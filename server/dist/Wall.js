"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RectangleObstacle_1 = require("./obstacle/RectangleObstacle");
class Wall extends RectangleObstacle_1.default {
    constructor(id, x, y, width, height) {
        super(id, x, y, width, height);
        this.healthMax = 200;
        this.health = this.healthMax;
    }
}
exports.default = Wall;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9XYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0VBQTZEO0FBRTdELE1BQXFCLElBQUssU0FBUSwyQkFBaUI7SUFDbEQsWUFBWSxFQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUMxRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUM5QixDQUFDO0NBQ0Q7QUFORCx1QkFNQyJ9