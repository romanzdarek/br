export default class PartBulletLine {
	readonly startX: number;
	readonly startY: number;
	readonly endX: number;
	readonly endY: number;
	private active: boolean = true;
	private age: number = 0;
	private maxAge: number = 10;

	constructor(startX: number, startY: number, endX: number, endY: number) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}

	increaseAge(): void {
		if (this.age++ === this.maxAge) {
			this.active = false;
		}
	}

	isActive(): boolean {
		return this.active;
	}

	getAge(): number {
		return this.age;
	}
}
