"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZoneCircle_1 = require("./ZoneCircle");
class Zone {
    constructor(map) {
        this.createZoneTime = null;
        this.moveZoneDelay = 1000 * 120;
        this.damage = 0.01;
        this.damageIncrease = 0.01;
        const mapCenterX = map.getSize() / 2;
        const mapCenterY = map.getSize() / 2;
        const outerRadius = Math.sqrt(map.getSize() * map.getSize() + map.getSize() * map.getSize()) / 2;
        this.outerCircle = new ZoneCircle_1.default(mapCenterX, mapCenterY, outerRadius);
        this.innerCircle = this.createInnerCircle(this.outerCircle);
    }
    createInnerCircle(outerCircle) {
        const innerRadius = outerCircle.getRadius() / 2;
        const randomAngle = Math.floor(Math.random() * 360);
        const zMax = outerCircle.getRadius() - innerRadius;
        const randomZ = Math.floor(Math.random() * zMax);
        const x = Math.sin(randomAngle * Math.PI / 180) * randomZ;
        const y = Math.cos(randomAngle * Math.PI / 180) * randomZ;
        return new ZoneCircle_1.default(outerCircle.getCenterX() + x, outerCircle.getCenterY() + y, innerRadius);
    }
    start() {
        this.createZoneTime = Date.now();
    }
    move() {
        if (this.createZoneTime && Date.now() > this.createZoneTime + this.moveZoneDelay) {
            if (this.outerCircle.done()) {
                this.innerCircle = this.createInnerCircle(this.outerCircle);
                this.createZoneTime = Date.now();
                this.outerCircle.resetMove();
                this.damage += this.damageIncrease;
            }
            else {
                this.outerCircle.move(this.innerCircle);
            }
        }
    }
    isPointIn(point) {
        //triangle
        const x = this.outerCircle.getCenterX() - point.x;
        const y = this.outerCircle.getCenterY() - point.y;
        const radius = Math.sqrt(x * x + y * y);
        return radius <= this.outerCircle.getRadius();
    }
    getDamage() {
        return this.damage;
    }
}
exports.default = Zone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ab25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXNDO0FBR3RDLE1BQXFCLElBQUk7SUFReEIsWUFBWSxHQUFRO1FBTFosbUJBQWMsR0FBa0IsSUFBSSxDQUFDO1FBQ3JDLGtCQUFhLEdBQVcsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNuQyxXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLG1CQUFjLEdBQVcsSUFBSSxDQUFDO1FBR3JDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksb0JBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8saUJBQWlCLENBQUMsV0FBdUI7UUFDaEQsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBQ25ELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFELE9BQU8sSUFBSSxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsS0FBSztRQUNKLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDakYsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUM3QixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDbkM7aUJBQ0k7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Q7SUFDRixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQVk7UUFDckIsVUFBVTtRQUNWLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QyxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxTQUFTO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7Q0FDRDtBQXZERCx1QkF1REMifQ==