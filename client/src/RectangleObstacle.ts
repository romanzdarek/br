import Point from './Point';

export default abstract class RectangleObstacle {
	readonly id: number;
	protected changed: boolean = false;
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
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

	getChangedData(): any {
		return { id: this.id, opacity: this.opacity };
	}

	update(opacity: number): void {
		this.opacity = opacity;
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

	acceptHit(): void {
		if (this.active) {
			if (this.opacity > 0.1) this.opacity -= 0.1;
			if (this.opacity < 0.1) {
				this.active = false;
			}
			this.changed = true;
		}
	}
}
