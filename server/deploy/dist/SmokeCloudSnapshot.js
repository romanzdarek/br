"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SmokeCloudSnapshot {
    constructor(smokeCloud) {
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(smokeCloud.getX() * afterComma) / afterComma;
        this.y = Math.round(smokeCloud.getY() * afterComma) / afterComma;
        this.s = smokeCloud.getSize();
        this.o = smokeCloud.getOpacity();
    }
}
exports.default = SmokeCloudSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU21va2VDbG91ZFNuYXBzaG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1Ntb2tlQ2xvdWRTbmFwc2hvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQXFCLGtCQUFrQjtJQVF0QyxZQUFZLFVBQXNCO1FBQ2pDLGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMsa0NBQWtDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUMzRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNqRSxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0NBQ0Q7QUFsQkQscUNBa0JDIn0=