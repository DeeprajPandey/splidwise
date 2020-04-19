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

// connect to the network using an identity registered with the CA
exports.connectAsUser = async (user) => {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.info(`connectAsUser::Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            let errorMsg = `connectAsUser::An identity for the user ${user} does not exist in the wallet`;
            console.info(errorMsg);
            return {"error": errorMsg};
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
        console.info(`$connectAsUser::${user}::Connected to network...`);
        return networkObj;

    } catch (error) {
        let errorMsg = `connectAsUser::Failed to connect to network: ${error}`;
        debug(errorMsg);
        return {"error": errorMsg};

    } finally {
        console.info('connectAsUser::Processed network connection request.\n');
    }
}

// invoke contract functions
exports.invoke = async (action, args, isQuery, networkObj) => {
    try {
        let result;
        if (args) {
            if (isQuery) {
                result = await networkObj.contract.evaluateTransaction(action, ...args);
                console.info(`$invoke::${action}(${util.inspect(args)}) transaction evaluated.`);
                console.info(`invoke::Response: ${result.toString()}`);
            } else {
                result = await networkObj.contract.submitTransaction(action, ...args);
                console.info(`$invoke::${action}(${util.inspect(args)}) transaction submitted.`);
                console.info(`invoke::Response: ${result.toString()}`);
                await networkObj.gateway.disconnect();
            }
        } else {
            if (isQuery) {
                result = await networkObj.contract.evaluateTransaction(action);
                console.info(`$invoke::${action}() transaction evaluated.`);
                console.info(`invoke::Response: ${result.toString()}`);
            } else {
                result = await networkObj.contract.submitTransaction(action);
                console.info(`$invoke::${action}() transaction submitted.`);
                console.info(`invoke::Response: ${result.toString()}`);
                await networkObj.gateway.disconnect();
            }
        }
        console.info('invoke::Txn result received from contract.')
        const resultObj = await JSON.parse(result);
        return resultObj;

    } catch(error) {
        let errorMsg = `invoke::Failed to send transaction: ${error}`;
        debug(errorMsg);
        return {"error": errorMsg};

    } finally {
        console.info('invoke::Processed request to invoke.\n');
    }
}

// registers a new user with the CA and adds info to the world state
// newUse (object): username, info{name, p_hash}
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
        console.info(`registerUser::Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(newUser.username);
        if (userExists) {
            let errorMsg = `registerUser::An identity for the user ${newUser.username} already exists in the wallet`;
            console.info(errorMsg);
            return {"error": errorMsg};
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(adminId);
        if (!adminExists) {
            let errorMsg = 'registerUser::An identity for the admin user does not exist in the wallet';
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
        const userIdentity = await X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(newUser.username, userIdentity);
        console.info(`$registerUser::${newUser.username}::Successfully registered, enrolled, and imported identity of user ${newUser.username} into the wallet`);
        return {};
    } catch (error) {
        let errorMsg = `registerUser::Failed to register user ${newUser.username} with CA: ${error}`;
        debug(errorMsg);
        return {"error": errorMsg};
    } finally {
        console.info('registerUser::Processed request to registerUser.\n');
    }
}

// sanity check for the username: , and + are forbidden in emails on our app
async function usernameSanity(userObj) {
    let username = userObj.username;
    if (!username || username.includes(',') || username.includes('+')) {
        return false;
    }
    return true;
}
