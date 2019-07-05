import { Player } from './Player';
import { Weapon } from './Weapon';

type HandPackage = { x: number; y: number };

export default class PlayerSnapshot {
	readonly x: number;
	readonly y: number;
	//angle
	readonly a: number;
	//hands
	readonly h: HandPackage[] = [];
	//name
	readonly n: string;
	//active weapon
	readonly w: Weapon;
	//hammer angle
	readonly m: number = 0;

	constructor(player: Player) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(player.getX() * afterComma) / afterComma;
		this.y = Math.round(player.getY() * afterComma) / afterComma;
		this.a = player.getAngle();
		this.n = player.name;
		this.w = player.getActiveWeapon();
		if (
			(player.getActiveWeapon() === Weapon.Granade || player.getActiveWeapon() === Weapon.Smoke) &&
			!player.hands[1].throwReady()
		) {
			//hide nate in hand
			this.w = Weapon.Hand;
		}
		for (const hand of player.hands) {
			this.h.push({
				x: Math.round(hand.getX() * afterComma) / afterComma,
				y: Math.round(hand.getY() * afterComma) / afterComma
			});
		}
		if (player.getActiveWeapon() === Weapon.Hammer) {
			this.m = player.hammer.getAngle();
		}
	}
}
