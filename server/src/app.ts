import 'source-map-support/register';
import Controller from './Controller';

export enum AppVariant {
	Production = 'production',
	Localhost = 'localhost',
}

export const appVariant = process.argv[2] === 'production' ? AppVariant.Production : AppVariant.Localhost;

//express for static files
const express = require('express');
const app = express();
//static files in static folder
app.use(express.static('static'));

const port = 8000;
const http = require('http')
	.Server(app)
	.listen(port, () => {
		console.log(`Running ${appVariant} variant on: http://localhost:${port}`);
	});

//start app
const controller = new Controller(http);
