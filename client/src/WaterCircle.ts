import WaterCircleSnapshot from './WaterCircleSnapshot';

export default class WaterCircle {
	private centerX: number;
	private centerY: number;
	private size: number = 30;
	private opacity: number = 1;

	constructor(waterCircleSnapshot: WaterCircleSnapshot) {
		this.centerX = waterCircleSnapshot.x;
		this.centerY = waterCircleSnapshot.y;
	}

	getX(): number {
		return this.centerX - this.size / 2;
	}

	getY(): number {
		return this.centerY - this.size / 2;
	}

	getSize(): number {
		return this.size;
	}

	getOpacity(): number {
		return this.opacity;
	}

	flow() {
		this.size += 2;
		this.opacity -= 0.02;
	}

	isActive(): boolean {
		return this.opacity > 0.04;
	}
}
