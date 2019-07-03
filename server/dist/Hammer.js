"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class Hammer {
    constructor(myPlayer, players, map, collisionPoints) {
        this.angle = 0;
        this.size = 200;
        this.active = false;
        this.inAction = false;
        this.hitTimer = 0;
        this.hitTimerMax = 20;
        this.player = myPlayer;
        this.players = players;
        this.map = map;
        this.collisionPoints = collisionPoints;
    }
    hit() {
        this.active = true;
        this.inAction = true;
    }
    getAngle() {
        let angle = this.player.getAngle() + this.angle;
        if (angle < 0)
            angle = 360 + angle;
        if (angle > 359)
            angle = angle - 360;
        return Math.round(angle);
    }
    isActive() {
        return this.active;
    }
    ready() {
        return this.hitTimer === 0;
    }
    move() {
        if (this.active) {
            if (this.hitTimer < this.hitTimerMax) {
                const shift = 10;
                if (this.hitTimer < this.hitTimerMax / 2) {
                    this.angle -= shift;
                    this.collisions();
                }
                else {
                    this.angle += shift;
                }
                this.hitTimer++;
            }
            else {
                this.active = false;
                this.hitTimer = 0;
            }
        }
    }
    collisions() {
        if (this.inAction) {
            const hammerX = this.player.getCenterX() - this.size / 2;
            const hammerY = this.player.getCenterY() - this.size / 2;
            for (const point of this.collisionPoints.hammer.getPointsForAngle(this.getAngle())) {
                const pointX = hammerX + point.x;
                const pointY = hammerY + point.y;
                const collisionPoint = new Point_1.default(pointX, pointY);
                for (const round of this.map.impassableRoundObstacles) {
                    if (round.isActive() && round.isPointIn(collisionPoint)) {
                        round.acceptHit(collisionPoint);
                        this.inAction = false;
                        break;
                    }
                }
                for (const rect of this.map.rectangleObstacles) {
                    if (rect.isActive() && rect.isPointIn(collisionPoint)) {
                        rect.acceptHit();
                        this.inAction = false;
                        break;
                    }
                }
            }
        }
    }
}
exports.default = Hammer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFtbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0hhbW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUk1QixNQUFxQixNQUFNO0lBWTFCLFlBQVksUUFBZ0IsRUFBRSxPQUFpQixFQUFFLEdBQVEsRUFBRSxlQUFnQztRQVhuRixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBVyxHQUFHLENBQUM7UUFDcEIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFPaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0lBRUQsR0FBRztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxRQUFRO1FBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hELElBQUksS0FBSyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLEtBQUssR0FBRyxHQUFHO1lBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSTtRQUNILElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDckMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7b0JBQ3pDLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO29CQUNwQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7aUJBQ2xCO3FCQUNJO29CQUNKLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO2lCQUNwQjtnQkFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDaEI7aUJBQ0k7Z0JBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO1NBQ0Q7SUFDRixDQUFDO0lBRU8sVUFBVTtRQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUN6RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7Z0JBQ25GLE1BQU0sTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLE1BQU0sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxjQUFjLEdBQUcsSUFBSSxlQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUU7b0JBQ3RELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUU7d0JBQ3hELEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO3dCQUN0QixNQUFNO3FCQUNOO2lCQUNEO2dCQUNELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtvQkFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDdEQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzt3QkFDdEIsTUFBTTtxQkFDTjtpQkFDRDthQUNEO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUFwRkQseUJBb0ZDIn0=