import { Terrain } from './Terrain';
import Bush from '../obstacle/Bush';
import Tree from '../obstacle/Tree';
import Rock from '../obstacle/Rock';
import WaterTerrainData from './WaterTerrainData';
import RoundObstacle from '../obstacle/RoundObstacle';
import RectangleObstacle from '../obstacle/RectangleObstacle';
import MapData from './MapData';
import { ObstacleType } from '../obstacle/ObstacleType';
import Box from '../obstacle/Box';
import Block from '../obstacle/Block';
import Camo from '../obstacle/Camo';

type MapBlock = {
	x: number;
	y: number;
};

export default class Map {
	private size: number = 0;
	private blockSize: number;
	readonly blocks: MapBlock[] = [];
	readonly terrain: Terrain[] = [];
	readonly roundObstacles: RoundObstacle[] = [];
	readonly rectangleObstacles: RectangleObstacle[] = [];
	readonly waterTerrainData: WaterTerrainData;

	constructor(waterTerrainData: WaterTerrainData, mapData: MapData) {
		this.waterTerrainData = waterTerrainData;
		this.blockSize = mapData.blockSize;
		this.openMap(mapData);
	}

	getSize(): number {
		return this.size;
	}

	getBlockSize(): number {
		return this.blockSize;
	}

	private openMap(mapData: MapData): void {
		this.size = mapData.size * mapData.blockSize;
		let obstacleId: number = 0;

		// Create blocks
		for (let yy = 0; yy < mapData.size; yy++) {
			for (let xx = 0; xx < mapData.size; xx++) {
				this.blocks.push({ x: xx * mapData.blockSize, y: yy * mapData.blockSize });
			}
		}

		// Terrain
		for (const terrain of mapData.terrains) {
			this.terrain.push(new Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
		}

		// Round
		for (const obstacle of mapData.roundObstacles) {
			let newObstacle: RoundObstacle;

			switch (obstacle.type) {
				case ObstacleType.Rock:
					newObstacle = new Rock(obstacleId++, obstacle.x, obstacle.y, obstacle.size);
					break;

				case ObstacleType.Tree:
					newObstacle = new Tree(obstacleId++, obstacle.x, obstacle.y, obstacle.size, (<Tree>obstacle).angle);
					break;

				case ObstacleType.Bush:
					newObstacle = new Bush(obstacleId++, obstacle.x, obstacle.y, obstacle.size, (<Bush>obstacle).angle);
					break;
			}
			this.roundObstacles.push(newObstacle);
		}

		// Rects
		for (const obstacle of mapData.rectangleObstacles) {
			let newObstacle: RectangleObstacle;

			switch (obstacle.type) {
				case ObstacleType.Box:
					newObstacle = new Box(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;

				case ObstacleType.Block:
					newObstacle = new Block(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;

				case ObstacleType.Camo:
					newObstacle = new Camo(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height, (<Camo>obstacle).angle);
					break;
			}
			this.rectangleObstacles.push(newObstacle);
		}
	}
}
