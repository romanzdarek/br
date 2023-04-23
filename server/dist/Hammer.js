"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Weapon_1 = require("./Weapon");
const Sound_1 = require("./Sound");
class Hammer {
    constructor(myPlayer, players, map, collisionPoints) {
        this.angle = 0;
        this.power = 100; //34
        this.size = 500; // 280
        this.active = false;
        this.hitTimer = 0;
        this.hitTimerMax = 20; // 20
        this.returnTimer = 0;
        this.returnTimerMax = 20;
        this.hitObjects = [];
        this.player = myPlayer;
        this.players = players;
        this.map = map;
        this.collisionPoints = collisionPoints;
    }
    hit() {
        this.active = true;
        this.moveType = 'hit';
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
            const shift = 8; //
            if (this.moveType === 'hit' && this.hitTimer <= this.hitTimerMax) {
                this.angle -= shift;
                console.log('hit', this.angle);
                this.hitTimer++;
                this.collisions();
                if (this.hitTimer === this.hitTimerMax) {
                    this.moveType = 'return';
                    this.returnTimer = 0;
                }
            }
            else if (this.moveType === 'return' && this.returnTimer <= this.returnTimerMax) {
                this.angle += shift;
                console.log('return', this.angle);
                this.returnTimer++;
                if (this.returnTimer === this.returnTimerMax) {
                    this.active = false;
                    this.hitTimer = 0;
                    this.returnTimer = 0;
                    this.hitObjects = [];
                }
            }
        }
    }
    block(blockedPoint) {
        this.moveType = 'return';
        this.returnTimer = this.hitTimerMax - this.hitTimer;
        const sound = new Sound_1.default(Sound_1.SoundType.SwordBlock, blockedPoint.x, blockedPoint.y);
        this.player.sounds.push(sound);
    }
    collisions() {
        const x = this.player.getCenterX() - this.size / 2;
        const y = this.player.getCenterY() - this.size / 2;
        const hammerCenter = new Point_1.default(x, y);
        // block colision
        // TODO: implement optimalization, compare points only if it is necessarily
        const minGap = 12;
        for (const point of this.collisionPoints.maceBlock.getPointsForAngle(this.getAngle())) {
            const hammerPoint = new Point_1.default(hammerCenter.x + point.x, hammerCenter.y + point.y);
            for (const player of this.players) {
                const _x = player.getCenterX() - this.size / 2;
                const _y = player.getCenterY() - this.size / 2;
                const _hammerCenter = new Point_1.default(_x, _y);
                if (player === this.player || !player.isActive())
                    continue;
                if (player.inventory.activeItem instanceof Hammer) {
                    for (const _point of this.collisionPoints.maceBlock.getPointsForAngle(player.inventory.activeItem.getAngle())) {
                        const _hammerPoint = new Point_1.default(_hammerCenter.x + _point.x, _hammerCenter.y + _point.y);
                        if (Math.abs(hammerPoint.x - _hammerPoint.x) <= minGap && Math.abs(hammerPoint.y - _hammerPoint.y) <= minGap) {
                            this.block(hammerPoint);
                            return;
                        }
                    }
                }
            }
        }
        for (const point of this.collisionPoints.hammer.getPointsForAngle(this.getAngle())) {
            const hammerPoint = new Point_1.default(hammerCenter.x + point.x, hammerCenter.y + point.y);
            const collisionPoint = new Point_1.default(hammerPoint.x, hammerPoint.y);
            for (const round of this.map.roundObstacles) {
                if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
                    round.acceptHit(this.power);
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
                if (!this.hitObjects.includes(player) && player.isPointIn(collisionPoint)) {
                    player.acceptHit(this.power, this.player, Weapon_1.Weapon.Hammer);
                    this.hitObjects.push(player);
                }
            }
        }
    }
}
exports.default = Hammer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFtbWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0hhbW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUc1QixxQ0FBa0M7QUFDbEMsbUNBQTJDO0FBRTNDLE1BQXFCLE1BQU07SUFtQjFCLFlBQVksUUFBZ0IsRUFBRSxPQUFpQixFQUFFLEdBQVEsRUFBRSxlQUFnQztRQWxCbkYsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNqQixVQUFLLEdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSTtRQUN6QixTQUFJLEdBQVcsR0FBRyxDQUFDLENBQUMsTUFBTTtRQUMzQixXQUFNLEdBQVksS0FBSyxDQUFDO1FBRXhCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZ0JBQVcsR0FBVyxFQUFFLENBQUMsQ0FBQyxLQUFLO1FBRS9CLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBT3BCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUFHOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0lBRUQsR0FBRztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRO1FBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hELElBQUksS0FBSyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLEtBQUssR0FBRyxHQUFHO1lBQUUs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