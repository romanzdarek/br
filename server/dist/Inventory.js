"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weapon_1 = require("./Weapon");
const Gun_1 = require("./Gun");
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
        this.loadingStart = 0;
        this.loadingNow = 0;
        this.loadingEnd = 0;
        this.loadingText = '';
        this.player = player;
        this.loot = loot;
        this.hammer = hammer;
    }
    ready() {
        return this.loadingStart === 0;
    }
    loading() {
        if (this.ready())
            return;
        if (this.loadingNow < this.loadingEnd) {
            this.loadingNow = Date.now();
        }
        else {
            if (this.loadingItem instanceof Gun_1.default) {
                this.finalReload(this.loadingItem);
                this.cancelLoading();
            }
            else if (this.loadingItem === Weapon_1.Weapon.Medkit) {
                this.item5--;
                this.player.healing(50);
                this.cancelLoading();
                if (!this.item5) {
                    if (this.item3 !== Weapon_1.Weapon.Hand) {
                        this.activeItem = this.item3;
                    }
                    this.changeActiveItem(3);
                }
            }
        }
    }
    reload(gun) {
        if (!this.ready())
            return;
        let reload = false;
        if (gun.getBullets() < gun.bulletsMax) {
            if (gun instanceof Pistol_1.default && this.orangeAmmo > 0) {
                reload = true;
            }
            else if (gun instanceof Machinegun_1.default && this.blueAmmo > 0) {
                reload = true;
            }
            else if (gun instanceof Shotgun_1.default && this.redAmmo > 0) {
                reload = true;
            }
            else if (gun instanceof Rifle_1.default && this.greenAmmo > 0) {
                reload = true;
            }
        }
        if (reload) {
            //start reload
            this.loadingText = 'Reloading';
            this.loadingStart = Date.now();
            this.loadingNow = this.loadingStart;
            this.loadingEnd = this.loadingStart + 2.5 * 1000;
            this.loadingItem = gun;
        }
    }
    heal() {
        if (!this.ready())
            return;
        if (this.item5 > 0 && this.player.getHealth() < 100) {
            //start heal
            this.loadingText = ' Healing';
            this.loadingStart = Date.now();
            this.loadingNow = this.loadingStart;
            this.loadingEnd = this.loadingStart + 2.5 * 1000;
            this.loadingItem = Weapon_1.Weapon.Medkit;
        }
    }
    finalReload(gun) {
        if (gun instanceof Pistol_1.default) {
            let bullets = 0;
            if (this.orangeAmmo >= gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax - gun.getBullets();
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
            if (this.blueAmmo >= gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax - gun.getBullets();
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
            if (this.redAmmo >= gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax - gun.getBullets();
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
            if (this.greenAmmo >= gun.bulletsMax - gun.getBullets()) {
                bullets = gun.bulletsMax - gun.getBullets();
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
    cancelLoading() {
        this.loadingStart = 0;
        this.loadingEnd = 0;
        this.loadingNow = 0;
    }
    changeActiveItem(item) {
        if (!this.ready())
            return;
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
                if (this.item5 > 0)
                    this.activeItem = Weapon_1.Weapon.Medkit;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrQztBQUNsQywrQkFBd0I7QUFDeEIscUNBQThCO0FBSTlCLHlDQUFzQztBQUN0QyxxQ0FBOEI7QUFFOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFHNUIsTUFBcUIsU0FBUztJQStCN0IsWUFBWSxNQUFjLEVBQUUsSUFBVSxFQUFFLE1BQWM7UUEzQnRELFVBQUssR0FBZSxJQUFJLENBQUM7UUFDekIsVUFBSyxHQUFlLElBQUksQ0FBQztRQUN6QixVQUFLLEdBQVEsZUFBTSxDQUFDLElBQUksQ0FBQztRQUNqQixXQUFNLEdBQVEsSUFBSSxDQUFDO1FBQzNCLFVBQUssR0FBYSxFQUFFLENBQUM7UUFDYixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDVixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRTdCLGVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTdCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFFdkIsU0FBSSxHQUFZLEtBQUssQ0FBQztRQUN0QixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRVYsWUFBTyxHQUFXLEdBQUcsQ0FBQztRQUU5QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFJeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0s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