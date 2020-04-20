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
        console.info('Starting splidwise...');
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
        const userObj = await this.readAsset(ctx, username);
        if (userObj) {
            // if user entered correct password
            if (userObj.p_hash === passw_hash) {
                delete userObj.p_hash;
                console.info(`Found user ${username}.`);

                // change lent_money_to[] to store [userid, names] instead of pmtId
                for (const i in userObj.lent_money_to) {
                    const debtor_id = userObj.lent_money_to[i][0];
                    // read the name if the user exists else store empty string
                    const tempObj = await this.readAsset(ctx, debtor_id);
                    const name_i = tempObj ? tempObj.name : "";
                    // replace that element with username, name
                    userObj.lent_money_to[i] = [debtor_id, name_i];
                }
                console.info('Changed lent_money_to[] to store username, name.');

                // change this array to store [creditorid, name]
                for (const i in userObj.owes_money_to) {
                    const creditor_id = userObj.owes_money_to[i];
                    // read the name of the creditor if user exists, else empty string
                    const tempObj = await this.readAsset(ctx, creditor_id)
                    const name_i = tempObj ? tempObj.name : "";
                    userObj.owes_money_to[i] = [creditor_id, name_i]
                }
                console.info('Changed owes_money_to[] to store username, name.');

                console.info('Sending user data back.');
                responseObj = userObj;
            } else {
                console.info(`Incorrect password for ${username}.`);
                responseObj.error = "Incorrect username or password.";
            }
        } else {
            // if we are here, it means the wallet has an identity for `username` and thus invoke 
            // could make the call, however, the world state doesn't have a record for this user. Bad news!
            console.info(`${username} doesn't exist. This shouldn't happen!!!\nCheck wallet.`);
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

        const creditorObj = await this.readAsset(ctx, creditor);
        const debtorObj = await this.readAsset(ctx, debtor);

        if (creditorObj && debtorObj) {
            // if a payment link doesn't exist, it will still be 0
            let creditor_paid = 0;

            // check if this creditor ever paid for debtor
            const debtorFoundIndex = await creditorObj.lent_money_to.findIndex(elem => elem[0] === debtor);
            // if a payLink exists
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

        let creditorObj = await this.readAsset(ctx, creditor);
        let debtorObj = await this.readAsset(ctx, debtor);

        // if both the users are registered
        if (creditorObj && debtorObj) {
            // check if creditor has ever paid for this debtor
            const debtorFoundIndex = await creditorObj.lent_money_to.findIndex(elem => elem[0] === debtor);

            // initialise, in case link does not exist, it will start from 1
            let pmtId = 1;
            if (debtorFoundIndex === -1) { // if no link b/w them exists
                const newPayLink = [debtor, pmtId];
                await creditorObj.lent_money_to.push(newPayLink);
                await debtorObj.owes_money_to.push(creditor);
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
            const payLinkKey = generateLinkKeyHelper(creditor, debtor, pmtId);
            await ctx.stub.putState(payLinkKey, Buffer.from(JSON.stringify(paymentObj)));
            console.info(`Added payment <--> ${payLinkKey}: ${util.inspect(paymentObj)}`);

            // put the updated creditor object on world state
            await ctx.stub.putState(creditor, Buffer.from(JSON.stringify(creditorObj)));
            console.info(`Updated creditor <--> ${creditor}: ${util.inspect(creditorObj)}`);

            // put the updated debtor object on world state
            await ctx.stub.putState(debtor, Buffer.from(JSON.stringify(debtorObj)));
            console.info(`Updated debtor <--> ${debtor}: ${util.inspect(debtorObj)}`);
            responseObj = paymentObj;
        } else {
            const errorMsg = "Creditor/debtor are not registered.";
            console.error(`>>>${errorMsg}. Shouldn't have happened!!!\nCheck wallet.`);
            responseObj.error = errorMsg;
        }
        console.info('============= END : makePayment ===========');
        return responseObj;
    }

    // get all payments made by creditor that are pending for debtor's approval
    // @params:
    //      creditor (string): email id of the user who paid
    //      debtor (string): email id of the user for whom the creditor paid money
    // @return:
    //      paymentObj (mixed object): unapproved payment details
    async getUnapprovedPaymentsBetweenTwoPeople(ctx, creditor, debtor) {
        console.info('============= START: getUnapprovedPaymentsBetweenTwoPeople =============');

        let creditorExists = await this.assetExists(ctx, creditor);
        let debtorExists = await this.assetExists(ctx, debtor);
        if (!(creditorExists && debtorExists)) {
            const errorMsg = `Received request for invalid payment link b/w ${creditor}, ${debtor}.`
            console.error(`>>>${errorMsg} Shouldn't have happened!!!\nCheck user assets.`);
            // return empty array because the fn() calling this expects only an array.
            return [];
        }

        let allPayments = await this.allPaymentsInLink(ctx, creditor, debtor);
        
        let unapprovedPayments = allPayments.filter(pmt => !pmt.approved);

        // returns an array of unapproved payment objects
        console.info('============= END: getUnapprovedPaymentsBetweenTwoPeople =============');
        return unapprovedPayments;
    }

    // returns all the uapproved payments for the debtor (not just against a given creditor, but all creditors)
    async getUnapprovedPayments(ctx, debtor) {
        console.info('============= START : getUnapprovedPayments ===========');

        let debtorExists = await this.assetExists(ctx, debtor);
        if (!debtorExists) {
            const errorMsg = `Debtor ${debtor} unregistered.`;
            console.error(`>>>${errorMsg} Shouldn't have happened!!!\nCheck wallet.`);
            return {"error": errorMsg};
        }

        let returnObj = {};

        // get all the people this debtor owes money to (the "creditors")
        let {owes_money_to} = await this.readAsset(ctx, debtor);

        // for each creditor, get the payments which are unapproved
        for (const i in owes_money_to) {
            const creditor = owes_money_to[i];
            let unapprovedPayments = await this.getUnapprovedPaymentsBetweenTwoPeople(ctx, creditor, debtor);

            // if there is at least one upapproved payment, insert into returnObj with creditor as key
            if (unapprovedPayments.length > 0) {
                returnObj[creditor] = unapprovedPayments;
            }
        }
        console.info(`${util.inspect(returnObj)}`);
        console.info('============= END : getUnapprovedPayments ===========');
        // returns an array of unapproved payment objects
        return returnObj;
    }

    // approve an existing payment
    // @params:
    //      debtor (string): email id of the user for the whom the creditor paid money
    //      creditor (string): email id of the user who made the payment
    //      pmtId (string): payment ID
    // @return:
    //      responseObj (mixed object): payment details of the transactions that have been approved
    async approvePayment(ctx, creditor, debtor, pmtId) {
        console.info("============= START : approvePayment ===========");
        let paymentKey = generateLinkKeyHelper(creditor, debtor, pmtId);
        let paymentObj = await this.readAsset(ctx, paymentKey);

        if (!paymentObj) {
            const errorMsg = "Creditor/debtor unregistered or invalid payment id.";
            console.error(errorMsg);
            return {"error": errorMsg};
        }

        // change the approved property to true
        paymentObj.approved = true;

        // update onto the world state
        await ctx.stub.putState(paymentKey, Buffer.from(JSON.stringify(paymentObj)));

        console.info(`Approved payment! ${util.inspect(paymentObj)}`);
        console.info("============= END : approvePayment ===========");

        return paymentObj;
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

    // helper function to return the asset if it exists, else empty obj
    // @params:
    //      key (string): key for user asset
    // @return:
    //      asBytes (mixed object): user asset
    async readAsset(ctx, key) {
        const exists = await this.assetExists(ctx, key);
        if (!exists) {
            return {};
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
            let paymentKey = generateLinkKeyHelper(creditor, debtor, pmtId);
            let paymentObj = await this.readAsset(ctx, paymentKey);
            // don't strip pmtId because we will need it when making approval txn
            allPayments.push(paymentObj);
        }
        return allPayments;
    }

}

// returns a payment key string given the args
function generateLinkKeyHelper(creditor, debtor, pmtId) {
    let linkKey = `(${creditor},${debtor},${pmtId.toString()})`;
    return linkKey;
}

module.exports = SpliDwise;
