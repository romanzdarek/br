"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const WaterTerrainData_1 = require("./WaterTerrainData");
class Model {
    constructor(io) {
        this.games = [];
        this.io = io;
        this.waterTerrainData = new WaterTerrainData_1.default();
        this.games.push(new Game_1.default(this.waterTerrainData));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBRWxELE1BQXFCLEtBQUs7SUFLekIsWUFBWSxFQUFtQjtRQUgvQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBSWxCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMEJBQWdCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ2pELFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTyxJQUFJO1FBQ1gsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO0lBQ0YsQ0FBQztDQUNEO0FBbkJELHdCQW1CQyJ9