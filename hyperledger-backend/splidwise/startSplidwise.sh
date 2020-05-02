#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/splidwise

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../basic-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and submit initLedger txn
docker-compose -f ./docker-compose.yml up -d cli

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n splidwise -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n splidwise -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 10
# enroll admin and start the server
cd ../splidwise
node services/enrollAdmin.js; sleep 1

# echo "Starting splidwise server in a new tmux session [server]..."
# tmux new -d -s server
# tmux send-keys -t server.0 "npm run serve" ENTER
# sleep 8

# echo "Initialising app with users and making dummy payments..."
# for ((c=0; c<=11; c++))
# do
# 	node services/initApp.js $c; sleep 1.5
# done

# echo "\n\nAttaching to tmux session for [server] in 15 seconds.\nPress \`Ctrl+c\` to stop."
# echo "\nYou can detach from tmux by pressing \`Ctrl+b\` then \`d\`"
# sleep 15
# tmux attach -t "server"
