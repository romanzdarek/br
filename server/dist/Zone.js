"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZoneCircle_1 = require("./ZoneCircle");
class Zone {
    constructor(map) {
        this.moveZoneDelay = 1000 * 10;
        const mapCenterX = map.width / 2;
        const mapCenterY = map.height / 2;
        const outerRadius = Math.sqrt(map.width * map.width + map.width * map.width) / 2;
        this.outerCircle = new ZoneCircle_1.default(mapCenterX, mapCenterY, outerRadius);
        this.innerCircle = this.createInnerCircle(this.outerCircle);
        this.createZoneTime = Date.now();
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
    move() {
        if (Date.now() > this.createZoneTime + this.moveZoneDelay) {
            if (this.outerCircle.done()) {
                this.innerCircle = this.createInnerCircle(this.outerCircle);
                this.createZoneTime = Date.now();
                this.outerCircle.resetMove();
            }
            else {
                this.outerCircle.move(this.innerCircle);
            }
        }
    }
}
exports.default = Zone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ab25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXNDO0FBRXRDLE1BQXFCLElBQUk7SUFNeEIsWUFBWSxHQUFRO1FBRlosa0JBQWEsR0FBVyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBR3pDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksb0JBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU8saUJBQWlCLENBQUMsV0FBdUI7UUFDaEQsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBQ25ELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFELE9BQU8sSUFBSSxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsSUFBSTtRQUNILElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUMxRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDN0I7aUJBQ0k7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUFyQ0QsdUJBcUNDIn0=