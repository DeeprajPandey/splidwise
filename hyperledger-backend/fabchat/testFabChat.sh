./teardownFabChat.sh
./startFabChat.sh
# gnome-terminal -- docker logs -f dev-peer0.org1.example.com-fabchat-1.0
cd javascript
node enrollAdmin.js
node registerUser.js user1
node registerUser.js user2
node registerUser.js user3
node invoke.js createMsg hello user1 u1@ashoka.edu.in
node invoke.js createMsg welcome user2 u2@ashoka.edu.in
node invoke.js createMsg covid19 user3 u3@ashoka.edu.in
node query.js -1 user1
node query.js 2 user1
node invoke.js flagMsg 2 user1
node invoke.js flagMsg 2 user2
node query.js 2 user1