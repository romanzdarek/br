export default class WaterCircleSnapshot {
	x: number;
	y: number;

	constructor(centerX: number, centerY: number) {
		this.x = Math.round(centerX * 10) / 10;
		this.y = Math.round(centerY * 10) / 10;
	}
}
