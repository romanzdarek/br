"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Hand_1 = require("./Hand");
const Weapon_1 = require("./Weapon");
const Pistol_1 = require("./Pistol");
const Machinegun_1 = require("./Machinegun");
const Shotgun_1 = require("./Shotgun");
const Rifle_1 = require("./Rifle");
const Hammer_1 = require("./Hammer");
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
        if (player.inventory.activeItem === Weapon_1.Weapon.Granade)
            this.w = Weapon_1.Weapon.Granade;
        if (player.inventory.activeItem === Weapon_1.Weapon.Smoke)
            this.w = Weapon_1.Weapon.Smoke;
        if (player.inventory.activeItem === Weapon_1.Weapon.Medkit)
            this.w = Weapon_1.Weapon.Medkit;
        if (player.inventory.activeItem instanceof Hammer_1.default) {
            this.w = Weapon_1.Weapon.Hammer;
            this.m = player.inventory.activeItem.getAngle();
        }
        if ((this.w === Weapon_1.Weapon.Granade || this.w === Weapon_1.Weapon.Smoke) && !player.hands[1].throwReady()) {
            //hide nate in hand
            this.w = Weapon_1.Weapon.Hand;
        }
        this.hSize = Hand_1.default.size;
        this.lX = Math.round(player.hands[0].getX() * afterComma) / afterComma;
        this.lY = Math.round(player.hands[0].getY() * afterComma) / afterComma;
        this.rX = Math.round(player.hands[1].getX() * afterComma) / afterComma;
        this.rY = Math.round(player.hands[1].getY() * afterComma) / afterComma;
    }
}
exports.default = PlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGxheWVyU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFDbEMsaUNBQTBCO0FBQzFCLHFDQUFrQztBQUNsQyxxQ0FBOEI7QUFDOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFHNUIscUNBQThCO0FBRTlCLE1BQXFCLGNBQWM7SUEwQmxDLFlBQVksTUFBYztRQWYxQixjQUFjO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQWViLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsZ0NBQWdDO1FBQ2hDLGdDQUFnQztRQUNoQyxrQ0FBa0M7UUFDbEMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxlQUFNLENBQUMsSUFBSSxD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