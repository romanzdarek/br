export default class WaterTerrainData {
	private waterTriangle1: boolean[][] = [];
	private waterTriangle2: boolean[][] = [];
	private waterTriangle3: boolean[][] = [];
	private waterTriangle4: boolean[][] = [];

	constructor() {}

	setData(type: string, data: boolean[][]): void {
		switch (type) {
			case 'waterTriangle1':
				this.waterTriangle1 = data;
				break;
			case 'waterTriangle2':
				this.waterTriangle2 = data;
				break;
			case 'waterTriangle3':
				this.waterTriangle3 = data;
				break;
			case 'waterTriangle4':
				this.waterTriangle4 = data;
				break;
			default:
				throw new Error('Unknown water type');
				break;
		}
	}

	includeWater(type: string, x: number, y: number): boolean {
		let state = false;
		let waterData;
		switch (type) {
			case 'waterTriangle1':
				waterData = this.waterTriangle1;
				break;
			case 'waterTriangle2':
				waterData = this.waterTriangle2;
				break;
			case 'waterTriangle3':
				waterData = this.waterTriangle3;
				break;
			case 'waterTriangle4':
				waterData = this.waterTriangle4;
				break;
			default:
				throw new Error('Unknown water type');
				break;
		}
		if (x < waterData.length && y < waterData[x].length) {
			if (waterData[x][y]) state = true;
		}
		else {
			throw new Error('Out of range on water type');
		}
		return state;
	}
}
