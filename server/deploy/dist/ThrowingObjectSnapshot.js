"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Granade_1 = require("./Granade");
const Smoke_1 = require("./Smoke");
class ThrowingObjectSnapshot {
    constructor(throwingObject) {
        //type
        this.t = '';
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(throwingObject.getX() * afterComma) / afterComma;
        this.y = Math.round(throwingObject.getY() * afterComma) / afterComma;
        this.a = throwingObject.getAngle();
        this.b = throwingObject.getAboveGround();
        if (throwingObject instanceof Granade_1.default) {
            this.t = 'g';
        }
        if (throwingObject instanceof Smoke_1.default) {
            this.t = 's';
        }
    }
}
exports.default = ThrowingObjectSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3RTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UaHJvd2luZ09iamVjdFNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQWdDO0FBQ2hDLG1DQUE0QjtBQUU1QixNQUFxQixzQkFBc0I7SUFTMUMsWUFBWSxjQUE4QjtRQUgxQyxNQUFNO1FBQ0csTUFBQyxHQUFXLEVBQUUsQ0FBQztRQUd2QixnQ0FBZ0M7UUFDaEMsZ0NBQWdDO1FBQ2hDLGtDQUFrQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDckUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDckUsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsSUFBSSxjQUFjLFlBQVksaUJBQU8sRUFBRTtZQUN0QyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUNiO1FBQ0QsSUFBSSxjQUFjLFlBQVksZUFBSyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ2I7SUFDRixDQUFDO0NBQ0Q7QUF6QkQseUNBeUJDIn0=