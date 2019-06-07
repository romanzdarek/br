export enum TerrainType {
	Grass,
	Water,
	WaterTriangle1,
	WaterTriangle2,
	WaterTriangle3,
	WaterTriangle4
}

export class Terrain {
	readonly type: TerrainType;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly angle: number = 0;

	constructor(type: TerrainType, x: number, y: number, width: number, height: number) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		switch (type) {
			case TerrainType.WaterTriangle2:
				this.angle = 90;
				break;
			case TerrainType.WaterTriangle3:
				this.angle = 180;
				break;
			case TerrainType.WaterTriangle4:
				this.angle = 270;
				break;
		}
	}
}
