export default class Terrain {
	readonly type: string;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;

	constructor(type: string, x: number, y: number, width: number, height: number) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}
