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
var port = 6401;

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(cors());

// get all the assets in world state
app.get('/queryAll', async (req, res) => {
	// invoke fabric to get json with 20 key-val pairs
	res.send({"hello":"world"});
});


app.listen(port);
debug('Listening on ' + port);
