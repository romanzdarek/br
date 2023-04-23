"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Player_1 = require("./Player");
const Weapon_1 = require("./weapon/Weapon");
class Hand {
    constructor(myPlayer, players, map, collisionPoints) {
        this.power = 50; //25
        this.x = 0;
        this.y = 0;
        this.shiftAngle = 40;
        this.hitTimer = 0;
        this.throwTimer = 0;
        this.throwTimerReady = -5;
        this.hitObjects = [];
        this.player = myPlayer;
        this.players = players;
        this.map = map;
        this.collisionPoints = collisionPoints;
    }
    hitReady() {
        return this.hitTimer === 0;
    }
    throwReady() {
        return this.throwTimer === this.throwTimerReady;
    }
    getCenterX() {
        return this.x + Hand.radius;
    }
    getCenterY() {
        return this.y + Hand.radius;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    move(direction) {
        let shiftAngle = this.shiftAngle;
        let playerAndHandDistance = Player_1.Player.radius;
        //hit move
        if (this.hitTimer > 0) {
            switch (this.hitTimer) {
                case 20:
                    shiftAngle -= 4;
                    playerAndHandDistance += 3;
                    break;
                case 19:
                    shiftAngle -= 8;
                    playerAndHandDistance += 6;
                    break;
                case 18:
                    shiftAngle -= 12;
                    playerAndHandDistance += 9;
                    break;
                case 17:
                    shiftAngle -= 16;
                    playerAndHandDistance += 12;
                    break;
                case 16:
                    shiftAngle -= 20;
                    playerAndHandDistance += 15;
                    break;
                case 15:
                    shiftAngle -= 24;
                    playerAndHandDistance += 18;
                    break;
                case 14:
                    shiftAngle -= 28;
                    playerAndHandDistance += 21;
                    break;
                case 13:
                    shiftAngle -= 32;
                    playerAndHandDistance += 24;
                    break;
                case 12:
                    shiftAngle -= 36;
                    playerAndHandDistance += 27;
                    break;
                case 11:
                    shiftAngle -= 40;
                    playerAndHandDistance += 30;
                    break;
                case 10:
                    shiftAngle -= 36;
                    playerAndHandDistance += 27;
                    break;
                case 9:
                    shiftAngle -= 32;
                    playerAndHandDistance += 24;
                    break;
                case 8:
                    shiftAngle -= 28;
                    playerAndHandDistance += 21;
                    break;
                case 7:
                    shiftAngle -= 24;
                    playerAndHandDistance += 18;
                    break;
                case 6:
                    shiftAngle -= 20;
                    playerAndHandDistance += 15;
                    break;
                case 5:
                    shiftAngle -= 16;
                    playerAndHandDistance += 12;
                    break;
                case 4:
                    shiftAngle -= 12;
                    playerAndHandDistance += 9;
                    break;
                case 3:
                    shiftAngle -= 8;
                    playerAndHandDistance += 6;
                    break;
                case 2:
                    shiftAngle -= 4;
                    playerAndHandDistance += 3;
                    break;
                case 1:
                    shiftAngle -= 0;
                    playerAndHandDistance += 0;
                    break;
            }
            this.collisions();
            this.hitTimer--;
        }
        //throw move
        if (this.throwTimer > this.throwTimerReady) {
            switch (this.throwTimer) {
                case 20:
                    shiftAngle -= 2;
                    playerAndHandDistance += 3;
                    break;
                case 19:
                    shiftAngle -= 4;
                    playerAndHandDistance += 6;
                    break;
                case 18:
                    shiftAngle -= 6;
                    playerAndHandDistance += 9;
                    break;
                case 17:
                    shiftAngle -= 8;
                    playerAndHandDistance += 12;
                    break;
                case 16:
                    shiftAngle -= 10;
                    playerAndHandDistance += 15;
                    break;
                case 15:
                    shiftAngle -= 12;
                    playerAndHandDistance += 18;
                    break;
                case 14:
                    shiftAngle -= 14;
                    playerAndHandDistance += 21;
                    break;
                case 13:
                    shiftAngle -= 16;
                    playerAndHandDistance += 24;
                    break;
                case 12:
                    shiftAngle -= 18;
                    playerAndHandDistance += 27;
                    break;
                case 11:
                    shiftAngle -= 20;
                    playerAndHandDistance += 30;
                    break;
                case 10:
                    shiftAngle -= 18;
                    playerAndHandDistance += 27;
                    break;
                case 9:
                    shiftAngle -= 16;
                    playerAndHandDistance += 24;
                    break;
                case 8:
                    shiftAngle -= 14;
                    playerAndHandDistance += 21;
                    break;
                case 7:
                    shiftAngle -= 12;
                    playerAndHandDistance += 18;
                    break;
                case 6:
                    shiftAngle -= 10;
                    playerAndHandDistance += 15;
                    break;
                case 5:
                    shiftAngle -= 8;
                    playerAndHandDistance += 12;
                    break;
                case 4:
                    shiftAngle -= 6;
                    playerAndHandDistance += 9;
                    break;
                case 3:
                    shiftAngle -= 4;
                    playerAndHandDistance += 6;
                    break;
                case 2:
                    shiftAngle -= 2;
                    playerAndHandDistance += 3;
                    break;
                case 1:
                    shiftAngle -= 0;
                    playerAndHandDistance += 0;
                    break;
            }
            this.throwTimer--;
        }
        let playerAngleForHand = this.player.getAngle() + shiftAngle * direction;
        //0 - 359...
        if (playerAngleForHand < 0)
            playerAngleForHand = 359 + playerAngleForHand;
        if (playerAngleForHand > 359)
            playerAngleForHand = playerAngleForHand - 359;
        //triangle
        const x = Math.sin((playerAngleForHand * Math.PI) / 180) * playerAndHandDistance;
        const y = Math.cos((playerAngleForHand * Math.PI) / 180) * playerAndHandDistance;
        //set final position from center
        this.x = this.player.getX() + Player_1.Player.size / 2 + x - Hand.size / 2;
        this.y = this.player.getY() + Player_1.Player.size / 2 - y - Hand.size / 2;
    }
    hit() {
        this.hitTimer = 20;
        this.hitObjects = [];
    }
    throw() {
        this.throwTimer = 20;
    }
    collisions() {
        // Hit?
        // Hit player
        for (const player of this.players) {
            if (!this.hitObjects.includes(player) && player != this.player) {
                const playerAndHandRadius = Player_1.Player.radius + Hand.radius;
                const x = this.getCenterX() - player.getCenterX();
                const y = this.getCenterY() - player.getCenterY();
                const distance = Math.sqrt(x * x + y * y);
                if (distance < playerAndHandRadius) {
                    player.acceptHit(this.power, this.player, Weapon_1.Weapon.Hand);
                    this.hitObjects.push(player);
                }
            }
        }
        // Hit round
        for (let i = 0; i < this.map.roundObstacles.length; i++) {
            const obstacle = this.map.roundObstacles[i];
            if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
                const obstacleAndHandRadius = obstacle.radius + Hand.radius;
                const x = this.getCenterX() - obstacle.getCenterX();
                const y = this.getCenterY() - obstacle.getCenterY();
                const distance = Math.sqrt(x * x + y * y);
                if (distance < obstacleAndHandRadius) {
                    obstacle.acceptHit(this.power);
                    this.hitObjects.push(obstacle);
                }
            }
        }
        // Hit rect
        for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
            const obstacle = this.map.rectangleObstacles[i];
            if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
                if (this.x <= obstacle.x + obstacle.width &&
                    this.x + Hand.size >= obstacle.x &&
                    this.y <= obstacle.y + obstacle.height &&
                    this.y + Hand.size >= obstacle.y) {
                    for (let j = 0; j < this.collisionPoints.hand.length; j++) {
                        const point = this.collisionPoints.hand[j];
                        if (obstacle.isPointIn(new Point_1.default(this.getCenterX() + point.x, this.getCenterY() + point.y))) {
                            obstacle.acceptHit(this.power);
                            this.hitObjects.push(obstacle);
                            break;
                        }
                    }
                }
            }
        }
    }
}
exports.default = Hand;
Hand.size = 30;
Hand.radius = Hand.size / 2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTRCO0FBQzVCLHFDQUFrQztBQUVsQyw0Q0FBeUM7QUFFekMsTUFBcUIsSUFBSTtJQWdCeEIsWUFBWSxRQUFnQixFQUFFLE9BQWlCLEVBQUUsR0FBUSxFQUFFLGVBQWdDO1FBYmxGLFVBQUssR0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJO1FBQ3pCLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsb0JBQWUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUs3QixlQUFVLEdBQVUsRUFBRSxDQUFDO1FBRzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVELFFBQVE7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDakQsQ0FBQztJQUVELFVBQVU7UUFDVCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJO1FBQ0gsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2Ys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