import { ObstacleType } from './ObstacleType';
import RoundObstacle from './RoundObstacle';

export default class Rock extends RoundObstacle {
	readonly angle: number;
	constructor(id: number, x: number, y: number, size: number) {
		super(id, x, y, size);
		this.opacity = 1;
		this.angle = Math.floor(Math.random() * 360);
		this.type = ObstacleType.Rock;
	}
}
