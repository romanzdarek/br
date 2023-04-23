import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import { ObstacleType } from './ObstacleType';

export default class ObstacleSnapshot {
	id: number;
	opacity: number;
	type: ObstacleType;
	x: number;
	y: number;
	width?: number;
	height?: number;
	size?: number;

	constructor(obstacle: RoundObstacle | RectangleObstacle) {
		this.id = obstacle.id;
		this.opacity = obstacle.getOpacity();
		this.type = obstacle.type;

		this.x = obstacle.x;
		this.y = obstacle.y;

		if (obstacle instanceof RectangleObstacle) {
			this.width = obstacle.width;
			this.height = obstacle.height;
		} else {
			this.size = obstacle.size;
		}
	}
}
