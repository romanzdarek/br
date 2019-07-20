export default class RectangleObstacle {
    constructor(id, x, y, width, height) {
        this.changed = false;
        this.opacity = 1;
        this.active = true;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
    update(opacity) {
        this.opacity = opacity;
    }
    isPointIn(point) {
        const { x, y } = point;
        if (x < this.x + this.width && x >= this.x && y >= this.y && y < this.y + this.height) {
            return true;
        }
        return false;
    }
    getOpacity() {
        return this.opacity;
    }
    isActive() {
        return this.active;
    }
    acceptHit() {
        if (this.active) {
            if (this.opacity > 0.1)
                this.opacity -= 0.1;
            if (this.opacity < 0.1) {
                this.active = false;
            }
            this.changed = true;
        }
    }
}
//# sourceMappingURL=RectangleObstacle.js.map