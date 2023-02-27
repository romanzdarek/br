"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gun_1 = require("./Gun");
class Rifle extends Gun_1.default {
    constructor(bullets) {
        const length = 100;
        const range = 30;
        const bulletSpeed = 18;
        const spray = 1;
        const bulletsMax = 5;
        super(length, range, bulletSpeed, spray, bullets, bulletsMax);
    }
}
exports.default = Rifle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmlmbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmlmbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBd0I7QUFFeEIsTUFBcUIsS0FBTSxTQUFRLGFBQUc7SUFDckMsWUFBWSxPQUFlO1FBQzFCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNuQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNEO0FBVEQsd0JBU0MifQ==