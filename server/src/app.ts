import 'source-map-support/register';
import Controller from './Controller';

//express for static files
const express = require('express');
const app = express();
app.use(express.static('../client/dist'));

//start http server
const port = 8888;
const http = require('http').Server(app).listen(port, () => {
	console.log('listening on:', port);
});

//start app
const controller = new Controller(http);
