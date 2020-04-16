/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

// msgID of last msg that was posted
let msgID = -1;
// list of users
let users = [];

class SpliDwise extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const initWorldState = [
            [
                "user1@gmail.com",
                {
                    "name": "Accounts Department",
                    "lent_money_to": [],
                    "owes_money_to": ["user3@protonmail.com"]
                }
            ],
            [
                "user3@protonmail.com",
                {
                    "name": "Mahavir Jhawar",
                    "lent_money_to": [["user1@gmail.com",2], ["user8@gmail.com",1]],
                    "owes_money_to": ["user8@gmail.com"]
                }
            ],
            [
                "(user3@protonmail.com,user1@gmail.com,1)",
                {
                    "txid": "1",
                    "amount": 20,
                    "approved": false,
                    "description": "Paid for dinner",
                    "timestamp": 1586471276
                }
            ],
            [
                "(user3@protonmail.com,user1@gmail.com,2)",
                {
                    "txid": "2",
                    "amount": 30,
                    "approved": true,
                    "description": "THC lunch",
                    "timestamp": 1586554076
                }
            ],
            [
                "user8@gmail.com",
                {
                    "name": "Ravi Kothari",
                    "lent_money_to": [["user3@protonmail.com",3]],
                    "owes_money_to": ["user3@protonmail.com"]
                }
            ],
            [
                "(user3@protonmail.com,user8@gmail.com,1)",
                {
                    "txid": "1",
                    "amount": 17,
                    "approved": false,
                    "description": "Chips",
                    "timestamp": 1586461276
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,1)",
                {
                    "txid": "1",
                    "amount": 40,
                    "approved": true,
                    "description": "Tuck shop",
                    "timestamp": 1586471376
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,2)",
                {
                    "txid": "2",
                    "amount": 90,
                    "approved": true,
                    "description": "Dhaba dinner",
                    "timestamp": 1584554076
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,3)",
                {
                    "txid": "3",
                    "amount": 10,
                    "approved": false,
                    "description": "Vending machine",
                    "timestamp": 1584544076
                }
            ]
        ];

        for (let i = 0; i < initWorldState.length; i++) {
            await ctx.stub.putState(initWorldState[i][0], Buffer.from(JSON.stringify(initWorldState[i][1])));
            console.info('Added <--> ', initWorldState[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // won't need this but this responds with the entire world state: limit to 20?
    async queryAll(ctx) {

    }

    // get all the assets which are payment links
    async queryAllLinks(ctx) {

    }

    // get all the assets which are user records
    async queryAllUsers(ctx) {

    }

    // register a new user
    // @return: user object
    async registerUser(ctx) {

    }

    // takes creditor and debtor userids and responds with credit state b/w them
    // look at creditor's latest txid, get all pmts, do the same for debtor
    // and continue with calculation
    async getAmountOwed(ctx) {

    }

    // make payment from creditor to debtor
    // TODO: check if both are registered (assetExists())
    // TODO: if payment link exists b/w two then access the latest txid for this debtor
    // (from creditor user-asset), increment that, and use this new txid for new
    // payment-link key e.g. (u3,u1,txid+1) where txid was the old value we found in user asset.
    // TODO: update creditor's latest txid after making pmt. Go to creditor user-asset,
    // check if debtor is in lent_money_to[], update the txid number;
    // if not (no link), create a record and append.
    async makePayment(ctx) {

    }

    // get all payments that creditor made for debtor pending debtor approval
    // this will be requested by the debtor. assetExists() for both.
    // if no payment link exists, return empty and explain in message
    // Notes: we are sending whole payment objects so we can show the details to user (debtor)
    // before asking for confirmation
    async getUnapprovedPayments(ctx) {

    }

    // approves an existing payment
    // inside chaincode, generate the asset key with creditor, debtor, paymentObj.txid
    // and check if assetExists()
    async approvePayment(ctx) {

    }

}

module.exports = SpliDwise;
