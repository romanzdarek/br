"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class Hand {
    constructor(myPlayer, players, map, collisionPoints) {
        this.size = 40;
        this.x = 0;
        this.y = 0;
        this.radius = this.size / 2;
        this.shiftAngle = 40;
        this.hitTimer = 0;
        this.throwTimer = 0;
        this.throwTimerReady = -5;
        this.inAction = false;
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
        return this.x + this.radius;
    }
    getCenterY() {
        return this.y + this.radius;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    move(direction) {
        let shiftAngle = this.shiftAngle;
        let playerAndHandDistance = this.player.radius;
        //hit move
        if (this.hitTimer > 0) {
            switch (this.hitTimer) {
                case 20:
                    shiftAngle -= 4;
                    playerAndHandDistance += 2;
                    break;
                case 19:
                    shiftAngle -= 8;
                    playerAndHandDistance += 4;
                    break;
                case 18:
                    shiftAngle -= 12;
                    playerAndHandDistance += 6;
                    break;
                case 17:
                    shiftAngle -= 16;
                    playerAndHandDistance += 8;
                    break;
                case 16:
                    shiftAngle -= 20;
                    playerAndHandDistance += 10;
                    break;
                case 15:
                    shiftAngle -= 24;
                    playerAndHandDistance += 12;
                    break;
                case 14:
                    shiftAngle -= 28;
                    playerAndHandDistance += 14;
                    break;
                case 13:
                    shiftAngle -= 32;
                    playerAndHandDistance += 16;
                    break;
                case 12:
                    shiftAngle -= 36;
                    playerAndHandDistance += 18;
                    break;
                case 11:
                    shiftAngle -= 40;
                    playerAndHandDistance += 20;
                    break;
                case 10:
                    shiftAngle -= 36;
                    playerAndHandDistance += 18;
                    break;
                case 9:
                    shiftAngle -= 32;
                    playerAndHandDistance += 16;
                    break;
                case 8:
                    shiftAngle -= 28;
                    playerAndHandDistance += 14;
                    break;
                case 7:
                    shiftAngle -= 24;
                    playerAndHandDistance += 12;
                    break;
                case 6:
                    shiftAngle -= 20;
                    playerAndHandDistance += 10;
                    break;
                case 5:
                    shiftAngle -= 16;
                    playerAndHandDistance += 8;
                    break;
                case 4:
                    shiftAngle -= 12;
                    playerAndHandDistance += 6;
                    break;
                case 3:
                    shiftAngle -= 8;
                    playerAndHandDistance += 4;
                    break;
                case 2:
                    shiftAngle -= 4;
                    playerAndHandDistance += 2;
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
                    shiftAngle -= 4;
                    playerAndHandDistance += 2;
                    break;
                case 19:
                    shiftAngle -= 8;
                    playerAndHandDistance += 4;
                    break;
                case 18:
                    shiftAngle -= 12;
                    playerAndHandDistance += 6;
                    break;
                case 17:
                    shiftAngle -= 16;
                    playerAndHandDistance += 8;
                    break;
                case 16:
                    shiftAngle -= 20;
                    playerAndHandDistance += 10;
                    break;
                case 15:
                    shiftAngle -= 24;
                    playerAndHandDistance += 12;
                    break;
                case 14:
                    shiftAngle -= 28;
                    playerAndHandDistance += 14;
                    break;
                case 13:
                    shiftAngle -= 32;
                    playerAndHandDistance += 16;
                    break;
                case 12:
                    shiftAngle -= 36;
                    playerAndHandDistance += 18;
                    break;
                case 11:
                    shiftAngle -= 40;
                    playerAndHandDistance += 20;
                    break;
                case 10:
                    shiftAngle -= 36;
                    playerAndHandDistance += 18;
                    break;
                case 9:
                    shiftAngle -= 32;
                    playerAndHandDistance += 16;
                    break;
                case 8:
                    shiftAngle -= 28;
                    playerAndHandDistance += 14;
                    break;
                case 7:
                    shiftAngle -= 24;
                    playerAndHandDistance += 12;
                    break;
                case 6:
                    shiftAngle -= 20;
                    playerAndHandDistance += 10;
                    break;
                case 5:
                    shiftAngle -= 16;
                    playerAndHandDistance += 8;
                    break;
                case 4:
                    shiftAngle -= 12;
                    playerAndHandDistance += 6;
                    break;
                case 3:
                    shiftAngle -= 8;
                    playerAndHandDistance += 4;
                    break;
                case 2:
                    shiftAngle -= 4;
                    playerAndHandDistance += 2;
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
        this.x = this.player.getX() + this.player.size / 2 + x - this.size / 2;
        this.y = this.player.getY() + this.player.size / 2 - y - this.size / 2;
    }
    hit() {
        this.hitTimer = 20;
        this.inAction = true;
    }
    throw() {
        this.throwTimer = 20;
    }
    collisions() {
        //hit?
        //hit players
        if (this.inAction) {
            for (const player of this.players) {
                if (player.isActive() && player != this.player) {
                    const playerAndHandRadius = player.radius + this.radius;
                    const x = this.getCenterX() - player.getCenterX();
                    const y = this.getCenterY() - player.getCenterY();
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance < playerAndHandRadius) {
                        player.acceptHit(1);
                        if (!player.isActive())
                            player.die();
                        this.inAction = false;
                        break;
                    }
                }
            }
        }
        if (this.inAction) {
            for (let i = 0; i < this.map.bushes.length; i++) {
                const obstacle = this.map.bushes[i];
                if (obstacle.isActive()) {
                    const obstacleAndHandRadius = obstacle.radius + this.radius;
                    const x = this.getCenterX() - obstacle.getCenterX();
                    const y = this.getCenterY() - obstacle.getCenterY();
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance < obstacleAndHandRadius) {
                        obstacle.acceptHit(new Point_1.default(this.getCenterX(), this.getCenterY()));
                        this.inAction = false;
                        break;
                    }
                }
            }
        }
        if (this.inAction) {
            for (let i = 0; i < this.map.rocks.length; i++) {
                const obstacle = this.map.rocks[i];
                if (obstacle.isActive()) {
                    const obstacleAndHandRadius = obstacle.radius + this.radius;
                    const x = this.getCenterX() - obstacle.getCenterX();
                    const y = this.getCenterY() - obstacle.getCenterY();
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance < obstacleAndHandRadius) {
                        obstacle.acceptHit(new Point_1.default(this.getCenterX(), this.getCenterY()));
                        this.inAction = false;
                        break;
                    }
                }
            }
        }
        if (this.inAction) {
            for (let i = 0; i < this.map.trees.length; i++) {
                const obstacle = this.map.trees[i];
                if (obstacle.isActive()) {
                    const obstacleAndHandRadius = obstacle.treeTrankRadius + this.radius;
                    const x = this.getCenterX() - obstacle.getCenterX();
                    const y = this.getCenterY() - obstacle.getCenterY();
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance < obstacleAndHandRadius) {
                        obstacle.acceptHit(new Point_1.default(this.getCenterX(), this.getCenterY()));
                        this.inAction = false;
                        break;
                    }
                }
            }
        }
        //walls
        if (this.inAction) {
            for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
                const obstacle = this.map.rectangleObstacles[i];
                if (obstacle.isActive()) {
                    if (this.x <= obstacle.x + obstacle.width &&
                        this.x + this.size >= obstacle.x &&
                        this.y <= obstacle.y + obstacle.height &&
                        this.y + this.size >= obstacle.y) {
                        for (let j = 0; j < this.collisionPoints.hand.length; j++) {
                            const point = this.collisionPoints.hand[j];
                            if (obstacle.isPointIn(new Point_1.default(this.getCenterX() + point.x, this.getCenterY() + point.y))) {
                                obstacle.acceptHit();
                                this.inAction = false;
                                console.log('hit');
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.default = Hand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTRCO0FBSTVCLE1BQXFCLElBQUk7SUFleEIsWUFBWSxRQUFnQixFQUFFLE9BQWlCLEVBQUUsR0FBUSxFQUFFLGVBQWdDO1FBZGxGLFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbkIsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxXQUFNLEdBQVcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDL0IsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsb0JBQWUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUM3QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBT2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVELFFBQVE7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDakQsQ0FBQztJQUVELFVBQVU7UUFDVCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJO1FBQ0gsT0FBTyxJQUFJLENBQUMsQ0FBQyxD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