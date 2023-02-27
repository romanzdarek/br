"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThrowingObject {
    constructor(player, hand, targetX, targetY, range = 85) {
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
        for (const rock of map.rocks) {
            const minDistance = rock.radius + minGap;
            const xDistance = Math.abs(rock.getCenterX() - this.x);
            const yDistance = Math.abs(rock.getCenterY() - this.y);
            const zDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            if (zDistance < minDistance) {
                this.x += this.shiftX * Math.random();
                this.y += this.shiftY * Math.random();
                return;
            }
        }
        for (const tree of map.trees) {
            const minDistance = tree.treeTrankRadius + minGap;
            const xDistance = Math.abs(tree.getCenterX() - this.x);
            const yDistance = Math.abs(tree.getCenterY() - this.y);
            const zDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            if (zDistance < minDistance) {
                this.x += this.shiftX * Math.random();
                this.y += this.shiftY * Math.random();
                return;
            }
        }
        for (const rectangle of map.rectangleObstacles) {
            if (this.x >= rectangle.x && this.x <= rectangle.x + rectangle.width && this.y >= rectangle.y && this.y <= rectangle.y + rectangle.height) {
                this.x += this.shiftX * Math.random();
                this.y += this.shiftY * Math.random();
                return;
            }
        }
    }
}
exports.default = ThrowingObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyb3dpbmdPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxNQUFxQixjQUFjO0lBZ0JsQyxZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxRQUFnQixFQUFFO1FBYnBGLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBR3hCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUdoQyxpQkFBaUI7UUFDVCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFckIsY0FBUyxHQUFXLEdBQUcsQ0FBQztRQUcvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixVQUFVO1FBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQ2pDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDO1NBQ2hDO2FBQU07WUFDTixDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLE9BQU8sRUFBRTtZQUNqQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLE9BQU8sQ0FBQztTQUNoQzthQUFNO1lBQ04sQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDaEM7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENB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QyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3pDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUMzRSxJQUFJLFNBQVMsR0FBRyxXQUFXLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RDLE9BQU87YUFDUDtTQUNEO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQzdCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO1lBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUMzRSxJQUFJLFNBQVMsR0FBRyxXQUFXLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RDLE9BQU87YUFDUDtTQUNEO1FBRUQsS0FBSyxNQUFNLFNBQVMsSUFBSSxHQUFHLENBQUMsa0JBQWtCLEVBQUU7WUFDL0MsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUMxSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QyxPQUFPO2FBQ1A7U0FDRDtJQUNGLENBQUM7Q0FDRDtBQTdJRCxpQ0E2SUMifQ==