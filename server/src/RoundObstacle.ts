import Point from './Point';

export default abstract class RoundObstacle {
	readonly id: number;
	protected changed: boolean = false;
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	protected health: number;
	protected healthMax: number;
	readonly size: number;
	readonly radius: number;
	private active: boolean = true;

	constructor(id: number, x: number, y: number, size: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
	}

	getChanged(): boolean {
		return this.changed;
	}

	nullChanged(): void {
		this.changed = false;
	}

	getChangedData(): any {
		return { id: this.id, opacity: this.opacity };
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + this.radius - point.x;
		const y = this.y + this.radius - point.y;
		const radius = Math.sqrt(x * x + y * y);
		if (radius <= this.radius) return true;
		return false;
	}

	getCenterX(): number {
		return this.x + this.size / 2;
	}

	getCenterY(): number {
		return this.y + this.size / 2;
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
