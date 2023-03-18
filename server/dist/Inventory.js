"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weapon_1 = require("./Weapon");
const Gun_1 = require("./Gun");
const Hammer_1 = require("./Hammer");
const LootType_1 = require("./LootType");
const Pistol_1 = require("./Pistol");
const Player_1 = require("./Player");
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
    throwLootOnPosition(angle, playerCenterX, playerCenterY) {
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
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.BlueAmmo, this.blueAmmo);
        }
        if (this.redAmmo) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.RedAmmo, this.redAmmo);
        }
        if (this.greenAmmo) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.GreenAmmo, this.blueAmmo);
        }
        if (this.orangeAmmo) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.OrangeAmmo, this.orangeAmmo);
        }
        //items
        if (this.vest) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Vest);
        }
        if (this.scope > 1) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            if (this.scope === 2)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope2);
            else if (this.scope === 4)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope4);
            else if (this.scope === 6)
                this.loot.createLootItem(x, y, LootType_1.LootType.Scope6);
        }
        //guns
        if (this.item1 instanceof Gun_1.default) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
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
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
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
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Hammer);
        }
        //smoke
        if (this.item4SmokeCount) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Smoke, this.item4SmokeCount);
        }
        //granade
        if (this.item4GranadeCount) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Granade, this.item4GranadeCount);
        }
        //medkits
        if (this.item5) {
            const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
            this.loot.createLootItem(x, y, LootType_1.LootType.Medkit, this.item5);
        }
        this.clear();
    }
    throwLootItem(player, lootType, quantity) {
        const x = player.getCenterX() + Math.sin(((player.getAngle() + 180) * Math.PI) / 180) * Player_1.Player.radius * 2;
        const y = player.getCenterY() - Math.cos(((player.getAngle() + 180) * Math.PI) / 180) * Player_1.Player.radius * 2;
        this.loot.createLootItem(x, y, lootType, quantity);
    }
    throwItemFromInventory(itemNumber) {
        if (itemNumber === 1 && this.item1) {
            const lootType = this.gunToLoopType(this.item1);
            this.throwLootItem(this.player, lootType, this.item1.getBullets());
            if (this.activeItem === this.item1)
                this.changeActiveItem(3);
            this.item1 = null;
        }
        if (itemNumber === 2 && this.item2) {
            const lootType = this.gunToLoopType(this.item2);
            this.throwLootItem(this.player, lootType, this.item2.getBullets());
            if (this.activeItem === this.item2)
                this.changeActiveItem(3);
            this.item2 = null;
        }
    }
    gunToLoopType(gun) {
        if (gun instanceof Pistol_1.default)
            return LootType_1.LootType.Pistol;
        if (gun instanceof Rifle_1.default)
            return LootType_1.LootType.Rifle;
        if (gun instanceof Shotgun_1.default)
            return LootType_1.LootType.Shotgun;
        if (gun instanceof Machinegun_1.default)
            return LootType_1.LootType.Machinegun;
        return null;
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
                if (this.item1 && this.item2) {
                    if (this.item1 === this.activeItem) {
                        itemPosition = 1;
                        this.activeItem = gun;
                    }
                    else if (this.item2 === this.activeItem) {
                        this.activeItem = gun;
                        itemPosition = 2;
                    }
                    else {
                        itemPosition = 0;
                        //cannot take
                        this.throwLootItem(this.player, loot.type, loot.quantity);
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
                        this.throwLootItem(this.player, lootType, bulletsInGun);
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
                        this.throwLootItem(this.player, lootType, bulletsInGun);
                    }
                }
                if (this.item2 === null) {
                    itemPosition = 2;
                }
                if (this.item1 === null) {
                    itemPosition = 1;
                }
                if (itemPosition === 1) {
                    this.item1 = gun;
                    //this.activeItemNumber = 1;
                }
                if (itemPosition === 2) {
                    this.item2 = gun;
                    //this.activeItemNumber = 2;
                }
                //this.activeItem = gun;
                //take first weapon
                if (((this.item1 && !this.item2) || (!this.item1 && this.item2)) && this.item3 !== this.hammer && this.item33 !== this.hammer) {
                    this.activeItemNumber = 1;
                    this.activeItem = gun;
                }
            }
        }
        else if (loot.type === LootType_1.LootType.Hammer) {
            //take hammer
            //throw hammer
            let hammerAlreadyTaken = false;
            if (this.item3 instanceof Hammer_1.default || this.item33 instanceof Hammer_1.default) {
                hammerAlreadyTaken = true;
                this.throwLootItem(this.player, LootType_1.LootType.Hammer);
            }
            if (!hammerAlreadyTaken) {
                this.item3 = this.hammer;
                this.item33 = Weapon_1.Weapon.Hand;
            }
            if (!this.item1 && !this.item2 && this.item33 !== this.hammer && !hammerAlreadyTaken)
                this.activeItem = this.hammer;
            //this.activeItem = this.item3;
            //this.activeItemNumber = 3;
        }
        else if (loot.type === LootType_1.LootType.Granade || loot.type === LootType_1.LootType.Smoke) {
            //take granades & smokes
            if (loot.type === LootType_1.LootType.Granade) {
                this.item4GranadeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Granade;
                //this.activeItem = this.item4;
                //this.activeItemNumber = 4;
            }
            else if (loot.type === LootType_1.LootType.Smoke) {
                this.item4SmokeCount += loot.quantity;
                this.item4 = Weapon_1.Weapon.Smoke;
                //this.activeItem = this.item4;
                //this.activeItemNumber = 4;
            }
            //throw
            //granade
            if (this.item4GranadeCount > this.item4Max) {
                this.throwLootItem(this.player, LootType_1.LootType.Granade, this.item4GranadeCount - this.item4Max);
                this.item4GranadeCount = this.item4Max;
            }
            //smoke
            if (this.item4SmokeCount > this.item4Max) {
                this.throwLootItem(this.player, LootType_1.LootType.Smoke, this.item4SmokeCount - this.item4Max);
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
                this.throwLootItem(this.player, LootType_1.LootType.GreenAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.RedAmmo) {
            this.redAmmo += loot.quantity;
            if (this.redAmmo > this.maxAmmo) {
                const newLootBullets = this.redAmmo - this.maxAmmo;
                this.redAmmo = this.maxAmmo;
                //throw loot
                this.throwLootItem(this.player, LootType_1.LootType.RedAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.BlueAmmo) {
            this.blueAmmo += loot.quantity;
            if (this.blueAmmo > this.maxAmmo) {
                const newLootBullets = this.blueAmmo - this.maxAmmo;
                this.blueAmmo = this.maxAmmo;
                //throw loot
                this.throwLootItem(this.player, LootType_1.LootType.BlueAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.OrangeAmmo) {
            this.orangeAmmo += loot.quantity;
            if (this.orangeAmmo > this.maxAmmo) {
                const newLootBullets = this.orangeAmmo - this.maxAmmo;
                this.orangeAmmo = this.maxAmmo;
                //throw loot
                this.throwLootItem(this.player, LootType_1.LootType.OrangeAmmo, newLootBullets);
            }
        }
        else if (loot.type === LootType_1.LootType.Vest) {
            //take vest
            if (this.vest) {
                //throw loot
                this.throwLootItem(this.player, LootType_1.LootType.Vest);
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
                this.throwLootItem(this.player, LootType_1.LootType.Medkit, throwCount);
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
                this.throwLootItem(this.player, scopeType);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludmVudG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFrQztBQUNsQywrQkFBd0I7QUFDeEIscUNBQThCO0FBRTlCLHlDQUFzQztBQUN0QyxxQ0FBOEI7QUFDOUIscUNBQWtDO0FBQ2xDLDZDQUFzQztBQUN0Qyx1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBRTVCLG1DQUE0QjtBQUU1QixNQUFxQixTQUFTO0lBa0M3QixZQUFZLE1BQWMsRUFBRSxJQUFVLEVBQUUsTUFBYztRQTlCOUMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQ3JDLFVBQUssR0FBZSxJQUFJLENBQUM7UUFDekIsVUFBSyxHQUFlLElBQUksQ0FBQztRQUN6QixVQUFLLEdBQVEsZUFBTSxDQUFDLElBQUksQ0FBQztRQUN6QixXQUFNLEdBQVEsSUFBSSxDQUFDO1FBQ25CLFVBQUssR0FBeUMsSUFBSSxDQUFDO1FBQ25ELHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUM5QixvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUNwQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDVixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRTdCLGVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTdCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFFdkIsU0FBSSxHQUFZLEtBQUssQ0FBQztRQUN0QixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRVYsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUU3QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFJeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUNELEtBQUs7UUFDSixPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxPQUFPO1FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTztRQUN6QixJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUM3QjthQUFNO1lBQ04sSUFBSSxJQUFJLENBQUMsV0FBVyxZQUFZLGFBQUcsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNyQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssZUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBTSxDQUFDLElBQUksRUFBRTt3QkFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO3FCQUM3QjtvQkFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCO2FBQ0Q7U0FDRDtJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBUTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTztRQUMxQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxhQUFhLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ3RDLElBQUksR0FBRyxZQUFZLGdCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pELE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDZDtpQkFBTSxJQUFJLEdBQUcsWUFBWSxvQkFBVSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUMxRCxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxHQUFHLFlBQVksaUJBQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRTtnQkFDdEQsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNkO2lCQUFNLElBQUksR0FBRyxZQUFZLGVBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtnQkFDdEQsdUJBQXVCO2dCQUN2QixNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2Q7U0FDRDtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1gsY0FBYztZQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO1lBQ3BELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCO0lBQ0YsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU87UUFDMUIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsRUFBRTtZQUNwRCxZQUFZO1lBQ1osSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7WUFDOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNqQztJQUNGLENBQUM7SUFFTyxXQUFXLENBQUMsR0FBUTtRQUMzQixJQUFJLEdBQUcsWUFBWSxnQkFBTSxFQUFFO1lBQzFCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUM1QztpQkFBTTtnQkFDTixPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUMxQjtZQUNELElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7YUFDM0I7U0FDRDthQUFNLElBQUksR0FBRyxZQUFZLG9CQUFVLEVBQUU7WUFDckMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDdkQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQzVDO2lCQUFNO2dCQUNOLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3hCO1lBQ0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQzthQUN6QjtTQUNEO2FBQU0sSUFBSSxHQUFHLFlBQVksaUJBQU8sRUFBRTtZQUNsQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUN0RCxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDNUM7aUJBQU07Z0JBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDdkI7WUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO2FBQ3hCO1NBQ0Q7YUFBTSxJQUFJLEdBQUcsWUFBWSxlQUFLLEVBQUU7WUFDaEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDeEQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQzVDO2lCQUFNO2dCQUNOLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ3pCO1lBQ0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQzthQUMxQjtTQUNEO0lBQ0YsQ0FBQztJQUVELFNBQVM7UUFDUixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLE9BQU87WUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUM1RCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFbEUsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRTtZQUNuRyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzdCO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRTtZQUN4RyxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzdCO2FBQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssQ0FBQyxFQUFFO1lBQ3RFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWxCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFNLENBQUMsSUFBSSxFQUFFO2dCQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDN0I7WUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekI7SUFDRixDQUFDO0lBRU8sYUFBYTtRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsdUJBQXVCLENBQUMsY0FBc0I7UUFDN0MsSUFBSSxjQUFjLEtBQUssQ0FBQztZQUN2QixRQUFRLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUIsS0FBSyxDQUFDO29CQUNMLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTTtnQkFDUCxLQUFLLENBQUM7b0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTTthQUNQO1FBRUYsSUFBSSxjQUFjLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUM5QixLQUFLLENBQUM7b0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTTtnQkFDUCxLQUFLLENBQUM7b0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLO3dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNO2FBQ1A7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBWTtRQUM1Qiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFeEMsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztpQkFDN0I7Z0JBQ0QsTUFBTTtZQUNQLEtBQUssQ0FBQztnQkFDTCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUM3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2lCQUM3QjtnQkFDRCxNQUFNO1lBQ1AsS0FBSyxDQUFDO2dCQUNMLHNCQUFzQjtnQkFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxZQUFZLGdCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxlQUFNLENBQUMsSUFBSSxFQUFFO29CQUN6RSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDOUIsTUFBTTt3QkFDTixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO3dCQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO3FCQUNwQjtpQkFDRDtnQkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDbkQsUUFBUTtvQkFDUixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLGVBQU0sQ0FBQyxPQUFPLEVBQUU7d0JBQzNFLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxlQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxpQkFBaUI7NEJBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDOzZCQUM1RixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssZUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZTs0QkFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUM7d0JBRXBHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztxQkFDN0I7b0JBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUM3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2lCQUM3QjtnQkFDRCxNQUFNO1lBQ1AsS0FBSyxDQUFDO2dCQUNMLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztpQkFDN0I7Z0JBQ0QsTUFBTTtTQUNQO0lBQ0YsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEtBQWEsRUFBRSxhQUFxQixFQUFFLGFBQXFCO1FBQ3RGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLGFBQWE7UUFDYixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDeEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3hELE9BQU8sSUFBSSxlQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sRUFBRSxhQUFhLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLEtBQUs7UUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZO1FBQ1gsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxVQUFVO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDakMsS0FBSztRQUNMLElBQUksSUFBSSxDQUFDLElBQUk7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsS0FBSztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzVCLFFBQVE7UUFDUixJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZ0JBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLGdCQUFNO1lBQUUsU0FBUyxFQUFFLENBQUM7UUFDL0UsT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLGlCQUFpQjtZQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLGVBQWU7WUFBRSxTQUFTLEVBQUUsQ0FBQztRQUN0QyxTQUFTO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSztZQUFFLFNBQVMsRUFBRSxDQUFDO1FBRTVCLE9BQU87UUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdEIsY0FBYztRQUNkLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzVILElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMvRDtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzVILElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2pFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDdEUsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUM7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsTUFBTTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxhQUFHLEVBQUU7WUFDOUIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzVILElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxnQkFBTTtnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztpQkFDdEcsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGVBQUs7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7aUJBQ3pHLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxpQkFBTztnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztpQkFDN0csSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLG9CQUFVO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQ3hIO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGFBQUcsRUFBRTtZQUM5QixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGdCQUFNO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUN0RyxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSztnQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztpQkFDekcsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGlCQUFPO2dCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RyxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksb0JBQVU7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDeEg7UUFDRCxRQUFRO1FBQ1IsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLGdCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sWUFBWSxnQkFBTSxFQUFFO1lBQ2xFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPO1FBQ1AsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1SCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyRTtRQUNELFNBQVM7UUFDVCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN6RTtRQUVELFNBQVM7UUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDNUgsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQWMsRUFBRSxRQUFrQixFQUFFLFFBQWlCO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRTFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxVQUFrQjtRQUN4QyxJQUFJLFVBQVUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUNuRSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLEtBQUs7Z0JBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxVQUFVLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDbkUsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxLQUFLO2dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNsQjtJQUNGLENBQUM7SUFFTyxhQUFhLENBQUMsR0FBUTtRQUM3QixJQUFJLEdBQUcsWUFBWSxnQkFBTTtZQUFFLE9BQU8sbUJBQVEsQ0FBQyxNQUFNLENBQUM7UUFDbEQsSUFBSSxHQUFHLFlBQVksZUFBSztZQUFFLE9BQU8sbUJBQVEsQ0FBQyxLQUFLLENBQUM7UUFDaEQsSUFBSSxHQUFHLFlBQVksaUJBQU87WUFBRSxPQUFPLG1CQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3BELElBQUksR0FBRyxZQUFZLG9CQUFVO1lBQUUsT0FBTyxtQkFBUSxDQUFDLFVBQVUsQ0FBQztRQUMxRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBYztRQUNsQixXQUFXO1FBQ1gsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3pJLElBQUksR0FBRyxDQUFDO1lBQ1IsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNsQixLQUFLLG1CQUFRLENBQUMsTUFBTTtvQkFDbkIsR0FBRyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hDLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLFVBQVU7b0JBQ3ZCLEdBQUcsR0FBRyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwQyxNQUFNO2dCQUNQLEtBQUssbUJBQVEsQ0FBQyxPQUFPO29CQUNwQixHQUFHLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakMsTUFBTTtnQkFDUCxLQUFLLG1CQUFRLENBQUMsS0FBSztvQkFDbEIsR0FBRyxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsTUFBTTthQUNQO1lBQ0QsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQix1QkFBdUI7Z0JBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbkMsWUFBWSxHQUFHLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7cUJBQ3RCO3lCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQzt3QkFDdEIsWUFBWSxHQUFHLENBQUMsQ0FBQztxQkFDakI7eUJBQU07d0JBQ04sWUFBWSxHQUFHLENBQUMsQ0FBQzt3QkFDakIsYUFBYTt3QkFDYixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQzFEO29CQUNELFlBQVk7b0JBQ1osSUFBSSxRQUFRLENBQUM7b0JBQ2IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7d0JBQ3ZCLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZ0JBQU07NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDO3dCQUM3RCxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksb0JBQVU7NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsVUFBVSxDQUFDO3dCQUNyRSxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksaUJBQU87NEJBQUUsUUFBUSxHQUFHLG1CQUFRLENBQUMsT0FBTyxDQUFDO3dCQUMvRCxJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSzs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxLQUFLLENBQUM7d0JBQzNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7cUJBQ3hEO29CQUNELElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTt3QkFDdkIsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxnQkFBTTs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzdELElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxvQkFBVTs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxVQUFVLENBQUM7d0JBQ3JFLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxpQkFBTzs0QkFBRSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLENBQUM7d0JBQy9ELElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxlQUFLOzRCQUFFLFFBQVEsR0FBRyxtQkFBUSxDQUFDLEtBQUssQ0FBQzt3QkFDM0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztxQkFDeEQ7aUJBQ0Q7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDeEIsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDeEIsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO29CQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztvQkFDakIsNEJBQTRCO2lCQUM1QjtnQkFDRCxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO29CQUNqQiw0QkFBNEI7aUJBQzVCO2dCQUNELHdCQUF3QjtnQkFFeEIsbUJBQW1CO2dCQUNuQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQzlILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO2lCQUN0QjthQUNEO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekMsYUFBYTtZQUNiLGNBQWM7WUFDZCxJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksZ0JBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLGdCQUFNLEVBQUU7Z0JBQ2xFLGtCQUFrQixHQUFHLElBQUksQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDakQ7WUFDRCxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO2FBQzFCO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLGtCQUFrQjtnQkFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEgsK0JBQStCO1lBQy9CLDRCQUE0QjtTQUM1QjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsS0FBSyxFQUFFO1lBQzFFLHdCQUF3QjtZQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLCtCQUErQjtnQkFDL0IsNEJBQTRCO2FBQzVCO2lCQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLEtBQUssRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQzFCLCtCQUErQjtnQkFDL0IsNEJBQTRCO2FBQzVCO1lBQ0QsT0FBTztZQUNQLFNBQVM7WUFDVCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDdkM7WUFDRCxPQUFPO1lBQ1AsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxtQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3JDO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDNUMsV0FBVztZQUNYLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLFlBQVk7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFRLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3BFO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDMUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDNUIsWUFBWTtnQkFDWixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDbEU7U0FDRDthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLFFBQVEsRUFBRTtZQUMzQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM3QixZQUFZO2dCQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNuRTtTQUNEO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsVUFBVSxFQUFFO1lBQzdDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLFlBQVk7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ3JFO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDdkMsV0FBVztZQUNYLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDZCxZQUFZO2dCQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9DO2lCQUFNO2dCQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekMsYUFBYTtZQUNiLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1QixZQUFZO1lBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDM0I7U0FDRDthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDM0csWUFBWTtZQUNaLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLFlBQVk7Z0JBQ1osSUFBSSxTQUFtQixDQUFDO2dCQUN4QixRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ25CLEtBQUssQ0FBQzt3QkFDTCxTQUFTLEdBQUcsbUJBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzVCLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLFNBQVMsR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDNUIsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsU0FBUyxHQUFHLG1CQUFRLENBQUMsTUFBTSxDQUFDO3dCQUM1QixNQUFNO2lCQUNQO2dCQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMzQztZQUNELFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbEIsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07Z0JBQ1AsS0FBSyxtQkFBUSxDQUFDLE1BQU07b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU07YUFDUDtTQUNEO0lBQ0YsQ0FBQztJQUVELG1CQUFtQjtRQUNsQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUM5QixDQUFDO0NBQ0Q7QUEzb0JELDRCQTJvQkMifQ==