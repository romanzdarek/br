import { Player } from './Player';
import Hand from './Hand';
import { Weapon } from '../weapon/Weapon';
import Pistol from '../weapon/Pistol';
import Machinegun from '../weapon/Machinegun';
import Shotgun from '../weapon/Shotgun';
import Rifle from '../weapon/Rifle';
import Sword from '../weapon/Sword';
import Mace from '../weapon/Mace';
import Halberd from '../weapon/Halberd';

export default class PlayerSnapshot {
	//id
	readonly i: number;
	x: number;
	y: number;
	//live
	l: number;
	//angle
	a: number;
	//active weapon
	w: Weapon;
	//weapon angle
	m: number = 0;
	size: number;

	//hand have beeen activated...
	h?: number;
	//left hand
	lX: number;
	lY: number;
	//right hand
	rX: number;
	rY: number;
	//hand size
	hSize: number;
	//damageTaken
	d?: number;
	//vest
	v?: number;

	constructor(player: Player) {
		this.i = player.id;
		this.size = Player.size;
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(player.getX() * afterComma) / afterComma;
		this.y = Math.round(player.getY() * afterComma) / afterComma;
		this.a = player.getAngle();

		this.l = 1;
		if (!player.isActive()) this.l = 0;

		if (player.inventory.activeItem === Weapon.Hand) this.w = Weapon.Hand;
		if (player.inventory.activeItem instanceof Pistol) this.w = Weapon.Pistol;
		if (player.inventory.activeItem instanceof Machinegun) this.w = Weapon.Machinegun;
		if (player.inventory.activeItem instanceof Shotgun) this.w = Weapon.Shotgun;
		if (player.inventory.activeItem instanceof Rifle) this.w = Weapon.Rifle;
		if (player.inventory.activeItem === Weapon.Grenade) this.w = Weapon.Grenade;
		if (player.inventory.activeItem === Weapon.Smoke) this.w = Weapon.Smoke;
		if (player.inventory.activeItem === Weapon.Medkit) this.w = Weapon.Medkit;
		if (player.inventory.activeItem instanceof Halberd) {
			this.w = Weapon.Halberd;
			this.m = player.inventory.activeItem.getAngle();
		}
		if (player.inventory.activeItem instanceof Sword) {
			this.w = Weapon.Sword;
			this.m = player.inventory.activeItem.getAngle();
		}
		if (player.inventory.activeItem instanceof Mace) {
			this.w = Weapon.Mace;
			this.m = player.inventory.activeItem.getAngle();
		}

		if ((this.w === Weapon.Grenade || this.w === Weapon.Smoke) && !player.hands[1].throwReady()) {
			//hide nade in hand
			this.w = Weapon.Hand;
		}

		this.hSize = Hand.size;
		this.lX = Math.round(player.hands[0].getX() * afterComma) / afterComma;
		this.lY = Math.round(player.hands[0].getY() * afterComma) / afterComma;
		this.rX = Math.round(player.hands[1].getX() * afterComma) / afterComma;
		this.rY = Math.round(player.hands[1].getY() * afterComma) / afterComma;

		if (player.getDamageTaken() >= 5) {
			this.d = player.getDamageTaken();
			player.nullDamageTaken();
		}

		if (player.inventory.vest) this.v = 1;
		else this.v = 0;
	}
}
