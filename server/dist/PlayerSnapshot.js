"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Hand_1 = require("./Hand");
const Weapon_1 = require("./Weapon");
const HandSnapshot_1 = require("./HandSnapshot");
class PlayerSnapshot {
    constructor(player) {
        //hands
        this.h = [];
        //hammer angle
        this.m = 0;
        this.i = player.id;
        this.size = Player_1.Player.size;
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(player.getX() * afterComma) / afterComma;
        this.y = Math.round(player.getY() * afterComma) / afterComma;
        this.a = player.getAngle();
        //this.n = player.name;
        this.w = player.getActiveWeapon();
        if ((player.getActiveWeapon() === Weapon_1.Weapon.Granade || player.getActiveWeapon() === Weapon_1.Weapon.Smoke) &&
            !player.hands[1].throwReady()) {
            //hide nate in hand
            this.w = Weapon_1.Weapon.Hand;
        }
        for (const hand of player.hands) {
            const x = Math.round(hand.getX() * afterComma) / afterComma;
            const y = Math.round(hand.getY() * afterComma) / afterComma;
            this.h.push(new HandSnapshot_1.default(x, y, Hand_1.default.size));
        }
        if (player.getActiveWeapon() === Weapon_1.Weapon.Hammer) {
            this.m = player.hammer.getAngle();
        }
    }
}
exports.default = PlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGxheWVyU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFDbEMsaUNBQTBCO0FBQzFCLHFDQUFrQztBQUNsQyxpREFBMEM7QUFFMUMsTUFBcUIsY0FBYztJQWlCbEMsWUFBWSxNQUFjO1FBVjFCLE9BQU87UUFDUCxNQUFDLEdBQW1CLEVBQUUsQ0FBQztRQUt2QixjQUFjO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUliLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsZ0NBQWdDO1FBQ2hDLGdDQUFnQztRQUNoQyxrQ0FBa0M7UUFDbEMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNsQyxJQUNDLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLGVBQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLGVBQU0sQ0FBQyxLQUFLLENBQUM7WUFDMUYsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUM1QjtZQUNELG1CQUFtQjtZQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7U0FDckI7UUFDRCxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQzVELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztZQUM1RCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUNELElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLGVBQU0sQ0FBQyxNQUFNLEVBQUU7WUFDL0MsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2xDO0lBQ0YsQ0FBQztDQUNEO0FBN0NELGlDQTZDQyJ9