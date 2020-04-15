'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var createError = require('http-errors');
var debug = require('debug')('splidwise:server');
var express = require('express');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var util = require('util');

var app = express();
var port = normalizePort(process.env.PORT || '6401');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(cors());

const dummyPath = path.join(process.cwd(), './dummy-data.json');
const dummyJSON = fs.readFileSync(dummyPath, 'utf8');
const dummyData = JSON.parse(dummyJSON);

// get all the assets in world state
app.get('/queryAll', async (req, res) => {
	// invoke fabric to get json with 20 key-val pairs
	res.status(200);
	res.send(dummyData);
});

// get all the assets which are payment links
app.get('/queryAllLinks', async (req, res) => {
	// read the entire world state and filter
	let worldState = dummyData;
	debug(util.inspect(worldState));

	let responseObj = {};
	for (var key in worldState) {
		// check if first and last characters are parentheses
		if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
			responseObj[key] = worldState[key];
		}
	}
	debug(util.inspect(responseObj));
	res.status(200);
	res.send(responseObj);
});

// get all the assets which are user records
app.get('/queryAllUsers', async (req, res) => {
	// read the entire world state and filter
	let worldState = dummyData;
	debug(util.inspect(worldState));

	let responseObj = {};
	for (var key in worldState) {
		// check if first and last characters are parentheses
		if (key.charAt(0) === "(" && key.charAt(key.length-1) === ")") {
			continue;
		}
		responseObj[key] = worldState[key];
	}
	debug(util.inspect(responseObj));
	res.status(200);
	res.send(responseObj);
});


app.listen(port);
debug('Listening on ' + port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
