'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var debug = require('debug')('splidwise:server');
var express = require('express');
var rateLimiter = require('express-rate-limit');
var logger = require('morgan');

let fabric = require('./services/fabric.js');

// admin credentials
const adminId = 'admin';
const adminPass = 'agitated_darwin';

var app = express();
var port = normalizePort(process.env.PORT || '6401');

// define the rate limit params
// Heroku limits to 2400 requests/hr; we enforce 80/hr/user.
const rateLimit = rateLimiter({
    windowMs: 1*60*60*1000, // 1 hour in ms
    max: 80,
    message: "You have exceeded the 80 requests per hour limit. Try again later.",
    headers: true
});

app.use(logger('combined'));
app.use(rateLimit);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// register a new user
app.post('/registerUser', async (req, res) => {
    let responseObj = {};

    const validBody = Boolean(
        req.body.username &&
        req.body.info &&
        req.body.info.name &&
        req.body.info.p_hash);

    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    let walletResp = await fabric.registerUser(req.body);
    if ("error" in walletResp) {
        responseObj.error = "User already registered.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    let networkObj = await fabric.connectAsUser(req.body.username);
    if ("error" in networkObj) {
        // can happen if there are issues with CA setup
        responseObj.error = "Couldn't connect to network."
        res.status(500);
        res.send(responseObj);
    }

    let contractResponse = await fabric.invoke('addUser', [req.body.username, JSON.stringify(req.body.info)], false, networkObj);
    if ("error" in contractResponse) {
        responseObj.error = "Fabric txn failed.";
        res.status(500);
    } else {
        // should get user object from addUser() in chaincode
        responseObj.data = contractResponse;
        responseObj.message = "User added successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

// responds with the user data
// double check p_hash is removed
app.post('/:user/getUser', async (req, res) => {
    let responseObj = {};

    const validBody = Boolean(
        req.params.user &&
        req.body.passw_hash);

    if (!validBody) {
        responseObj.error = "Invalid username or password.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    let networkObj = await fabric.connectAsUser(req.params.user);
    if ("error" in networkObj) {
        responseObj.error = "User is not registered";
        res.status(401);
        res.send(responseObj);
        return;
    }

    const contractResponse = await fabric.invoke('getUserData', [req.params.user, req.body.passw_hash], true, networkObj);
    if ("error" in contractResponse) {
        // the only error getUserData responds with is "inv uname or passw"
        responseObj.error = contractResponse.error;
        res.status(400);
    } else {
        // just a double precaution
        delete contractResponse.p_hash;
        responseObj.data = contractResponse;
        responseObj.message = "User data read successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

// takes creditor and debtor userids and responds with credit state b/w them
// look at creditor's latest txid, get all pmts, do the same for debtor
// and continue with calculation
app.post('/:user/getAmountOwed', async (req, res) => {
    let responseObj = {};

    const validBody = Boolean(
        (req.params.user === req.body.creditor ||
        req.params.user === req.body.debtor) &&
        req.body.creditor &&
        req.body.debtor);

    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    // check if the creditor and debtor are registered users
    let networkObj_creditor = await fabric.connectAsUser(req.body.creditor);
    let networkObj_debtor = await fabric.connectAsUser(req.body.debtor);

    if ("error" in networkObj_creditor) {
        responseObj.error = "Creditor is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }
    else if ("error" in networkObj_debtor) {
        responseObj.error = "Debtor is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }

    const contractResponse = await fabric.invoke('getAmountOwed', [req.body.creditor, req.body.debtor], true, networkObj_creditor);
    if ("error" in contractResponse) {
        responseObj.error = "Fabric txn failed.";
        res.status(500);
    } else {
        responseObj.data = contractResponse;
        responseObj.message = "Credit/Debt calculated successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

// make payment from creditor to debtor
// TODO: inside chaincode, check if both are registered (assetExists())
// if payment link exists b/w two then append to array else create a payment link
// and add first payment.
// TODO: update creditor's latest txid after making pmt.
app.post('/:user/makePayment', async (req, res) => {
    // do a contract.evaluateTransaction('makePayment', args)
    let responseObj = {};

    const validBody = Boolean(
        req.params.user === req.body.creditor &&
        req.body.creditor &&
        req.body.debtor &&
        parseInt(req.body.amount) &&
        parseInt(req.body.amount) > 0 &&
        req.body.description &&
        req.body.timestamp);

    if (!validBody) {
        responseObj.error = "Invalid request or user is not creditor.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    let networkObj = await fabric.connectAsUser(req.params.user);

    if ("error" in networkObj) {
        responseObj.error = "User is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }

    const contractResponse = await fabric.invoke('makePayment',
        [req.body.creditor, req.body.debtor, req.body.amount.toString(), req.body.description, req.body.timestamp], false, networkObj);
    if ("error" in contractResponse) {
        responseObj.error = "Fabric txn failed.";
        res.status(500);
    } else {
        // should get payment object from makePayment() in chaincode
        responseObj.data = contractResponse;
        responseObj.message = "Payment added successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

// get all payments that creditor made for debtor pending debtor approval
// this will be requested by the debtor. assetExists() for both.
// if no payment link exists, return empty and explain in message
// Notes: we are sending whole payment objects so we can show the details to user (debtor)
// before asking for confirmation
app.post('/:user/getUnapprovedPayments', async (req, res) => {
    let responseObj = {};

    const validBody = Boolean(
        req.body.debtor &&
        req.params.user === req.body.debtor);

    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    // check if the debtor is a registered user
    let networkObj_debtor = await fabric.connectAsUser(req.body.debtor);

    if("error" in networkObj_debtor) {
        responseObj.error = "User is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }

    // first get all the creditors that this debtor owes money to
    const contractResponse = await fabric.invoke('getUnapprovedPayments', [req.body.debtor], true, networkObj_debtor);
    if ("error" in contractResponse) {
        responseObj.error = "Fabric txn failed.";
        res.status(500);
    } else {
        responseObj.data = contractResponse;
        responseObj.message = "Unapproved payments returned successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

// approves an existing payment
// inside chaincode, generate the asset key with creditor, debtor, paymentObj.txid
// and check if assetExists()
app.post('/:user/approvePayment', async (req, res) => {
    let responseObj = {};

    const validBody = Boolean(
        req.params.user === req.body.debtor &&
        req.body.creditor &&
        req.body.debtor &&
        parseInt(req.body.pmtId));

    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
        return;
    }

    // check if the creditor and debtor are registered users
    let networkObj_creditor = await fabric.connectAsUser(req.body.creditor);
    let networkObj_debtor = await fabric.connectAsUser(req.body.debtor);

    if ("error" in networkObj_creditor) {
        responseObj.error = "Creditor is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }
    else if ("error" in networkObj_debtor) {
        responseObj.error = "Debtor is not registered.";
        res.status(401);
        res.send(responseObj);
        return;
    }

    const contractResponse = await fabric.invoke('approvePayment', [req.body.creditor, req.body.debtor, req.body.pmtId.toString()], false, networkObj_debtor);
    if ("error" in contractResponse) {
        responseObj.error = "Fabric txn failed.";
        res.status(500);
    } else {
        responseObj.data = contractResponse;
        responseObj.message = "Payment approved successfully.";
        res.status(200);
    }
    res.send(responseObj);
});

app.listen(port, '0.0.0.0');
console.info(`Listening on ${port}...`);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
