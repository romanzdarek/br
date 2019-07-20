export default class PartBulletLine {
    constructor(startX, startY, endX, endY) {
        this.active = true;
        this.age = 0;
        this.maxAge = 10;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    increaseAge() {
        if (this.age++ === this.maxAge) {
            this.active = false;
        }
    }
    isActive() {
        return this.active;
    }
    getAge() {
        return this.age;
    }
}
//# sourceMappingURL=PartBulletLine.js.map