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
const Point_1 = require("./Point");
class Inventory {
    constructor(player, loot, hammer) {
        this.item1 = null;
        this.item2 = null;
        this.item3 = Weapon_1.Weapon.Hand;
        this.item33 = null;
        this.item4 = null;
        this.item4GranadeCount = 0;
        this.item4SmokeCount = 0;
        this.item4Max = 3;
        this.item5 = 0;
        this.item5Max = 3;
        this.activeItem = this.item3;
        this.redAmmo = 0;
        this.blueAmmo = 0;
        this.greenAmmo = 0;
        this.orangeAmmo = 0;
        this.vest = false;
        this.scope = 1;
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
    /*
    private sortNades(type: Weapon): void {
        if (type === Weapon.Granade)
            this.item4.sort(function(a, b) {
                return a - b;
            });
        if (type === Weapon.Smoke)
            this.item4.sort(function(a, b) {
                return b - a;
            });
    }
    */
    throwNade() {
        if (this.activeItem === Weapon_1.Weapon.Granade)
            this.item4GranadeCount--;
        else if (this.activeItem === Weapon_1.Weapon.Smoke)
            this.item4SmokeCount--;
        if (this.activeItem === Weapon_1.Weapon.Granade && this.item4GranadeCount === 0 && this.item4SmokeCount > 0) {
            this.activeItem = Weapon_1.Weapon.Smoke;
            this.item4 = this.activeItem;
        }
        else if (this.activeItem === Weapon_1.Weapon.Smoke && this.item4SmokeCount === 0 && this.item4GranadeCount > 0) {
            this.activeItem = Weapon_1.Weapon.Granade;
            this.item4 = this.activeItem;
        }
        else if (this.item4SmokeCount === 0 && this.item4GranadeCount === 0) {
            this.item4 = null;
            //hnad
            if (this.item3 !== Weapon_1.Weapon.Hand) {
                this.activeItem = this.item3;
            }
            this.changeActiveItem(3);
        }
        /*
        this.item4.splice(0, 1);
        if (this.item4.length) {
            this.activeItem = this.item4[0];
        }
        else {
            if (this.item3 !== Weapon.Hand) {
                this.activeItem = this.item3;
            }
            this.changeActiveItem(3);
        }
        */
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
                if (this.item4GranadeCount || this.item4SmokeCount) {
                    //change
                    if (this.activeItem === Weapon_1.Weapon.Smoke || this.activeItem === Weapon_1.Weapon.Granade) {
                        if (this.activeItem === Weapon_1.Weapon.Smoke && this.item4GranadeCount)
                            this.activeItem = Weapon_1.Weapon.Granade;
                        else if (this.activeItem === Weapon_1.Weapon.Granade && this.item4SmokeCount)
                            this.activeItem = Weapon_1.Weapon.Smoke;
                        this.item4 = this.activeItem;
                    }
                    this.activeItem = this.item4;
                }
                break;
            case 5:
                if (this.item5 > 0)
                    this.activeItem = Weapon_1.Weapon.Medkit;
                break;
        }
    }
    throwLootPosition(angle, playerCenterX, playerCenterY) {
        const shiftZ = Math.floor(Math.random() * 40);
        //xyz tringle
        let shiftX = Math.sin(angle * Math.PI / 180) * shiftZ;
        let shiftY = Math.cos(angle * Math.PI / 180) * shiftZ;
        return new Point_1.default(playerCenterX + shiftX, playerCenterY + shiftY);
    }
    clear() {
        this.redAmmo = 0;
        this.blueAmmo = 0;
        this.greenAmmo = 0;
        this.orangeAmmo = 0;
        this.vest = false;
        this.scope = 1;
        this.item1 = null;
        this.item2 = null;
        this.item3 = Weapon_1.Weapon.Hand;
        this.item33 = null;
        this.item4 = null;
        this.item4GranadeCount = 0;
        this.item4SmokeCount = 0;
        this.item5 = 0;
        this.activeItem = this.item3;
    }
    throwAllLoot() {
        let lootCount = 0;
        //ammo
        if (this.blueAmmo)
            lootCount++;
        if (this.redAmmo)
            lootCount++;
        if (this.greenAmmo)
            lootCount++;
        if (this.orangeAmmo)
            lootCount++;
        //...
        if (this.vest)
            lootCount++;
        if (this.scope > 1)
            lootCount++;
        //guns
        if (this.item1)
            lootCount++;
        if (this.item2)
            lootCount++;
        //hammer
        if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default)
            lootCount++;
        //nates
        if (this.item4GranadeCount)
            lootCount++;
        if (this.item4SmokeCount)
            lootCount++;
        //medkits
        if (this.item5)
            lootCount++;
        //shift
        const shiftAngle = Math.floor(360 / lootCount);
        let shiftMultiple = 0;
        //create loots
        //ammo
        if (this.blueAmmo) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.BlueAmmo, this.blueAmmo);
        }
        if (this.redAmmo) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.RedAmmo, this.redAmmo);
        }
        if (this.greenAmmo) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.GreenAmmo, this.blueAmmo);
        }
        if (this.orangeAmmo) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.OrangeAmmo, this.orangeAmmo);
        }
        //items
        if (this.vest) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Vest);
        }
        if (this.scope > 1) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            if (this.scope === 2)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope2);
            else if (this.scope === 4)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope4);
            else if (this.scope === 6)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope6);
        }
        //guns
        if (this.item1 instanceof Gun_1.default) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            if (this.item1 instanceof Pistol_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Pistol, this.item1.getBullets());
            else if (this.item1 instanceof Rifle_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Rifle, this.item1.getBullets());
            else if (this.item1 instanceof Shotgun_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Shotgun, this.item1.getBullets());
            else if (this.item1 instanceof Machinegun_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Machinegun, this.item1.getBullets());
        }
        if (this.item2 instanceof Gun_1.default) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            if (this.item2 instanceof Pistol_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Pistol, this.item2.getBullets());
            else if (this.item2 instanceof Rifle_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Rifle, this.item2.getBullets());
            else if (this.item2 instanceof Shotgun_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Shotgun, this.item2.getBullets());
            else if (this.item2 instanceof Machinegun_1.default)
                this.loot.createLootItem(x, y, LootType_1.LootType.Machinegun, this.item2.getBullets());
        }
        //hammer
        if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Hammer);
        }
        //smoke
        if (this.item4SmokeCount) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Smoke, this.item4SmokeCount);
        }
        //granade
        if (this.item4GranadeCount) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Granade, this.item4GranadeCount);
        }
        //medkits
        if (this.item5) {
            const { x, y } = this.throwLootPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Medkit, this.item5);
        }
        this.clear();
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
                    gun = new Pistol_1.default(loot.quantity);
                    break;
                case LootType_1.LootType.Machinegun:
                    gun = new Machinegun_1.default(loot.quantity);
                    break;
                case LootType_1.LootType.Shotgun:
                    gun = new Shotgun_1.default(loot.quantity);
                    break;
                case LootType_1.LootType.Rifle:
                    gun = new Rifle_1.default(loot.quantity);
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
        else if (loot.type === LootType_1.LootType.Hammer) {
            //take hammer
            //throw hammer
            if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default) {
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Hammer);
            }
            this.item3 = this.hammer;
            this.item33 = Weapon_1.Weapon.Hand;
            this.activeItem = this.item3;
        }
        else if (loot.type === LootType_1.LootType.Granade || loot.type === LootType_1.LootType.Smoke) {
            //take granades & smokes
            if (loot.type === LootType_1.LootType.Granade) {
                this.item4GranadeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Granade;
                this.activeItem = this.item4;
            }
            else if (loot.type === LootType_1.LootType.Smoke) {
                this.item4SmokeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Smoke;
                this.activeItem = this.item4;
            }
            //throw
            //granade
            if (this.item4GranadeCount > this.item4Max) {
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Granade, this.item4GranadeCount - this.item4Max);
                this.item4GranadeCount = this.item4Max;
            }
            //smoke
            if (this.item4SmokeCount > this.item4Max) {
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Smoke, this.item4SmokeCount - this.item4Max);
                this.item4SmokeCount = this.item4Max;
            }
        }
        else if (loot.type === LootType_1.LootType.GreenAmmo) {
            //take ammo
            this.greenAmmo += loot.quantity;
            if (this.greenAmmo > this.maxAmmo) {
                const newLootBullets = this.greenAmmo - this.maxAmmo;
                this.greenAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.GreenAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.RedAmmo) {
            this.redAmmo += loot.quantity;
            if (this.redAmmo > this.maxAmmo) {
                const newLootBullets = this.redAmmo - this.maxAmmo;
                this.redAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.RedAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.BlueAmmo) {
            this.blueAmmo += loot.quantity;
            if (this.blueAmmo > this.maxAmmo) {
                const newLootBullets = this.blueAmmo - this.maxAmmo;
                this.blueAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.BlueAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.OrangeAmmo) {
            this.orangeAmmo += loot.quantity;
            if (this.orangeAmmo > this.maxAmmo) {
                const newLootBullets = this.orangeAmmo - this.maxAmmo;
                this.orangeAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.OrangeAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.Vest) {
            //take vest
            if (this.vest) {
                //throw loot
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Vest);
            }
            else {
                this.vest = true;
            }
        }
        else if (loot.type === LootType_1.LootType.Medkit) {
            //take medkit
            this.item5 += loot.quantity;
            //throw loot
            if (this.item5 > this.item5Max) {
                const throwCount = this.item5 - this.item5Max;
                this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType_1.LootType.Medkit, throwCount);
                this.item5 = this.item5Max;
            }
        }
        else if (loot.type === LootType_1.LootType.Scope2 || loot.type === LootType_1.LootType.Scope4 || loot.type === LootType_1.LootType.Scope6) {
            //take scope
            if (this.scope !== 1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrQztBQUNsQywrQkFBd0I7QUFDeEIscUNBQThCO0FBSTlCLHlDQUFzQztBQUN0QyxxQ0FBOEI7QUFFOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFFNUIsbUNBQTRCO0FBRTVCLE1BQXFCLFNBQVM7SUFpQzdCLFlBQVksTUFBYyxFQUFFLElBQVUsRUFBRSxNQUFjO1FBN0J0RCxVQUFLLEdBQWUsSUFBSSxDQUFDO1FBQ3pCLFVBQUssR0FBZSxJQUFJLENBQUM7UUFDekIsVUFBSyxHQUFRLGVBQU0sQ0FBQyxJQUFJLENBQUM7UUFDakIsV0FBTSxHQUFRLElBQUksQ0FBQztRQUMzQixVQUFLLEdBQXlDLElBQUksQ0FBQztRQUNuRCxzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFDOUIsb0JBQWUsR0FBVyxDQUFDLENBQUM7UUFDcEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUM3QixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ1YsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUU3QixlQUFVLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU3QixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFDdEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUVWLFlBQU8sR0FBVyxHQUFHLENBQUM7UUFFOUIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBSXhCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU87UUFDekIsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDN0I7YUFDSTtZQUNKLElBQUksSUFBSSxDQUFDLFdBQVcsWUFBWSxhQUFHLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDckI7aUJBQ0ksSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLGVBQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGVBQU0sQ0FBQyxJQUFJLEVBQUU7d0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztxQkFDN0I7b0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNEO1NBQ0Q7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVE7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU87UUFDMUIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDdEMsSUFBSSxHQUFHLFlBQVksZ0JBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDakQsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNkO2lCQUNJLElBQUksR0FBRyxZQUFZLG9CQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDZDtpQkFDSSxJQUFJLEdBQUcsWUFBWSxpQkFBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7aUJBQ0ksSUFBSSxHQUFHLFlBQVksZUFBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7U0FDRDtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1gsY0FBYztZQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNqRCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztTQUN2QjtJQUNGLENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPO1FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDcEQsWUFBWTtZQUNaLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNqRCxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUM7U0FDakM7SUFDRixDQUFDO0lBRU8sV0FBVyxDQUFDLEdBQVE7UUFDM0IsSUFBSSxHQUFHLFlBQVksZ0JBQU0sRUFBRTtZQUMxQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUN6RCxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDNUM7aUJBQ0k7Z0JBQ0osT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDMUI7WUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO2FBQzNCO1NBQ0Q7YUFDSSxJQUFJLEdBQUcsWUFBWSxvQkFBVSxFQUFFO1lBQ25DLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3ZELE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM1QztpQkFDSTtnQkFDSixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUN4QjtZQUNELElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUM7YUFDekI7U0FDRDthQUNJLElBQUksR0FBRyxZQUFZLGlCQUFPLEVBQUU7WUFDaEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDdEQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQzVDO2lCQUNJO2dCQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ3ZCO1lBQ0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQzthQUN4QjtTQUNEO2FBQ0ksSUFBSSxHQUFHLFlBQVksZUFBSyxFQUFFO1lBQzlCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3hELE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM1QztpQkFDSTtnQkFDSixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUN6QjtZQUNELElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUM7YUFDMUI7U0FDRDtJQUNGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7TUFXRTtJQUVGLFNBQVM7UUFDUixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLE9BQU87WUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUM1RCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFbEUsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRTtZQUNuRyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzdCO2FBQ0ksSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRTtZQUN0RyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzdCO2FBQ0ksSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssQ0FBQyxFQUFFO1lBQ3BFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLE1BQU07WUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBTSxDQUFDLElBQUksRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0Q7Ozs7Ozs7Ozs7O1VBV0U7SUFDSCxDQUFDO0lBRU8sYUFBYTtRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBWTtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU87UUFDMUIsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSztvQkFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSztvQkFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsVUFBVSxZQUFZLGdCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxlQUFNLENBQUMsSUFBSSxFQUFFO29CQUN6RSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDOUIsTUFBTTt3QkFDTixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO3dCQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO3FCQUNwQjtpQkFDRDtnQkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDbkQsUUFBUTtvQkFDUixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxPQUFPLEVBQUU7d0JBQzNFLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxlQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxpQkFBaUI7NEJBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLE9BQU8sQ0FBQzs2QkFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWU7NEJBQ2xFLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFFaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO3FCQUM3QjtvQkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzdCO2dCQUNELE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUM7b0JBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNwRCxNQUFNO1NBQ1A7SUFDRixDQUFDO0lBRU8saUJBQWlCLENBQUMsS0FBYSxFQUFFLGFBQXFCLEVBQUUsYUFBcUI7UUFDcEYsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUMsYUFBYTtRQUNiLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3RELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3RELE9BQU8sSUFBSSxlQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sRUFBRSxhQUFhLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLEtBQUs7UUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZO1FBQ1gsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxVQUFVO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDakMsS0FBSztRQUNMLElBQUksSUFBSSxDQUFDLElBQUk7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsS0FBSztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzVCLFFBQVE7UUFDUixJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZ0JBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLGdCQUFNO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDL0UsT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLGlCQUFpQjtZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLGVBQWU7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUN0QyxTQUFTO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBRTVCLE9BQU87UUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdEIsY0FBYztRQUNkLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQ3RDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDeEIsQ0FBQztZQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN0QyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3hCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMvRDtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDdEMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUN4QixDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQ3RDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDeEIsQ0FBQztZQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN0QyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3hCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN0QyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3hCLENBQUM7WUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2pFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDdEUsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUM7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsTUFBTTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxhQUFHLEVBQUU7WUFDOUIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQ3RDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDeEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxnQkFBTTtnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztpQkFDdEcsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGVBQUs7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUNwRSxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksaUJBQU87Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUN0RSxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksb0JBQVU7Z0JBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGFBQUcsRUFBRTtZQUM5QixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDdEMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUN4QixDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGdCQUFNO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUN0RyxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSztnQkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7aUJBQ3BFLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxpQkFBTztnQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7aUJBQ3RFLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxvQkFBVTtnQkFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDOUU7UUFDRCxRQUFRO1FBQ1IsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGdCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sWUFBWSxnQkFBTSxFQUFFO1lBQ2xFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN0QyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3hCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPO1FBQ1AsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN0QyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQ3hCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyRTtRQUNELFNBQVM7UUFDVCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDdEMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUN4QixDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN6RTtRQUVELFNBQVM7UUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDdEMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUN4QixDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQWM7UUFDbEIsV0FBVztRQUNYLElBQ0MsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE1BQU07WUFDN0IsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLFVBQVU7WUFDakMsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE9BQU87WUFDOUIsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLEtBQUssRUFDM0I7WUFDRCxJQUFJLEdBQUcsQ0FBQztZQUNSLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbEIsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLEdBQUcsR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoQyxNQUFNO2dCQUNQLEtBQUssbUJBQVEsQ0FBQyxVQUFVO29CQUN2QixHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEMsTUFBTTtnQkFDUCxLQUFLLG1CQUFRLENBQUMsT0FBTztvQkFDcEIsR0FBRyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2pDLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLEtBQUs7b0JBQ2xCLEdBQUcsR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9CLE1BQU07YUFDUDtZQUNELElBQUksR0FBRyxFQUFFO2dCQUNSLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDckIsdUJBQXVCO2dCQUN2QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO29CQUMvQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbkMsWUFBWSxHQUFHLENBQUMsQ0FBQztxQkFDakI7eUJBQ0ksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ3hDLFlBQVksR0FBRyxDQUFDLENBQUM7cUJBQ2pCO3lCQUNJO3dCQUNKLFlBQVksR0FBRyxDQUFDLENBQUM7cUJBQ2pCO29CQUNELFlBQVk7b0JBQ1osSUFBSSxRQUFRLENBQUM7b0JBQ2IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7d0JBQ3ZCLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZ0JBQU07NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDO3dCQUM3RCxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksb0JBQVU7NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsVUFBVSxDQUFDO3dCQUNyRSxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksaUJBQU87NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsT0FBTyxDQUFDO3dCQUMvRCxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSzs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxLQUFLLENBQUM7cUJBQzNEO29CQUNELElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTt3QkFDdkIsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxnQkFBTTs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzdELElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxvQkFBVTs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxVQUFVLENBQUM7d0JBQ3JFLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxpQkFBTzs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLENBQUM7d0JBQy9ELElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxlQUFLOzRCQUFFLFFBQVEsR0FBRyxtQkFBUSxDQUFDLEtBQUssQ0FBQztxQkFDM0Q7b0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztpQkFDekY7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDeEIsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDeEIsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxZQUFZLEtBQUssQ0FBQztvQkFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDekMsSUFBSSxZQUFZLEtBQUssQ0FBQztvQkFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDekMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7YUFDdEI7U0FDRDthQUNJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE1BQU0sRUFBRTtZQUN2QyxhQUFhO1lBQ2IsY0FBYztZQUNkLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxnQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLFlBQVksZ0JBQU0sRUFBRTtnQkFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEY7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM3QjthQUNJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3hFLHdCQUF3QjtZQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUM3QjtpQkFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDN0I7WUFDRCxPQUFPO1lBQ1AsU0FBUztZQUNULElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUNsQixtQkFBUSxDQUFDLE9BQU8sRUFDaEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQ3RDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDdkM7WUFDRCxPQUFPO1lBQ1AsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUNsQixtQkFBUSxDQUFDLEtBQUssRUFDZCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQ3BDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3JDO1NBQ0Q7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDMUMsV0FBVztZQUNYLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLFlBQVk7Z0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLG1CQUFRLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3JHO1NBQ0Q7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDNUIsWUFBWTtnQkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDbkc7U0FDRDthQUNJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLFFBQVEsRUFBRTtZQUN6QyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM3QixZQUFZO2dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNwRztTQUNEO2FBQ0ksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsVUFBVSxFQUFFO1lBQzNDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLFlBQVk7Z0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLG1CQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3RHO1NBQ0Q7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDckMsV0FBVztZQUNYLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDZCxZQUFZO2dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hGO2lCQUNJO2dCQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1NBQ0Q7YUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDdkMsYUFBYTtZQUNiLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1QixZQUFZO1lBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM5RixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDM0I7U0FDRDthQUNJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekcsWUFBWTtZQUNaLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLFlBQVk7Z0JBQ1osSUFBSSxTQUFtQixDQUFDO2dCQUN4QixRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ25CLEtBQUssQ0FBQzt3QkFDTCxTQUFTLEdBQUcsbUJBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzVCLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLFNBQVMsR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDNUIsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsU0FBUyxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDO3dCQUM1QixNQUFNO2lCQUNQO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM1RTtZQUNELFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbEIsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07YUFDUDtTQUNEO0lBQ0YsQ0FBQztDQUNEO0FBam5CRCw0QkFpbkJDIn0=