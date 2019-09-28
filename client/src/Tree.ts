import RoundObstacle from './RoundObstacle';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;
	readonly angle: number;

	constructor(id: number, x: number, y: number, angle: number) {
		const size = 500;
		super(id, x, y, size);
		this.treeTrankRadius = 35;
		//this.opacity = 1;
		this.angle = angle;
	}
}
