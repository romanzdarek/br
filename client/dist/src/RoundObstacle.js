import Point from './Point';
export default class RoundObstacle {
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
    update(opacity) {
        this.opacity = opacity;
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
        if (this.opacity > 0.1)
            this.opacity -= 0.1;
        this.createAnimateHit(handCenter);
        if (this.opacity < 0.1) {
            this.active = false;
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
        return new Point(animateX, animateY);
    }
}
//# sourceMappingURL=RoundObstacle.js.map