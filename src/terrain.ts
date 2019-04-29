export default class Terrain {
	readonly type: string;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly angle: number = 0;

	constructor(type: string, x: number, y: number, width: number, height: number) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		switch (type) {
			case 'waterTriangle2':
				this.angle = 90;
				break;
			case 'waterTriangle3':
				this.angle = 180;
				break;
			case 'waterTriangle4':
				this.angle = 270;
				break;
		}
	}
}
