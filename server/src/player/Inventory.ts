import { Weapon } from '../weapon/Weapon';
import Gun from '../weapon/Gun';
import Loot from '../loot/Loot';
import { LootType } from '../loot/LootType';
import Pistol from '../weapon/Pistol';
import { Player } from './Player';
import Machinegun from '../weapon/Machinegun';
import Shotgun from '../weapon/Shotgun';
import Rifle from '../weapon/Rifle';
import LootItem from '../loot/LootItem';
import Point from '../Point';
import Mace from '../weapon/Mace';
import Sword from '../weapon/Sword';
import HandWeapon from '../weapon/HandWeapon';
import Halberd from '../weapon/Halberd';

export default class Inventory {
	private player: Player;
	private loot: Loot;
	private halberd: Halberd;
	private sword: Sword;
	private mace: Mace;

	private activeItemNumber: number = 3;
	item1: Gun | null = null;
	item2: Gun | null = null;
	item3: any = Weapon.Hand;
	item33: any = null;
	item4: Weapon.Grenade | Weapon.Smoke | null = null;
	item4GrenadeCount: number = 0;
	item4SmokeCount: number = 0;
	private item4Max: number = 3;
	item5: number = 0;
	private item5Max: number = 3;

	activeItem: any = this.item3;

	redAmmo: number = 0;
	blueAmmo: number = 0;
	greenAmmo: number = 0;
	orangeAmmo: number = 0;

	vest: boolean = false;
	scope: number = 1;

	private maxAmmo: number = 99;

	loadingStart: number = 0;
	loadingNow: number = 0;
	loadingEnd: number = 0;
	loadingText: string = '';
	private loadingItem: any;

	constructor(player: Player, loot: Loot, halberd: Halberd, sword: Sword, mace: Mace) {
		this.player = player;
		this.loot = loot;
		this.halberd = halberd;
		this.sword = sword;
		this.mace = mace;
	}
	ready(): boolean {
		return this.loadingStart === 0;
	}

	loading(): void {
		if (this.ready()) return;
		if (this.loadingNow < this.loadingEnd) {
			this.loadingNow = Date.now();
		} else {
			if (this.loadingItem instanceof Gun) {
				this.finalReload(this.loadingItem);
				this.cancelLoading();
			} else if (this.loadingItem === Weapon.Medkit) {
				this.item5--;
				this.player.healing(50);
				this.cancelLoading();
				if (!this.item5) {
					if (this.item3 !== Weapon.Hand) {
						this.activeItem = this.item3;
					}
					this.changeActiveItem(3);
				}
			}
		}
	}

