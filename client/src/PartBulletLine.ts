import BulletLine from './BulletLine';

export default class PartBulletLine {
	readonly startX: number;
	readonly startY: number;
	readonly endX: number;
	readonly endY: number;
	private age: number = 0;
	private maxAge: number = 10;
	bulletLine: BulletLine;

	constructor(startX: number, startY: number, endX: number, endY: number, bulletLine: BulletLine) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.bulletLine = bulletLine;
		/*
		if (Math.abs(startX - endX) > 500 || Math.abs(startY - endY) > 500) {
			console.error(this);
			throw 'bullet line error';
		}
		*/
	}

	increaseAge(): void {
		this.age++;
	}

	isActive(): boolean {
		return this.age <= this.maxAge;
	}

	getAge(): number {
		return this.age;
	}
}
