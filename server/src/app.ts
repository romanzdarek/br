import 'source-map-support/register';
import Controller from './Controller';

//express for static files
const express = require('express');
const app = express();
//static files in static folder
app.use(express.static('static'));

//start http server
const port = process.env.PORT || 8080;
const http = require('http').Server(app).listen(port, () => {
	console.log('listening on:', port);
});

//start app
const controller = new Controller(http);
