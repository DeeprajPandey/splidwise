'use strict';

const {FileSystemWallet, Gateway} = require('fabric-network');
var debug = require('debug')('splidwise:server');
const fs = require('fs');
const path = require('path');
var util = require('util');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// app admin credentials set by enrollAdmin
let adminId = 'admin';
let adminPass = 'adminpw';
const mspId = 'Org1MSP'; // from basic-network/connection.json

exports.connectAsUser = async (user) => {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.info(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.info(`An identity for the user ${user} does not exist in the wallet`);
            return {"error": `An identity for ${user} does not exist in the wallet`};
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: user, discovery: {enabled: false}});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('splidwise');

        let networkObj = {
            "gateway": gateway,
            "contract": contract
        };

        return networkObj;

    } catch (error) {
        debug(`Failed to connect to network: ${error}`);
        return {"error": `Failed to connect to network: ${error}`};
    } finally {
        console.info('Processed network connection request');
    }
}

exports.invoke = async (isQuery, networkObj, action, args) => {
    try {
        if (args) {
            if (isQuery) {
                const result = await networkObj.contract.evaluateTransaction(action, JSON.stringify(args));
                console.info(`${action}(${util.inspect(args)}) transaction has been evaluated.`);
                console.info(`Result: ${result.toString()}`);
            } else {
                await networkObj.contract.submitTransaction(action, JSON.stringify(args));
                console.info(`${action}(${util.inspect(args)}) transaction submitted.`);
                await networkObj.gateway.disconnect();
            }
        } else {
            if (isQuery) {
                const result = await networkObj.contract.evaluateTransaction(action);
                console.info(`${action}() transaction has been evaluated.`);
                console.info(`Result: ${result.toString()}`);
            } else {
                await networkObj.contract.submitTransaction(action);
                console.info(`${action}() transaction submitted.`);
                await networkObj.gateway.disconnect();
            }
        }
    } catch(error) {
        debug(`Failed to connect to network: ${error}`);
        return {"error": `Failed to connect to network: ${error}`};
    } finally {
        console.info('Processed invoke and submitted/evaluated transaction.');
    }
}
