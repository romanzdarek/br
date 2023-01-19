"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const Controller_1 = require("./Controller");
var AppVariant;
(function (AppVariant) {
    AppVariant["Production"] = "production";
    AppVariant["Localhost"] = "localhost";
})(AppVariant = exports.AppVariant || (exports.AppVariant = {}));
exports.appVariant = process.argv[2] === 'production' ? AppVariant.Production : AppVariant.Localhost;
//express for static files
const express = require('express');
const app = express();
//static files in static folder
app.use(express.static('static'));
const port = 8000;
const http = require('http')
    .Server(app)
    .listen(port, () => {
    console.log(`Running ${exports.appVariant} variant on: http://localhost:${port}`);
});
//start app
const controller = new Controller_1.default(http);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFxQztBQUNyQyw2Q0FBc0M7QUFFdEMsSUFBWSxVQUdYO0FBSEQsV0FBWSxVQUFVO0lBQ3JCLHVDQUF5QixDQUFBO0lBQ3pCLHFDQUF1QixDQUFBO0FBQ3hCLENBQUMsRUFIVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUdyQjtBQUVZLFFBQUEsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBRTFHLDBCQUEwQjtBQUMxQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDdEIsK0JBQStCO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDWCxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsa0JBQVUsaUNBQWlDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDM0UsQ0FBQyxDQUFDLENBQUM7QUFFSixXQUFXO0FBQ1gsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=