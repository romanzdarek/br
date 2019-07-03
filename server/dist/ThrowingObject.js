"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThrowingObject {
    constructor(hand, targetX, targetY, range = 80) {
        this.aboveGround = 1;
        this.angle = 0;
        this.angleShift = 10;
        //shiftZ == speed
        this.shiftZ = 7;
        this.distance = 0;
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
}
exports.default = ThrowingObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyb3dpbmdPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFxQixjQUFjO0lBY2xDLFlBQVksSUFBVSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsUUFBZ0IsRUFBRTtRQVhwRSxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUV4QixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFHaEMsaUJBQWlCO1FBQ1QsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBSTVCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNCLFVBQVU7UUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDVCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxPQUFPLEVBQUU7WUFDakMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDaEM7YUFDSTtZQUNKLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQ2pDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDO1NBQ2hDO2FBQ0k7WUFDSixDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNoQztRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksT0FBTyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDN0I7YUFDSTtZQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEM7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxPQUFPLEVBQUU7WUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM3QjthQUNJO1lBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3RCLElBQUk7WUFDSixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO2FBQ3pCO2lCQUNJO2dCQUNKLE1BQU07Z0JBQ04sSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7YUFDekI7WUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDaEI7SUFDRixDQUFDO0lBRUQsTUFBTTtRQUNMLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO1NBQ2xCO0lBQ0YsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ25CLENBQUM7SUFFRCxjQUFjO1FBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ25DLENBQUM7Q0FDRDtBQWpHRCxpQ0FpR0MifQ==