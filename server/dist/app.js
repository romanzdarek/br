"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const Controller_1 = require("./Controller");
//express for static files
const express = require('express');
const app = express();
//../client/dist
app.use(express.static('../client/dist'));
//start http server
const port = 8080;
const http = require('http').Server(app).listen(port, () => {
    console.log('listening on:', port);
});
//start app
const controller = new Controller_1.default(http);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFxQztBQUNyQyw2Q0FBc0M7QUFFdEMsMEJBQTBCO0FBQzFCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixnQkFBZ0I7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUUxQyxtQkFBbUI7QUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxXQUFXO0FBQ1gsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=