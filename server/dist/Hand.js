"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
class Hand {
    constructor(myPlayer, players, map, collisionPoints) {
        this.power = 25;
        this.x = 0;
        this.y = 0;
        this.shiftAngle = 40;
        this.hitTimer = 0;
        this.throwTimer = 0;
        this.throwTimerReady = -5;
        this.inAction = false;
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
        const x = Math.sin(playerAngleForHand * Math.PI / 180) * playerAndHandDistance;
        const y = Math.cos(playerAngleForHand * Math.PI / 180) * playerAndHandDistance;
        //set final position from center
        this.x = this.player.getX() + Player_1.Player.size / 2 + x - Hand.size / 2;
        this.y = this.player.getY() + Player_1.Player.size / 2 - y - Hand.size / 2;
    }
    hit() {
        this.hitTimer = 20;
        this.inAction = true;
        this.hitObjects = [];
    }
    throw() {
        this.throwTimer = 20;
    }
    collisions() {
        //hit?
        //hit players
        for (const player of this.players) {
            if (!this.hitObjects.includes(player) && player.isActive() && player != this.player) {
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
        for (let i = 0; i < this.map.bushes.length; i++) {
            const obstacle = this.map.bushes[i];
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
        for (let i = 0; i < this.map.rocks.length; i++) {
            const obstacle = this.map.rocks[i];
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
        for (let i = 0; i < this.map.trees.length; i++) {
            const obstacle = this.map.trees[i];
            if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
                const obstacleAndHandRadius = obstacle.treeTrankRadius + Hand.radius;
                const x = this.getCenterX() - obstacle.getCenterX();
                const y = this.getCenterY() - obstacle.getCenterY();
                const distance = Math.sqrt(x * x + y * y);
                if (distance < obstacleAndHandRadius) {
                    obstacle.acceptHit(this.power);
                    this.hitObjects.push(obstacle);
                }
            }
        }
        //walls
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
Hand.size = 35;
Hand.radius = Hand.size / 2;
exports.default = Hand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTRCO0FBQzVCLHFDQUFrQztBQUVsQyxxQ0FBa0M7QUFFbEMsTUFBcUIsSUFBSTtJQWlCeEIsWUFBWSxRQUFnQixFQUFFLE9BQWlCLEVBQUUsR0FBUSxFQUFFLGVBQWdDO1FBZGxGLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDcEIsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixvQkFBZSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFLMUIsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQUc5QixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQ2pELENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELFVBQVU7UUFDVCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFD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