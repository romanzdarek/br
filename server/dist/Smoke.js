"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThrowingObject_1 = require("./ThrowingObject");
class Smoke extends ThrowingObject_1.default {
    constructor(player, hand, targetX, targetY, touchDelay) {
        super(player, hand, targetX, targetY, touchDelay);
        this.cloudCount = 6;
    }
}
exports.default = Smoke;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU21va2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU21va2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBOEM7QUFJOUMsTUFBcUIsS0FBTSxTQUFRLHdCQUFjO0lBR2hELFlBQVksTUFBYyxFQUFFLElBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLFVBQWtCO1FBQzNGLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFIMUMsZUFBVSxHQUFXLENBQUMsQ0FBQztJQUloQyxDQUFDO0NBQ0Q7QUFORCx3QkFNQyJ9