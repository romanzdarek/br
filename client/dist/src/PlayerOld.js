import Gun from './Gun';
export class PlayerOld {
    constructor(map) {
        this.size = 80;
        this.radius = this.size / 2;
        this.speed = 6;
        this.angle = 0;
        this.hands = [];
        this.collisionPoints = [];
        this.slowAroundObstacle = false;
        this.loadingTime = 0;
        this.loadingMaxTime = 3 * 60;
        this.x = 550;
        this.y = 700;
        this.canvas = document.getElementById('gameScreen');
        this.hands.push();
        this.hands.push();
        this.gun = new Gun(this.size, 20);
        this.map = map;
    }
    loading() {
        if (this.loadingTime < this.loadingMaxTime)
            this.loadingTime++;
        return { time: this.loadingTime, max: this.loadingMaxTime };
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
    getAngle() {
        return this.angle;
    }
    setAngle(angle) {
        this.angle = angle;
    }
}
//# sourceMappingURL=PlayerOld.js.map