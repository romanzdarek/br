"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RectangleObstacle {
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
    /*
    getChangedData(): any {
        return { id: this.id, opacity: this.opacity };
    }
    */
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
exports.default = RectangleObstacle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjdGFuZ2xlT2JzdGFjbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVjdGFuZ2xlT2JzdGFjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUE4QixpQkFBaUI7SUFVOUMsWUFBWSxFQUFVLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQVJqRSxZQUFPLEdBQVksS0FBSyxDQUFDO1FBR3pCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFHdEIsV0FBTSxHQUFZLElBQUksQ0FBQztRQUc5QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQsV0FBVztRQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7OztNQUlFO0lBRUYsU0FBUyxDQUFDLEtBQVk7UUFDckIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEYsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVELFVBQVU7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEIsQ0FBQztJQUVELFNBQVM7UUFDUixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUM7WUFDNUMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDcEI7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNwQjtJQUNGLENBQUM7Q0FDRDtBQXpERCxvQ0F5REMifQ==