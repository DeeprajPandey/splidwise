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
