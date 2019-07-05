"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weapon_1 = require("./Weapon");
class PlayerSnapshot {
    constructor(player) {
        //hands
        this.h = [];
        //hammer angle
        this.m = 0;
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(player.getX() * afterComma) / afterComma;
        this.y = Math.round(player.getY() * afterComma) / afterComma;
        this.a = player.getAngle();
        this.n = player.name;
        this.w = player.getActiveWeapon();
        if ((player.getActiveWeapon() === Weapon_1.Weapon.Granade || player.getActiveWeapon() === Weapon_1.Weapon.Smoke) &&
            !player.hands[1].throwReady()) {
            //hide nate in hand
            this.w = Weapon_1.Weapon.Hand;
        }
        for (const hand of player.hands) {
            this.h.push({
                x: Math.round(hand.getX() * afterComma) / afterComma,
                y: Math.round(hand.getY() * afterComma) / afterComma
            });
        }
        if (player.getActiveWeapon() === Weapon_1.Weapon.Hammer) {
            this.m = player.hammer.getAngle();
        }
    }
}
exports.default = PlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGxheWVyU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxQ0FBa0M7QUFJbEMsTUFBcUIsY0FBYztJQWNsQyxZQUFZLE1BQWM7UUFUMUIsT0FBTztRQUNFLE1BQUMsR0FBa0IsRUFBRSxDQUFDO1FBSy9CLGNBQWM7UUFDTCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBR3RCLGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMsa0NBQWtDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM3RCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM3RCxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDbEMsSUFDQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsS0FBSyxlQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUUsS0FBSyxlQUFNLENBQUMsS0FBSyxDQUFDO1lBQzFGLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDNUI7WUFDRCxtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLENBQUMsR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1NBQ3JCO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNYLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVO2dCQUNwRCxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVTthQUNwRCxDQUFDLENBQUM7U0FDSDtRQUNELElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLGVBQU0sQ0FBQyxNQUFNLEVBQUU7WUFDL0MsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2xDO0lBQ0YsQ0FBQztDQUNEO0FBekNELGlDQXlDQyJ9