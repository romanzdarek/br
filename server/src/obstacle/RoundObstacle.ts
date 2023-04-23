import Point from '../Point';
import { ObstacleType } from './ObstacleType';
import RectangleObstacle from './RectangleObstacle';

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
	type: ObstacleType;
	protected fixedPosition: boolean = true;
	collisionPoints: Point[] = [];

	constructor(id: number, x: number, y: number, size: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
		this.calcColisionPoints();
	}

	protected calcColisionPoints(radius?: number) {
		this.collisionPoints = [];
		let _radius = radius ? radius : this.radius;

		let centerX = this.x + this.radius;
		let centerY = this.y + this.radius;

		for (let angle = 0; angle < 360; angle += 10) {
			//triangle
			const hypotenuse = _radius;
			const x = Math.sin((angle * Math.PI) / 180) * hypotenuse;
			const y = Math.cos((angle * Math.PI) / 180) * hypotenuse;
			this.collisionPoints.push(new Point(centerX + x, centerY + y));
		}
	}

	hasFixedPosition() {
		return this.fixedPosition;
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
		// TODO: delete return to enable destroy...
		return;

		if (this.active) {
			this.health -= power;
			this.opacity = Math.round((this.health / this.healthMax) * 10) / 10;
			if (this.opacity <= 0) {
				this.opacity = 0;
				this.active = false;
			}
			this.changed = true;
		}
	}
}
