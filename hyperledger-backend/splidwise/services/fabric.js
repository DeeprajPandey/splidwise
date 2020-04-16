'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
var util = require('util');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// app admin credentials - will be set by enrollAppAdmin
let adminId = '';
let adminPass = '';
const mspId = 'Org1MSP'; // from basic-network/connection.json

exports.enrollAppAdmin = async (id, pass) => {
    try {
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(id);
        if (adminExists) {
            let msg = `An identity for the admin user ${id} already exists in the wallet`;
            console.log(msg);
            return msg;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: pass });
        const identity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(id, identity);
        adminId = id;
        adminPass = pass;

        let msg = `Successfully enrolled admin user ${id} and imported it into the wallet.`
        console.log(msg);
        return msg;
        
    } catch (error) {
        console.error(`Failed to enroll admin user ${id}: ${error}`);
        process.exit(1);
    }
}
