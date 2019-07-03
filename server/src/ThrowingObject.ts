import Hand from './hand';

export default class ThrowingObject {
	private x: number;
	private y: number;
	private aboveGround: number = 1;

	private angle: number = 0;
	private angleShift: number = 10;
	private shiftX: number;
	private shiftY: number;
	//shiftZ == speed
	private shiftZ: number = 7;
	private distance: number = 0;
	private steps: number;

	constructor(hand: Hand, targetX: number, targetY: number, range: number = 80) {
		this.x = hand.getCenterX();
		this.y = hand.getCenterY();
		//triangle
		let x, y;
		if (hand.getCenterX() >= targetX) {
			x = hand.getCenterX() - targetX;
		}
		else {
			x = targetX - hand.getCenterX();
		}
		if (hand.getCenterY() >= targetY) {
			y = hand.getCenterY() - targetY;
		}
		else {
			y = targetY - hand.getCenterY();
		}
		const z = Math.sqrt(x * x + y * y);
		this.steps = Math.round(z / this.shiftZ);

		if (hand.getCenterX() <= targetX) {
			this.shiftX = x / this.steps;
		}
		else {
			this.shiftX = x / this.steps * -1;
		}

		if (hand.getCenterY() <= targetY) {
			this.shiftY = y / this.steps;
		}
		else {
			this.shiftY = y / this.steps * -1;
		}
		if (this.steps > range) this.steps = range;
	}

	move(): void {
		if (this.distance < this.steps) {
			this.x += this.shiftX;
			this.y += this.shiftY;
			//up
			if (this.distance < this.steps / 2) {
				this.aboveGround += 0.05;
			}
			else {
				//down
				this.aboveGround -= 0.05;
			}
			this.rotate();
			this.distance++;
		}
	}

	rotate(): void {
		this.angle += this.angleShift;
		if (this.angle >= 360) {
			this.angle -= 360;
		}
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getAngle(): number {
		return this.angle;
	}

	getAboveGround(): number {
		return this.aboveGround;
	}

	ready(): boolean {
		return true;
	}

	flying(): boolean {
		return this.distance < this.steps;
	}
}
