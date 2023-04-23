import { ObstacleType } from './ObstacleType';
import RectangleObstacle from './RectangleObstacle';

export default class Camo extends RectangleObstacle {
	readonly angle: number;
	constructor(id: number, x: number, y: number, width: number, height: number, angle = 0) {
		super(id, x, y, width, height);
		this.healthMax = 200;
		this.health = this.healthMax;
		this.type = ObstacleType.Camo;
		this.angle = angle;
	}

	acceptHit(power: number): void {}
}
