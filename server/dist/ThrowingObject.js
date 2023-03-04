"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThrowingObject {
    constructor(player, hand, targetX, targetY, touchDelay, range = 85) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyb3dpbmdPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxNQUFxQixjQUFjO0lBZ0JsQyxZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxVQUFrQixFQUFFLFFBQWdCLEVBQUU7UUFieEcsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFHeEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBR2hDLGlCQUFpQjtRQUNULFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUVyQixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBRy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRTNCLFVBQVU7UUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFVCxrQkFBa0I7UUFDbEIsSUFBSSxVQUFVLEVBQUU7WUFDZix3Q0FBd0M7WUFDeEMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDekYsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7WUFFekYsT0FBTyxDQUFD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