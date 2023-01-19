"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoundObstacle_1 = require("./RoundObstacle");
class Rock extends RoundObstacle_1.default {
    constructor(id, x, y) {
        const size = 100;
        super(id, x, y, size);
        this.opacity = 1;
        this.healthMax = 200;
        this.health = this.healthMax;
    }
}
exports.default = Rock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Sb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTRDO0FBRTVDLE1BQXFCLElBQUssU0FBUSx1QkFBYTtJQUM5QyxZQUFZLEVBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMzQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7UUFDakIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUM5QixDQUFDO0NBQ0Q7QUFSRCx1QkFRQyJ9