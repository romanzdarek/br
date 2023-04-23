import { Player } from './Player';
import { Weapon } from '../weapon/Weapon';
import Pistol from '../weapon/Pistol';
import Machinegun from '../weapon/Machinegun';
import Shotgun from '../weapon/Shotgun';
import Rifle from '../weapon/Rifle';
import Gun from '../weapon/Gun';
import Sword from '../weapon/Sword';
import Mace from '../weapon/Mace';
import Halberd from '../weapon/Halberd';

export default class MyPlayerSnapshot {
	id: number;
	//health
	h: number;
	//inventory
	i1: Weapon;
	i2: Weapon;
	i3: Weapon;
	i4: Weapon;
	i5: Weapon;
	//suma
	s4: number;
	s5: number;
	//active item
	ai: number;
	//bullets
	r: number;
	g: number;
	b: number;
	o: number;
	//active weapon
	//ammmo in mag
	a?: number;
	//max ammo in mag
	aM?: number;
	//scope
	s: number;
	//vest
	v: number;
	//loading
	l: number;
	lE: number;
	lT: string;
	//spectacting
	spectate: number = -1;
	spectateName: string = '';

	constructor(player: Player) {
		this.id = player.id;
		this.h = player.getHealth();
		if (player.inventory.item1 instanceof Pistol) this.i1 = Weapon.Pistol;
		else if (player.inventory.item1 instanceof Machinegun) this.i1 = Weapon.Machinegun;
		else if (player.inventory.item1 instanceof Shotgun) this.i1 = Weapon.Shotgun;
		else if (player.inventory.item1 instanceof Rifle) this.i1 = Weapon.Rifle;
		else this.i1 = Weapon.Empty;

		if (player.inventory.item2 instanceof Pistol) this.i2 = Weapon.Pistol;
		else if (player.inventory.item2 instanceof Machinegun) this.i2 = Weapon.Machinegun;
		else if (player.inventory.item2 instanceof Shotgun) this.i2 = Weapon.Shotgun;
		else if (player.inventory.item2 instanceof Rifle) this.i2 = Weapon.Rifle;
		else this.i2 = Weapon.Empty;

		if (player.inventory.item3 instanceof Halberd) this.i3 = Weapon.Halberd;
		else if (player.inventory.item3 instanceof Sword) this.i3 = Weapon.Sword;
		else if (player.inventory.item3 instanceof Mace) this.i3 = Weapon.Mace;
		else this.i3 = Weapon.Hand;

		this.s4 = 0;
		this.i4 = Weapon.Empty;
		if (player.inventory.item4 === Weapon.Grenade) {
			this.i4 = Weapon.Grenade;
			this.s4 = player.inventory.item4GrenadeCount;
		} else if (player.inventory.item4 === Weapon.Smoke) {
			this.i4 = Weapon.Smoke;
			this.s4 = player.inventory.item4SmokeCount;
		}

		if (player.inventory.item5) {
			this.i5 = Weapon.Medkit;
			this.s5 = player.inventory.item5;
		} else {
			this.i5 = Weapon.Empty;
			this.s5 = 0;
		}

		//ammo
		this.r = player.inventory.redAmmo;
		this.g = player.inventory.greenAmmo;
		this.b = player.inventory.blueAmmo;
		this.o = player.inventory.orangeAmmo;

		//weapon ammo
		if (player.inventory.activeItem instanceof Gun) {
			this.a = player.inventory.activeItem.getBullets();
			//this.aM = player.inventory.activeItem.bulletsMax;
		}

		this.s = player.inventory.scope;

		this.v = 0;
		if (player.inventory.vest) this.v = 1;

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
