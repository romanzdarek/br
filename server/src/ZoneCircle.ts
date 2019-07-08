export default class ZoneCircle {
	private centerX: number;
	private centerY: number;
	private radius: number;
	private step: number = 0;
	private steps: number = 300;
	private shiftCenterX: number = 0;
	private shiftCenterY: number = 0;
	private radiusChange: number = 0;
	private changeReady: boolean = false;

	constructor(centerX: number, centerY: number, radius: number) {
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
	}

	calcChange(innerCircle: ZoneCircle): void {
		this.radiusChange = (this.radius - innerCircle.radius) / this.steps;
		//triangle xyz
		let x = Math.abs(this.centerX - innerCircle.centerX);
		let y = Math.abs(this.centerY - innerCircle.centerY);
		const z = Math.sqrt(x * x + y * y);
		const shiftZ = z / this.steps;

		//can not set x and y to 0 because angle
		if (x === 0) x = 0.000001;
		if (y === 0) y = 0.000001;
		//atangens
		let angle = Math.abs(Math.atan(x / y) * 180 / Math.PI);
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1
		if (this.centerX >= innerCircle.centerX && this.centerY < innerCircle.centerY) {
			//angle = angle;
		}
		//2
		if (this.centerX >= innerCircle.centerX && this.centerY >= innerCircle.centerY) {
			angle = 90 + 90 - angle;
		}
		//3
		if (this.centerX < innerCircle.centerX && this.centerY >= innerCircle.centerY) {
			angle = 180 + angle;
		}
		//4
		if (this.centerX < innerCircle.centerX && this.centerY < innerCircle.centerY) {
			angle = 270 + 90 - angle;
		}
		this.shiftCenterX = Math.sin(angle * Math.PI / 180) * shiftZ;
		this.shiftCenterY = Math.cos(angle * Math.PI / 180) * shiftZ;
	}

	move(inCircle: ZoneCircle): void {
		if (this.step < this.steps) {
			if (!this.changeReady) {
				this.calcChange(inCircle);
				this.changeReady = true;
			}
			this.radius -= this.radiusChange;
			this.centerX -= this.shiftCenterX;
			this.centerY += this.shiftCenterY;
			this.step++;
		}
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
