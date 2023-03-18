import { ObstacleType } from './ObstacleType';
import RoundObstacle from './RoundObstacle';

export default class Bush extends RoundObstacle {
	readonly angle: number;

	constructor(id: number, x: number, y: number, size: number, angle: number) {
		super(id, x, y, size);
		//this.opacity = 1;
		this.angle = angle;
		this.type = ObstacleType.Bush;
	}
}
