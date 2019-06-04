"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gun {
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
exports.default = Gun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0d1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXFCLEdBQUc7SUFRdkIsWUFBWSxVQUFrQixFQUFFLEtBQWE7UUFQakMsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUd0QixNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLFVBQUssR0FBVyxDQUFDLENBQUM7UUFHbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQUMsV0FBbUIsRUFBRSxhQUFxQixFQUFFLGFBQXFCO1FBQ3JFLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBQ3pCLFVBQVU7UUFDVixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbkUsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Q7QUF0Q0Qsc0JBc0NDIn0=