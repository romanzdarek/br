"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const RotateCollisionPoints_1 = require("./RotateCollisionPoints");
const Player_1 = require("./Player");
const Hand_1 = require("./Hand");
class CollisionPoints {
    constructor() {
        const hammerCollisionPoints = [
            new Point_1.default(203, 67),
            new Point_1.default(211, 68),
            new Point_1.default(217, 73),
            new Point_1.default(217, 84),
            new Point_1.default(217, 95),
            new Point_1.default(217, 115),
            new Point_1.default(217, 125),
            new Point_1.default(217, 134),
            new Point_1.default(211, 140),
            new Point_1.default(203, 141),
            new Point_1.default(194, 140),
            new Point_1.default(188, 134),
            new Point_1.default(188, 125),
            new Point_1.default(188, 115),
            new Point_1.default(188, 95),
            new Point_1.default(188, 83),
            new Point_1.default(188, 73),
            new Point_1.default(194, 68)
        ];
        this.hammer = new RotateCollisionPoints_1.default(hammerCollisionPoints, 280);
        this.body = this.calculateRoundPoints(Player_1.Player.radius, 10);
        this.hand = this.calculateRoundPoints(Hand_1.default.radius, 20);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uUG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbGxpc2lvblBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE0QjtBQUM1QixtRUFBNEQ7QUFDNUQscUNBQWtDO0FBQ2xDLGlDQUEwQjtBQUUxQixNQUFxQixlQUFlO0lBS25DO1FBQ0MsTUFBTSxxQkFBcUIsR0FBRztZQUM3QixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNuQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ25CLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDbkIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNuQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ25CLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDbkIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNuQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ25CLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDbkIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztTQUNsQixDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLCtCQUFxQixDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsTUFBYyxFQUFFLE9BQWU7UUFDM0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLE9BQU8sRUFBRTtZQUN0QyxVQUFVO1lBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDL0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztDQUNEO0FBMUNELGtDQTBDQyJ9