	reload(gun: Gun): void {
		if (!this.ready()) return;
		let reload = false;
		let reloadingTime = 2.5 * 1000;
		if (gun.getBullets() < gun.bulletsMax) {
			if (gun instanceof Pistol && this.orangeAmmo > 0) {
				reload = true;
			} else if (gun instanceof Machinegun && this.blueAmmo > 0) {
				reload = true;
			} else if (gun instanceof Shotgun && this.redAmmo > 0) {
				reload = true;
			} else if (gun instanceof Rifle && this.greenAmmo > 0) {
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

	heal(): void {
		if (!this.ready()) return;
		if (this.item5 > 0 && this.player.getHealth() < 100) {
			//start heal
			this.loadingText = ' Healing';
			this.loadingStart = Date.now();
			this.loadingNow = this.loadingStart;
			this.loadingEnd = this.loadingStart + 2.5 * 1000;
			this.loadingItem = Weapon.Medkit;
		}
	}

	private finalReload(gun: Gun): void {
		if (gun instanceof Pistol) {
			let bullets = 0;
			if (this.orangeAmmo >= gun.bulletsMax - gun.getBullets()) {
				bullets = gun.bulletsMax - gun.getBullets();
			} else {
				bullets = this.orangeAmmo;
			}
			if (bullets > 0) {
				gun.reload(bullets);
				this.orangeAmmo -= bullets;
			}
		} else if (gun instanceof Machinegun) {
			let bullets = 0;
			if (this.blueAmmo >= gun.bulletsMax - gun.getBullets()) {
				bullets = gun.bulletsMax - gun.getBullets();
			} else {
				bullets = this.blueAmmo;
			}
			if (bullets > 0) {
				gun.reload(bullets);
				this.blueAmmo -= bullets;
			}
		} else if (gun instanceof Shotgun) {
			let bullets = 0;
			if (this.redAmmo >= gun.bulletsMax - gun.getBullets()) {
				bullets = gun.bulletsMax - gun.getBullets();
			} else {
				bullets = this.redAmmo;
			}
			if (bullets > 0) {
				gun.reload(bullets);
				this.redAmmo -= bullets;
			}
		} else if (gun instanceof Rifle) {
			let bullets = 0;
			if (this.greenAmmo >= gun.bulletsMax - gun.getBullets()) {
				bullets = gun.bulletsMax - gun.getBullets();
			} else {
				bullets = this.greenAmmo;
			}
			if (bullets > 0) {
				gun.reload(bullets);
				this.greenAmmo -= bullets;
			}
		}
	}

	throwNade(): void {
		if (this.activeItem === Weapon.Grenade) this.item4GrenadeCount--;
		else if (this.activeItem === Weapon.Smoke) this.item4SmokeCount--;

		if (this.activeItem === Weapon.Grenade && this.item4GrenadeCount === 0 && this.item4SmokeCount > 0) {
			this.activeItem = Weapon.Smoke;
			this.item4 = this.activeItem;
		} else if (this.activeItem === Weapon.Smoke && this.item4SmokeCount === 0 && this.item4GrenadeCount > 0) {
			this.activeItem = Weapon.Grenade;
			this.item4 = this.activeItem;
		} else if (this.item4SmokeCount === 0 && this.item4GrenadeCount === 0) {
			this.item4 = null;

			/*
			if (this.item3 !== Weapon.Hand) {
				this.activeItem = this.item3;
			}
			*/

			this.changeActiveItem(3);
		}
	}

	private cancelLoading(): void {
		this.loadingStart = 0;
		this.loadingEnd = 0;
		this.loadingNow = 0;
	}

	changeActiveItemByWheel(wheelDirection: number): void {
		if (wheelDirection === 1)
			switch (this.activeItemNumber) {
				case 1:
					if (this.item2) this.changeActiveItem(2);
					else if (this.item3) this.changeActiveItem(3);
					else if (this.item4) this.changeActiveItem(4);
					else if (this.item5) this.changeActiveItem(5);
					break;
				case 2:
					if (this.item3) this.changeActiveItem(3);
					else if (this.item4) this.changeActiveItem(4);
					else if (this.item5) this.changeActiveItem(5);
					else if (this.item1) this.changeActiveItem(1);
					break;
				case 3:
					if (this.item4) this.changeActiveItem(4);
					else if (this.item5) this.changeActiveItem(5);
					else if (this.item1) this.changeActiveItem(1);
					else if (this.item2) this.changeActiveItem(2);
					break;
				case 4:
					if (this.item5) this.changeActiveItem(5);
					else if (this.item1) this.changeActiveItem(1);
					else if (this.item2) this.changeActiveItem(2);
					else if (this.item3) this.changeActiveItem(3);
					break;
				case 5:
					if (this.item1) this.changeActiveItem(1);
					else if (this.item2) this.changeActiveItem(2);
					else if (this.item3) this.changeActiveItem(3);
					else if (this.item4) this.changeActiveItem(4);
					break;
			}

		if (wheelDirection === -1)
			switch (this.activeItemNumber) {
				case 5:
					if (this.item4) this.changeActiveItem(4);
					else if (this.item3) this.changeActiveItem(3);
					else if (this.item2) this.changeActiveItem(2);
					else if (this.item1) this.changeActiveItem(1);
					break;
				case 4:
					if (this.item3) this.changeActiveItem(3);
					else if (this.item2) this.changeActiveItem(2);
					else if (this.item1) this.changeActiveItem(1);
					else if (this.item5) this.changeActiveItem(5);
					break;
				case 3:
					if (this.item2) this.changeActiveItem(2);
					else if (this.item1) this.changeActiveItem(1);
					else if (this.item4) this.changeActiveItem(4);
					else if (this.item5) this.changeActiveItem(5);
					break;
				case 2:
					if (this.item1) this.changeActiveItem(1);
					else if (this.item5) this.changeActiveItem(5);
					else if (this.item4) this.changeActiveItem(4);
					else if (this.item3) this.changeActiveItem(3);
					break;
				case 1:
					if (this.item5) this.changeActiveItem(5);
					else if (this.item4) this.changeActiveItem(4);
					else if (this.item3) this.changeActiveItem(3);
					else if (this.item2) this.changeActiveItem(2);
					break;
			}
	}

	changeActiveItem(item: number): void {
		//if (!this.ready()) return;
		if (!this.ready()) this.cancelLoading();

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
				//change weapon x hand
				if (this.activeItem instanceof HandWeapon || this.activeItem === Weapon.Hand) {
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
				if (this.item4GrenadeCount || this.item4SmokeCount) {
					//change
					if (this.activeItem === Weapon.Smoke || this.activeItem === Weapon.Grenade) {
						if (this.activeItem === Weapon.Smoke && this.item4GrenadeCount) this.activeItem = Weapon.Grenade;
						else if (this.activeItem === Weapon.Grenade && this.item4SmokeCount) this.activeItem = Weapon.Smoke;

						this.item4 = this.activeItem;
					}
					this.activeItem = this.item4;
					this.activeItemNumber = item;
				}
				break;
			case 5:
				if (this.item5 > 0) {
					this.activeItem = Weapon.Medkit;
					this.activeItemNumber = item;
				}
				break;
		}
	}

	private throwLootOnPosition(angle: number, playerCenterX: number, playerCenterY: number): Point {
		const shiftZ = Math.floor(Math.random() * 40);
		//xyz tringle
		let shiftX = Math.sin((angle * Math.PI) / 180) * shiftZ;
		let shiftY = Math.cos((angle * Math.PI) / 180) * shiftZ;
		return new Point(playerCenterX + shiftX, playerCenterY + shiftY);
	}

	private clear(): void {
		this.redAmmo = 0;
		this.blueAmmo = 0;
		this.greenAmmo = 0;
		this.orangeAmmo = 0;
		this.vest = false;
		this.scope = 1;
		this.item1 = null;
		this.item2 = null;
		this.item3 = Weapon.Hand;
		this.item33 = null;
		this.item4 = null;
		this.item4GrenadeCount = 0;
		this.item4SmokeCount = 0;
		this.item5 = 0;
		this.activeItem = this.item3;
	}

	throwAllLoot(): void {
		let lootCount = 0;
		//ammo
		if (this.blueAmmo) lootCount++;
		if (this.redAmmo) lootCount++;
		if (this.greenAmmo) lootCount++;
		if (this.orangeAmmo) lootCount++;
		//...
		if (this.vest) lootCount++;
		if (this.scope > 1) lootCount++;
		//guns
		if (this.item1) lootCount++;
		if (this.item2) lootCount++;

		if (this.item3 instanceof HandWeapon || this.item33 instanceof HandWeapon) lootCount++;
		//nates
		if (this.item4GrenadeCount) lootCount++;
		if (this.item4SmokeCount) lootCount++;
		//medkits
		if (this.item5) lootCount++;

		//shift
		const shiftAngle = Math.floor(360 / lootCount);
		let shiftMultiple = 0;
		//create loots
		//ammo
		if (this.blueAmmo) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.BlueAmmo, this.blueAmmo);
		}

		if (this.redAmmo) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.RedAmmo, this.redAmmo);
		}
		if (this.greenAmmo) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.GreenAmmo, this.blueAmmo);
		}
		if (this.orangeAmmo) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.OrangeAmmo, this.orangeAmmo);
		}
		//items
		if (this.vest) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.Vest);
		}
		if (this.scope > 1) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			if (this.scope === 2) this.loot.createLootItem(x, y, LootType.Scope2);
			else if (this.scope === 4) this.loot.createLootItem(x, y, LootType.Scope4);
			else if (this.scope === 6) this.loot.createLootItem(x, y, LootType.Scope6);
		}
		//guns
		if (this.item1 instanceof Gun) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			if (this.item1 instanceof Pistol) this.loot.createLootItem(x, y, LootType.Pistol, this.item1.getBullets());
			else if (this.item1 instanceof Rifle) this.loot.createLootItem(x, y, LootType.Rifle, this.item1.getBullets());
			else if (this.item1 instanceof Shotgun) this.loot.createLootItem(x, y, LootType.Shotgun, this.item1.getBullets());
			else if (this.item1 instanceof Machinegun) this.loot.createLootItem(x, y, LootType.Machinegun, this.item1.getBullets());
		}
		if (this.item2 instanceof Gun) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			if (this.item2 instanceof Pistol) this.loot.createLootItem(x, y, LootType.Pistol, this.item2.getBullets());
			else if (this.item2 instanceof Rifle) this.loot.createLootItem(x, y, LootType.Rifle, this.item2.getBullets());
			else if (this.item2 instanceof Shotgun) this.loot.createLootItem(x, y, LootType.Shotgun, this.item2.getBullets());
			else if (this.item2 instanceof Machinegun) this.loot.createLootItem(x, y, LootType.Machinegun, this.item2.getBullets());
		}
		// HandWeapon
		if (this.item3 instanceof HandWeapon || this.item33 instanceof HandWeapon) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());

			let weapon;
			if (this.item3 instanceof HandWeapon) weapon = this.item3;
			else weapon = this.item33;

			if (weapon instanceof Halberd) this.loot.createLootItem(x, y, LootType.Halberd);
			if (weapon instanceof Sword) this.loot.createLootItem(x, y, LootType.Sword);
			if (weapon instanceof Mace) this.loot.createLootItem(x, y, LootType.Mace);
		}
		//smoke
		if (this.item4SmokeCount) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.Smoke, this.item4SmokeCount);
		}
		//Grenade
		if (this.item4GrenadeCount) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.Grenade, this.item4GrenadeCount);
		}

		//medkits
		if (this.item5) {
			const { x, y } = this.throwLootOnPosition(shiftAngle * ++shiftMultiple, this.player.getCenterX(), this.player.getCenterY());
			this.loot.createLootItem(x, y, LootType.Medkit, this.item5);
		}

		this.clear();
	}

	private throwLootItem(player: Player, lootType: LootType, quantity?: number) {
		const x = player.getCenterX() + Math.sin(((player.getAngle() + 180) * Math.PI) / 180) * Player.radius * 2;
		const y = player.getCenterY() - Math.cos(((player.getAngle() + 180) * Math.PI) / 180) * Player.radius * 2;

		this.loot.createLootItem(x, y, lootType, quantity);
	}

	throwItemFromInventory(itemNumber: number) {
		if (itemNumber === 1 && this.item1) {
			const lootType = this.gunToLoopType(this.item1);
			this.throwLootItem(this.player, lootType, this.item1.getBullets());
			if (this.activeItem === this.item1) this.changeActiveItem(3);

			this.item1 = null;
		}

		if (itemNumber === 2 && this.item2) {
			const lootType = this.gunToLoopType(this.item2);
			this.throwLootItem(this.player, lootType, this.item2.getBullets());
			if (this.activeItem === this.item2) this.changeActiveItem(3);
			this.item2 = null;
		}

		if (itemNumber === 3 && this.item3 !== Weapon.Hand) {
			let lootType;
			if (this.item3.type === Weapon.Halberd) lootType = LootType.Halberd;
			if (this.item3.type === Weapon.Mace) lootType = LootType.Mace;
			if (this.item3.type === Weapon.Sword) lootType = LootType.Sword;

			this.throwLootItem(this.player, lootType);
			this.item3 = Weapon.Hand;
			this.activeItem = this.item3;
			this.item33 = null;
		}

		if (itemNumber === 4) {
			if (this.item4 === Weapon.Grenade) {
				this.throwLootItem(this.player, LootType.Grenade, this.item4GrenadeCount);
				this.item4GrenadeCount = 0;
				if (this.activeItemNumber === 4 && this.item4SmokeCount) {
					this.changeActiveItem(4);
				}
			}

			if (this.item4 === Weapon.Smoke) {
				this.throwLootItem(this.player, LootType.Smoke, this.item4SmokeCount);
				this.item4SmokeCount = 0;
				if (this.activeItemNumber === 4 && this.item4GrenadeCount) {
					this.changeActiveItem(4);
				}
			}

			if (this.activeItemNumber === 4 && !this.item4GrenadeCount && !this.item4SmokeCount) {
				this.item4 = null;
				this.changeActiveItem(3);
			} else if (!this.item4GrenadeCount && !this.item4SmokeCount) {
				this.item4 = null;
			} else if (this.item4GrenadeCount) {
				this.item4 = Weapon.Grenade;
			} else if (this.item4SmokeCount) {
				this.item4 = Weapon.Smoke;
			}
		}

		if (itemNumber === 5 && this.item5) {
			this.throwLootItem(this.player, LootType.Medkit, this.item5);
			this.item5 = 0;
			if (this.activeItemNumber === 5) this.changeActiveItem(3);
		}
	}

	private gunToLoopType(gun: Gun) {
		if (gun instanceof Pistol) return LootType.Pistol;
		if (gun instanceof Rifle) return LootType.Rifle;
		if (gun instanceof Shotgun) return LootType.Shotgun;
		if (gun instanceof Machinegun) return LootType.Machinegun;
		return null;
	}

	take(loot: LootItem): void {
		//take guns
		if (loot.type === LootType.Pistol || loot.type === LootType.Machinegun || loot.type === LootType.Shotgun || loot.type === LootType.Rifle) {
			let gun;
			switch (loot.type) {
				case LootType.Pistol:
					gun = new Pistol(loot.quantity);
					break;
				case LootType.Machinegun:
					gun = new Machinegun(loot.quantity);
					break;
				case LootType.Shotgun:
					gun = new Shotgun(loot.quantity);
					break;
				case LootType.Rifle:
					gun = new Rifle(loot.quantity);
					break;
			}
			if (gun) {
				let itemPosition = 0;
				//gun inventory is full
				if (this.item1 && this.item2) {
					if (this.item1 === this.activeItem) {
						itemPosition = 1;
						this.activeItem = gun;
					} else if (this.item2 === this.activeItem) {
						this.activeItem = gun;
						itemPosition = 2;
					} else {
						itemPosition = 0;
						//cannot take
						this.throwLootItem(this.player, loot.type, loot.quantity);
					}
					//remove gun
					let lootType;
					let bulletsInGun = 0;
					if (itemPosition === 1) {
						bulletsInGun = this.item1.getBullets();
						if (this.item1 instanceof Pistol) lootType = LootType.Pistol;
						if (this.item1 instanceof Machinegun) lootType = LootType.Machinegun;
						if (this.item1 instanceof Shotgun) lootType = LootType.Shotgun;
						if (this.item1 instanceof Rifle) lootType = LootType.Rifle;
						this.throwLootItem(this.player, lootType, bulletsInGun);
					}
					if (itemPosition === 2) {
						bulletsInGun = this.item2.getBullets();
						if (this.item2 instanceof Pistol) lootType = LootType.Pistol;
						if (this.item2 instanceof Machinegun) lootType = LootType.Machinegun;
						if (this.item2 instanceof Shotgun) lootType = LootType.Shotgun;
						if (this.item2 instanceof Rifle) lootType = LootType.Rifle;
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
				if (((this.item1 && !this.item2) || (!this.item1 && this.item2)) && !(this.item3 instanceof HandWeapon || this.item33 instanceof HandWeapon)) {
					this.activeItemNumber = 1;
					this.activeItem = gun;
				}
			}
			// Hand weapon
		} else if ([LootType.Halberd, LootType.Sword, LootType.Mace].includes(loot.type)) {
			let handweaponAlreadyTaken = false;
			if (
				this.item3 instanceof Halberd ||
				this.item33 instanceof Halberd ||
				this.item3 instanceof Sword ||
				this.item33 instanceof Sword ||
				this.item3 instanceof Mace ||
				this.item33 instanceof Mace
			) {
				handweaponAlreadyTaken = true;
				let weapon;
				if (this.item3 instanceof HandWeapon) weapon = this.item3;
				else weapon = this.item33;

				if (weapon instanceof Halberd) this.throwLootItem(this.player, LootType.Halberd);
				if (weapon instanceof Sword) this.throwLootItem(this.player, LootType.Sword);
				if (weapon instanceof Mace) this.throwLootItem(this.player, LootType.Mace);
			}

			this.item33 = Weapon.Hand;
			switch (loot.type) {
				case LootType.Halberd:
					this.item3 = this.halberd;
					break;
				case LootType.Sword:
					this.item3 = this.sword;
					break;
				case LootType.Mace:
					this.item3 = this.mace;
					break;
			}

			if (!this.item1 && !this.item2 && this.item33 === Weapon.Hand && !handweaponAlreadyTaken) this.activeItem = this.item3;
			if (this.activeItemNumber === 3) this.activeItem = this.item3;
			//this.activeItem = this.item3;
			//this.activeItemNumber = 3;
		} else if (loot.type === LootType.Grenade || loot.type === LootType.Smoke) {
			//take Grenades & smokes
			if (loot.type === LootType.Grenade) {
				this.item4GrenadeCount += loot.quantity;
				this.item4 = Weapon.Grenade;
				//this.activeItem = this.item4;
				//this.activeItemNumber = 4;
			} else if (loot.type === LootType.Smoke) {
				this.item4SmokeCount += loot.quantity;
				this.item4 = Weapon.Smoke;
				//this.activeItem = this.item4;
				//this.activeItemNumber = 4;
			}
			//throw
			//Grenade
			if (this.item4GrenadeCount > this.item4Max) {
				this.throwLootItem(this.player, LootType.Grenade, this.item4GrenadeCount - this.item4Max);
				this.item4GrenadeCount = this.item4Max;
			}
			//smoke
			if (this.item4SmokeCount > this.item4Max) {
				this.throwLootItem(this.player, LootType.Smoke, this.item4SmokeCount - this.item4Max);
				this.item4SmokeCount = this.item4Max;
			}
		} else if (loot.type === LootType.GreenAmmo) {
			//take ammo
			this.greenAmmo += loot.quantity;
			if (this.greenAmmo > this.maxAmmo) {
				const newLootBullets = this.greenAmmo - this.maxAmmo;
				this.greenAmmo = this.maxAmmo;
				//throw loot
				this.throwLootItem(this.player, LootType.GreenAmmo, newLootBullets);
			}
		} else if (loot.type === LootType.RedAmmo) {
			this.redAmmo += loot.quantity;
			if (this.redAmmo > this.maxAmmo) {
				const newLootBullets = this.redAmmo - this.maxAmmo;
				this.redAmmo = this.maxAmmo;
				//throw loot
				this.throwLootItem(this.player, LootType.RedAmmo, newLootBullets);
			}
		} else if (loot.type === LootType.BlueAmmo) {
			this.blueAmmo += loot.quantity;
			if (this.blueAmmo > this.maxAmmo) {
				const newLootBullets = this.blueAmmo - this.maxAmmo;
				this.blueAmmo = this.maxAmmo;
				//throw loot
				this.throwLootItem(this.player, LootType.BlueAmmo, newLootBullets);
			}
		} else if (loot.type === LootType.OrangeAmmo) {
			this.orangeAmmo += loot.quantity;
			if (this.orangeAmmo > this.maxAmmo) {
				const newLootBullets = this.orangeAmmo - this.maxAmmo;
				this.orangeAmmo = this.maxAmmo;
				//throw loot
				this.throwLootItem(this.player, LootType.OrangeAmmo, newLootBullets);
			}
		} else if (loot.type === LootType.Vest) {
			//take vest
			if (this.vest) {
				//throw loot
				this.throwLootItem(this.player, LootType.Vest);
			} else {
				this.vest = true;
			}
		} else if (loot.type === LootType.Medkit) {
			//take medkit
			this.item5 += loot.quantity;
			//throw loot
			if (this.item5 > this.item5Max) {
				const throwCount = this.item5 - this.item5Max;
				this.throwLootItem(this.player, LootType.Medkit, throwCount);
				this.item5 = this.item5Max;
			}
		} else if (loot.type === LootType.Scope2 || loot.type === LootType.Scope4 || loot.type === LootType.Scope6) {
			//take scope
			if (this.scope !== 1) {
				//throw loot
				let scopeType: LootType;
				switch (this.scope) {
					case 2:
						scopeType = LootType.Scope2;
						break;
					case 4:
						scopeType = LootType.Scope4;
						break;
					case 6:
						scopeType = LootType.Scope6;
						break;
				}
				this.throwLootItem(this.player, scopeType);
			}
			switch (loot.type) {
				case LootType.Scope2:
					this.scope = 2;
					break;
				case LootType.Scope4:
					this.scope = 4;
					break;
				case LootType.Scope6:
					this.scope = 6;
					break;
			}
		}
	}

	getActiveItemNumber(): number {
		return this.activeItemNumber;
	}
}
