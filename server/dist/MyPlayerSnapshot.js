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
        if (player.inventory.item4[0] === Weapon_1.Weapon.Granade) {
            this.i4 = Weapon_1.Weapon.Granade;
            let nates = 0;
            for (const granade of player.inventory.item4) {
                if (granade === Weapon_1.Weapon.Granade)
                    nates++;
            }
            this.s4 = nates;
        }
        else if (player.inventory.item4[0] === Weapon_1.Weapon.Smoke) {
            this.i4 = Weapon_1.Weapon.Smoke;
            let nates = 0;
            for (const smoke of player.inventory.item4) {
                if (smoke === Weapon_1.Weapon.Smoke)
                    nates++;
            }
            this.s4 = nates;
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
        //active weapon ammo
        if (player.inventory.activeItem instanceof Gun_1.default) {
            this.a = player.inventory.activeItem.getBullets();
            this.aM = player.inventory.activeItem.bulletsMax;
        }
        this.s = player.inventory.scope;
        this.v = 0;
        if (player.inventory.vest)
            this.v = 1;
        //loading
        this.l = player.inventory.loadingNow - player.inventory.loadingStart;
        this.lE = player.inventory.loadingEnd - player.inventory.loadingStart;
        this.lT = player.inventory.loadingText;
    }
}
exports.default = MyPlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlQbGF5ZXJTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9NeVBsYXllclNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWtDO0FBQ2xDLHFDQUE4QjtBQUM5Qiw2Q0FBc0M7QUFDdEMsdUNBQWdDO0FBQ2hDLG1DQUE0QjtBQUM1QixxQ0FBOEI7QUFDOUIsK0JBQXdCO0FBRXhCLE1BQXFCLGdCQUFnQjtJQWdDcEMsWUFBWSxNQUFjO1FBQ3pCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZ0JBQU07WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUM7YUFDakUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssWUFBWSxvQkFBVTtZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsZUFBTSxDQUFDLFVBQVUsQ0FBQzthQUM5RSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxZQUFZLGlCQUFPO1lBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDO2FBQ3hFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZUFBSztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQzs7WUFDcEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDO1FBRTVCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFlBQVksZ0JBQU07WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUM7YUFDakUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssWUFBWSxvQkFBVTtZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsZUFBTSxDQUFDLFVBQVUsQ0FBQzth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