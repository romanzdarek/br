import RoundObstacle from './RoundObstacle';

export default class Tree extends RoundObstacle {
	readonly treeTrankRadius: number;

	constructor(id: number, x: number, y: number) {
		const size = 200;
		super(id, x, y, size);
		this.treeTrankRadius = 35;
		this.opacity = 0.9;
	}
}
