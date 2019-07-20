export default class Hand {
	readonly size: number;
	readonly radius: number;
	private x: number;
	private y: number;

	constructor(x: number, y: number, size: number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
	}

	setX(x: number): void {
		this.x = x;
	}

	setY(y: number): void {
		this.y = y;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
		return this.y + this.radius;
	}
}
