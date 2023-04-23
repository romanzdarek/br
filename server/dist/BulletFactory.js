"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class BulletFactory {
    createBullet(player, gun, map, players, shiftAngle = 0) {
        return Bullet_1.default.createBullet(BulletFactory.bulletId++, player, gun, map, players, shiftAngle);
    }
    createFragment(Grenade, map, players, shiftAngle) {
        return Bullet_1.default.createFragment(BulletFactory.bulletId++, Grenade.player, Grenade, map, players, shiftAngle);
    }
}
exports.default = BulletFactory;
BulletFactory.bulletId = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWxsZXRGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEscUNBQThCO0FBRTlCLE1BQXFCLGFBQWE7SUFHakMsWUFBWSxDQUFDLE1BQWMsRUFBRSxHQUFRLEVBQUUsR0FBUSxFQUFFLE9BQWlCLEVBQUUsYUFBcUIsQ0FBQztRQUN6RixPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELGNBQWMsQ0FBQyxPQUFnQixFQUFFLEdBQVEsRUFBRSxPQUFpQixFQUFFLFVBQVU7UUFDdkUsT0FBTyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMzRyxDQUFDOztBQVRGLGdDQVVDO0FBVGUsc0JBQVEsR0FBVyxDQUFDLENBQUMifQ==