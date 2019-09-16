import { Player } from './Player';
import { Weapon } from './Weapon';
import Pistol from './Pistol';
import Machinegun from './Machinegun';
import Shotgun from './Shotgun';
import Rifle from './Rifle';
import Hammer from './Hammer';
import Gun from './Gun';

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

		if (player.inventory.item3 instanceof Hammer) this.i3 = Weapon.Hammer;
		else this.i3 = Weapon.Hand;

		this.s4 = 0;
		this.i4 = Weapon.Empty;
		if (player.inventory.item4 === Weapon.Granade) {
			this.i4 = Weapon.Granade;
			this.s4 = player.inventory.item4GranadeCount;
		}
		else if (player.inventory.item4 === Weapon.Smoke) {
			this.i4 = Weapon.Smoke;
			this.s4 = player.inventory.item4SmokeCount;
		}

		if (player.inventory.item5) {
			this.i5 = Weapon.Medkit;
			this.s5 = player.inventory.item5;
		}
		else {
			this.i5 = Weapon.Empty;
			this.s5 = 0;
		}

		//ammo
		this.r = player.inventory.redAmmo;
		this.g = player.inventory.greenAmmo;
		this.b = player.inventory.blueAmmo;
		this.o = player.inventory.orangeAmmo;

		//active weapon ammo
		if (player.inventory.activeItem instanceof Gun) {
			this.a = player.inventory.activeItem.getBullets();
			this.aM = player.inventory.activeItem.bulletsMax;
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
