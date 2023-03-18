import { ObstacleType } from './ObstacleType';
import RoundObstacle from './RoundObstacle';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;
	readonly angle: number;

	constructor(id: number, x: number, y: number, size: number, angle: number) {
		super(id, x, y, size);

		const defaultSize = 500;
		const change = defaultSize / size;

		this.treeTrankRadius = 35 / change;
		//this.opacity = 1;
		this.angle = angle;
		this.type = ObstacleType.Tree;
	}
}
