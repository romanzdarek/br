import { Terrain, TerrainType } from './Terrain';
import Bush from './Bush';
import Tree from './Tree';
import Rock from './Rock';
import Wall from './Wall';
import WaterTerrainData from './WaterTerrainData';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';

type Block = {
	x: number;
	y: number;
};

export default class Map {
	width: number;
	height: number;
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
		/*
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
		this.terrain.push(new Terrain(TerrainType.Water, 0, 0, this.width, blockSize));
		this.terrain.push(new Terrain(TerrainType.Water, 0, this.height - blockSize, this.width, blockSize));
		this.terrain.push(new Terrain(TerrainType.Water, 0, blockSize, blockSize, this.height - 2 * blockSize));
		this.terrain.push(
			new Terrain(TerrainType.Water, this.width - blockSize, blockSize, blockSize, this.height - 2 * blockSize)
		);

		//water trangle
		this.terrain.push(new Terrain(TerrainType.WaterTriangle1, blockSize, blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain(TerrainType.WaterTriangle2, 3 * blockSize, blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain(TerrainType.WaterTriangle3, 3 * blockSize, 3 * blockSize, blockSize, blockSize));
		this.terrain.push(new Terrain(TerrainType.WaterTriangle4, blockSize, 3 * blockSize, blockSize, blockSize));

		let id = 0;
		//bushes
		this.bushes.push(new Bush(++id, 600, 600));
		this.bushes.push(new Bush(++id, 300, 400));

		//rocks
		const rock = new Rock(++id, 100, 100);
		this.rocks.push(rock);
		this.impassableRoundObstacles.push(rock);

		const rock2 = new Rock(++id, 550, 550);
		this.rocks.push(rock2);
		this.impassableRoundObstacles.push(rock2);

		const rock3 = new Rock(++id, 700, 550);
		this.rocks.push(rock3);
		this.impassableRoundObstacles.push(rock3);

		//this.rocks[0].isPointIn(new Point(120, 120));

		//trees
		const tree = new Tree(++id, 800, 800);
		this.trees.push(tree);
		this.impassableRoundObstacles.push(tree);

		const tree2 = new Tree(++id, 0, 0);
		this.trees.push(tree2);
		this.impassableRoundObstacles.push(tree2);

		//walls
		this.rectangleObstacles.push(new Wall(++id, 600, 800, 20, 200));
		this.rectangleObstacles.push(new Wall(++id, 500, 900, 200, 20));
		this.rectangleObstacles.push(new Wall(++id, 500, 350, 300, 100));
		*/
	}

	openMap(map: any): void {
		this.width = map.width * map.blockSize;
		this.height = map.height * map.blockSize;
		//Create blocks
		for (let yy = 0; yy < map.height; yy++) {
			for (let xx = 0; xx < map.width; xx++) {
				this.blocks.push({ x: xx * map.blockSize, y: yy * map.blockSize });
			}
		}

		//terrains
		for (const terrain of map.terrains) {
			this.terrain.push(new Terrain(terrain.type, terrain.x, terrain.y, terrain.width, terrain.height));
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
			this.bushes.push(new Bush(id++, bush.x, bush.y));
		}
		//trees
		for (const tree of map.trees) {
			const newTree = new Tree(id++, tree.x, tree.y);
			this.trees.push(newTree);
			this.impassableRoundObstacles.push(newTree);
		}
		//walls
		for (const wall of map.rects) {
			this.rectangleObstacles.push(new Wall(id++, wall.x, wall.y, wall.width, wall.height));
		}
	}
}
