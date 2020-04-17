# SpliDwise
SpliDwise is a distributed version of a popular similar application called Splitwise implemented on Hyperledger Fabric.
The client facing application is built with Vue.js and the backend api is set up with Express.js which talks to the Fabric
Network (simple setup with only 1 organisation which approves transactions).

## API Documentation

The full documentation is hosted here: https://relaxed-dijkstra-a3d3bb.netlify.com

The documentation comes with a playground set up with the staging server hosted on Heroku. You can make **all** the calls from within the documentation but if you want to test it out yourself, you can do that [here](https://fathomless-fortress-82121.herokuapp.com). A rate limit of 80 requests/hour is enforced since the staging server is currently on free dynos. 

## Setup

SpliDwise is under active development right now and might have multiple breaking changes throughout. Expect the entire
application to change drastically often.

### Install Dependencies
1. Install [node](https://nodejs.org/en/)

2. Start the server (with debugging)
```sh
$ cd user-app/server
$ npm run serve
```

3. In a separate terminal session, start the client (with debugging)
```sh
$ cd user-app/ui
$ npm start
```

4. You can now access the application at http://localhost:8080

### Flow
1. If you are a returning user, log into your account else register as a new user.