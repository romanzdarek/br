import RoundObstacle from './roundObstacle';

export default class Bush extends RoundObstacle {
	constructor(x: number, y: number) {
		const size = 100;
		super(x, y, size);
		this.opacity = 0.9;
	}
}
