import Map from './Map';
import Point from './Point';
import { Player } from './Player';

export default class Bullet {
	readonly size: number = 5;
	readonly range: number;
	private x: number = 0;
	private y: number = 0;
	private angle: number = 0;
	private shiftX: number = 0;
	private shiftY: number = 0;
	private distance: number = 0;
	private active: boolean = true;

	constructor(x: number, y: number, angle: number, range: number) {
		this.x = x - this.size / 2;
		this.y = y - this.size / 2;
		this.angle = angle;
		this.range = range;
		//triangle
		const bulletSpeed = 30;
		this.shiftX = Math.sin(angle * Math.PI / 180) * bulletSpeed;
		this.shiftY = Math.cos(angle * Math.PI / 180) * bulletSpeed;

		//start shift
		const bulletStartShift = 1.5;
		this.x += this.shiftX * bulletStartShift;
		this.y -= this.shiftY * bulletStartShift;
	}

	move(map: Map, players: Player[]): void {
		if (!this.collisions(map, players)) {
			this.x += this.shiftX;
			this.y -= this.shiftY;
		}
	}

	private collisions(map: Map, players: Player[]): boolean {
		const bulletPoint = new Point(this.getCenterX(), this.getCenterY());
		//rounds
		if (this.active) {
			for (const obstacle of map.impassableRoundObstacles) {
				if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
					obstacle.acceptHit(bulletPoint);
					this.active = false;
					return true;
				}
			}
		}
		//rects
		if (this.active) {
			for (const obstacle of map.rectangleObstacles) {
				if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
					obstacle.acceptHit();
					this.active = false;
					return true;
				}
			}
		}
		//players
		if (this.active) {
			for (const player of players) {
				if (player.isActive() && player.isPointIn(bulletPoint)) {
					player.acceptHit(1);
					if (!player.isActive()) player.die();
					this.active = false;
					return true;
				}
			}
		}
		return false;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getCenterX(): number {
		return this.x + this.size / 2;
	}

	getCenterY(): number {
		return this.y + this.size / 2;
	}

	getAngle(): number {
		return this.angle;
	}

	flying(): boolean {
		let state = true;
		this.distance++;
		if (this.distance > this.range) state = false;
		if (!this.active) state = false;
		return state;
	}
}
