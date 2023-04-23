import { Terrain } from './Terrain';
import Bush from './obstacle/Bush';
import Tree from './obstacle/Tree';
import Rock from './obstacle/Rock';
import WaterTerrainData from './WaterTerrainData';
import RoundObstacle from './obstacle/RoundObstacle';
import RectangleObstacle from './obstacle/RectangleObstacle';
import MapData from './MapData';
import { ObstacleType } from './obstacle/ObstacleType';
import Box from './obstacle/Box';
import Block from './obstacle/Block';
import Camo from './obstacle/Camo';

type MapBlock = {
	x: number;
	y: number;
};

export default class Map {
	private size: number;
	private blockSize: number;
	readonly blocks: MapBlock[] = [];
	readonly terrain: Terrain[] = [];
	readonly rectangleObstacles: RectangleObstacle[] = [];
	readonly roundObstacles: RoundObstacle[] = [];
	readonly waterTerrainData: WaterTerrainData;

	constructor(waterTerrainData: WaterTerrainData) {
		this.waterTerrainData = waterTerrainData;
	}

	reset(): void {
		this.blocks.splice(0, this.blocks.length);
		this.terrain.splice(0, this.terrain.length);
		this.rectangleObstacles.splice(0, this.rectangleObstacles.length);
		this.roundObstacles.splice(0, this.roundObstacles.length);
	}

	getSize(): number {
		return this.size;
	}

	getBlockSize(): number {
		return this.blockSize;
	}

	openMap(mapData: MapData): void {
		this.size = mapData.size * mapData.blockSize;
		this.blockSize = mapData.blockSize;

		// Blocks
		for (let yy = 0; yy < mapData.size; yy++) {
			for (let xx = 0; xx < mapData.size; xx++) {
				this.blocks.push({ x: xx * mapData.blockSize, y: yy * mapData.blockSize });
			}
		}

		// Terrains
		for (const terrain of mapData.terrains) {
			this.terrain.push(new Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
		}

		let id = 0;

		// Rounds
		for (const obstacle of mapData.roundObstacles) {
			let newObstacle: RoundObstacle;

			switch (obstacle.type) {
				case ObstacleType.Rock:
					newObstacle = new Rock(id++, obstacle.x, obstacle.y, obstacle.size);
					break;
				case ObstacleType.Tree:
					newObstacle = new Tree(id++, obstacle.x, obstacle.y, obstacle.size, (<Tree>obstacle).angle);
					break;
				case ObstacleType.Bush:
					newObstacle = new Bush(id++, obstacle.x, obstacle.y, obstacle.size, (<Bush>obstacle).angle);
					break;
			}

			this.roundObstacles.push(newObstacle);
		}

		// Rects
		for (const obstacle of mapData.rectangleObstacles) {
			let newObstacle: RectangleObstacle;

			switch (obstacle.type) {
				case ObstacleType.Box:
					newObstacle = new Box(id++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;

				case ObstacleType.Block:
					newObstacle = new Block(id++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;

				case ObstacleType.Camo:
					newObstacle = new Camo(id++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;
			}

			this.rectangleObstacles.push(newObstacle);
		}
	}
}
