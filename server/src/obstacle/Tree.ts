import RoundObstacle from './RoundObstacle';
import Point from '../Point';
import { ObstacleType } from './ObstacleType';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;
	readonly angle: number;

	constructor(id: number, x: number, y: number, size: number, angle: number) {
		super(id, x, y, size);
		const defaultSize = 500;
		const changeSizeRatio = size / defaultSize;

		this.treeTrankRadius = 38 * changeSizeRatio;
		this.opacity = 1;
		this.healthMax = 200;
		this.health = this.healthMax * this.opacity;
		this.angle = angle;
		this.type = ObstacleType.Tree;
		this.calcColisionPoints(this.treeTrankRadius);
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
