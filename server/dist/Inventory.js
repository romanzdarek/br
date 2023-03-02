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
        this.activeItemNumber = 3;
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
        this.maxAmmo = 99;
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
        let reloadingTime = 2.5 * 1000;
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
                //reloadingTime = 1000;
                reload = true;
            }
        }
        if (reload) {
            //start reload
            this.loadingText = 'Reloading';
            this.loadingStart = Date.now();
            this.loadingNow = this.loadingStart;
            this.loadingEnd = this.loadingStart + reloadingTime;
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
    changeActiveItemByWheel(wheelDirection) {
        if (wheelDirection === 1)
            switch (this.activeItemNumber) {
                case 1:
                    if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    break;
                case 2:
                    if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    break;
                case 3:
                    if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    break;
                case 4:
                    if (this.item5)
                        this.changeActiveItem(5);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    break;
                case 5:
                    if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    break;
            }
        if (wheelDirection === -1)
            switch (this.activeItemNumber) {
                case 5:
                    if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    break;
                case 4:
                    if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    break;
                case 3:
                    if (this.item2)
                        this.changeActiveItem(2);
                    else if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    break;
                case 2:
                    if (this.item1)
                        this.changeActiveItem(1);
                    else if (this.item5)
                        this.changeActiveItem(5);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    break;
                case 1:
                    if (this.item5)
                        this.changeActiveItem(5);
                    else if (this.item4)
                        this.changeActiveItem(4);
                    else if (this.item3)
                        this.changeActiveItem(3);
                    else if (this.item2)
                        this.changeActiveItem(2);
                    break;
            }
    }
    changeActiveItem(item) {
        //if (!this.ready()) return;
        if (!this.ready())
            this.cancelLoading();
        switch (item) {
            case 1:
                if (this.item1) {
                    this.activeItem = this.item1;
                    this.activeItemNumber = item;
                }
                break;
            case 2:
                if (this.item2) {
                    this.activeItem = this.item2;
                    this.activeItemNumber = item;
                }
                break;
            case 3:
                //change hammer x hand
                if (this.activeItem instanceof Hammer_1.default || this.activeItem === Weapon_1.Weapon.Hand) {
                    if (this.item3 && this.item33) {
                        //swap
                        const item3 = this.item3;
                        this.item3 = this.item33;
                        this.item33 = item3;
                    }
                }
                this.activeItem = this.item3;
                this.activeItemNumber = item;
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
                    this.activeItemNumber = item;
                }
                break;
            case 5:
                if (this.item5 > 0) {
                    this.activeItem = Weapon_1.Weapon.Medkit;
                    this.activeItemNumber = item;
                }
                break;
        }
    }
    throwLootPosition(angle, playerCenterX, playerCenterY) {
        const shiftZ = Math.floor(Math.random() * 40);
        //xyz tringle
        let shiftX = Math.sin((angle * Math.PI) / 180) * shiftZ;
        let shiftY = Math.cos((angle * Math.PI) / 180) * shiftZ;
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
        if (loot.type === LootType_1.LootType.Pistol || loot.type === LootType_1.LootType.Machinegun || loot.type === LootType_1.LootType.Shotgun || loot.type === LootType_1.LootType.Rifle) {
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
                    this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), lootType, bulletsInGun);
                }
                if (this.item2 === null) {
                    itemPosition = 2;
                }
                if (this.item1 === null) {
                    itemPosition = 1;
                }
                if (itemPosition === 1) {
                    this.item1 = gun;
                    this.activeItemNumber = 1;
                }
                if (itemPosition === 2) {
                    this.item2 = gun;
                    this.activeItemNumber = 2;
                }
                this.activeItem = gun;
            }
        }
        else if (loot.type === LootType_1.LootType.Hammer) {
            //take hammer
            //throw hammer
            if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default) {
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.Hammer);
            }
            this.item3 = this.hammer;
            this.item33 = Weapon_1.Weapon.Hand;
            this.activeItem = this.item3;
            this.activeItemNumber = 3;
        }
        else if (loot.type === LootType_1.LootType.Granade || loot.type === LootType_1.LootType.Smoke) {
            //take granades & smokes
            if (loot.type === LootType_1.LootType.Granade) {
                this.item4GranadeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Granade;
                this.activeItem = this.item4;
                this.activeItemNumber = 4;
            }
            else if (loot.type === LootType_1.LootType.Smoke) {
                this.item4SmokeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Smoke;
                this.activeItem = this.item4;
                this.activeItemNumber = 4;
            }
            //throw
            //granade
            if (this.item4GranadeCount > this.item4Max) {
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.Granade, this.item4GranadeCount - this.item4Max);
                this.item4GranadeCount = this.item4Max;
            }
            //smoke
            if (this.item4SmokeCount > this.item4Max) {
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.Smoke, this.item4SmokeCount - this.item4Max);
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
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.GreenAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.RedAmmo) {
            this.redAmmo += loot.quantity;
            if (this.redAmmo > this.maxAmmo) {
                const newLootBullets = this.redAmmo - this.maxAmmo;
                this.redAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.RedAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.BlueAmmo) {
            this.blueAmmo += loot.quantity;
            if (this.blueAmmo > this.maxAmmo) {
                const newLootBullets = this.blueAmmo - this.maxAmmo;
                this.blueAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.BlueAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.OrangeAmmo) {
            this.orangeAmmo += loot.quantity;
            if (this.orangeAmmo > this.maxAmmo) {
                const newLootBullets = this.orangeAmmo - this.maxAmmo;
                this.orangeAmmo = this.maxAmmo;
                //throw loot
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.OrangeAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.Vest) {
            //take vest
            if (this.vest) {
                //throw loot
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.Vest);
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
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType_1.LootType.Medkit, throwCount);
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
                this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), scopeType);
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
    getActiveItemNumber() {
        return this.activeItemNumber;
    }
}
exports.default = Inventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrQztBQUNsQywrQkFBd0I7QUFDeEIscUNBQThCO0FBRTlCLHlDQUFzQztBQUN0QyxxQ0FBOEI7QUFFOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFFNUIsbUNBQTRCO0FBRTVCLE1BQXFCLFNBQVM7SUFrQzdCLFlBQVksTUFBYyxFQUFFLElBQVUsRUFBRSxNQUFjO1FBOUI5QyxxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDckMsVUFBSyxHQUFlLElBQUksQ0FBQztRQUN6QixVQUFLLEdBQWUsSUFBSSxDQUFDO1FBQ3pCLFVBQUssR0FBUSxlQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2pCLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFDM0IsVUFBSyxHQUF5QyxJQUFJLENBQUM7UUFDbkQsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDN0IsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNWLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFN0IsZUFBVSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFN0IsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUV2QixTQUFJLEdBQVksS0FBSyxDQUFDO1FBQ3RCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFVixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBRTdCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixnQkFBVyxHQUFXLEVBQUUs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