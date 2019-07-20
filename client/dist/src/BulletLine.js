import PartBulletLine from './PartBulletLine';
export default class BulletLine {
    constructor(id, startX, startY) {
        this.parts = [];
        this.id = id;
        this.startX = startX;
        this.startY = startY;
    }
    getEndX() {
        return this.endX;
    }
    getEndY() {
        return this.endY;
    }
    setEnd(endX, endY) {
        this.endX = endX;
        this.endY = endY;
        //part line
        let startX = this.startX;
        let startY = this.startY;
        if (this.parts.length) {
            startX = this.parts[this.parts.length - 1].endX;
            startY = this.parts[this.parts.length - 1].endY;
        }
        this.parts.push(new PartBulletLine(startX, startY, endX, endY));
    }
    isActive() {
        if (this.parts.length) {
            return this.parts[this.parts.length - 1].isActive();
        }
        //co kdyz budu mit jen jeden bod bullety a zadnou celou part?
        //toto by nemel server dopustit...
        return true;
    }
}
//# sourceMappingURL=BulletLine.js.map