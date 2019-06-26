"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const WaterTerrainData_1 = require("./WaterTerrainData");
const CollisionPoints_1 = require("./CollisionPoints");
class Model {
    constructor(io) {
        this.games = [];
        this.io = io;
        this.waterTerrainData = new WaterTerrainData_1.default();
        this.collisionPoints = new CollisionPoints_1.default();
        this.games.push(new Game_1.default(this.waterTerrainData, this.collisionPoints));
        setInterval(() => {
            this.loop();
        }, 1000 / 60);
    }
    loop() {
        for (const game of this.games) {
            game.loop();
        }
    }
}
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUVoRCxNQUFxQixLQUFLO0lBTXpCLFlBQVksRUFBbUI7UUFKdEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUszQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVPLElBQUk7UUFDWCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ1o7SUFDRixDQUFDO0NBQ0Q7QUFyQkQsd0JBcUJDIn0=