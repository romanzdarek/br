"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const RotateCollisionPoints_1 = require("./RotateCollisionPoints");
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
        this.body = this.calculateRoundPoints(80, 10);
        this.hand = this.calculateRoundPoints(40, 20);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uUG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbGxpc2lvblBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE0QjtBQUM1QixtRUFBNEQ7QUFFNUQsTUFBcUIsZUFBZTtJQUtuQztRQUNDLE1BQU0scUJBQXFCLEdBQUc7WUFDN0IsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsSUFBSSxlQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1NBQ2xCLENBQUM7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksK0JBQXFCLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFcEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVsRCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsTUFBYyxFQUFFLE9BQWU7UUFDeEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLE9BQU8sRUFBRTtZQUN0QyxVQUFVO1lBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ3JCLENBQUM7Q0FDRDtBQWpDRCxrQ0FpQ0MifQ==