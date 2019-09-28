"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoundObstacle_1 = require("./RoundObstacle");
class Bush extends RoundObstacle_1.default {
    constructor(id, x, y, angle) {
        const size = 350;
        super(id, x, y, size);
        this.opacity = 1;
        this.healthMax = 200;
        this.health = this.healthMax * this.opacity;
        this.angle = angle;
    }
}
exports.default = Bush;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTRDO0FBRTVDLE1BQXFCLElBQUssU0FBUSx1QkFBYTtJQUc5QyxZQUFZLEVBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWE7UUFDMUQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0NBQ0Q7QUFYRCx1QkFXQyJ9