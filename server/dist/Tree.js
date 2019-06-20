"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoundObstacle_1 = require("./RoundObstacle");
class Tree extends RoundObstacle_1.default {
    constructor(id, x, y) {
        const size = 200;
        super(id, x, y, size);
        this.treeTrankRadius = 35;
        this.opacity = 0.9;
    }
    isPointIn(point) {
        //triangle
        const x = this.x + this.radius - point.x;
        const y = this.y + this.radius - point.y;
        const radius = Math.sqrt(x * x + y * y);
        //tree trank hit
        if (radius <= this.treeTrankRadius)
            return true;
        return false;
    }
}
exports.default = Tree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UcmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTRDO0FBRzVDLE1BQXFCLElBQUssU0FBUSx1QkFBYTtJQUc5QyxZQUFZLEVBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMzQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7UUFDakIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBWTtRQUNyQixVQUFVO1FBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QyxnQkFBZ0I7UUFDaEIsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLGVBQWU7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNoRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7Q0FDRDtBQW5CRCx1QkFtQkMifQ==