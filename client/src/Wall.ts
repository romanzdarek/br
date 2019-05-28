import RectangleObstacle from './RectangleObstacle';

export default class Wall extends RectangleObstacle {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}
}
