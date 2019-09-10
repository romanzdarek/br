import { Weapon } from './Weapon';
import Gun from './Gun';
import Hammer from './Hammer';
import Granade from './Granade';
import ThrowingObject from './ThrowingObject';
import Loot from './Loot';
import { LootType } from './LootType';
import Pistol from './Pistol';
import { Player } from './Player';
import Machinegun from './Machinegun';
import Shotgun from './Shotgun';
import Rifle from './Rifle';
import LootItem from './LootItem';
import Point from './Point';

export default class Inventory {
	private player: Player;
	private loot: Loot;
	private hammer: Hammer;
	private activeItemNumber: number = 3;
	item1: Gun | null = null;
	item2: Gun | null = null;
	item3: any = Weapon.Hand;
	private item33: any = null;
	item4: Weapon.Granade | Weapon.Smoke | null = null;
	item4GranadeCount: number = 0;
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

	private maxAmmo: number = 100;

	loadingStart: number = 0;
	loadingNow: number = 0;
	loadingEnd: number = 0;
	loadingText: string = '';
	private loadingItem: any;

	constructor(player: Player, loot: Loot, hammer: Hammer) {
		this.player = player;
		this.loot = loot;
		this.hammer = hammer;
	}
	ready(): boolean {
		return this.loadingStart === 0;
	}

