import RoundObstacle from './RoundObstacle';

export default class Bush extends RoundObstacle {
	readonly angle: number;

	constructor(id: number, x: number, y: number, angle: number) {
		const size = 350;
		super(id, x, y, size);
		this.opacity = 1;
		this.healthMax = 200;
		this.health = this.healthMax * this.opacity;
		this.angle = angle;
	}
}
