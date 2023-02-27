"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class Shotgun extends Gun_1.default {
    constructor(bullets) {
        const length = 68;
        const range = 20;
        const bulletSpeed = 14;
        const spray = 0.7;
        const bulletsMax = 2;
        super(length, range, bulletSpeed, spray, bullets, bulletsMax);
    }
}
exports.default = Shotgun;
Shotgun.lastUsedShotgunBarrel = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hvdGd1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TaG90Z3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBRXhCLE1BQXFCLE9BQVEsU0FBUSxhQUFHO0lBR3ZDLFlBQVksT0FBZTtRQUMxQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDbEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7O0FBVkYsMEJBV0M7QUFWTyw2QkFBcUIsR0FBRyxDQUFDLENBQUMifQ==