	loading(): void {
		if (this.ready()) return;
		if (this.loadingNow < this.loadingEnd) {
			this.loadingNow = Date.now();
		}
		else {
			if (this.loadingItem instanceof Gun) {
				this.finalReload(this.loadingItem);
				this.cancelLoading();
			}
			else if (this.loadingItem === Weapon.Medkit) {
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
		if (gun.getBullets() < gun.bulletsMax) {
			if (gun instanceof Pistol && this.orangeAmmo > 0) {
				reload = true;
			}
			else if (gun instanceof Machinegun && this.blueAmmo > 0) {
				reload = true;
			}
			else if (gun instanceof Shotgun && this.redAmmo > 0) {
				reload = true;
			}
			else if (gun instanceof Rifle && this.greenAmmo > 0) {
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
			}
			else {
				bullets = this.orangeAmmo;
			}
			if (bullets > 0) {
				gun.reload(bullets);
				this.orangeAmmo -= bullets;
			}
		}
		else if (gun instanceof Machinegun) {
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
		else if (gun instanceof Shotgun) {
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
		else if (gun instanceof Rifle) {
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

	throwNade(): void {
		if (this.activeItem === Weapon.Granade) this.item4GranadeCount--;
		else if (this.activeItem === Weapon.Smoke) this.item4SmokeCount--;

		if (this.activeItem === Weapon.Granade && this.item4GranadeCount === 0 && this.item4SmokeCount > 0) {
			this.activeItem = Weapon.Smoke;
			this.item4 = this.activeItem;
		}
		else if (this.activeItem === Weapon.Smoke && this.item4SmokeCount === 0 && this.item4GranadeCount > 0) {
			this.activeItem = Weapon.Granade;
			this.item4 = this.activeItem;
		}
		else if (this.item4SmokeCount === 0 && this.item4GranadeCount === 0) {
			this.item4 = null;
			//hnad
			if (this.item3 !== Weapon.Hand) {
				this.activeItem = this.item3;
			}
			this.changeActiveItem(3);
		}
	}

	private cancelLoading(): void {
		this.loadingStart = 0;
		this.loadingEnd = 0;
		this.loadingNow = 0;
	}

	changeActiveItem(item: number): void {
		if (!this.ready()) return;
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
				if (this.activeItem instanceof Hammer || this.activeItem === Weapon.Hand) {
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
					if (this.activeItem === Weapon.Smoke || this.activeItem === Weapon.Granade) {
						if (this.activeItem === Weapon.Smoke && this.item4GranadeCount)
							this.activeItem = Weapon.Granade;
						else if (this.activeItem === Weapon.Granade && this.item4SmokeCount)
							this.activeItem = Weapon.Smoke;

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

	private throwLootPosition(angle: number, playerCenterX: number, playerCenterY: number): Point {
		const shiftZ = Math.floor(Math.random() * 40);
		//xyz tringle
		let shiftX = Math.sin(angle * Math.PI / 180) * shiftZ;
		let shiftY = Math.cos(angle * Math.PI / 180) * shiftZ;
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
		this.item4GranadeCount = 0;
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
		//hammer
		if (this.item3 instanceof Hammer || this.item33 instanceof Hammer) lootCount++;
		//nates
		if (this.item4GranadeCount) lootCount++;
		if (this.item4SmokeCount) lootCount++;
		//medkits
		if (this.item5) lootCount++;

		//shift
		const shiftAngle = Math.floor(360 / lootCount);
		let shiftMultiple = 0;
		//create loots
		//ammo
		if (this.blueAmmo) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.BlueAmmo, this.blueAmmo);
		}

		if (this.redAmmo) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.RedAmmo, this.redAmmo);
		}
		if (this.greenAmmo) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.GreenAmmo, this.blueAmmo);
		}
		if (this.orangeAmmo) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.OrangeAmmo, this.orangeAmmo);
		}
		//items
		if (this.vest) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.Vest);
		}
		if (this.scope > 1) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			if (this.scope === 2) this.loot.createLootItem(x, y, LootType.Scope2);
			else if (this.scope === 4) this.loot.createLootItem(x, y, LootType.Scope4);
			else if (this.scope === 6) this.loot.createLootItem(x, y, LootType.Scope6);
		}
		//guns
		if (this.item1 instanceof Gun) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			if (this.item1 instanceof Pistol) this.loot.createLootItem(x, y, LootType.Pistol, this.item1.getBullets());
			else if (this.item1 instanceof Rifle)
				this.loot.createLootItem(x, y, LootType.Rifle, this.item1.getBullets());
			else if (this.item1 instanceof Shotgun)
				this.loot.createLootItem(x, y, LootType.Shotgun, this.item1.getBullets());
			else if (this.item1 instanceof Machinegun)
				this.loot.createLootItem(x, y, LootType.Machinegun, this.item1.getBullets());
		}
		if (this.item2 instanceof Gun) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			if (this.item2 instanceof Pistol) this.loot.createLootItem(x, y, LootType.Pistol, this.item2.getBullets());
			else if (this.item2 instanceof Rifle)
				this.loot.createLootItem(x, y, LootType.Rifle, this.item2.getBullets());
			else if (this.item2 instanceof Shotgun)
				this.loot.createLootItem(x, y, LootType.Shotgun, this.item2.getBullets());
			else if (this.item2 instanceof Machinegun)
				this.loot.createLootItem(x, y, LootType.Machinegun, this.item2.getBullets());
		}
		//hammer
		if (this.item3 instanceof Hammer || this.item33 instanceof Hammer) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.Hammer);
		}
		//smoke
		if (this.item4SmokeCount) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.Smoke, this.item4SmokeCount);
		}
		//granade
		if (this.item4GranadeCount) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.Granade, this.item4GranadeCount);
		}

		//medkits
		if (this.item5) {
			const { x, y } = this.throwLootPosition(
				shiftAngle * ++shiftMultiple,
				this.player.getCenterX(),
				this.player.getCenterY()
			);
			this.loot.createLootItem(x, y, LootType.Medkit, this.item5);
		}

		this.clear();
	}

	take(loot: LootItem): void {
		//take guns
		if (
			loot.type === LootType.Pistol ||
			loot.type === LootType.Machinegun ||
			loot.type === LootType.Shotgun ||
			loot.type === LootType.Rifle
		) {
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
						if (this.item1 instanceof Pistol) lootType = LootType.Pistol;
						if (this.item1 instanceof Machinegun) lootType = LootType.Machinegun;
						if (this.item1 instanceof Shotgun) lootType = LootType.Shotgun;
						if (this.item1 instanceof Rifle) lootType = LootType.Rifle;
					}
					if (itemPosition === 2) {
						bulletsInGun = this.item2.getBullets();
						if (this.item2 instanceof Pistol) lootType = LootType.Pistol;
						if (this.item2 instanceof Machinegun) lootType = LootType.Machinegun;
						if (this.item2 instanceof Shotgun) lootType = LootType.Shotgun;
						if (this.item2 instanceof Rifle) lootType = LootType.Rifle;
					}
					this.loot.createLootItem(
						this.player.getCenterX(),
						this.player.getCenterY(),
						lootType,
						bulletsInGun
					);
				}
				if (this.item2 === null) {
					itemPosition = 2;
				}
				if (this.item1 === null) {
					itemPosition = 1;
				}
				if (itemPosition === 1){
					this.item1 = gun;
					this.activeItemNumber = 1;
				} 
				if (itemPosition === 2){
					this.item2 = gun;
					this.activeItemNumber = 2;
				} 
				this.activeItem = gun;
			}
		}
		else if (loot.type === LootType.Hammer) {
			//take hammer
			//throw hammer
			if (this.item3 instanceof Hammer || this.item33 instanceof Hammer) {
				this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType.Hammer);
			}
			this.item3 = this.hammer;
			this.item33 = Weapon.Hand;
			this.activeItem = this.item3;
			this.activeItemNumber = 3;
		}
		else if (loot.type === LootType.Granade || loot.type === LootType.Smoke) {
			//take granades & smokes
			if (loot.type === LootType.Granade) {
				this.item4GranadeCount += loot.quantity;
				this.item4 = Weapon.Granade;
				this.activeItem = this.item4;
			}
			else if (loot.type === LootType.Smoke) {
				this.item4SmokeCount += loot.quantity;
				this.item4 = Weapon.Smoke;
				this.activeItem = this.item4;
				this.activeItemNumber = 4;
			}
			//throw
			//granade
			if (this.item4GranadeCount > this.item4Max) {
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.Granade,
					this.item4GranadeCount - this.item4Max
				);
				this.item4GranadeCount = this.item4Max;
			}
			//smoke
			if (this.item4SmokeCount > this.item4Max) {
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.Smoke,
					this.item4SmokeCount - this.item4Max
				);
				this.item4SmokeCount = this.item4Max;
			}
		}
		else if (loot.type === LootType.GreenAmmo) {
			//take ammo
			this.greenAmmo += loot.quantity;
			if (this.greenAmmo > this.maxAmmo) {
				const newLootBullets = this.greenAmmo - this.maxAmmo;
				this.greenAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.GreenAmmo,
					newLootBullets
				);
			}
		}
		else if (loot.type === LootType.RedAmmo) {
			this.redAmmo += loot.quantity;
			if (this.redAmmo > this.maxAmmo) {
				const newLootBullets = this.redAmmo - this.maxAmmo;
				this.redAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.RedAmmo,
					newLootBullets
				);
			}
		}
		else if (loot.type === LootType.BlueAmmo) {
			this.blueAmmo += loot.quantity;
			if (this.blueAmmo > this.maxAmmo) {
				const newLootBullets = this.blueAmmo - this.maxAmmo;
				this.blueAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.BlueAmmo,
					newLootBullets
				);
			}
		}
		else if (loot.type === LootType.OrangeAmmo) {
			this.orangeAmmo += loot.quantity;
			if (this.orangeAmmo > this.maxAmmo) {
				const newLootBullets = this.orangeAmmo - this.maxAmmo;
				this.orangeAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.OrangeAmmo,
					newLootBullets
				);
			}
		}
		else if (loot.type === LootType.Vest) {
			//take vest
			if (this.vest) {
				//throw loot
				this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), LootType.Vest);
			}
			else {
				this.vest = true;
			}
		}
		else if (loot.type === LootType.Medkit) {
			//take medkit
			this.item5 += loot.quantity;
			//throw loot
			if (this.item5 > this.item5Max) {
				const throwCount = this.item5 - this.item5Max;
				this.loot.createLootItem(
					this.player.getCenterX(),
					this.player.getCenterY(),
					LootType.Medkit,
					throwCount
				);
				this.item5 = this.item5Max;
			}
		}
		else if (loot.type === LootType.Scope2 || loot.type === LootType.Scope4 || loot.type === LootType.Scope6) {
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
				this.loot.createLootItem(this.player.getCenterX(), this.player.getCenterY(), scopeType);
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
