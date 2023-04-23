"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Hand_1 = require("./Hand");
const Weapon_1 = require("./weapon/Weapon");
const Pistol_1 = require("./weapon/Pistol");
const Machinegun_1 = require("./weapon/Machinegun");
const Shotgun_1 = require("./weapon/Shotgun");
const Rifle_1 = require("./weapon/Rifle");
const Hammer_1 = require("./weapon/Hammer");
class PlayerSnapshot {
    constructor(player) {
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
        this.l = 1;
        if (!player.isActive())
            this.l = 0;
        if (player.inventory.activeItem === Weapon_1.Weapon.Hand)
            this.w = Weapon_1.Weapon.Hand;
        if (player.inventory.activeItem instanceof Pistol_1.default)
            this.w = Weapon_1.Weapon.Pistol;
        if (player.inventory.activeItem instanceof Machinegun_1.default)
            this.w = Weapon_1.Weapon.Machinegun;
        if (player.inventory.activeItem instanceof Shotgun_1.default)
            this.w = Weapon_1.Weapon.Shotgun;
        if (player.inventory.activeItem instanceof Rifle_1.default)
            this.w = Weapon_1.Weapon.Rifle;
        if (player.inventory.activeItem === Weapon_1.Weapon.Grenade)
            this.w = Weapon_1.Weapon.Grenade;
        if (player.inventory.activeItem === Weapon_1.Weapon.Smoke)
            this.w = Weapon_1.Weapon.Smoke;
        if (player.inventory.activeItem === Weapon_1.Weapon.Medkit)
            this.w = Weapon_1.Weapon.Medkit;
        if (player.inventory.activeItem instanceof Hammer_1.default) {
            this.w = Weapon_1.Weapon.Hammer;
            this.m = player.inventory.activeItem.getAngle();
        }
        if ((this.w === Weapon_1.Weapon.Grenade || this.w === Weapon_1.Weapon.Smoke) && !player.hands[1].throwReady()) {
            //hide nate in hand
            this.w = Weapon_1.Weapon.Hand;
        }
        this.hSize = Hand_1.default.size;
        this.lX = Math.round(player.hands[0].getX() * afterComma) / afterComma;
        this.lY = Math.round(player.hands[0].getY() * afterComma) / afterComma;
        this.rX = Math.round(player.hands[1].getX() * afterComma) / afterComma;
        this.rY = Math.round(player.hands[1].getY() * afterComma) / afterComma;
        if (player.getDamageTaken() >= 5) {
            this.d = player.getDamageTaken();
            player.nullDamageTaken();
        }
        if (player.inventory.vest)
            this.v = 1;
        else
            this.v = 0;
    }
}
exports.default = PlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGxheWVyU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFDbEMsaUNBQTBCO0FBQzFCLDRDQUF5QztBQUN6Qyw0Q0FBcUM7QUFDckMsb0RBQTZDO0FBQzdDLDhDQUF1QztBQUN2QywwQ0FBbUM7QUFDbkMsNENBQXFDO0FBRXJDLE1BQXFCLGNBQWM7SUE4QmxDLFlBQVksTUFBYztRQW5CMUIsY0FBYztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFtQmIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixnQ0FBZ0M7UUFDaEMsZ0NBQWdDO1FBQ2hDLGtDQUFrQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDN0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDN0QsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5DLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLElBQUk7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxJQUFJ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