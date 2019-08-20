"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Weapon_1 = require("./Weapon");
class Hammer {
    constructor(myPlayer, players, map, collisionPoints) {
        this.angle = 0;
        this.size = 200;
        this.active = false;
        this.hitTimer = 0;
        this.hitTimerMax = 20;
        this.hitObjects = [];
        this.player = myPlayer;
        this.players = players;
        this.map = map;
        this.collisionPoints = collisionPoints;
    }
    hit() {
        this.active = true;
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
                this.hitObjects = [];
            }
        }
    }
    collisions() {
        const hammerX = this.player.getCenterX() - this.size / 2;
        const hammerY = this.player.getCenterY() - this.size / 2;
        for (const point of this.collisionPoints.hammer.getPointsForAngle(this.getAngle())) {
            const pointX = hammerX + point.x;
            const pointY = hammerY + point.y;
            const collisionPoint = new Point_1.default(pointX, pointY);
            for (const round of this.map.impassableRoundObstacles) {
                if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
                    round.acceptHit(collisionPoint);
                    this.hitObjects.push(round);
                }
            }
            for (const round of this.map.bushes) {
                if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
                    round.acceptHit(collisionPoint);
                    this.hitObjects.push(round);
                }
            }
            for (const rect of this.map.rectangleObstacles) {
                if (!this.hitObjects.includes(rect) && rect.isActive() && rect.isPointIn(collisionPoint)) {
                    rect.acceptHit();
                    this.hitObjects.push(rect);
                }
            }
            for (const player of this.players) {
                if (!this.hitObjects.includes(player) && player.isActive() && player.isPointIn(collisionPoint)) {
                    player.acceptHit(34, this.player, Weapon_1.Weapon.Hammer);
                    this.hitObjects.push(player);
                }
            }
        }
    }
}
exports.default = Hammer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFtbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0hhbW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUc1QixxQ0FBa0M7QUFFbEMsTUFBcUIsTUFBTTtJQVkxQixZQUFZLFFBQWdCLEVBQUUsT0FBaUIsRUFBRSxHQUFRLEVBQUUsZUFBZ0M7UUFYbkYsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQVcsR0FBRyxDQUFDO1FBQ3BCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUt6QixlQUFVLEdBQVUsRUFBRSxDQUFDO1FBRzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVELEdBQUc7UUFDRixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRUQsUUFBUTtRQUNQLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoRCxJQUFJLEtBQUssR0FBRyxDQUFDO1lBQUUsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDbkMsSUFBSSxLQUFLLEdBQUcsR0FBRztZQUFFLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsUUFBUTtRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSztRQUNKLE9BQU8sSUFB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