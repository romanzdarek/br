import RoundObstacle from './RoundObstacle';

export default class Bush extends RoundObstacle {
	readonly angle: number;

	constructor(id: number, x: number, y: number, angle: number) {
		const size = 350;
		super(id, x, y, size);
		//this.opacity = 1;
		this.angle = angle;
	}
}
