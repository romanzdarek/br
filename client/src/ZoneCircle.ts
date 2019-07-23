export default class ZoneCircle {
	private centerX: number;
	private centerY: number;
	private radius: number;

	constructor(centerX: number, centerY: number, radius: number) {
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
	}

	setCenterX(x: number): void {
		this.centerX = x;
	}

	setCenterY(y: number): void {
		this.centerY = y;
	}

	setRadius(radius: number): void {
		this.radius = radius;
	}

	getCenterX(): number {
		return this.centerX;
	}

	getCenterY(): number {
		return this.centerY;
	}

	getRadius(): number {
		return this.radius;
	}
}
