import Hand from './Hand';
import { Weapon } from './Weapon';
import PlayerSnapshot from './PlayerSnapshot';

export default class Player {
	readonly id: number;
	readonly size: number;
	readonly radius: number;
	private live: boolean = true;
	private x: number;
	private y: number;
	private angle: number;
	private hammerAngle: number;
	readonly hands: Hand[] = [];
	private weapon: Weapon;

	constructor(playerSnapshot: PlayerSnapshot) {
		this.id = playerSnapshot.i;
		this.x = playerSnapshot.x;
		this.y = playerSnapshot.y;
		this.angle = playerSnapshot.a;
		this.hammerAngle = playerSnapshot.m;
		this.weapon = playerSnapshot.w;
		this.size = playerSnapshot.size;
		this.radius = this.size / 2;
		this.hands.push(new Hand(playerSnapshot.lX, playerSnapshot.lY, playerSnapshot.hSize));
		this.hands.push(new Hand(playerSnapshot.rX, playerSnapshot.rY, playerSnapshot.hSize));
	}

	die():void{
		this.live = false;
	}

	alive(): boolean{
		return this.live;
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
