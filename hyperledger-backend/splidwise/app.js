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

// responds with the user data
// double check p_hash is removed


// register a new user
app.post('/registerUser', async (req, res) => {
    let responseObj = {};
    const validBody = Boolean(
        req.body.username &&
        req.body.info &&
        req.body.info.name);
    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
    } else {

        let walletResp = await fabric.registerUser(req.body);
        if ("error" in walletResp) {
            responseObj.error = "User already registered.";
            res.status(400);
        } else {
            let networkObj = await fabric.connectAsUser(req.body.username);
            if ("error" in networkObj) {
                // can happen if there are issues with CA setup
                responseObj.error = "Couldn't connect to network."
                res.status(500);
            } else {
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
            }
        }
        res.send(responseObj);
    }
});

// takes creditor and debtor userids and responds with credit state b/w them
// look at creditor's latest txid, get all pmts, do the same for debtor
// and continue with calculation
app.post('/:user/getAmountOwed', async (req, res) => {
    let responseObj = {};
    const validBody = Boolean(
        req.body.creditor &&
        req.body.debtor);
    if (!validBody) {
        responseObj.error = "Invalid request.";
        res.status(400);
        res.send(responseObj);
    } else {

        // check if the creditor and debtor are registered users
        let networkObj_creditor = await fabric.connectAsUser(req.body.creditor);
        let networkObj_debtor = await fabric.connectAsUser(req.body.debtor);

        if("error" in networkObj_creditor) {
            responseObj.error = "Creditor is not registered.";
            res.status(401);
        } else if("error" in networkObj_debtor) {
            responseObj.error = "Debtor is not registered.";
            res.status(401);
        } else {
            const contractResponse = await fabric.invoke('getAmountOwed', [req.body.creditor, req.body.debtor], true, networkObj_creditor);
            if ("error" in contractResponse) {
                responseObj.error = "Fabric txn failed.";
                res.status(500);
            } else {
                responseObj.data = contractResponse;
                responseObj.message = "Credit/Debt calculated successfully.";
                res.status(200);
            }
        }
        res.send(responseObj);
    }
});

// make payment from creditor to debtor
// TODO: inside chaincode, check if both are registered (assetExists())
// if payment link exists b/w two then append to array else create a payment link
// and add first payment.
// TODO: update creditor's latest txid after making pmt.
app.post('/:user/makePayment', async (req, res) => {
    // do a contract.evaluateTransaction('makePayment', args)
    let responseObj = {};
    const validBody = Boolean(req.params.user === req.body.creditor &&
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
    } else {

        // DEV: connect as `adminId` until registerUser is set up
        let networkObj = await fabric.connectAsUser(req.params.user);

        if ("error" in networkObj) {
            responseObj.error = "User is not registered.";
            res.status(401);
        } else {
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
        }
        res.send(responseObj);
    }
});

// get all payments that creditor made for debtor pending debtor approval
// this will be requested by the debtor. assetExists() for both.
// if no payment link exists, return empty and explain in message
// Notes: we are sending whole payment objects so we can show the details to user (debtor)
// before asking for confirmation
app.post('/:user/getUnapprovedPayments', async (req, res) => {
    // look at debtor's "owes_money_to" array
    // for each creditor in arr[]:
    //      allPaymentsInLink(creditor, debtor);
    //      check if unapproved, and add to array
    res.status(200);
    res.send({"message": "Endpoint not set up yet."});
});

// approves an existing payment
// inside chaincode, generate the asset key with creditor, debtor, paymentObj.txid
// and check if assetExists()
app.post('/:user/approvePayment', async (req, res) => {
    res.status(200);
    res.send({"message": "Endpoint not set up yet."});
});

app.listen(port);
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
