import PartBulletLine from './PartBulletLine';

export default class BulletLine {
	readonly id: number;
	private startX: number;
	private startY: number;
	parts: PartBulletLine[] = [];

	constructor(id: number, startX: number, startY: number) {
		this.id = id;
		this.startX = startX;
		this.startY = startY;
	}

	setEnd(endX: number, endY: number): void {
		//part line
		let startX = this.startX;
		let startY = this.startY;
		if (this.parts.length) {
			startX = this.parts[this.parts.length - 1].endX;
			startY = this.parts[this.parts.length - 1].endY;
		}
		this.parts.push(new PartBulletLine(startX, startY, endX, endY));
	}

	isActive(): boolean {
		if (this.parts.length) {
			return this.parts[this.parts.length - 1].isActive();
		}
		return true;
	}
}
