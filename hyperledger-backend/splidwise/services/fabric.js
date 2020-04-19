'use strict';

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const debug = require('debug')('splidwise:server');
const fs = require('fs');
const path = require('path');
const util = require('util');

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
        const contract = await network.getContract('splidwise');

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

exports.invoke = async (action, args, isQuery, networkObj) => {
    try {
        let result;
        if (args) {
            if (isQuery) {
                result = await networkObj.contract.evaluateTransaction(action, ...args);
                console.info(`${action}(${util.inspect(args)}) transaction has been evaluated.`);
                console.info(`Response: ${result.toString()}`);
            } else {
                result = await networkObj.contract.submitTransaction(action, ...args);
                console.info(`${action}(${util.inspect(args)}) transaction submitted.`);
                console.info(`Response: ${result.toString()}`);
                await networkObj.gateway.disconnect();
            }
        } else {
            if (isQuery) {
                result = await networkObj.contract.evaluateTransaction(action);
                console.info(`${action}() transaction has been evaluated.`);
                console.info(`Response: ${result.toString()}`);
            } else {
                result = await networkObj.contract.submitTransaction(action);
                console.info(`${action}() transaction submitted.`);
                console.info(`Response: ${result.toString()}`);
                await networkObj.gateway.disconnect();
            }
        }
        return result;

    } catch(error) {
        debug(`Failed to connect to network: ${error}`);
        return {"error": `Failed to connect to network: ${error}`};

    } finally {
        console.info('Processed invoke and submitted/evaluated transaction.');
    }
}

exports.registerUser = async (newUser) => {
    // validate username
    let valid = await usernameSanity(newUser);
    if (!valid) {
        return {"error": "Invalid username. Retry."}
    }

    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.info(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(newUser.username);
        if (userExists) {
            let errorMsg = `An identity for the user ${newUser.username} already exists in the wallet`;
            console.info(errorMsg);
            return {"error": errorMsg};
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(adminId);
        if (!adminExists) {
            let errorMsg = 'An identity for the admin user does not exist in the wallet';
            console.info(errorMsg);
            console.info('Run the enrollAdmin.js application before retrying');
            return {"error": errorMsg};
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: adminId, discovery: {enabled: false}});

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = await gateway.getClient().getCertificateAuthority();
        const adminIdentity = await gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: newUser.username,
            role: 'client'
        }, adminIdentity);
        const enrollment = await ca.enroll({enrollmentID: newUser.username, enrollmentSecret: secret});
        const userIdentity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(newUser.username, userIdentity);
        console.info(`Successfully registered and enrolled user ${newUser.username} and imported it into the wallet`);
        return {};
    } catch (error) {
        debug(`Failed to register user ${newUser.username}: ${error}`);
        return {"error": `Failed to register ${newUser.username} with CA: ${error}`};
    }
}

async function usernameSanity(userObj) {
    let username = userObj.username;
    if (!username || username.includes(',') || username.includes('+')) {
        return false;
    }
    return true;
}
