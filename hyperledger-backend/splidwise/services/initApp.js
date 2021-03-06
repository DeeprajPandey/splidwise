'use strict';
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const util = require('util');

const requestsPath = path.join(process.cwd(), './services/init-requests.json');
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
	console.log(response.status);
    console.log(response.data);
    console.log('\n');
})
.catch(error => {
	const logMsg = error.response ?
			`[${error.response.status}] Check request object ${index}` : 
			`[${error.code}] Check connection to server`;
    console.error(logMsg);
});
