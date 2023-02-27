import RoundObstacle from './RoundObstacle';
import Point from './Point';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;
	readonly angle: number;

	constructor(id: number, x: number, y: number, angle: number) {
		const size = 500;
		super(id, x, y, size);
		this.treeTrankRadius = 38.5;
		this.opacity = 1;
		this.healthMax = 200;
		this.health = this.healthMax * this.opacity;
		this.angle = angle;
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + this.radius - point.x;
		const y = this.y + this.radius - point.y;
		const radius = Math.sqrt(x * x + y * y);
		//tree trank hit
		if (radius <= this.treeTrankRadius) return true;
		return false;
	}
}
