import { Terrain } from './Terrain';
import RectangleObstacle from './obstacle/RectangleObstacle';
import RoundObstacle from './obstacle/RoundObstacle';

export default class MapData {
	constructor(
		public size: number,
		public blockSize: number,
		public terrains: Terrain[],
		public roundObstacles: RoundObstacle[],
		public rectangleObstacles: RectangleObstacle[]
	) {}
}
