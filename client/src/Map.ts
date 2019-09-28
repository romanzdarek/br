import { Terrain, TerrainType } from './Terrain';
import Bush from './Bush';
import Tree from './Tree';
import Rock from './Rock';
import Wall from './Wall';
import WaterTerrainData from './WaterTerrainData';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import MapData from './MapData';

type Block = {
	x: number;
	y: number;
};

export default class Map {
	private size: number;
	private blockSize: number;
	readonly blocks: Block[] = [];
	readonly terrain: Terrain[] = [];
	readonly impassableRoundObstacles: RoundObstacle[] = [];
	readonly bushes: Bush[] = [];
	readonly trees: Tree[] = [];
	readonly rocks: Rock[] = [];
	readonly rectangleObstacles: RectangleObstacle[] = [];
	readonly waterTerrainData: WaterTerrainData;

	constructor(waterTerrainData: WaterTerrainData) {
		this.waterTerrainData = waterTerrainData;
	}

	reset(): void {
		this.blocks.splice(0, this.blocks.length);
		this.terrain.splice(0, this.terrain.length);
		this.impassableRoundObstacles.splice(0, this.impassableRoundObstacles.length);
		this.bushes.splice(0, this.bushes.length);
		this.trees.splice(0, this.trees.length);
		this.rocks.splice(0, this.rocks.length);
		this.rectangleObstacles.splice(0, this.rectangleObstacles.length);
	}

	getSize(): number {
		return this.size;
	}

	getBlockSize(): number {
		return this.blockSize;
	}

	openMap(map: MapData): void {
		this.size = map.size * map.blockSize;
		this.blockSize = map.blockSize;
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
		let id = 0;
		for (const rock of map.rocks) {
			const newRock = new Rock(id++, rock.x, rock.y);
			this.rocks.push(newRock);
			this.impassableRoundObstacles.push(newRock);
		}
		//bushes
		for (const bush of map.bushes) {
			this.bushes.push(new Bush(id++, bush.x, bush.y, bush.angle));
		}
		//trees
		for (const tree of map.trees) {
			const newTree = new Tree(id++, tree.x, tree.y, tree.angle);
			this.trees.push(newTree);
			this.impassableRoundObstacles.push(newTree);
		}
		//walls
		for (const wall of map.rects) {
			this.rectangleObstacles.push(new Wall(id++, wall.x, wall.y, wall.width, wall.height));
		}
	}
}
