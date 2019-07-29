"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LootSnapshot {
    constructor(loot) {
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(loot.getX() * afterComma) / afterComma;
        this.y = Math.round(loot.getY() * afterComma) / afterComma;
        this.i = loot.id;
        this.size = loot.size;
        this.type = loot.type;
        if (!loot.isActive())
            this.del = 1;
    }
}
exports.default = LootSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdFNuYXBzaG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xvb3RTbmFwc2hvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQXFCLFlBQVk7SUFTaEMsWUFBWSxJQUFVO1FBQ3JCLGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMsa0NBQWtDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUMzRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUMzRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDRDtBQXJCRCwrQkFxQkMifQ==