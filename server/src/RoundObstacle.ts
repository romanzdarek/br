import Point from './Point';

export default abstract class RoundObstacle {
	readonly id: number;
	protected changed: boolean = false;
	readonly x: number;
	readonly y: number;
	protected opacity: number = 1;
	readonly size: number;
	readonly radius: number;
	private active: boolean = true;
	private hitAnimateTimer: number = 0;
	private hitAnimateShiftX: number = 0;
	private hitAnimateShiftY: number = 0;

	constructor(id: number, x: number, y: number, size: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.size = size;
		this.radius = size / 2;
	}

	getChanged():boolean{
		return this.changed;
	}

	nullChanged():void{
		this.changed = false;
	}

	getChangedData(): any {
		return { id: this.id, opacity: this.opacity };
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
		if (this.active) {
			if (this.opacity > 0.1) this.opacity -= 0.1;
			this.createAnimateHit(handCenter);
			if (this.opacity < 0.1) {
				this.active = false;
			}
			this.changed = true;
		}
		
	}

	private createAnimateHit(handCenter: Point): void {
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

	animate(): Point {
		let animateX = 0;
		let animateY = 0;
		if (this.hitAnimateTimer > 0) this.hitAnimateTimer--;
		switch (this.hitAnimateTimer) {
			case 1:
				animateX = this.hitAnimateShiftX;
				animateY = this.hitAnimateShiftY;
				break;
			case 2:
				animateX = 2 * this.hitAnimateShiftX;
				animateY = 2 * this.hitAnimateShiftY;
				break;
			case 3:
				animateX = 3 * this.hitAnimateShiftX;
				animateY = 3 * this.hitAnimateShiftY;
				break;
			case 4:
				animateX = 4 * this.hitAnimateShiftX;
				animateY = 4 * this.hitAnimateShiftY;
				break;
			case 5:
				animateX = 5 * this.hitAnimateShiftX;
				animateY = 5 * this.hitAnimateShiftY;
				break;
			case 6:
				animateX = 4 * this.hitAnimateShiftX;
				animateY = 4 * this.hitAnimateShiftY;
				break;
			case 7:
				animateX = 3 * this.hitAnimateShiftX;
				animateY = 3 * this.hitAnimateShiftY;
				break;
			case 8:
				animateX = 2 * this.hitAnimateShiftX;
				animateY = 2 * this.hitAnimateShiftY;
				break;
			case 9:
				animateX = 1 * this.hitAnimateShiftX;
				animateY = 1 * this.hitAnimateShiftY;
				break;
			case 10:
				break;
		}
		return new Point(animateX, animateY);
	}
}
