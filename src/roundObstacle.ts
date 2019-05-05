import Point from './point';

export default abstract class RoundObstacle {
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	readonly size: number;
	readonly radius: number;
	private active: boolean = true;

	constructor(x: number, y: number, size: number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + this.radius - point.getX();
		const y = this.y + this.radius - point.getY();
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

	getActive(): boolean {
		return this.active;
	}

	acceptHit(): void {
		if (this.opacity > 0.1) this.opacity -= 0.1;
		if (this.opacity < 0.1) {
			this.active = false;
		}
	}
}
