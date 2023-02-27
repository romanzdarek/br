"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
let bulletId = 0;
class BulletFactory {
    constructor() {
        this.bulletId = 0;
    }
    createBullet(player, gun, map, players, shiftAngle = 0) {
        return Bullet_1.default.createBullet(bulletId++, player, gun, map, players, shiftAngle);
    }
    createFragment(granade, map, players, shiftAngle) {
        return Bullet_1.default.createFragment(bulletId++, granade.player, granade, map, players, shiftAngle);
    }
}
exports.default = BulletFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWxsZXRGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEscUNBQThCO0FBRTlCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQixNQUFxQixhQUFhO0lBQWxDO1FBQ1MsYUFBUSxHQUFXLENBQUMsQ0FBQztJQVM5QixDQUFDO0lBUEEsWUFBWSxDQUFDLE1BQWMsRUFBRSxHQUFRLEVBQUUsR0FBUSxFQUFFLE9BQWlCLEVBQUUsYUFBcUIsQ0FBQztRQUN6RixPQUFPLGdCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQWdCLEVBQUUsR0FBUSxFQUFFLE9BQWlCLEVBQUUsVUFBVTtRQUN2RSxPQUFPLGdCQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0YsQ0FBQztDQUNEO0FBVkQsZ0NBVUMifQ==