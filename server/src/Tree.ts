import RoundObstacle from './RoundObstacle';
import Point from './Point';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;

	constructor(id: number, x: number, y: number) {
		const size = 200;
		super(id, x, y, size);
		this.treeTrankRadius = 35;
		this.opacity = 0.9;
		this.healthMax = 200;
		this.health = this.healthMax * this.opacity;
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
