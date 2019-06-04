"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class RoundObstacle {
    constructor(id, x, y, size) {
        this.changed = false;
        this.opacity = 1;
        this.active = true;
        this.hitAnimateTimer = 0;
        this.hitAnimateShiftX = 0;
        this.hitAnimateShiftY = 0;
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = size / 2;
    }
    getChanged() {
        return this.changed;
    }
    nullChanged() {
        this.changed = false;
    }
    getChangedData() {
        return { id: this.id, opacity: this.opacity };
    }
    isPointIn(point) {
        //triangle
        const x = this.x + this.radius - point.x;
        const y = this.y + this.radius - point.y;
        const radius = Math.sqrt(x * x + y * y);
        if (radius <= this.radius)
            return true;
        return false;
    }
    getCenterX() {
        return this.x + this.size / 2;
    }
    getCenterY() {
        return this.y + this.size / 2;
    }
    getOpacity() {
        return this.opacity;
    }
    isActive() {
        return this.active;
    }
    acceptHit(handCenter) {
        if (this.active) {
            if (this.opacity > 0.1)
                this.opacity -= 0.1;
            this.createAnimateHit(handCenter);
            if (this.opacity < 0.1) {
                this.active = false;
            }
            this.changed = true;
        }
    }
    createAnimateHit(handCenter) {
        const x = handCenter.x - this.getCenterX();
        const y = handCenter.y - this.getCenterY();
        let hitAngle = Math.abs(Math.atan(x / y) * (180 / Math.PI));
        //1..2..3..4.. Q; 0 - 90, 90 - 180...
        //1
        if (handCenter.x >= this.getCenterX() && handCenter.y < this.getCenterY()) {
            hitAngle = hitAngle;
        }
        //2
        if (handCenter.x >= this.getCenterX() && handCenter.y >= this.getCenterY()) {
            hitAngle = 180 - hitAngle;
        }
        //3
        if (handCenter.x < this.getCenterX() && handCenter.y >= this.getCenterY()) {
            hitAngle = 180 + hitAngle;
        }
        //4
        if (handCenter.x < this.getCenterX() && handCenter.y < this.getCenterY()) {
            hitAngle = 360 - hitAngle;
        }
        hitAngle = Math.round(hitAngle);
        if (hitAngle === 360)
            hitAngle = 0;
        this.hitAnimateTimer = 10;
        //triangle
        const hitShift = 3;
        this.hitAnimateShiftX = Math.sin(hitAngle * Math.PI / 180) * hitShift * -1;
        this.hitAnimateShiftY = Math.cos(hitAngle * Math.PI / 180) * hitShift;
    }
    animate() {
        let animateX = 0;
        let animateY = 0;
        if (this.hitAnimateTimer > 0)
            this.hitAnimateTimer--;
        switch (this.hitAnimateTimer) {
            case 1:
                animateX = this.hitAnimateShiftX;
                animateY = this.hitAnimateShiftY;
                break;
            case 2:
                animateX = 2 * this.hitAnimateShiftX;
                animateY = 2 * this.hitAnimateShiftY;
                break;
            case 3:
                animateX = 3 * this.hitAnimateShiftX;
                animateY = 3 * this.hitAnimateShiftY;
                break;
            case 4:
                animateX = 4 * this.hitAnimateShiftX;
                animateY = 4 * this.hitAnimateShiftY;
                break;
            case 5:
                animateX = 5 * this.hitAnimateShiftX;
                animateY = 5 * this.hitAnimateShiftY;
                break;
            case 6:
                animateX = 4 * this.hitAnimateShiftX;
                animateY = 4 * this.hitAnimateShiftY;
                break;
            case 7:
                animateX = 3 * this.hitAnimateShiftX;
                animateY = 3 * this.hitAnimateShiftY;
                break;
            case 8:
                animateX = 2 * this.hitAnimateShiftX;
                animateY = 2 * this.hitAnimateShiftY;
                break;
            case 9:
                animateX = 1 * this.hitAnimateShiftX;
                animateY = 1 * this.hitAnimateShiftY;
                break;
            case 10:
                break;
        }
        return new Point_1.default(animateX, animateY);
    }
}
exports.default = RoundObstacle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91bmRPYnN0YWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Sb3VuZE9ic3RhY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTRCO0FBRTVCLE1BQThCLGFBQWE7SUFhMUMsWUFBWSxFQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZO1FBWC9DLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFHMUIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUd0QixXQUFNLEdBQVksSUFBSSxDQUFDO1FBQ3ZCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFHcEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELGNBQWM7UUFDYixPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQVk7UUFDckIsVUFBVTtRQUNWLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLElBQUksQ0FBQztRQUN2QyxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxTQUFTLENBQUMsVUFBaUI7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzthQUNwQjtZQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0lBRUYsQ0FBQztJQUVPLGdCQUFnQixDQUFDLFVBQWlCO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUQscUNBQXFDO1FBQ3JDLEdBQUc7UUFDSCxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzFFLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDcEI7UUFDRCxHQUFHO1FBQ0gsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUMzRSxRQUFRLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQztTQUMxQjtRQUNELEdBQUc7UUFDSCxJQUFJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzFFLFFBQVEsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDO1NBQzFCO1FBQ0QsR0FBRztRQUNILElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDekUsUUFBUSxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7U0FDMUI7UUFDRCxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxJQUFJLFFBQVEsS0FBSyxHQUFHO1lBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJ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