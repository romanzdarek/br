"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZoneCircle_1 = require("./ZoneCircle");
const Player_1 = require("./Player");
class Zone {
    constructor(map) {
        this.createZoneTime = null;
        this.moveZoneDelay = 1000 * 10;
        this.damage = 0.1;
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
    playertIn(player) {
        //triangle
        const x = this.outerCircle.getCenterX() - player.getCenterX();
        const y = this.outerCircle.getCenterY() - player.getCenterY();
        const radius = Math.sqrt(x * x + y * y);
        return radius + Player_1.Player.radius <= this.outerCircle.getRadius();
    }
    getDamage() {
        return this.damage;
    }
}
exports.default = Zone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ab25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXNDO0FBRXRDLHFDQUFrQztBQUVsQyxNQUFxQixJQUFJO0lBUXhCLFlBQVksR0FBUTtRQUxaLG1CQUFjLEdBQWtCLElBQUksQ0FBQztRQUNyQyxrQkFBYSxHQUFXLElBQUksR0FBRyxFQUFFLENBQUM7UUFDbEMsV0FBTSxHQUFXLEdBQUcsQ0FBQztRQUNyQixtQkFBYyxHQUFXLElBQUksQ0FBQztRQUdyQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG9CQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLGlCQUFpQixDQUFDLFdBQXVCO1FBQ2hELE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDcEQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUNuRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUMxRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUMxRCxPQUFPLElBQUksb0JBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELEtBQUs7UUFDSixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSTtRQUNILElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2pGLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO2FBQ25DO2lCQUNJO2dCQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN4QztTQUNEO0lBQ0YsQ0FBQztJQUVELFNBQVMsQ0FBQyxNQUFjO1FBQ3ZCLFVBQVU7UUFDVixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM5RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sTUFBTSxHQUFHLGVBQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0lBRUQsU0FBUztRQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNwQixDQUFDO0NBQ0Q7QUF2REQsdUJBdURDIn0=