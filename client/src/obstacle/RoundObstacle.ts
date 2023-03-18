import ObstacleSnapshot from '../ObstacleSnapshot';
import Point from '../Point';
import { ObstacleType } from './ObstacleType';

export default abstract class RoundObstacle {
	readonly id: number;
	protected changed: boolean = false;
	x: number;
	y: number;
	protected opacity: number = 1;
	size: number;
	readonly radius: number;
	private active: boolean = true;
	type: ObstacleType;

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

	update(obstacle: ObstacleSnapshot): void {
		console.log(obstacle);
		this.opacity = obstacle.opacity;
		this.x = obstacle.x;
		this.y = obstacle.y;
		this.size = obstacle.size;
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

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + this.radius - point.x;
		const y = this.y + this.radius - point.y;
		const radius = Math.sqrt(x * x + y * y);
		if (radius <= this.radius) return true;
		return false;
	}

	increaseOpacity(adjustFrameRate: number) {
		this.opacity += 0.01 * adjustFrameRate;
		if (this.opacity > 1) this.opacity = 1;
	}

	decreaseOpacity(adjustFrameRate: number) {
		this.opacity -= 0.02 * adjustFrameRate;
		if (this.opacity < 0.7) this.opacity = 0.7;
	}
}
