"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class Hand {
    constructor(playerSize) {
        this.size = 40;
        this.x = 0;
        this.y = 0;
        this.radius = this.size / 2;
        this.shiftAngle = 40;
        this.hitTimer = 0;
        this.inAction = false;
        this.collisionPoints = [];
        this.playerRadius = playerSize / 2;
        this.calculateCollisionsPoints();
    }
    calculateCollisionsPoints() {
        for (let i = 0; i < 360; i += 20) {
            //triangle
            const x = Math.sin(i * Math.PI / 180) * this.radius;
            const y = Math.cos(i * Math.PI / 180) * this.radius;
            this.collisionPoints.push(new Point_1.default(x, y));
        }
    }
    ready() {
        return this.hitTimer === 0;
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
    moveHand(playerAngle, direction, playerSize, playerX, playerY, map) {
        let shiftAngle = this.shiftAngle;
        let playerRadius = this.playerRadius;
        //hit move
        if (this.hitTimer > 0) {
            switch (this.hitTimer) {
                case 20:
                    shiftAngle -= 4;
                    playerRadius += 2;
                    break;
                case 19:
                    shiftAngle -= 8;
                    playerRadius += 4;
                    break;
                case 18:
                    shiftAngle -= 12;
                    playerRadius += 6;
                    break;
                case 17:
                    shiftAngle -= 16;
                    playerRadius += 8;
                    break;
                case 16:
                    shiftAngle -= 20;
                    playerRadius += 10;
                    break;
                case 15:
                    shiftAngle -= 24;
                    playerRadius += 12;
                    break;
                case 14:
                    shiftAngle -= 28;
                    playerRadius += 14;
                    break;
                case 13:
                    shiftAngle -= 32;
                    playerRadius += 16;
                    break;
                case 12:
                    shiftAngle -= 36;
                    playerRadius += 18;
                    break;
                case 11:
                    shiftAngle -= 40;
                    playerRadius += 20;
                    break;
                case 10:
                    shiftAngle -= 36;
                    playerRadius += 18;
                    break;
                case 9:
                    shiftAngle -= 32;
                    playerRadius += 16;
                    break;
                case 8:
                    shiftAngle -= 28;
                    playerRadius += 14;
                    break;
                case 7:
                    shiftAngle -= 24;
                    playerRadius += 12;
                    break;
                case 6:
                    shiftAngle -= 20;
                    playerRadius += 10;
                    break;
                case 5:
                    shiftAngle -= 16;
                    playerRadius += 8;
                    break;
                case 4:
                    shiftAngle -= 12;
                    playerRadius += 6;
                    break;
                case 3:
                    shiftAngle -= 8;
                    playerRadius += 4;
                    break;
                case 2:
                    shiftAngle -= 4;
                    playerRadius += 2;
                    break;
                case 1:
                    shiftAngle -= 0;
                    playerRadius += 0;
                    break;
            }
            //hit?
            if (this.inAction) {
                for (let i = 0; i < map.bushes.length; i++) {
                    const obstacle = map.bushes[i];
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
                for (let i = 0; i < map.rocks.length; i++) {
                    const obstacle = map.rocks[i];
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
                for (let i = 0; i < map.trees.length; i++) {
                    const obstacle = map.trees[i];
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
            //walls
            if (this.inAction) {
                for (let i = 0; i < map.rectangleObstacles.length; i++) {
                    const obstacle = map.rectangleObstacles[i];
                    if (obstacle.isActive()) {
                        if (this.x <= obstacle.x + obstacle.width &&
                            this.x + this.size >= obstacle.x &&
                            this.y <= obstacle.y + obstacle.height &&
                            this.y + this.size >= obstacle.y) {
                            for (let j = 0; j < this.collisionPoints.length; j++) {
                                const point = this.collisionPoints[j];
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
            this.hitTimer--;
        }
        let playerAngleForHand = playerAngle + shiftAngle * direction;
        //0 - 359...
        if (playerAngleForHand < 0)
            playerAngleForHand = 359 + playerAngleForHand;
        if (playerAngleForHand > 359)
            playerAngleForHand = playerAngleForHand - 359;
        //triangle
        const x = Math.sin(playerAngleForHand * Math.PI / 180) * playerRadius;
        const y = Math.cos(playerAngleForHand * Math.PI / 180) * playerRadius;
        //set final position from center
        this.x = playerX + playerSize / 2 + x - this.size / 2;
        this.y = playerY + playerSize / 2 - y - this.size / 2;
    }
    hit() {
        this.hitTimer = 20;
        this.inAction = true;
    }
}
exports.default = Hand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTRCO0FBRTVCLE1BQXFCLElBQUk7SUFXeEIsWUFBWSxVQUFrQjtRQVZyQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ25CLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsV0FBTSxHQUFXLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQ3pCLG9CQUFlLEdBQVksRUFBRSxDQUFDO1FBR3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU8seUJBQXlCO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQyxVQUFVO1lBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztJQUNGLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxRQUFRLENBQ1AsV0FBbUIsRUFDbkIsU0FBaUIsRUFDakIsVUFBa0IsRUFDbEIsT0FBZSxFQUNmLE9BQWUsRUFDZixHQUFRO1FBRVIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLFVBQVU7UUFDVixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxDQUFDLENBQUM7b0JBQ2hCLFlBQVksSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxDQUFDLENBQUM7b0JBQ2hCLFlBQVksSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxFQUFFO29CQUNOLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLFVBQVUsSUFBSSxFQUFFLENBQUM7b0JBQ2pCLFlBQVksSUFBSSxDQUFDLENBQUM7b0JB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