export default class Gun {
    constructor(playerSize, range) {
        this.size = 70;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.playerRadius = playerSize / 2;
        this.range = range;
    }
    move(playerAngle, playerCenterX, playerCenterY) {
        this.angle = playerAngle;
        //triangle
        const x = Math.sin(this.angle * Math.PI / 180) * this.playerRadius;
        const y = Math.cos(this.angle * Math.PI / 180) * this.playerRadius;
        //set final position from center
        this.x = playerCenterX + x - this.size / 2;
        this.y = playerCenterY - y - this.size / 2;
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
    ready() {
        return true;
    }
}
//# sourceMappingURL=Gun.js.map