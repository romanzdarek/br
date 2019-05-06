import RoundObstacle from './RoundObstacle';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;

	constructor(x: number, y: number) {
		const size = 200;
		super(x, y, size);
		this.treeTrankRadius = 35;
		this.opacity = 0.9;
	}
}
