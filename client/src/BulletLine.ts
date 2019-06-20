import PartBulletLine from './PartBulletLine';

export default class BulletLine {
	readonly id: number;
	readonly startX: number;
	readonly startY: number;
	private endX: number;
	private endY: number;
	parts: PartBulletLine[] = [];

	constructor(id: number, startX: number, startY: number) {
		this.id = id;
		this.startX = startX;
		this.startY = startY;
	}

	getEndX(): number {
		return this.endX;
	}

	getEndY(): number {
		return this.endY;
	}

	setEnd(endX: number, endY: number): void {
		this.endX = endX;
		this.endY = endY;

        //part line
        let startX = this.startX;
        let startY = this.startY;
        if(this.parts.length){
            startX = this.parts[this.parts.length - 1].endX
            startY = this.parts[this.parts.length - 1].endY
        }
		this.parts.push(new PartBulletLine(startX, startY, endX, endY));
	}

	isActive(): boolean {
        if(this.parts.length){
            return this.parts[this.parts.length - 1].isActive()
        }

        //co kdyz budu mit jen jeden bod bullety a zadnou celou part?
        //toto by nemel server dopustit...
		return true;
	}
}
