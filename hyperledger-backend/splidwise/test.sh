#!/bin/bash
./teardownSplidwise.sh
./startSplidwise.sh
node javascript/enrollAdmin
node javascript/registerUser user1
node javascript/query -1 user1