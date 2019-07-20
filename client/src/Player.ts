import Hand from './Hand';
import HandSnapshot from './HandSnapshot';
import { Weapon } from './Weapon';

export default class Player {
	readonly id: number;
	readonly size: number;
	private radius: number;
	private x: number;
	private y: number;
	private angle: number;
	private hammerAngle: number;
	readonly hands: Hand[] = [];
	private weapon: Weapon;

	constructor(id: number, x: number, y: number, angle: number, hammerAngle: number, size: number, hands: HandSnapshot[], weapon: Weapon) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.hammerAngle = hammerAngle;
		this.weapon = weapon;
		this.size = size;
		this.radius = size / 2;
		for (const hand of hands) {
			this.hands.push(new Hand(hand.x, hand.y, hand.size));
		}
	}

	setX(x: number): void {
		this.x = x;
	}

	setY(y: number): void {
		this.y = y;
	}

	setAngle(angle: number): void {
		this.angle = angle;
	}

	setHammerAngle(hammerAngle: number): void {
		this.hammerAngle = hammerAngle;
	}

	setWeapon(weapon: Weapon): void {
		this.weapon = weapon;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getAngle(): number {
		return this.angle;
	}

	getHammerAngle(): number {
		return this.hammerAngle;
	}

	getWeapon(): Weapon {
		return this.weapon;
	}

	getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
		return this.y + this.radius;
	}
}
