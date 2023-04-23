"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObstacleType_1 = require("./obstacle/ObstacleType");
class ThrowingObject {
    constructor(player, hand, targetX, targetY, touchDelay, range = 110) {
        this.aboveGround = 1;
        this.angle = 0;
        this.angleShift = 10;
        //shiftZ == speed
        this.shiftZ = 9;
        this.distance = 0;
        this.countdown = 120;
        this.player = player;
        this.x = hand.getCenterX();
        this.y = hand.getCenterY();
        //triangle
        let x, y;
        // mobile controll
        if (touchDelay) {
            //console.log('touchDelay', touchDelay);
            targetX = hand.getCenterX() + Math.sin((player.getAngle() * Math.PI) / 180) * touchDelay;
            targetY = hand.getCenterY() - Math.cos((player.getAngle() * Math.PI) / 180) * touchDelay;
            console.log(targetX, targetY);
        }
        if (hand.getCenterX() >= targetX) {
            x = hand.getCenterX() - targetX;
        }
        else {
            x = targetX - hand.getCenterX();
        }
        if (hand.getCenterY() >= targetY) {
            y = hand.getCenterY() - targetY;
        }
        else {
            y = targetY - hand.getCenterY();
        }
        const z = Math.sqrt(x * x + y * y);
        this.steps = Math.round(z / this.shiftZ);
        if (hand.getCenterX() <= targetX) {
            this.shiftX = x / this.steps;
        }
        else {
            this.shiftX = (x / this.steps) * -1;
        }
        if (hand.getCenterY() <= targetY) {
            this.shiftY = y / this.steps;
        }
        else {
            this.shiftY = (y / this.steps) * -1;
        }
        if (this.steps > range)
            this.steps = range;
    }
    move() {
        if (this.distance < this.steps) {
            this.x += this.shiftX;
            this.y += this.shiftY;
            //up
            if (this.distance < this.steps / 2) {
                this.aboveGround += 0.05;
            }
            else {
                //down
                this.aboveGround -= 0.05;
            }
            this.rotate();
            this.distance++;
        }
    }
    rotate() {
        this.angle += this.angleShift;
        if (this.angle >= 360) {
            this.angle -= 360;
        }
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getAngle() {
        return this.angle;
    }
    getAboveGround() {
        return this.aboveGround;
    }
    ready() {
        return true;
    }
    flying() {
        return this.distance < this.steps;
    }
    tick() {
        if (this.countdown > 0)
            this.countdown--;
    }
    explode() {
        return this.countdown === 0;
    }
    moveFromObstacle(map) {
        if (this.aboveGround > 1.05)
            return;
        const minGap = 5;
        for (const obstacle of map.roundObstacles) {
            if (obstacle.type === ObstacleType_1.ObstacleType.Bush)
                continue;
            let minDistance = obstacle.radius + minGap;
            if (obstacle.type === ObstacleType_1.ObstacleType.Tree)
                minDistance = obstacle.treeTrankRadius + minGap;
            const xDistance = Math.abs(obstacle.getCenterX() - this.x);
            const yDistance = Math.abs(obstacle.getCenterY() - this.y);
            const zDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            if (zDistance < minDistance) {
                this.x += this.shiftX * Math.random();
                this.y += this.shiftY * Math.random();
                return;
            }
        }
        for (const rectangle of map.rectangleObstacles) {
            if (rectangle.type === ObstacleType_1.ObstacleType.Camo)
                continue;
            if (this.x >= rectangle.x && this.x <= rectangle.x + rectangle.width && this.y >= rectangle.y && this.y <= rectangle.y + rectangle.height) {
                this.x += this.shiftX * Math.random();
                this.y += this.shiftY * Math.random();
                return;
            }
        }
    }
}
exports.default = ThrowingObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyb3dpbmdPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwREFBdUQ7QUFJdkQsTUFBcUIsY0FBYztJQWdCbEMsWUFBWSxNQUFjLEVBQUUsSUFBVSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsVUFBa0IsRUFBRSxRQUFnQixHQUFHO1FBYnpHLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBR3hCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUdoQyxpQkFBaUI7UUFDVCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFckIsY0FBUyxHQUFXLEdBQUcsQ0FBQztRQUcvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUUzQixVQUFVO1FBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRVQsa0JBQWtCO1FBQ2xCLElBQUksVUFBVSxFQUFFO1lBQ2Ysd0NBQXdDO1lBQ3hDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQ3pGLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1lB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