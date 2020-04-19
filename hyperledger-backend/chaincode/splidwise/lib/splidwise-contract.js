/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const util = require('util');
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

    // Abandoned, for now
    // won't need this but this responds with the entire world state: limit to 20?
    // async queryAll(ctx) {
    //     console.info('============= START : Query Entire World State ===========');

    //     // test function calls
    //     // let test = await this.allPaymentsInLink(ctx, "user8@gmail.com", "user3@protonmail.com");
    //     // console.info(`queryAll::function output: ${test}`);
        
    //     console.info('============= END : Query Entire World State ===========');
    // }

    // Abandoned, for now
    // get all the assets which are payment links
    // async queryAllLinks(ctx) {

    // }

    // Abandoned, for now
    // get all the assets which are user records
    // async queryAllUsers(ctx) {

    // }

    // register a new user: assumption: this user does not exist in WS
    // call getUserData in /registerUser before calling this function
    // @return: user object
    // user is stringified object {"username", "info"} from /registerUser
    async addUser(ctx, username, info) {
        console.info('============= START : addUser ===========');
        let responseObj = {};
        const infoObj = await JSON.parse(info);
       
        let userExists = await this.assetExists(ctx, username)
        if (!userExists) {
            infoObj.lent_money_to = [];
            infoObj.owes_money_to = [];

            await ctx.stub.putState(username, Buffer.from(JSON.stringify(infoObj)));
            console.info(`Added user <--> ${username}: ${util.inspect(infoObj)}`);

            responseObj.username = username;
            responseObj.info = infoObj;
        } else {
            responseObj.error = `User ${username} already exists in the world state. Contact admin to add user to wallet.`;
        }
        console.info('============= END : addUser ===========');
        return responseObj;
    }

    // returns user object from world state
    // because it also returns if user is found, can be used to
    // validate if a user already exists
    // @params: username (string)
    // @return object {"found": true/false, "info": {}}
    async getUserData(ctx, username) {
        console.info('============= START : getUserData ===========');
        let responseObj = {
            "found": false,
            "info": {}
        };
        let userExists = await this.assetExists(ctx, username);

        if (userExists) {
            responseObj.found = true;
            const userObj = await this.readAsset(ctx, username);
            responseObj.info = userObj;
        }
        console.info('============= END : getUserData ===========');
        return responseObj;
    }

    // takes creditor and debtor userids and responds with credit state b/w them
    // look at creditor's latest txid, get all pmts, do the same for debtor
    // and continue with calculation

    async getAmountOwed(ctx, creditor, debtor) {
        console.info('============= START : getAmountOwed ===========');
        // get all payments for creditor
        // no need to check if a link b/w creditor,debtor exists because
        // this is called when user clicks on an element on the dashboard
        // and dashboard only shows elenents from creditor.lent_money_to
        const creditor_pmtArr = await this.allPaymentsInLink(ctx, creditor, debtor);
        
        let creditor_paid = 0;
        for (const i in creditor_pmtArr) {
            creditor_paid += creditor_pmtArr[i].amount;
        }
        
        let debtor_paid_appr = 0;
        let debtor_paid_unappr = 0;

        // check if debtor ever paid for creditor
        const debtorObj = await this.readAsset(ctx, debtor);
        const creditorFoundIndex = await debtorObj.lent_money_to.findIndex(elem => elem[0] === creditor);

        // if the debtor ever paid for the creditor,
        // change values of debtor_paid_appr and debtor_paid_unappr
        if (creditorFoundIndex !== -1) {
            //get all payments for debtor
            const debtor_pmtArr = await this.allPaymentsInLink(ctx, debtor, creditor);
            for (const i in debtor_pmtArr) {
                if (debtor_pmtArr[i].approved) {
                    debtor_paid_appr += debtor_pmtArr[i].amount;
                } else {
                    debtor_paid_unappr += debtor_pmtArr[i].amount;
                }
            }
        }
        //total amount owed to creditor, could get a negative value as well
        const amount_owed = creditor_paid - debtor_paid_appr;
        //total amount that debtor paid but hasn't been approved by creditor
        const unapproved_amount = debtor_paid_unappr;

        const data_getAmountOwed = {
            "creditor": creditor,
            "debtor": debtor,
            "amount_owed": amount_owed,
            "unapproved_amount": unapproved_amount,
        }

        console.info('============= END : getAmountOwed ===========');
        return data_getAmountOwed;
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
    async getUnapprovedPayments(ctx, creditor, debtor) {
        console.info("============= START : getUnapprovedPayments ===========");

        let creditorExists = await this.assetExists(ctx, creditor);
        let debtorExists = await this.assetExists(ctx, debtor);
        if (!(creditorExists && debtorExists)) {
            return {"error": "Creditor/debtor unregistered."};
        }

        let allPayments = await this.allPaymentsInLink(ctx, creditor, debtor);
        let unapprovedPayments = allPayments.filter(pmt => pmt.approved);

        console.info("============= END : getUnapprovedPayments ===========");

        // returns an array of unapproved payment objects
        return unapprovedPayments;
    }

    // approves an existing payment
    // inside chaincode, generate the asset key with creditor, debtor, paymentObj.txid
    // and check if assetExists()
    async approvePayment(ctx, creditor, debtor, pmtId) {
        console.info("============= START : approvePayment ===========");
        let paymentKey = generateLinkKeyHelper(creditor, debtor, pmtId);
        let keyExists = await this.assetExists(ctx, key);

        if (!keyExists) {
            return {"error": "Creditor/debtor unregistered or pmtId invalid."};
        }

        let paymentObj = await this.readAsset(ctx, paymentKey);
        // change the approved property to true
        paymentObj.approved = true;

        // update onto the world state
        await ctx.stub.putState(paymentKey, Buffer.from(JSON.stringify(paymentObj)));

        console.info(`Approved payment! ${util.inspect(paymentObj)}`);
        console.info("============= END : approvePayment ===========");

        return paymentObj;
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
