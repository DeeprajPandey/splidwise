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

class FabChat extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const startKey = '0';
        const endKey = '99999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));
                let msg;
                try {
                    msg = JSON.parse(res.value.value.toString('utf8'));

                    // update users array and msgID
                    if (msg.msgText === "$HELLO$") {
                        users.push(msg.userID);
                    }

                    msgID += 1;

                } catch (err) {
                    console.log(err);
                    msg = res.value.value.toString('utf8');
                }
            }

            if (res.done) {
                await iterator.close();
                console.log(`users: ${users}`);
                console.log(`numUsers: ${users.length}`);
                console.log(`lastMsgID: ${msgID}`);
                break;
            }
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createMsg(ctx, msgText, emailID) {
        console.info('============= START : createMsg ===========');

        let cid = new ClientIdentity(ctx.stub);
        let userID = cid.getID();

        console.log(`msgText : ${msgText}`);
        console.log(`userID  : ${userID}`);
        console.log(`emailID : ${emailID}`);

        const flaggers = [];
        const flag = 0;

        const msg = {
            msgText,
            userID,
            flag,
            flaggers,
            emailID,
        };

        // if new user, add user to users array
        if (!(users.includes(userID))) {
            console.log(`New user! Added to users array.`);
            users.push(userID);
        }

        msgID += 1;

        await ctx.stub.putState(msgID.toString(), Buffer.from(JSON.stringify(msg)));
        console.info('============= END : createMsg ===========');
    }

    async queryMsg(ctx, msgID) {
        console.info('============= START : queryMsgByID ===========');
        console.log(`msgID: ${msgID}`);

        const msgAsBytes = await ctx.stub.getState(msgID); // get the msg from chaincode state
        if (!msgAsBytes || msgAsBytes.length === 0) {
            throw new Error(`${msgID} does not exist`);
        }
        let msg;
        msg = JSON.parse(msgAsBytes.toString());

        // don't show registration $HELLO$ records
        if (msg.msgText === "$HELLO$") {
            throw new Error(`${msgID} does not exist`);
        }

        // don't show email ID if flag is not -1
        if (msg.flag !== -1) {
            delete msg.emailID;
        }

        // no need to show these fields anyway
        delete msg.flag;
        delete msg.flaggers;
        delete msg.userID;

        console.log(msg);
        console.info('============= END : queryMsgByID ===========');
        return JSON.stringify(msg);
    }


    async queryAllMsgs(ctx) {
        console.info('============= START : queryAllMsgs ===========');

        const startKey = '0';
        const endKey = '99999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let msg;
                try {
                    msg = JSON.parse(res.value.value.toString('utf8'));

                    // don't show registration $HELLO$ records
                    if (msg.msgText === "$HELLO$") {
                        continue;
                    }

                    // don't show email ID if flag is not -1
                    if (msg.flag !== -1) {
                        delete msg.emailID;
                    }

                    // no need to show these fields anyway
                    delete msg.userID;
                    delete msg.flag;
                    delete msg.flaggers;

                } catch (err) {
                    console.log(err);
                    msg = res.value.value.toString('utf8');
                }
                allResults.push({Key, msg});
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.info('============= END : queryAllMsgs ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    async flagMsg(ctx, msgID) {
        console.info('============= START : flagMsg ===========');

        let cid = new ClientIdentity(ctx.stub);
        let flagger = cid.getID();
        let threshold = Math.ceil(0.5 * users.length);

        console.log(`numUsers: ${users.length}`);
        console.log(`threshold: ${threshold}`);
        console.log(`msgID: ${msgID}`);
        console.log(`flagger  : ${flagger}`);

        const msgAsBytes = await ctx.stub.getState(msgID); // get the msg from chaincode state
        if (!msgAsBytes || msgAsBytes.length === 0) {
            throw new Error(`${msgID} does not exist`);
        }
        const msg = JSON.parse(msgAsBytes.toString());

        /* flag only if:
			1. flagger is not trying to flag its own msg
			2. flagger has not already flagged the msg
			3. flagger is not trying to flag $HELLO$ msgs
			4. flagger is not trying to flag a msg with flag = -1
        */
        if ((flagger !== msg.userID) && !(msg.flaggers.includes(flagger)) && (msg.msgText !== "$HELLO$") && (msg.flag !== -1)) {

            // push new flagger in flaggers array
            msg.flaggers.push(flagger);
            // increment flag
            msg.flag += 1;

            console.log(`msgID ${msgID} flagged successfully!`);

            // if flag count reaches threshold, set flag = -1
            if (msg.flag >= threshold) {
                msg.flag = -1;
                console.log(`msgID ${msgID} flag count has now reached threshold!`);
            }

        } else {
            throw new Error(`Cannot flag message!`);
        }

        await ctx.stub.putState(msgID, Buffer.from(JSON.stringify(msg)));
        console.info('============= END : flagMsg ===========');
    }

}

module.exports = FabChat;
