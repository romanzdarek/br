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
        this.countdown = 100;
    }
    tick() {
        if (this.countdown > 0)
            this.countdown--;
    }
    explode() {
        return this.countdown === 0;
    }
}
exports.default = Granade;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFuYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThDO0FBRzlDLE1BQXFCLE9BQVEsU0FBUSx3QkFBYztJQVFsRCxZQUFZLElBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZTtRQUN2RCxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVJ0QixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUU1QixjQUFTLEdBQVcsR0FBRyxDQUFDO0lBSWhDLENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELE9BQU87UUFDTixPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRDtBQW5CRCwwQkFtQkMifQ==