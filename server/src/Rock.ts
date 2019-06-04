import RoundObstacle from './RoundObstacle';

export default class Rock extends RoundObstacle {
	constructor(id: number,x: number, y: number) {
		const size = 100;
		super(id, x, y, size);
		this.opacity = 1;
	}
}
