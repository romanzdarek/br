"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LootType_1 = require("./LootType");
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
        if (loot.type === LootType_1.LootType.OrangeAmmo ||
            loot.type === LootType_1.LootType.RedAmmo ||
            loot.type === LootType_1.LootType.BlueAmmo ||
            loot.type === LootType_1.LootType.GreenAmmo ||
            loot.type === LootType_1.LootType.Granade ||
            loot.type === LootType_1.LootType.Smoke) {
            this.quantity = loot.quantity;
        }
    }
}
exports.default = LootSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdFNuYXBzaG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xvb3RTbmFwc2hvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlDQUFzQztBQUV0QyxNQUFxQixZQUFZO0lBVWhDLFlBQVksSUFBYztRQUN6QixnQ0FBZ0M7UUFDaEMsZ0NBQWdDO1FBQ2hDLGtDQUFrQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDM0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDM0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUNDLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxVQUFVO1lBQ2pDLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPO1lBQzlCLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxRQUFRO1lBQy9CLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxTQUFTO1lBQ2hDLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPO1lBQzlCLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxLQUFLLEVBQzNCO1lBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQzlCO0lBQ0YsQ0FBQztDQUNEO0FBaENELCtCQWdDQyJ9