"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoundObstacle_1 = require("./RoundObstacle");
class Bush extends RoundObstacle_1.default {
    constructor(id, x, y) {
        const size = 100;
        super(id, x, y, size);
        this.opacity = 0.9;
        this.healthMax = 200;
        this.health = this.healthMax * this.opacity;
    }
}
exports.default = Bush;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTRDO0FBRTVDLE1BQXFCLElBQUssU0FBUSx1QkFBYTtJQUM5QyxZQUFZLEVBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMzQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7UUFDakIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQzdDLENBQUM7Q0FDRDtBQVJELHVCQVFDIn0=