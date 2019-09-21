"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Weapon_1 = require("./Weapon");
class Hammer {
    constructor(myPlayer, players, map, collisionPoints) {
        this.angle = 0;
        this.power = 34;
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
                    round.acceptHit(this.power);
                    this.hitObjects.push(round);
                }
            }
            for (const round of this.map.bushes) {
                if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
                    round.acceptHit(thispower);
                    this.hitObjects.push(round);
                }
            }
            for (const rect of this.map.rectangleObstacles) {
                if (!this.hitObjects.includes(rect) && rect.isActive() && rect.isPointIn(collisionPoint)) {
                    rect.acceptHit(this.power);
                    this.hitObjects.push(rect);
                }
            }
            for (const player of this.players) {
                if (!this.hitObjects.includes(player) && player.isActive() && player.isPointIn(collisionPoint)) {
                    player.acceptHit(this.power, this.player, Weapon_1.Weapon.Hammer);
                    this.hitObjects.push(player);
                }
            }
        }
    }
}
exports.default = Hammer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFtbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0hhbW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUc1QixxQ0FBa0M7QUFFbEMsTUFBcUIsTUFBTTtJQWExQixZQUFZLFFBQWdCLEVBQUUsT0FBaUIsRUFBRSxHQUFRLEVBQUUsZUFBZ0M7UUFabkYsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNqQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFNBQUksR0FBVyxHQUFHLENBQUM7UUFDcEIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBS3pCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUFHOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0lBRUQsR0FBRztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxRQUFRO1FBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hELElBQUksS0FBSyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLEtBQUssR0FBRyxHQUFHO1lBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENB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