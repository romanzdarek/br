import { Terrain, TerrainType } from './Terrain';
import Bush from './Bush';
import Tree from './Tree';
import Rock from './Rock';
import Wall from './Wall';
import WaterTerrainData from './WaterTerrainData';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import MapData from './Mapdata';

type Block = {
	x: number;
	y: number;
};

export default class Map {
	private size: number = 0;
	private blockSize: number;
	readonly blocks: Block[] = [];
	readonly terrain: Terrain[] = [];
	readonly impassableRoundObstacles: RoundObstacle[] = [];
	readonly bushes: Bush[] = [];
	readonly trees: Tree[] = [];
	readonly rocks: Rock[] = [];
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

	private openMap(mapData: any): void {
		const map = mapData;
		this.size = map.size * map.blockSize;
		let mapObjectId: number = 0;
		//Create blocks
		for (let yy = 0; yy < map.size; yy++) {
			for (let xx = 0; xx < map.size; xx++) {
				this.blocks.push({ x: xx * map.blockSize, y: yy * map.blockSize });
			}
		}

		//terrains
		for (const terrain of map.terrains) {
			this.terrain.push(new Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
		}
		//rocks
		for (const rock of map.rocks) {
			const newRock = new Rock(mapObjectId++, rock.x, rock.y);
			this.rocks.push(newRock);
			this.impassableRoundObstacles.push(newRock);
		}
		//bushes
		for (const bush of map.bushes) {
			this.bushes.push(new Bush(mapObjectId++, bush.x, bush.y));
		}
		//trees
		for (const tree of map.trees) {
			const newTree = new Tree(mapObjectId++, tree.x, tree.y);
			this.trees.push(newTree);
			this.impassableRoundObstacles.push(newTree);
		}
		//walls
		for (const wall of map.rects) {
			this.rectangleObstacles.push(new Wall(mapObjectId++, wall.x, wall.y, wall.width, wall.height));
		}
	}
}
