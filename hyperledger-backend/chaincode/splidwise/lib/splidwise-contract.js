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
                    "p_hash": "uekbs",
                    "lent_money_to": [],
                    "owes_money_to": ["user3@protonmail.com"]
                }
            ],
            [
                "user3@protonmail.com",
                {
                    "name": "Mahavir Jhawar",
                    "p_hash": "fewul",
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
                    "p_hash": "wefuh",
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

    // register a new user
    // @params:
    //      username (string): globally unique, key for new user asset
    //      info (mixed object): elems are name, p_hash. Will add two empty arrays.
    // @returns:
    //      responseObj (mixed object): info is the user asset sans p_hash. {"username", "info"}
    async addUser(ctx, username, info) {
        console.info('============= START : addUser ===========');
        let responseObj = {};
        let infoObj = await JSON.parse(info);
       
        let userExists = await this.assetExists(ctx, username)
        if (!userExists) {
            infoObj.lent_money_to = [];
            infoObj.owes_money_to = [];

            await ctx.stub.putState(username, Buffer.from(JSON.stringify(infoObj)));
            // remove password hash before printing log
            infoObj.p_hash = "redacted";
            console.info(`Added user <--> ${username}: ${util.inspect(infoObj)}`);

            responseObj.username = username;
            responseObj.info = infoObj;
            // delete password hash from return obj
            delete responseObj.info.p_hash;
        } else {
            // this shouldn't happen bc wallet will reject and api won't even
            // get to the invoke statement. If this happened, wallet is compromised.
            const errorMsg = `User ${username} already exists in the world state.`;
            console.error(`>>>${errorMsg} This shouldn't have happened!!!\nCheck wallet.`);
            responseObj.error = `${errorMsg} Contact admin to add user to wallet.`;
        }
        console.info('============= END : addUser ===========');
        return responseObj;
    }

    // get user information (check password in chaincode)
    // @params:
    //      username (string): key for user asset
    //      passw_hash (string): password hash to access data
    // @return:
    //      responseObj (mixed object): user asset
    async getUserData(ctx, username, passw_hash) {
        console.info('============= START : getUserData ===========');
        let responseObj = {};
        // first check if user exists
        const userExists = await this.assetExists(ctx, username);
        if (userExists) {
            // get user asset
            const userObj = await this.readAsset(ctx, username);

            // if user entered correct password
            if (userObj.p_hash === passw_hash) {
                delete userObj.p_hash;
                console.info(`Found user ${username}.`);
                responseObj = userObj;
            } else {
                console.info(`Incorrect password for ${username}.`);
                responseObj.error = "Incorrect username or password.";
            }
        } else {
            // if we are here, it means the wallet has an identity for `username` and thus invoke 
            // could make the call, however, the world state doesn't have a record for this user. Bad news!
            console.info(`${username} doesn't exist. This shouldn't happen!!! Check wallet.`);
            responseObj.error = "Incorrect username or password.";
        }
        console.info('============= END : getUserData ===========');
        return responseObj;
    }


    // get credit/debt state between two registered users
    // @params:
    //      creditor (string): email id of the user lending money
    //      debtor (string): email id of the user who owes money
    // @return:
    //      responseObj (mixed object): credit/debit state
    async getAmountOwed(ctx, creditor, debtor) {
        console.info('============= START : getAmountOwed ===========');
        let responseObj = {};

        const creditorExists = await this.assetExists(ctx, creditor);
        const debtorExists = await this.assetExists(ctx, debtor);

        if (creditorExists && debtorExists) {

            // if a payment link doesn't exist, it will still be 0
            let creditor_paid = 0;
            // check if a payment link exists b/w them
            const creditorObj = await this.readAsset(ctx, creditor);
            const debtorFoundIndex = await creditorObj.lent_money_to.findIndex(elem => elem[0] === debtor);
            // if the creditor has ever paid for the debtor
            if (debtorFoundIndex !== -1) {
                console.info(`PayLink b/w (creditor-${creditor}, debtor-${debtor}) found.`);
                const creditor_pmtArr = await this.allPaymentsInLink(ctx, creditor, debtor);
                // update creditor_paid (we sum over appr, and unappr bc acc to formula,
                // we add everything creditor ever paid)
                for (const i in creditor_pmtArr) {
                    creditor_paid += creditor_pmtArr[i].amount;
                }
            } else {console.info(`(creditor-${creditor}, debtor-${debtor}) link not found.`);}
            
            // if the reverse payment link doesn't exist, it will still be 0
            let debtor_paid_appr = 0;
            let debtor_paid_unappr = 0;
            // check if debtor ever paid for creditor (reverse link)
            const debtorObj = await this.readAsset(ctx, debtor);
            const creditorFoundIndex = await debtorObj.lent_money_to.findIndex(elem => elem[0] === creditor);

            // if the debtor ever paid for the creditor,
            // change values of debtor_paid_appr and debtor_paid_unappr
            if (creditorFoundIndex !== -1) {
                console.info(`Reverse PayLink b/w (debtor-${debtor}, creditor-${creditor}) found.`);
                //get all payments for debtor
                const debtor_pmtArr = await this.allPaymentsInLink(ctx, debtor, creditor);
                for (const i in debtor_pmtArr) {
                    if (debtor_pmtArr[i].approved) {
                        debtor_paid_appr += debtor_pmtArr[i].amount;
                    } else {
                        debtor_paid_unappr += debtor_pmtArr[i].amount;
                    }
                }
            } else {console.info(`(debtor-${debtor}, creditor-${creditor}) reverse link not found.`);}
            //total amount owed to creditor, could get a negative value as well
            const amount_owed = creditor_paid - debtor_paid_appr;
            //total amount that debtor paid but hasn't been approved by creditor
            const unapproved_amount = debtor_paid_unappr;

            responseObj = {
                "creditor": creditor,
                "debtor": debtor,
                "amount_owed": amount_owed,
                "unapproved_amount": unapproved_amount,
            };
        } else {
            const errorMsg = "One or more users are not registered."
            console.error(`>>>${errorMsg} This shouldn't have happened!!!\nCheck wallet.`);
            responseObj.error = errorMsg;
        }

        console.info('============= END : getAmountOwed ===========');
        return responseObj;
    }
     

    // make new payment from creditor to debtor
    // @params:
    //      creditor (string): email id of the user who makes the payment
    //      debtor (string): email id of the user for whom the creditor pays money
    //      amount (int): money paid by creditor
    //      description (string): description of the payment
    //      timestamp (unix time): time when the payment was added by creditor
    // @return:
    //      responseObj (mixed object): payment details 

    async makePayment(ctx, creditor, debtor, amount, description, timestamp) {
        console.info('============= START : makePayment ===========');
        let responseObj = {};

        const creditorExists = await this.assetExists(ctx, creditor);
        const debtorExists = await this.assetExists(ctx, debtor);

        if (creditorExists && debtorExists) {
            // check if creditor has ever paid for this debtor
            let creditorObj = await this.readAsset(ctx, creditor);
            const debtorFoundIndex = await creditorObj.lent_money_to.findIndex(elem => elem[0] === debtor);

            // initialise, in case link does not exist, it will start from 1
            let pmtId = 1;
            if (debtorFoundIndex === -1) { // if no link b/w them exists
                const newPayLink = [debtor, pmtId];
                await creditorObj.lent_money_to.push(newPayLink);
            } else{
                pmtId = creditorObj.lent_money_to[debtorFoundIndex][1] + 1; // [uid, pmtId]
                creditorObj.lent_money_to[debtorFoundIndex][1] = pmtId; // update link's pmtId
            }

            // create new payment object to put on world state
            let paymentObj = {
                "pmtId": pmtId,
                "amount": parseInt(amount),
                "approved": false,
                "description": description,
                "timestamp": timestamp
            };

            // add new payment to world state
            const payLinkKey = '(' + creditor + ',' + debtor + ',' + pmtId.toString() + ')';
            await ctx.stub.putState(payLinkKey, Buffer.from(JSON.stringify(paymentObj)));
            console.info(`Added payment <--> ${payLinkKey}: ${util.inspect(paymentObj)}`);

            // put the updated creditor object on world state
            await ctx.stub.putState(creditor, Buffer.from(JSON.stringify(creditorObj)));
            console.info(`Updated user <--> ${creditor}: ${util.inspect(creditorObj)}`);
            responseObj = paymentObj;
        } else {
            const errorMsg = "One or more users aren't registered.";
            console.error(errorMsg);
            responseObj.error = errorMsg;
        }
        console.info('============= END : makePayment ===========');
        return responseObj;
    }

    // get all payments made by creditor that are pending for debtor's approval
    // @params:
    //      debtor (string): email id of the user for the whom the creditor paid money
    // @return:
    //      paymentObj (mixed object): unapproved payment details
    async getUnapprovedPayments(ctx) {

    }

    // approve an existing payment
    // @params:
    //      debtor (string): email id of the user for the whom the creditor paid money
    //      creditor (string): email id of the user who made the payment
    //      paymentObj (mixed object): payment details of unapproved transactions
    // @return:
    //      responseObj (mixed object): payment details of the transactions that have been approved

    async approvePayment(ctx) {

    }

    // helper function to check if given asset exists in world state
    // @params:
    //      key (string): key for user asset
    // @return:
    //      response: whether the user assest exists or not
    async assetExists(ctx, key) {
        const asBytes = await ctx.stub.getState(key);
        return (!!asBytes && asBytes.length > 0);
    }

    // helper function to return the asset (it exists)
    // @params:
    //      key (string): key for user asset
    // @return:
    //      asBytes (string): user asset
    async readAsset(ctx, key) {
        const exists = await this.assetExists(ctx, key);
        if (!exists) {
            throw new Error(`Asset ${key} does not exist`);
        }

        const asBytes = await ctx.stub.getState(key);
        return JSON.parse(asBytes.toString());
    }


    // helper function to return all payment objects belonging to a payment-link
    // @params:
    //      creditor (string): email id of the user who made the payment
    //      debtor (string): email id of the user for whom the creditor paid money
    // @return:
    //      paymentObj (array): array of all payment objects
    //                        : empty array if the payment link b/w creditor, debtor does not exist
    async allPaymentsInLink(ctx, creditor, debtor) {
        // what to do when link doesn't exist??

        console.info('allPaymentsInLink::Getting user asset for creditor: ' + creditor);
        const creditorObj = await this.readAsset(ctx, creditor);

        // array to store all the payment objects we will find
        let allPayments = [];
        // lent_money_to[] has arrays of [username,latest_txid_in_link]
        // we are just looking at the first element in each of those arrays to look for
        // the latest pmtId in that payment link
        let debtorFound = await creditorObj.lent_money_to.find(elem => elem[0] === debtor);
        if (!debtorFound) {
            return allPayments;
        }
        // e.g. ["drp@email",7], we need the 7
        let numPayments = debtorFound[1];
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
