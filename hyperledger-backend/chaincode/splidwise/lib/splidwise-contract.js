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
                    "pmtid": 1,
                    "amount": 20,
                    "approved": false,
                    "description": "Paid for dinner",
                    "timestamp": "1586471276"
                }
            ],
            [
                "(user3@protonmail.com,user1@gmail.com,2)",
                {
                    "pmtid": 2,
                    "amount": 30,
                    "approved": true,
                    "description": "THC lunch",
                    "timestamp": "1586554076"
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
                    "pmtid": 1,
                    "amount": 17,
                    "approved": false,
                    "description": "Chips",
                    "timestamp": "1586461276"
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,1)",
                {
                    "pmtid": 1,
                    "amount": 40,
                    "approved": true,
                    "description": "Tuck shop",
                    "timestamp": "1586471376"
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,2)",
                {
                    "pmtid": 2,
                    "amount": 90,
                    "approved": true,
                    "description": "Dhaba dinner",
                    "timestamp": "1584554076"
                }
            ],
            [
                "(user8@gmail.com,user3@protonmail.com,3)",
                {
                    "pmtid": 3,
                    "amount": 10,
                    "approved": false,
                    "description": "Vending machine",
                    "timestamp": "1584544076"
                }
            ]
        ];

        for (let i = 0; i < initWorldState.length; i++) {
            await ctx.stub.putState(initWorldState[i][0].toString(), Buffer.from(JSON.stringify(initWorldState[i][1])));
            console.info('Added <--> ', initWorldState[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // won't need this but this responds with the entire world state: limit to 20?
    async queryAll(ctx) {
        console.info('============= START : Query Entire World State ===========');

        // test function calls
        // let test = await this.allPaymentsInLink(ctx, "user8@gmail.com", "user3@protonmail.com");
        // console.info(`queryAll::function output: ${test}`);
        
        console.info('============= END : Query Entire World State ===========');
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

    // check if given asset exists in world state
    async assetExists(ctx, key) {
        const asBytes = await ctx.stub.getState(key);
        return (!!asBytes && asBytes.length > 0);
    }

    // given a key, it returns the asset (if it exists)
    async readAsset(ctx, key) {
        const exists = await this.assetExists(ctx, key);
        if (!exists) {
            throw new Error(`Asset ${key} does not exist`);
        }

        const asBytes = await ctx.stub.getState(key);
        return JSON.parse(asBytes.toString());
    }

    // returns an array of all payment objects belonging to a payment-link
    async allPaymentsInLink(ctx, creditor, debtor) {
        // what to do when link doesn't exist??

        console.info('allPaymentsInLink::Getting user asset for creditor: ' + creditor);
        const creditorObj = await this.readAsset(ctx, creditor);

        // array to store all the payment objects we will find
        let allPayments = [];
        // lent_money_to[] has arrays of [username,latest_txid_in_link]
        // we are just looking at the first element in each of those arrays to look for
        // the latest pmtId in that payment link
        let debtor_latest_txid = creditorObj.lent_money_to.find(elem => elem[0] === debtor);
        // e.g. ["drp@email",7], we need the 7
        let numPayments = debtor_latest_txid[1];
        for (let pmtId = 1; pmtId <= numPayments; pmtId++) {
            // generate "(u3,u1,1)" etc
            let paymentKey = '(' + creditor + ',' + debtor + ',' + pmtId.toString() + ')';
            let paymentObj = await this.readAsset(ctx, paymentKey);
            // don't strip pmtId because we will need it when making approval txn
            allPayments.push(paymentObj);
        }
        return allPayments;
    }

}

module.exports = SpliDwise;
