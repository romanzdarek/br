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

export default class Inventory {
	private player: Player;
	private loot: Loot;
	private hammer: Hammer;
	item1: Gun | null = null;
	item2: Gun | null = null;
	item3: any = Weapon.Hand;
	private item33: any = null;
	item4: Weapon[] = [];
	private item4Max: number = 3;
	item5: number = 0;
	private item5Max: number = 3;

	activeItem: any = this.item3;

	redAmmo: number = 0;
	blueAmmo: number = 0;
	greenAmmo: number = 0;
	orangeAmmo: number = 0;

	vest: boolean = false;
	scope: number = 0;

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

	throwNade(): void {
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
				if (this.item1) this.activeItem = this.item1;
				break;
			case 2:
				if (this.item2) this.activeItem = this.item2;
				break;
			case 3:
				if (this.activeItem instanceof Hammer || this.activeItem === Weapon.Hand) {
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
					if (this.activeItem === Weapon.Smoke || this.activeItem === Weapon.Granade) {
						this.sortNades(this.item4[this.item4.length - 1]);
					}
					this.activeItem = this.item4[0];
				}

				break;
			case 5:
				if (this.item5 > 0) this.activeItem = Weapon.Medkit;
				break;
		}
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
					gun = new Pistol(loot.bullets);
					break;
				case LootType.Machinegun:
					gun = new Machinegun(loot.bullets);
					break;
				case LootType.Shotgun:
					gun = new Shotgun(loot.bullets);
					break;
				case LootType.Rifle:
					gun = new Rifle(loot.bullets);
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
					this.loot.createLootItem(this.player.getX(), this.player.getY(), lootType, bulletsInGun);
				}
				if (this.item2 === null) {
					itemPosition = 2;
				}
				if (this.item1 === null) {
					itemPosition = 1;
				}
				if (itemPosition === 1) this.item1 = gun;
				if (itemPosition === 2) this.item2 = gun;
				this.activeItem = gun;
			}
		}

		//take hammer
		if (loot.type === LootType.Hammer) {
			//throw hammer
			if (this.item3 instanceof Hammer || this.item33 instanceof Hammer) {
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.Hammer);
			}
			this.item3 = this.hammer;
			this.item33 = Weapon.Hand;
			this.activeItem = this.item3;
		}

		//take granades & smokes
		if (this.item4.length < this.item4Max) {
			if (loot.type === LootType.Granade) {
				this.item4.push(Weapon.Granade);
				this.sortNades(Weapon.Granade);
				this.activeItem = this.item4[0];
			}
			if (loot.type === LootType.Smoke) {
				this.item4.push(Weapon.Smoke);
				this.sortNades(Weapon.Smoke);
				this.activeItem = this.item4[0];
			}
		}
		else {
			this.loot.createLootItem(this.player.getX(), this.player.getY(), loot.type);
		}

		//take ammo
		if (loot.type === LootType.GreenAmmo) {
			this.greenAmmo += loot.bullets;
			if (this.greenAmmo > this.maxAmmo) {
				const newLootBullets = this.greenAmmo - this.maxAmmo;
				this.greenAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.GreenAmmo, newLootBullets);
			}
		}
		if (loot.type === LootType.RedAmmo) {
			this.redAmmo += loot.bullets;
			if (this.redAmmo > this.maxAmmo) {
				const newLootBullets = this.redAmmo - this.maxAmmo;
				this.redAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.RedAmmo, newLootBullets);
			}
		}
		if (loot.type === LootType.BlueAmmo) {
			this.blueAmmo += loot.bullets;
			if (this.blueAmmo > this.maxAmmo) {
				const newLootBullets = this.blueAmmo - this.maxAmmo;
				this.blueAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.BlueAmmo, newLootBullets);
			}
		}
		if (loot.type === LootType.OrangeAmmo) {
			this.orangeAmmo += loot.bullets;
			if (this.orangeAmmo > this.maxAmmo) {
				const newLootBullets = this.orangeAmmo - this.maxAmmo;
				this.orangeAmmo = this.maxAmmo;
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.OrangeAmmo, newLootBullets);
			}
		}
		//take vest
		if (loot.type === LootType.Vest) {
			if (this.vest) {
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.Vest);
			}
			else {
				this.vest = true;
			}
		}
		//take medkit
		if (loot.type === LootType.Medkit) {
			if (this.item5 < this.item5Max) {
				this.item5++;
			}
			else {
				//throw loot
				this.loot.createLootItem(this.player.getX(), this.player.getY(), LootType.Medkit);
			}
		}
		//take scope
		if (loot.type === LootType.Scope2 || loot.type === LootType.Scope4 || loot.type === LootType.Scope6) {
			if (this.scope !== 0) {
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
				this.loot.createLootItem(this.player.getX(), this.player.getY(), scopeType);
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
}
