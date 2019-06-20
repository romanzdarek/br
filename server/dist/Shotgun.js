"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class Shotgun extends Gun_1.default {
    constructor(playerRadius) {
        const length = 70;
        const range = 20;
        const bulletSpeed = 12;
        const spray = 10;
        super(playerRadius, length, range, bulletSpeed, spray);
    }
}
exports.default = Shotgun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hvdGd1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TaG90Z3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBRXhCLE1BQXFCLE9BQVEsU0FBUSxhQUFHO0lBQ3ZDLFlBQVksWUFBb0I7UUFDL0IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBUkQsMEJBUUMifQ==