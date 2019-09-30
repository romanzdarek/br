"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class BulletFactory {
    constructor() {
        this.bulletId = 0;
    }
    createBullet(player, gun, map, players, shiftAngle = 0) {
        return Bullet_1.default.createBullet(this.bulletId++, player, gun, map, players, shiftAngle);
    }
    createFragment(granade, map, players, shiftAngle) {
        return Bullet_1.default.createFragment(this.bulletId++, granade.player, granade, map, players, shiftAngle);
    }
}
exports.default = BulletFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWxsZXRGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEscUNBQThCO0FBRTlCLE1BQXNCLGFBQWE7SUFBbkM7UUFDUyxhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBUzlCLENBQUM7SUFQQSxZQUFZLENBQUMsTUFBYyxFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsT0FBaUIsRUFBRSxhQUFxQixDQUFDO1FBQ3pGLE9BQU8sZ0JBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQWdCLEVBQUUsR0FBUSxFQUFFLE9BQWlCLEVBQUUsVUFBVTtRQUNwRSxPQUFPLGdCQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7Q0FDRDtBQVZELGdDQVVDIn0=