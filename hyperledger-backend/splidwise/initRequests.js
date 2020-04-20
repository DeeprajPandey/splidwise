'use strict';
const axios = require('axios')
const fs = require('fs');
const path = require('path');

const requestsPath = path.join(process.cwd(), './init-requests.json');
const requestsJSON = fs.readFileSync(requestsPath, 'utf8');
const requestsData = JSON.parse(requestsJSON);

const baseurl = 'http://localhost:6401';

const index = process.argv.slice(2)[0];

axios({
    method: 'post',
    url: baseurl + requestsData[index].url,
    data: requestsData[index].request
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error.response.status);
});


// function makeCall(url, requestBody) {
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'post',
//             url: baseurl + url,
//             data: requestBody
//         })
//         .then(serverResponse => {
//             resolve(serverResponse);
//         });
//     });
// }

// function initialise() {
//     let oneRequest = null;

//     requestsData.forEach(async (req) => {
//             oneRequest = (makeCall(req.url, req.request));

//             await oneRequest.then(resp => {
//                 console.log(resp.status);
//             });
//         }
//     );
// }

// initialise();

// for (const i in requestsData) {
//     axios({
//         method: 'post',
//         url: baseurl + requestsData[i].url,
//         data: requestsData[i].request
//     })
//     .then(response => {
//         console.log(response.status);
//     });
// }
