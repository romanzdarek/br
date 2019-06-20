"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class Pistol extends Gun_1.default {
    constructor(playerRadius) {
        const length = 70;
        const range = 20;
        const bulletSpeed = 15;
        const spray = 3;
        super(playerRadius, length, range, bulletSpeed, spray);
    }
}
exports.default = Pistol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlzdG9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1Bpc3RvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUF3QjtBQUV4QixNQUFxQixNQUFPLFNBQVEsYUFBRztJQUN0QyxZQUFZLFlBQW9CO1FBQy9CLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBUkQseUJBUUMifQ==