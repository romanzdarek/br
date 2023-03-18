import { ObstacleType } from './ObstacleType';
import RectangleObstacle from './RectangleObstacle';

export default class Block extends RectangleObstacle {
	constructor(id: number, x: number, y: number, width: number, height: number) {
		super(id, x, y, width, height);
		this.type = ObstacleType.Block;
	}
}
