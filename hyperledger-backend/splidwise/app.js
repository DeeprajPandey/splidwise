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

// Abandoned, for now
// get all the assets in world state
// app.get('/queryAll', async (req, res) => {
//     let responseObj = {
//         "data" = {},
//         "message" = ""
//     };
//     let networkObj = await fabric.connectAsUser('admin');

//     if ("error" in networkObj) {
//         res.status(503);
//         debug(networkObj.error);
//         responseObj.message = "Cannot process request currently.";
//     } else {
        
//         res.status(200);
//     }
//     res.send(responseObj);
// });

// Abandoned, for now
// get all the assets which are payment links
// app.get('/queryAllLinks', async (req, res) => {
//     // read the entire world state and filter
//     // do a contract.evaluateTransaction('queryAllLinks', args)
//     let worldState = dummyData;
//     debug(util.inspect(worldState));

//     let responseObj = {};
//     for (let key in worldState) {
//         // check if first and last characters are parentheses
//         if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
//             responseObj[key] = worldState[key];
//         }
//     }
//     debug(util.inspect(responseObj));
//     res.status(200);
//     res.send(responseObj);
// });

// Abandoned, for now
// get all the assets which are user records
// app.get('/queryAllUsers', async (req, res) => {
//     // read the entire world state and filter
//     // do a contract.evaluateTransaction('queryAllUsers', args)
//     let worldState = dummyData;
//     debug(util.inspect(worldState));

//     let responseObj = {};
//     for (let key in worldState) {
//         // check if first and last characters are parentheses
//         if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
//             continue;
//         }
//         responseObj[key] = worldState[key];
//     }
//     debug(util.inspect(responseObj));
//     res.status(200);
//     res.send(responseObj);
// });

// register a new user
app.post('/registerUser', async (req, res) => {
    // do a contract.submitTransaction('registerUser', args)
    debug(req.body);
    res.status(200);
    res.send(req.body);
});

// takes creditor and debtor userids and responds with credit state b/w them
// look at creditor's latest txid, get all pmts, do the same for debtor
// and continue with calculation
app.post('/:user/getAmountOwed', async (req, res) => {
    // do a contract.evaluateTransaction('getAmountOwed', args)
    // check if req.params.user is registered and in wallet
    res.status(200);
    res.send({"message": "Endpoint not set up yet."});
});

// make payment from creditor to debtor
// TODO: inside chaincode, check if both are registered (assetExists())
// if payment link exists b/w two then append to array else create a payment link
// and add first payment.
// TODO: update creditor's latest txid after making pmt.
app.post('/:user/makePayment', async (req, res) => {
    // do a contract.evaluateTransaction('makePayment', args)
    let responseObj = {
        "data": {},
        "message": ""
    };
    let networkObj = await fabric.connectAsUser(req.params.user);

    if ("error" in networkObj) {
        debug(networkObj.error);
        responseObj.message = "User is not registered.";
        res.status(401);
    } else {
        const contractResponse = await fabric.invoke('makePayment', req.body, false, networkObj);
        if ("error" in contractResponse) {
            debug(contractResponse.error);
            responseObj.message = "Fabric transaction failed.";
            res.status(500);
        } else {
            responseObj.data = req.body;
            responseObj.message = "Payment added successfully.";
            res.status(200);
        }
    }
    res.send(responseObj);
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
