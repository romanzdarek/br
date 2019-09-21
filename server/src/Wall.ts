import RectangleObstacle from './RectangleObstacle';

export default class Wall extends RectangleObstacle {
	constructor(id: number, x: number, y: number, width: number, height: number) {
		super(id, x, y, width, height);
		this.healthMax = 200;
		this.health = this.healthMax;
	}
}
