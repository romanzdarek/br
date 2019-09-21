import Point from './Point';

export default abstract class RectangleObstacle {
	readonly id: number;
	protected changed: boolean = false;
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	protected health: number;
	protected healthMax: number;
	readonly width: number;
	readonly height: number;
	private active: boolean = true;

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

	/*
	getChangedData(): any {
		return { id: this.id, opacity: this.opacity };
	}
	*/

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
			this.opacity = Math.round(this.health / this.healthMax * 10) / 10;
			if (this.opacity <= 0) {
				this.opacity = 0;
				this.active = false;
			}
			this.changed = true;
		}
	}
}
