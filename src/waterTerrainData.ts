/*
import { triangel1 } from './triangel1Data';
import { triangel2 } from './triangel2Data';
import { triangel3 } from './triangel3Data';
import { triangel4 } from './triangel4Data';
*/

export default class WaterTerrainData {

	private waterTriangle1: boolean[][] = [];
	private waterTriangle2: boolean[][] = [];
	private waterTriangle3: boolean[][] = [];
	private waterTriangle4: boolean[][] = [];

	/*
	private waterTriangle1: number[][] = triangel1;
	private waterTriangle2: number[][] = triangel2;
	private waterTriangle3: number[][] = triangel3;
	private waterTriangle4: number[][] = triangel4;
	*/

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

	/*
	write(): void {
		const el = document.createElement('p');
		el.style.position = 'absolute';
		el.style.top = '0';
		el.style.left = '0';

		el.textContent = JSON.stringify(this.waterTriangle4);
		document.body.appendChild(el);
	}
	*/
}
