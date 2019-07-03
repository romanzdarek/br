"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThrowingObjectSnapshot {
    constructor(throwingObject) {
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(throwingObject.getX() * afterComma) / afterComma;
        this.y = Math.round(throwingObject.getY() * afterComma) / afterComma;
        this.a = throwingObject.getAngle();
        this.b = throwingObject.getAboveGround();
    }
}
exports.default = ThrowingObjectSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyb3dpbmdPYmplY3RTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UaHJvd2luZ09iamVjdFNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBcUIsc0JBQXNCO0lBTzFDLFlBQVksY0FBOEI7UUFDekMsZ0NBQWdDO1FBQ2hDLGdDQUFnQztRQUNoQyxrQ0FBa0M7UUFDbEMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQy9ELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3JFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2hELENBQUM7Q0FDRDtBQWpCRCx5Q0FpQkMifQ==