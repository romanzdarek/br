"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weapon_1 = require("./Weapon");
const Pistol_1 = require("./Pistol");
const Machinegun_1 = require("./Machinegun");
const Shotgun_1 = require("./Shotgun");
const Rifle_1 = require("./Rifle");
const Hammer_1 = require("./Hammer");
const Gun_1 = require("./Gun");
class MyPlayerSnapshot {
    constructor(player) {
        //spectacting
        this.spectate = -1;
        this.spectateName = '';
        this.id = player.id;
        this.h = player.getHealth();
        if (player.inventory.item1 instanceof Pistol_1.default)
            this.i1 = Weapon_1.Weapon.Pistol;
        else if (player.inventory.item1 instanceof Machinegun_1.default)
            this.i1 = Weapon_1.Weapon.Machinegun;
        else if (player.inventory.item1 instanceof Shotgun_1.default)
            this.i1 = Weapon_1.Weapon.Shotgun;
        else if (player.inventory.item1 instanceof Rifle_1.default)
            this.i1 = Weapon_1.Weapon.Rifle;
        else
            this.i1 = Weapon_1.Weapon.Empty;
        if (player.inventory.item2 instanceof Pistol_1.default)
            this.i2 = Weapon_1.Weapon.Pistol;
        else if (player.inventory.item2 instanceof Machinegun_1.default)
            this.i2 = Weapon_1.Weapon.Machinegun;
        else if (player.inventory.item2 instanceof Shotgun_1.default)
            this.i2 = Weapon_1.Weapon.Shotgun;
        else if (player.inventory.item2 instanceof Rifle_1.default)
            this.i2 = Weapon_1.Weapon.Rifle;
        else
            this.i2 = Weapon_1.Weapon.Empty;
        if (player.inventory.item3 instanceof Hammer_1.default)
            this.i3 = Weapon_1.Weapon.Hammer;
        else
            this.i3 = Weapon_1.Weapon.Hand;
        this.s4 = 0;
        this.i4 = Weapon_1.Weapon.Empty;
        if (player.inventory.item4 === Weapon_1.Weapon.Granade) {
            this.i4 = Weapon_1.Weapon.Granade;
            this.s4 = player.inventory.item4GranadeCount;
        }
        else if (player.inventory.item4 === Weapon_1.Weapon.Smoke) {
            this.i4 = Weapon_1.Weapon.Smoke;
            this.s4 = player.inventory.item4SmokeCount;
        }
        if (player.inventory.item5) {
            this.i5 = Weapon_1.Weapon.Medkit;
            this.s5 = player.inventory.item5;
        }
        else {
            this.i5 = Weapon_1.Weapon.Empty;
            this.s5 = 0;
        }
        //ammo
        this.r = player.inventory.redAmmo;
        this.g = player.inventory.greenAmmo;
        this.b = player.inventory.blueAmmo;
        this.o = player.inventory.orangeAmmo;
        //weapon ammo
        if (player.inventory.activeItem instanceof Gun_1.default) {
            this.a = player.inventory.activeItem.getBullets();
            //this.aM = player.inventory.activeItem.bulletsMax;
        }
        this.s = player.inventory.scope;
        this.v = 0;
        if (player.inventory.vest)
            this.v = 1;
        //loading
        this.l = player.inventory.loadingNow - player.inventory.loadingStart;
        this.lE = player.inventory.loadingEnd - player.inventory.loadingStart;
        this.lT = player.inventory.loadingText;
        if (player.getSpectate()) {
            this.spectate = player.spectateThatPlayer.id;
            this.spectateName = player.spectateThatPlayer.name;
        }
        this.ai = player.inventory.getActiveItemNumber();
    }
}
exports.default = MyPlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlQbGF5ZXJTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9NeVBsYXllclNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWtDO0FBQ2xDLHFDQUE4QjtBQUM5Qiw2Q0FBc0M7QUFDdEMsdUNBQWdDO0FBQ2hDLG1DQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsK0JBQXdCO0FBRXhCLE1BQXFCLGdCQUFnQjtJQXFDcEMsWUFBWSxNQUFjO1FBSjFCLGFBQWE7UUFDYixhQUFRLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFHekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZ0JBQU07WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUM7YUFDakUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssWUFBWSxvQkFBVTtZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsZUFBTSxDQUFDLFVBQVUsQ0FBQzthQUM5RSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxZQUFZLGlCQUFPO1lBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDO2FBQ3hFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZUFBSztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQzs7WUFDcEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDO1FBRTVCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZ0JBQU07WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFH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