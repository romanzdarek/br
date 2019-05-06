import RoundObstacle from './RoundObstacle';

export default class Rock extends RoundObstacle {
	constructor(x: number, y: number) {
		const size = 100;
		super(x, y, size);
		this.opacity = 1;
	}
}
