"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZoneCircle_1 = require("./ZoneCircle");
const Player_1 = require("./Player");
class Zone {
    constructor(map) {
        this.createZoneTime = null;
        this.moveZoneDelay = 1000 * 30;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ab25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXNDO0FBRXRDLHFDQUFrQztBQUVsQyxNQUFxQixJQUFJO0lBUXhCLFlBQVksR0FBUTtRQUxwQixtQkFBYyxHQUFrQixJQUFJLENBQUM7UUFDckMsa0JBQWEsR0FBVyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzFCLFdBQU0sR0FBVyxHQUFHLENBQUM7UUFDckIsbUJBQWMsR0FBVyxJQUFJLENBQUM7UUFHckMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxXQUF1QjtRQUNoRCxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxXQUFXLENBQUM7UUFDbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDMUQsT0FBTyxJQUFJLG9CQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFFRCxLQUFLO1FBQ0osSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNqRixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQzthQUNuQztpQkFDSTtnQkFDSixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDeEM7U0FDRDtJQUNGLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBYztRQUN2QixVQUFVO1FBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QyxPQUFPLE1BQU0sR0FBRyxlQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVELFNBQVM7UUFDUixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEIsQ0FBQztDQUNEO0FBdkRELHVCQXVEQyJ9