import { Player } from './Player';
import Hand from './Hand';
import { Weapon } from './Weapon';
import HandSnapshot from './HandSnapshot';

export default class PlayerSnapshot {
	//id
	readonly i: number;
	x: number;
	y: number;
	//angle
	a: number;
	//hands
	h: HandSnapshot[] = [];
	//name
	//readonly n: string;
	//active weapon
	w: Weapon;
	//hammer angle
	m: number = 0;
	size: number;

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
		//this.n = player.name;
		this.w = player.getActiveWeapon();
		if (
			(player.getActiveWeapon() === Weapon.Granade || player.getActiveWeapon() === Weapon.Smoke) &&
			!player.hands[1].throwReady()
		) {
			//hide nate in hand
			this.w = Weapon.Hand;
		}
		for (const hand of player.hands) {
			const x = Math.round(hand.getX() * afterComma) / afterComma;
			const y = Math.round(hand.getY() * afterComma) / afterComma;
			this.h.push(new HandSnapshot(x, y, Hand.size));
		}
		if (player.getActiveWeapon() === Weapon.Hammer) {
			this.m = player.hammer.getAngle();
		}
	}
}
