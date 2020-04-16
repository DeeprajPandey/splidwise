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

}

module.exports = SpliDwise;
