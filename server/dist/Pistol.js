"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class Pistol extends Gun_1.default {
    constructor(bullets) {
        const length = 70;
        const range = 20;
        const bulletSpeed = 15;
        const spray = 3;
        const bulletsMax = 10;
        super(length, range, bulletSpeed, spray, bullets, bulletsMax);
    }
}
exports.default = Pistol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlzdG9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1Bpc3RvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUF3QjtBQUV4QixNQUFxQixNQUFPLFNBQVEsYUFBRztJQUN0QyxZQUFZLE9BQWU7UUFDMUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0Q7QUFURCx5QkFTQyJ9