import Point from './Point';
export default class Bullet {
    constructor(x, y, angle, range) {
        this.size = 5;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.distance = 0;
        this.active = true;
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.angle = angle;
        this.range = range;
        //triangle
        const bulletSpeed = 30;
        this.shiftX = Math.sin(angle * Math.PI / 180) * bulletSpeed;
        this.shiftY = Math.cos(angle * Math.PI / 180) * bulletSpeed;
        //start shift
        const bulletStartShift = 1.5;
        this.x += this.shiftX * bulletStartShift;
        this.y -= this.shiftY * bulletStartShift;
    }
    move(map) {
        if (!this.collisions(map)) {
            this.x += this.shiftX;
            this.y -= this.shiftY;
        }
    }
    collisions(map) {
        const bulletPoint = new Point(this.getCenterX(), this.getCenterY());
        //rounds
        for (const obstacle of map.impassableRoundObstacles) {
            if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                obstacle.acceptHit(bulletPoint);
                this.active = false;
                return true;
            }
        }
        //rects
        if (this.active) {
            for (const obstacle of map.rectangleObstacles) {
                if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit();
                    this.active = false;
                    return true;
                }
            }
        }
        return false;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getCenterX() {
        return this.x + this.size / 2;
    }
    getCenterY() {
        return this.y + this.size / 2;
    }
    getAngle() {
        return this.angle;
    }
    flying() {
        let state = true;
        this.distance++;
        if (this.distance > this.range)
            state = false;
        if (!this.active)
            state = false;
        return state;
    }
}
//# sourceMappingURL=Bullet.js.map