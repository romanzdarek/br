"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThrowingObject {
    constructor(player, hand, targetX, targetY, range = 80) {
        this.aboveGround = 1;
        this.angle = 0;
        this.angleShift = 10;
        //shiftZ == speed
        this.shiftZ = 7;
        this.distance = 0;
        this.countdown = 100;
        this.player = player;
        this.x = hand.getCenterX();
        this.y = hand.getCenterY();
        //triangle
        let x, y;
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
            this.shiftX = x / this.steps * -1;
        }
        if (hand.getCenterY() <= targetY) {
            this.shiftY = y / this.steps;
        }
        else {
            this.shiftY = y / this.steps * -1;
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
}
exports.default = ThrowingObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyb3dpbmdPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxNQUFxQixjQUFjO0lBZ0JsQyxZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxRQUFnQixFQUFFO1FBYnBGLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBR3hCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUdoQyxpQkFBaUI7UUFDVCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFbEIsY0FBUyxHQUFXLEdBQUcsQ0FBQztRQUdsQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixVQUFVO1FBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQ2pDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDO1NBQ2hDO2FBQ0k7WUFDSixDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLE9BQU8sRUFBRTtZQUNqQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLE9BQU8sQ0FBQztTQUNoQzthQUNJO1lBQ0osQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDaEM7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENB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