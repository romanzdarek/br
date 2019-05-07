import Point from './Point';

export default abstract class RoundObstacle {
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	readonly size: number;
	readonly radius: number;
	private active: boolean = true;
	private hitAnimateTimer: number = 0;
	private hitAnimateShiftX: number;
	private hitAnimateShiftY: number;

	constructor(x: number, y: number, size: number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
	}

	getHitAnimateShiftX(): number {
		return this.hitAnimateShiftX;
	}

	getHitAnimateShiftY(): number {
		return this.hitAnimateShiftY;
	}

	getAnimateTimer(): number {
		if (this.hitAnimateTimer > 0) this.hitAnimateTimer--;
		return this.hitAnimateTimer;
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + this.radius - point.x;
		const y = this.y + this.radius - point.y;
		const radius = Math.sqrt(x * x + y * y);
		if (radius <= this.radius) return true;
		return false;
	}

	getCenterX(): number {
		return this.x + this.size / 2;
	}

	getCenterY(): number {
		return this.y + this.size / 2;
	}

	getOpacity(): number {
		return this.opacity;
	}

	isActive(): boolean {
		return this.active;
	}

	acceptHit(handCenter: Point): void {
		if (this.opacity > 0.1) this.opacity -= 0.1;
		this.setAnimateHit(handCenter);
		if (this.opacity < 0.1) {
			this.active = false;
		}
	}

	setAnimateHit(handCenter: Point): void {
		const x = handCenter.x - this.getCenterX();
		const y = handCenter.y - this.getCenterY();
		let hitAngle = Math.abs(Math.atan(x / y) * (180 / Math.PI));
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1
		if (handCenter.x >= this.getCenterX() && handCenter.y < this.getCenterY()) {
			hitAngle = hitAngle;
		}
		//2
		if (handCenter.x >= this.getCenterX() && handCenter.y >= this.getCenterY()) {
			hitAngle = 180 - hitAngle;
		}
		//3
		if (handCenter.x < this.getCenterX() && handCenter.y >= this.getCenterY()) {
			hitAngle = 180 + hitAngle;
		}
		//4
		if (handCenter.x < this.getCenterX() && handCenter.y < this.getCenterY()) {
			hitAngle = 360 - hitAngle;
		}
		hitAngle = Math.round(hitAngle);
		if (hitAngle === 360) hitAngle = 0;

		this.hitAnimateTimer = 10;
		//triangle
		const hitShift = 3;
		this.hitAnimateShiftX = Math.sin(hitAngle * Math.PI / 180) * hitShift * -1;
		this.hitAnimateShiftY = Math.cos(hitAngle * Math.PI / 180) * hitShift;
	}
}
