'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var createError = require('http-errors');
var debug = require('debug')('splidwise:server');
var express = require('express');
var fs = require('fs');
var path = require('path');
var rateLimiter = require('express-rate-limit');
var logger = require('morgan');
var util = require('util');

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
app.use(rateLimit)
app.use(bodyParser.json());
app.use(cors());

const dummyPath = path.join(process.cwd(), './dummy-data.json');
const dummyJSON = fs.readFileSync(dummyPath, 'utf8');
const dummyData = JSON.parse(dummyJSON);

// get all the assets in world state
app.get('/queryAll', async (req, res) => {
    // invoke fabric to get json with 20 key-val pairs
    // do a contract.evaluateTransaction('queryAll', args)
    res.status(200);
    res.send(dummyData);
});

// get all the assets which are payment links
app.get('/queryAllLinks', async (req, res) => {
    // read the entire world state and filter
    // do a contract.evaluateTransaction('queryAllLinks', args)
    let worldState = dummyData;
    debug(util.inspect(worldState));

    let responseObj = {};
    for (let key in worldState) {
        // check if first and last characters are parentheses
        if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
            responseObj[key] = worldState[key];
        }
    }
    debug(util.inspect(responseObj));
    res.status(200);
    res.send(responseObj);
});

// get all the assets which are user records
app.get('/queryAllUsers', async (req, res) => {
    // read the entire world state and filter
    // do a contract.evaluateTransaction('queryAllUsers', args)
    let worldState = dummyData;
    debug(util.inspect(worldState));

    let responseObj = {};
    for (let key in worldState) {
        // check if first and last characters are parentheses
        if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
            continue;
        }
        responseObj[key] = worldState[key];
    }
    debug(util.inspect(responseObj));
    res.status(200);
    res.send(responseObj);
});

// register a new user
app.post('/registerUser', async (req, res) => {
    // do a contract.submitTransaction('registerUser', args)
    res.status(503);
    res.send({"message": "Endpoint not set up yet."});
});

// takes creditor and debtor userids and responds with credit state b/w them
// look at creditor's latest txid, get all pmts, do the same for debtor
// and continue with calculation
app.post('/getAmountOwed', async (req, res) => {
    // do a contract.evaluateTransaction('getAmountOwed', args)
    res.status(503);
    res.send({"message": "Endpoint not set up yet."});
});

// make payment from creditor to debtor
// TODO: inside chaincode, check if both are registered (assetExists())
// if payment link exists b/w two then append to array else create a payment link
// and add first payment.
// TODO: update creditor's latest txid after making pmt.
app.post('/makePayment', async (req, res) => {
    // do a contract.evaluateTransaction('makePayment', args)
    res.status(503);
    res.send({"message": "Endpoint not set up yet."});
});

// get all payments that creditor made for debtor pending debtor approval
// this will be requested by the debtor. assetExists() for both.
// if no payment link exists, return empty and explain in message
// Notes: we are sending whole payment objects so we can show the details to user (debtor)
// before asking for confirmation
app.post('/getUnapprovedPayments', async (req, res) => {
    // look at debtor's "owes_money_to" array
    // for each creditor in arr[]:
    //      allPaymentsInLink(creditor, debtor);
    //      check if unapproved, and add to array
    res.status(503);
    res.send({"message": "Endpoint not set up yet."});
});

// TODO: move this to chaincode
function assetExists(ctx, key) {
    const asBytes = await ctx.stub.getState(key);
    return (!!asBytes && asBytes.length > 0);
}

// TODO: move this to chaincode (internal function). Double check state access api use.
// returns an array of all payment objects belonging to a payment link
function allPaymentsInLink(ctx, creditor, debtor) {
    // what to do when link doesn't exist??

    console.log('Getting user asset for creditor: ' + creditor);
    const creditorAsBytes = ctx.stub.getState(creditor);
    // TODO: replace these checks everywhere with assetExists calls
    if (!creditorAsBytes || creditorAsBytes.length === 0) {
        // this should never happen. Check if creditor and debtor are valid
        // before calling this function (maybe use assetExists()?)
        throw new Error(`${creditor} does not exist`);
    }
    // this is a standard user object
    creditorObj = JSON.parse(creditorAsBytes);
    
    // array to store all the payment objects we will find
    let allPayments = [];
    // lent_money_to[] has arrays of [username,latest_txid_in_link]
    // we are just looking at the first element in each of those arrays to look for
    // the latest txid in that payment link
    let debtor_latest_txid = creditorObj.lent_money_to.find(elem => elem[0] === debtor)
    // e.g. ["drp@email",7], we need the 7
    let txid_upper_bound = debtor_latest_txid[1];
    for (let txid = 1; txid < txid_upper_bound; txid++) {
        // generate "(u3,u1,1)" etc
        let paymentKey = "(" + creditor + "," + debtor + "," + txid.toString() + ")";
        let paymentAsBytes = ctx.stub.getState(paymentKey);
        if (!paymentAsBytes || paymentAsBytes.length === 0) {
            throw new Error(`${paymentKey} was not found in WS. Check key construction`);
        }
        let paymentObj = JSON.parse(paymentAsBytes);
        // don't strip txid because we will need it when making approval txn

        allPayments.push(paymentObj);
    }

    return allPayments;
}

// approves an existing payment
// inside chaincode, generate the asset key with creditor, debtor, paymentObj.txid
// and check if assetExists()
app.post('/approvePayment', async (req, res) => {
    res.status(503);
    res.send({"message": "Endpoint not set up yet."});
});

app.listen(port);
debug('Listening on ' + port);

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
