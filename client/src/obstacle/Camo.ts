import { ObstacleType } from './ObstacleType';
import RectangleObstacle from './RectangleObstacle';

export default class Camo extends RectangleObstacle {
	readonly angle: number;
	constructor(id: number, x: number, y: number, width: number, height: number) {
		super(id, x, y, width, height);
		this.type = ObstacleType.Camo;
		this.angle = Math.floor(Math.random() * 4) * 90;
	}
}
