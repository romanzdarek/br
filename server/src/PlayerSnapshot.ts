import { Player } from './Player';
import Hand from './Hand';
import { Weapon } from './Weapon';
import Pistol from './Pistol';
import Machinegun from './Machinegun';
import Shotgun from './Shotgun';
import Rifle from './Rifle';
import Granade from './Granade';
import Smoke from './Smoke';
import Hammer from './Hammer';

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
	//hammer angle
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
		if (player.inventory.activeItem === Weapon.Granade) this.w = Weapon.Granade;
		if (player.inventory.activeItem === Weapon.Smoke) this.w = Weapon.Smoke;
		if (player.inventory.activeItem === Weapon.Medkit) this.w = Weapon.Medkit;
		if (player.inventory.activeItem instanceof Hammer) {
			this.w = Weapon.Hammer;
			this.m = player.inventory.activeItem.getAngle();
		}

		if ((this.w === Weapon.Granade || this.w === Weapon.Smoke) && !player.hands[1].throwReady()) {
			//hide nate in hand
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
	}
}
