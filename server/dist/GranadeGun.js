"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class GranadeGun extends Gun_1.default {
    constructor(playerRadius) {
        const length = 70;
        const range = 20;
        const bulletSpeed = 12;
        const spray = 0.7;
        super(playerRadius, length, range, bulletSpeed, spray);
    }
}
exports.default = GranadeGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbmFkZUd1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFuYWRlR3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBRXhCLE1BQXFCLFVBQVcsU0FBUSxhQUFHO0lBQzFDLFlBQVksWUFBb0I7UUFDL0IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBUkQsNkJBUUMifQ==