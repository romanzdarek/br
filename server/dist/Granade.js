"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThrowingObject_1 = require("./ThrowingObject");
class Granade extends ThrowingObject_1.default {
    constructor(hand, targetX, targetY) {
        super(hand, targetX, targetY);
        this.fragmentRange = 25;
        this.fragmentSpeed = 5;
        this.fragmentSpray = 10;
        this.fragmentCount = 15;
    }
}
exports.default = Granade;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFuYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThDO0FBRzlDLE1BQXFCLE9BQVEsU0FBUSx3QkFBYztJQU1sRCxZQUFZLElBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZTtRQUN2RCxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQU50QixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztJQUlwQyxDQUFDO0NBQ0Q7QUFURCwwQkFTQyJ9