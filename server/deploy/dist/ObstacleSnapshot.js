"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RectangleObstacle_1 = require("./RectangleObstacle");
const Bush_1 = require("./Bush");
const Tree_1 = require("./Tree");
const Rock_1 = require("./Rock");
class ObstacleSnapshot {
    constructor(obstacle) {
        this.i = obstacle.id;
        this.o = obstacle.getOpacity();
        //wall
        if (obstacle instanceof RectangleObstacle_1.default)
            this.t = 'w';
        //bushes
        else if (obstacle instanceof Bush_1.default)
            this.t = 'b';
        //tree
        else if (obstacle instanceof Tree_1.default)
            this.t = 't';
        //rock
        else if (obstacle instanceof Rock_1.default)
            this.t = 'r';
    }
}
exports.default = ObstacleSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzdGFjbGVTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9PYnN0YWNsZVNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkRBQW9EO0FBQ3BELGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFDMUIsaUNBQTBCO0FBRTFCLE1BQXFCLGdCQUFnQjtJQVFqQyxZQUFZLFFBQTJDO1FBQ25ELElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQixNQUFNO1FBQ04sSUFBRyxRQUFRLFlBQVksMkJBQWlCO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRSxHQUFHLENBQUM7UUFDdEQsUUFBUTthQUNILElBQUcsUUFBUSxZQUFZLGNBQUk7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFFLEdBQUcsQ0FBQztRQUM5QyxNQUFNO2FBQ0QsSUFBRyxRQUFRLFlBQVksY0FBSTtZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUUsR0FBRyxDQUFDO1FBQzlDLE1BQU07YUFDRCxJQUFHLFFBQVEsWUFBWSxjQUFJO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRSxHQUFHLENBQUM7SUFDbEQsQ0FBQztDQUNKO0FBcEJELG1DQW9CQyJ9