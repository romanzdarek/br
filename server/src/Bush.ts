import RoundObstacle from './RoundObstacle';

export default class Bush extends RoundObstacle {
	constructor(id: number, x: number, y: number) {
		const size = 100;
		super(id, x, y, size);
		this.opacity = 0.9;
		this.healthMax = 200;
		this.health = this.healthMax * this.opacity;
	}
}
