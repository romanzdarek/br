import Point from './Point';

export default abstract class RectangleObstacle {
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	readonly width: number;
	readonly height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	isPointIn(point: Point): boolean {
		const x = point.x;
		const y = point.y;
		if (x <= this.x + this.width && x >= this.x && y >= this.y && y <= this.y + this.height) {
			return true;
		}
		return false;
    }
    
	getOpacity(): number {
		return this.opacity;
	}
}
