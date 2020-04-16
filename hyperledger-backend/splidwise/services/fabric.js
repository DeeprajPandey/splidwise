'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
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
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
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
        console.error(`Failed to evaluate transaction: ${error}`);
        return {"error": `Failed to evaluate transaction: ${user}`};
    } finally {
        console.log('Processed network connection request')
    }
}