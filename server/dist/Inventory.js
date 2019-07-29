"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weapon_1 = require("./Weapon");
const Hammer_1 = require("./Hammer");
const LootType_1 = require("./LootType");
const Pistol_1 = require("./Pistol");
const Machinegun_1 = require("./Machinegun");
const Shotgun_1 = require("./Shotgun");
const Rifle_1 = require("./Rifle");
class Inventory {
    constructor(player, loot, hammer) {
        this.item1 = null;
        this.item2 = null;
        this.item3 = Weapon_1.Weapon.Hand;
        this.item33 = null;
        this.item4 = [];
        this.item4Max = 3;
        this.item5 = 0;
        this.item5Max = 3;
        this.activeItem = this.item3;
        this.redAmmo = 0;
        this.blueAmmo = 0;
        this.greenAmmo = 0;
        this.orangeAmmo = 0;
        this.vest = false;
        this.scope = 0;
        this.maxAmmo = 100;
        this.player = player;
        this.loot = loot;
        this.hammer = hammer;
    }
    reload(gun) {
        if (gun instanceof Pistol_1.default) {
            let bullets = 0;
            if (this.orangeAmmo > gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax;
            }
            else {
                bullets = this.orangeAmmo;
            }
            if (bullets > 0) {
                gun.reload(bullets);
                this.orangeAmmo -= bullets;
            }
        }
        else if (gun instanceof Machinegun_1.default) {
            let bullets = 0;
            if (this.blueAmmo > gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax;
            }
            else {
                bullets = this.blueAmmo;
            }
            if (bullets > 0) {
                gun.reload(bullets);
                this.blueAmmo -= bullets;
            }
        }
        else if (gun instanceof Shotgun_1.default) {
            let bullets = 0;
            if (this.redAmmo > gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax;
            }
            else {
                bullets = this.redAmmo;
            }
            if (bullets > 0) {
                gun.reload(bullets);
                this.redAmmo -= bullets;
            }
        }
        else if (gun instanceof Rifle_1.default) {
            let bullets = 0;
            if (this.greenAmmo > gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax;
            }
            else {
                bullets = this.greenAmmo;
            }
            if (bullets > 0) {
                gun.reload(bullets);
                this.greenAmmo -= bullets;
            }
        }
    }
    sortNades(type) {
        if (type === Weapon_1.Weapon.Granade)
            this.item4.sort(function (a, b) {
                return a - b;
            });
        if (type === Weapon_1.Weapon.Smoke)
            this.item4.sort(function (a, b) {
                return b - a;
            });
    }
    throwNade() {
        this.item4.splice(0, 1);
        if (this.item4.length) {
            this.activeItem = this.item4[0];
        }
        else {
            if (this.item3 !== Weapon_1.Weapon.Hand) {
                this.activeItem = this.item3;
            }
            this.changeActiveItem(3);
        }
    }
    changeActiveItem(item) {
        switch (item) {
            case 1:
                if (this.item1)
                    this.activeItem = this.item1;
                break;
            case 2:
                if (this.item2)
                    this.activeItem = this.item2;
                break;
            case 3:
                if (this.activeItem instanceof Hammer_1.default || this.activeItem === Weapon_1.Weapon.Hand) {
                    if (this.item3 && this.item33) {
                        //swap
                        const item3 = this.item3;
                        this.item3 = this.item33;
                        this.item33 = item3;
                    }
                }
                this.activeItem = this.item3;
                break;
            case 4:
                if (this.item4.length) {
                    if (this.activeItem === Weapon_1.Weapon.Smoke || this.activeItem === Weapon_1.Weapon.Granade) {
                        this.sortNades(this.item4[this.item4.length - 1]);
                    }
                    this.activeItem = this.item4[0];
                }
                break;
            case 5:
                //this.activeItem = this.item5;
                break;
        }
    }
    take(loot) {
        //take guns
        if (loot.type === LootType_1.LootType.Pistol ||
            loot.type === LootType_1.LootType.Machinegun ||
            loot.type === LootType_1.LootType.Shotgun ||
            loot.type === LootType_1.LootType.Rifle) {
            let gun;
            switch (loot.type) {
                case LootType_1.LootType.Pistol:
                    gun = new Pistol_1.default(loot.bullets);
                    break;
                case LootType_1.LootType.Machinegun:
                    gun = new Machinegun_1.default(loot.bullets);
                    break;
                case LootType_1.LootType.Shotgun:
                    gun = new Shotgun_1.default(loot.bullets);
                    break;
                case LootType_1.LootType.Rifle:
                    gun = new Rifle_1.default(loot.bullets);
                    break;
            }
            if (gun) {
                let itemPosition = 0;
                //gun inventory is full
                if (this.item1 !== null && this.item2 !== null) {
                    if (this.item1 === this.activeItem) {
                        itemPosition = 1;
                    }
                    else if (this.item2 === this.activeItem) {
                        itemPosition = 2;
                    }
                    else {
                        itemPosition = 1;
                    }
                    //remove gun
                    let lootType;
                    let bulletsInGun = 0;
                    if (itemPosition === 1) {
                        bulletsInGun = this.item1.getBullets();
                        if (this.item1 instanceof Pistol_1.default)
                            lootType = LootType_1.LootType.Pistol;
                        if (this.item1 instanceof Machinegun_1.default)
                            lootType = LootType_1.LootType.Machinegun;
                        if (this.item1 instanceof Shotgun_1.default)
                            lootType = LootType_1.LootType.Shotgun;
                        if (this.item1 instanceof Rifle_1.default)
                            lootType = LootType_1.LootType.Rifle;
                    }
                    if (itemPosition === 2) {
                        bulletsInGun = this.item2.getBullets();
                        if (this.item2 instanceof Pistol_1.default)
                            lootType = LootType_1.LootType.Pistol;
                        if (this.item2 instanceof Machinegun_1.default)
                            lootType = LootType_1.LootType.Machinegun;
                        if (this.item2 instanceof Shotgun_1.default)
                            lootType = LootType_1.LootType.Shotgun;
                        if (this.item2 instanceof Rifle_1.default)
                            lootType = LootType_1.LootType.Rifle;
                    }
                    this.loot.createLootItem(this.player.getX(), this.player.getY(), lootType, bulletsInGun);
                }
                if (this.item2 === null) {
                    itemPosition = 2;
                }
                if (this.item1 === null) {
                    itemPosition = 1;
                }
                if (itemPosition === 1)
                    this.item1 = gun;
                if (itemPosition === 2)
                    this.item2 = gun;
                this.activeItem = gun;
            }
        }
        //take hammer
        if (loot.type === LootType_1.LootType.Hammer) {
            //throw hammer
            if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default) {
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Hammer);
            }
            this.item3 = this.hammer;
            this.item33 = Weapon_1.Weapon.Hand;
            this.activeItem = this.item3;
        }
        //take granades & smokes
        if (this.item4.length < this.item4Max) {
            if (loot.type === LootType_1.LootType.Granade) {
                this.item4.push(Weapon_1.Weapon.Granade);
                this.sortNades(Weapon_1.Weapon.Granade);
                this.activeItem = this.item4[0];
            }
            if (loot.type === LootType_1.LootType.Smoke) {
                this.item4.push(Weapon_1.Weapon.Smoke);
                this.sortNades(Weapon_1.Weapon.Smoke);
                this.activeItem = this.item4[0];
            }
        }
        else {
            this.loot.createLootItem(this.player.getX(), this.player.getY(), loot.type);
        }
        //take ammo
        if (loot.type === LootType_1.LootType.GreenAmmo) {
            this.greenAmmo += loot.bullets;
            if (this.greenAmmo > this.maxAmmo) {
                const newLootBullets = this.greenAmmo - this.maxAmmo;
                this.greenAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.GreenAmmo, newLootBullets);
            }
        }
        if (loot.type === LootType_1.LootType.RedAmmo) {
            this.redAmmo += loot.bullets;
            if (this.redAmmo > this.maxAmmo) {
                const newLootBullets = this.redAmmo - this.maxAmmo;
                this.redAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.RedAmmo, newLootBullets);
            }
        }
        if (loot.type === LootType_1.LootType.BlueAmmo) {
            this.blueAmmo += loot.bullets;
            if (this.blueAmmo > this.maxAmmo) {
                const newLootBullets = this.blueAmmo - this.maxAmmo;
                this.blueAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.BlueAmmo, newLootBullets);
            }
        }
        if (loot.type === LootType_1.LootType.OrangeAmmo) {
            this.orangeAmmo += loot.bullets;
            if (this.orangeAmmo > this.maxAmmo) {
                const newLootBullets = this.orangeAmmo - this.maxAmmo;
                this.orangeAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.OrangeAmmo, newLootBullets);
            }
        }
        //take vest
        if (loot.type === LootType_1.LootType.Vest) {
            if (this.vest) {
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Vest);
            }
            else {
                this.vest = true;
            }
        }
        //take medkit
        if (loot.type === LootType_1.LootType.Medkit) {
            if (this.item5 < this.item5Max) {
                this.item5++;
            }
            else {
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Medkit);
            }
        }
        //take scope
        if (loot.type === LootType_1.LootType.Scope2 || loot.type === LootType_1.LootType.Scope4 || loot.type === LootType_1.LootType.Scope6) {
            if (this.scope !== 0) {
                //throw loot
                let scopeType;
                switch (this.scope) {
                    case 2:
                        scopeType = LootType_1.LootType.Scope2;
                        break;
                    case 4:
                        scopeType = LootType_1.LootType.Scope4;
                        break;
                    case 6:
                        scopeType = LootType_1.LootType.Scope6;
                        break;
                }
                this.loot.createLootItem(this.player.getX(), this.player.getY(), scopeType);
            }
            switch (loot.type) {
                case LootType_1.LootType.Scope2:
                    this.scope = 2;
                    break;
                case LootType_1.LootType.Scope4:
                    this.scope = 4;
                    break;
                case LootType_1.LootType.Scope6:
                    this.scope = 6;
                    break;
            }
        }
    }
}
exports.default = Inventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrQztBQUVsQyxxQ0FBOEI7QUFJOUIseUNBQXNDO0FBQ3RDLHFDQUE4QjtBQUU5Qiw2Q0FBc0M7QUFDdEMsdUNBQWdDO0FBQ2hDLG1DQUE0QjtBQUc1QixNQUFxQixTQUFTO0lBeUI3QixZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsTUFBYztRQXJCOUMsVUFBSyxHQUFlLElBQUksQ0FBQztRQUN6QixVQUFLLEdBQWUsSUFBSSxDQUFDO1FBQ3pCLFVBQUssR0FBUSxlQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3pCLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFDbkIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUU3QixlQUFVLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU3QixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFDdEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUVWLFlBQU8sR0FBVyxHQUFHLENBQUM7UUFHN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFRO1FBQ2QsSUFBSSxHQUFHLFlBQVksZ0JBQU0sRUFBRTtZQUMxQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsSUFB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