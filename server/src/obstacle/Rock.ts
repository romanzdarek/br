import { ObstacleType } from './ObstacleType';
import RoundObstacle from './RoundObstacle';

export default class Rock extends RoundObstacle {
	constructor(id: number, x: number, y: number, size: number) {
		super(id, x, y, size);
		this.opacity = 1;
		this.healthMax = 200;
		this.health = this.healthMax;
		this.type = ObstacleType.Rock;
	}
}
