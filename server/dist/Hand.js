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
    move(
    /*
    playerAngle: number,
    direction: number,
    playerSize: number,
    playerX: number,
    playerY: number,
    */
    direction, map, myPlayer, players) {
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
            //hit players
            if (this.inAction) {
                for (const player of players) {
                    if (player.isActive() && player != myPlayer) {
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
        let playerAngleForHand = myPlayer.getAngle() + shiftAngle * direction;
        //0 - 359...
        if (playerAngleForHand < 0)
            playerAngleForHand = 359 + playerAngleForHand;
        if (playerAngleForHand > 359)
            playerAngleForHand = playerAngleForHand - 359;
        //triangle
        const x = Math.sin(playerAngleForHand * Math.PI / 180) * playerRadius;
        const y = Math.cos(playerAngleForHand * Math.PI / 180) * playerRadius;
        //set final position from center
        this.x = myPlayer.getX() + myPlayer.size / 2 + x - this.size / 2;
        this.y = myPlayer.getY() + myPlayer.size / 2 - y - this.size / 2;
    }
    hit() {
        this.hitTimer = 20;
        this.inAction = true;
    }
}
exports.default = Hand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTRCO0FBRzVCLE1BQXFCLElBQUk7SUFXeEIsWUFBWSxVQUFrQjtRQVZyQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ25CLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsV0FBTSxHQUFXLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQ3pCLG9CQUFlLEdBQVksRUFBRSxDQUFDO1FBR3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU8seUJBQXlCO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQyxVQUFVO1lBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztJQUNGLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJO0lBQ0g7Ozs7OztNQU1FO0lBQ0YsU0FBaUIsRUFDakIsR0FBUSxFQUNSLFFBQWdCLEVBQ2hCLE9BQWlCO1FBRWpCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDakMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNyQyxVQUFVO1FBQ1YsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtZQUN0QixRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksQ0FBQyxDQUFDO29CQUNoQixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNsQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksQ0FBQyxDQUFDO29CQUNoQixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNsQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNsQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNsQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssRUFBRTtvQkFDTixVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksRUFBRSxDQUFDO29CQUNuQixNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNqQixZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNsQixN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