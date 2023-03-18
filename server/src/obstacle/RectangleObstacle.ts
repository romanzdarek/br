import Point from '../Point';
import { ObstacleType } from './ObstacleType';

export default abstract class RectangleObstacle {
	readonly id: number;
	protected changed: boolean = false;
	x: number;
	y: number;
	protected opacity: number = 1;
	protected health: number;
	protected healthMax: number;
	width: number;
	height: number;
	private active: boolean = true;
	type: ObstacleType;

	constructor(id: number, x: number, y: number, width: number, height: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	getChanged(): boolean {
		return this.changed;
	}

	nullChanged(): void {
		this.changed = false;
	}

	isPointIn(point: Point): boolean {
		const { x, y } = point;
		if (x < this.x + this.width && x >= this.x && y >= this.y && y < this.y + this.height) {
			return true;
		}
		return false;
	}

	getOpacity(): number {
		return this.opacity;
	}

	isActive(): boolean {
		return this.active;
	}

	acceptHit(power: number): void {
		if (this.active) {
			this.health -= power;
			const change = Math.round((this.health / this.healthMax) * 10) / 10;
			this.opacity = change;
			const previousWidth = this.width;
			const previousHeight = this.height;

			this.width *= change;
			this.height *= change;

			this.x += (previousWidth - this.width) / 2;
			this.y += (previousHeight - this.height) / 2;

			if (this.opacity <= 0.5) {
				this.opacity = 0;
				this.active = false;
			}
			this.changed = true;
		}
	}
}
