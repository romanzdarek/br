import { Terrain } from './Terrain';
import RectangleObstacle from './RectangleObstacle';
import Bush from './Bush';
import Rock from './Rock';
import Tree from './Tree';

export default class MapData {
	size: number;
	blockSize: number;
	terrains: Terrain[];
	rects: RectangleObstacle[];
	bushes: Bush[];
	rocks: Rock[];
	trees: Tree[];

	constructor(
		size: number,
		blockSize: number,
		terrains: Terrain[],
		rects: RectangleObstacle[],
		bushes: Bush[],
		rocks: Rock[],
		trees: Tree[]
	) {
		this.size = size;
		this.blockSize = blockSize;
		this.terrains = terrains;
		this.rects = rects;
		this.bushes = bushes;
		this.rocks = rocks;
		this.trees = trees;
	}
}
