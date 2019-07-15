import { Terrain } from './Terrain';
import RectangleObstacle from './RectangleObstacle';
import Bush from './Bush';
import Rock from './Rock';
import Tree from './Tree';

export default interface MapData {
	size: number;
	blockSize: number;
	terrains: Terrain[];
	rects: RectangleObstacle[];
	bushes: Bush[];
	rocks: Rock[];
	trees: Tree[];
};
