import Terrain from './terrain';
import WaterTerrainData from './waterTerrainData';

export type Block = {
	x: number;
	y: number;
};

export default class Map {
	readonly width: number;
	readonly height: number;
	readonly blocks: Block[] = [];
	readonly terrain: Terrain[] = [];
	readonly waterTerrainData: WaterTerrainData;

	constructor(waterTerrainData: WaterTerrainData) {
		this.waterTerrainData = waterTerrainData;
		const blockSize = 300;
		this.width = 5 * blockSize;
		this.height = 5 * blockSize;
		//Create blocks
		for (let yy = 0; yy < this.height / blockSize; yy++) {
			for (let xx = 0; xx < this.width / blockSize; xx++) {
				this.blocks.push({ x: xx * blockSize, y: yy * blockSize });
			}
		}

		//terrain
		this.terrain.push(new Terrain('water', 0, 0, this.width, blockSize));
		this.terrain.push(new Terrain('water', 0, this.height - blockSize, this.width, blockSize));
		this.terrain.push(new Terrain('water', 0, blockSize, blockSize, this.height - 2 * blockSize));
		this.terrain.push(
			new Terrain('water', this.width - blockSize, blockSize, blockSize, this.height - 2 * blockSize)
		);

		//water trangle
		this.terrain.push(new Terrain('waterTriangle1', blockSize, blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain('waterTriangle2', 3 * blockSize, blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain('waterTriangle3', 3 * blockSize, 3 * blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain('waterTriangle4', blockSize, 3 * blockSize, blockSize, blockSize));
	}
}
