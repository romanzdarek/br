"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThrowingObject_1 = require("./ThrowingObject");
class Granade extends ThrowingObject_1.default {
    constructor(player, hand, targetX, targetY) {
        super(player, hand, targetX, targetY);
        this.fragmentRange = 25;
        this.fragmentSpeed = 5;
        this.fragmentSpray = 10;
        this.fragmentCount = 50;
    }
}
exports.default = Granade;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFuYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThDO0FBSTlDLE1BQXFCLE9BQVEsU0FBUSx3QkFBYztJQU1sRCxZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWU7UUFDdkUsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTjlCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQzNCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQzNCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO0lBSXBDLENBQUM7Q0FDRDtBQVRELDBCQVNDIn0=