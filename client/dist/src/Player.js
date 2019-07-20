import Hand from './Hand';
export default class Player {
    constructor(id, x, y, angle, hammerAngle, size, hands, weapon) {
        this.hands = [];
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.hammerAngle = hammerAngle;
        this.weapon = weapon;
        this.size = size;
        this.radius = size / 2;
        for (const hand of hands) {
            this.hands.push(new Hand(hand.x, hand.y, hand.size));
        }
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setAngle(angle) {
        this.angle = angle;
    }
    setHammerAngle(hammerAngle) {
        this.hammerAngle = hammerAngle;
    }
    setWeapon(weapon) {
        this.weapon = weapon;
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
    getHammerAngle() {
        return this.hammerAngle;
    }
    getWeapon() {
        return this.weapon;
    }
    getCenterX() {
        return this.x + this.radius;
    }
    getCenterY() {
        return this.y + this.radius;
    }
}
//# sourceMappingURL=Player.js.map