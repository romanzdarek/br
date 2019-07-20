"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const RotateCollisionPoints_1 = require("./RotateCollisionPoints");
const Player_1 = require("./Player");
const Hand_1 = require("./Hand");
class CollisionPoints {
    constructor() {
        const hammerCollisionPoints = [
            new Point_1.default(152, 36),
            new Point_1.default(182, 36),
            new Point_1.default(152, 56),
            new Point_1.default(182, 56),
            new Point_1.default(152, 78),
            new Point_1.default(182, 78),
            new Point_1.default(152, 95),
            new Point_1.default(182, 95)
        ];
        this.hammer = new RotateCollisionPoints_1.default(hammerCollisionPoints, 200);
        this.body = this.calculateRoundPoints(Player_1.Player.radius, 10);
        this.hand = this.calculateRoundPoints(Hand_1.default.radius, 10);
    }
    calculateRoundPoints(radius, density) {
        const points = [];
        for (let i = 0; i < 360; i += density) {
            //triangle
            const x = Math.sin(i * Math.PI / 180) * radius;
            const y = Math.cos(i * Math.PI / 180) * radius;
            points.push(new Point_1.default(x, y));
        }
        return points;
    }
}
exports.default = CollisionPoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uUG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbGxpc2lvblBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE0QjtBQUM1QixtRUFBNEQ7QUFDNUQscUNBQWtDO0FBQ2xDLGlDQUEwQjtBQUUxQixNQUFxQixlQUFlO0lBS25DO1FBQ0MsTUFBTSxxQkFBcUIsR0FBRztZQUM3QixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7U0FDbEIsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSwrQkFBcUIsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxlQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLG9CQUFvQixDQUFDLE1BQWMsRUFBRSxPQUFlO1FBQzNELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUU7WUFDdEMsVUFBVTtZQUNWLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0I7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7Q0FDRDtBQWhDRCxrQ0FnQ0MifQ==