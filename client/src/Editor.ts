import { Terrain, TerrainType } from './Terrain';
import MyHtmlElements from './MyHtmlElements';
import Bush from './obstacle/Bush';
import Rock from './obstacle/Rock';
import Tree from './obstacle/Tree';
import Socket from './Socket';
import Colors from './Colors';
import MapData from './MapData';
import Block from './obstacle/Block';
import Box from './obstacle/Box';
import RoundObstacle from './obstacle/RoundObstacle';
import RectangleObstacle from './obstacle/RectangleObstacle';
import { ObstacleType } from './obstacle/ObstacleType';

export default class Editor {
	private terrainType: TerrainType | null;
	private obstacleType: ObstacleType | null;

	bush: Bush;
	rock: Rock;
	tree: Tree;
	block: Block;
	box: Box;

	minShiftX: number = 1;
	minShiftY: number = 1;

	private x: number;
	private y: number;
	private active: boolean = false;
	private size: number;
	readonly blockSize: number = 300;
	terrains: Terrain[] = [];
	roundObstacles: RoundObstacle[] = [];
	rectangleObstacles: RectangleObstacle[] = [];

	private myHtmlElements: MyHtmlElements;
	private socket: Socket;
	private colors: Colors;

	constructor(myHtmlElements: MyHtmlElements, socket: Socket) {
		this.myHtmlElements = myHtmlElements;
		this.socket = socket;
		this.colors = new Colors();
		this.bush = new Bush(0, 0, 0, 300, 0);
		this.rock = new Rock(0, 0, 0, 100);
		this.tree = new Tree(0, 0, 0, 500, 0);
		this.block = new Block(0, 0, 0, 100, 100);
		this.box = new Box(0, 0, 0, 50, 50);
		this.controller();
	}

	isActive(): boolean {
		return this.active;
	}

	close(): void {
		this.active = false;
	}

	getTerrainType(): TerrainType | null {
		return this.terrainType;
	}

	getObstacleType(): ObstacleType | null {
		return this.obstacleType;
	}

	getSize(): number {
		return this.size;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getMapData(): MapData {
		return new MapData(this.size, this.blockSize, this.terrains, this.roundObstacles, this.rectangleObstacles);
	}

	create(): void {
		this.cleanMap();
	}

	changeSize(size: number): void {
		this.active = true;
		const el = this.myHtmlElements;
		this.size = size;
		(<HTMLCanvasElement>el.editor.screen).width = size * this.blockSize + this.blockSize;
		(<HTMLCanvasElement>el.editor.screen).height = size * this.blockSize + this.blockSize;
		const widthString = (size * this.blockSize).toString();
		el.editor.screen.style.width = widthString;
		const heightString = (size * this.blockSize).toString();
		el.editor.screen.style.width = heightString;
		this.cleanMapAfterChangeSize();
	}

	private cleanMap(): void {
		this.terrains = [];
		this.roundObstacles = [];
		this.rectangleObstacles = [];
	}

	private cleanMapAfterChangeSize(): void {
		const mapSize = this.size * this.blockSize;

		let arr: any = this.terrains;
		for (let i = arr.length - 1; i >= 0; i--) {
			const item = arr[i];
			if (item.x >= mapSize || item.y >= mapSize) {
				arr.splice(i, 1);
			}
		}

		arr = this.roundObstacles;
		for (let i = arr.length - 1; i >= 0; i--) {
			const item = arr[i];
			if (item.x >= mapSize || item.y >= mapSize) {
				arr.splice(i, 1);
			}
		}

		arr = this.rectangleObstacles;
		for (let i = arr.length - 1; i >= 0; i--) {
			const item = arr[i];
			if (item.x >= mapSize || item.y >= mapSize) {
				arr.splice(i, 1);
			}
		}
	}

	private openMap(mapData: MapData): void {
		this.create();
		this.changeSize(mapData.size);

		for (const item of mapData.terrains) {
			this.terrains.push(new Terrain(item.type, item.x, item.y, item.size));
		}

		let id = 0;

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

		for (const obstacle of mapData.rectangleObstacles) {
			let newObstacle: RectangleObstacle;
			switch (obstacle.type) {
				case ObstacleType.Box:
					newObstacle = new Box(id++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;
				case ObstacleType.Block:
					newObstacle = new Block(id++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;
			}
			this.rectangleObstacles.push(newObstacle);
		}

		this.cleanMapAfterChangeSize();
	}

	controller(): void {
		const el = this.myHtmlElements;

		(<HTMLInputElement>el.editor.obstacleMinShiftX).value = this.minShiftX.toString();
		(<HTMLInputElement>el.editor.obstacleMinShiftY).value = this.minShiftY.toString();

		el.editor.obstacleMinShiftX.addEventListener('change', (event: InputEvent) => {
			const shift = parseInt((<HTMLInputElement>el.editor.obstacleMinShiftX).value);
			if (!shift) return;
			this.minShiftX = shift;
		});

		el.editor.obstacleMinShiftY.addEventListener('change', (event: InputEvent) => {
			const shift = parseInt((<HTMLInputElement>el.editor.obstacleMinShiftY).value);
			if (!shift) return;
			this.minShiftY = shift;
		});

		(<HTMLInputElement>el.editor.obstacleTreeSize).value = this.tree.size.toString();
		(<HTMLInputElement>el.editor.obstacleBushSize).value = this.bush.size.toString();
		(<HTMLInputElement>el.editor.obstacleRockSize).value = this.rock.size.toString();
		(<HTMLInputElement>el.editor.obstacleBoxSize).value = this.box.width.toString();
		(<HTMLInputElement>el.editor.obstacleBlockSize).value = this.block.width.toString();

		el.editor.obstacleTreeSize.addEventListener('change', (event: InputEvent) => {
			const size = parseInt((<HTMLInputElement>el.editor.obstacleTreeSize).value);
			if (!size) return;
			this.tree = new Tree(0, 0, 0, size, 0);
		});

		el.editor.obstacleBushSize.addEventListener('change', (event: InputEvent) => {
			const size = parseInt((<HTMLInputElement>el.editor.obstacleBushSize).value);
			if (!size) return;
			this.bush = new Bush(0, 0, 0, size, 0);
		});

		el.editor.obstacleRockSize.addEventListener('change', (event: InputEvent) => {
			const size = parseInt((<HTMLInputElement>el.editor.obstacleRockSize).value);
			if (!size) return;
			this.rock = new Rock(0, 0, 0, size);
		});

		el.editor.obstacleBoxSize.addEventListener('change', (event: InputEvent) => {
			const size = parseInt((<HTMLInputElement>el.editor.obstacleBoxSize).value);
			if (!size) return;
			this.box = new Box(0, 0, 0, size, size);
		});

		el.editor.obstacleBlockSize.addEventListener('change', (event: InputEvent) => {
			const size = parseInt((<HTMLInputElement>el.editor.obstacleBlockSize).value);
			if (!size) return;
			this.block = new Block(0, 0, 0, size, size);
		});

		// editorScreen mouse move
		el.editor.screen.addEventListener('mousemove', (e: MouseEvent) => {
			const canvasRect = el.editor.screen.getBoundingClientRect();
			this.x = Math.round(e.clientX + el.editor.screen.scrollLeft - canvasRect.left);
			this.y = Math.round(e.clientY + el.editor.screen.scrollTop - canvasRect.top);
			el.editor.coordinates.innerText = `x: ${this.x} y: ${this.y}`;
		});

		// choose terrain type
		el.editor.terrainImgs.addEventListener('click', (e: MouseEvent) => {
			const terrainImgs = el.editor.terrainImgs.children;
			for (let i = 0; i < terrainImgs.length; i++) {
				(<HTMLElement>terrainImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			const objectImgs = el.editor.obstacleImgs.children;
			for (let i = 0; i < objectImgs.length; i++) {
				(<HTMLElement>objectImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			(<HTMLElement>e.target).style.borderColor = this.colors.blockFrameActive;
			this.obstacleType = null;
			switch (e.target) {
				case el.editor.terrainWater:
					this.terrainType = TerrainType.Water;
					break;
				case el.editor.terrainGrass:
					this.terrainType = TerrainType.Grass;
					console.log(TerrainType.Grass);
					break;
				case el.editor.terrainWaterTriangle1:
					this.terrainType = TerrainType.WaterTriangle1;
					break;
				case el.editor.terrainWaterTriangle2:
					this.terrainType = TerrainType.WaterTriangle2;
					break;
				case el.editor.terrainWaterTriangle3:
					this.terrainType = TerrainType.WaterTriangle3;
					break;
				case el.editor.terrainWaterTriangle4:
					this.terrainType = TerrainType.WaterTriangle4;
					break;
			}
		});

		// Choose obstacle
		el.editor.obstacleImgs.addEventListener('click', (e: MouseEvent) => {
			const terrainImgs = el.editor.terrainImgs.children;
			for (let i = 0; i < terrainImgs.length; i++) {
				(<HTMLElement>terrainImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			const objectImgs = el.editor.obstacleImgs.children;
			for (let i = 0; i < objectImgs.length; i++) {
				(<HTMLElement>objectImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			(<HTMLElement>e.target).style.borderColor = this.colors.blockFrameActive;
			this.terrainType = null;
			switch (e.target) {
				case el.editor.obstacleBush:
					this.obstacleType = ObstacleType.Bush;
					break;
				case el.editor.obstacleRock:
					this.obstacleType = ObstacleType.Rock;
					break;
				case el.editor.obstacleTree:
					this.obstacleType = ObstacleType.Tree;
					break;

				case el.editor.obstacleBox:
					this.obstacleType = ObstacleType.Box;
					break;

				case el.editor.obstacleBlock:
					this.obstacleType = ObstacleType.Block;
					break;

				case el.editor.obstacleDelete:
					this.obstacleType = null;
					break;
			}
		});

		//editorScreenClick
		el.editor.screen.addEventListener('click', () => {
			if (this.getTerrainType()) {
				const blockX = Math.floor(this.getX() / this.blockSize) * this.blockSize;
				const blockY = Math.floor(this.getY() / this.blockSize) * this.blockSize;
				// Find block on this position and delete
				let deletePosition = -1;
				for (let i = 0; i < this.terrains.length; i++) {
					const terrain = this.terrains[i];
					if (terrain.x === blockX && terrain.y === blockY) {
						deletePosition = i;
						break;
					}
				}
				if (deletePosition !== -1) {
					this.terrains.splice(deletePosition, 1);
				}
				if (this.getTerrainType() !== TerrainType.Grass) {
					this.terrains.push(new Terrain(this.getTerrainType(), blockX, blockY, this.blockSize));
				}
				// Obstacles
			} else {
				const randomAngle = Math.floor(Math.random() * 360);
				let x = this.getX();
				let y = this.getY();

				if (this.minShiftX > 1) {
					x = Math.floor(x / this.minShiftX) * this.minShiftX;
				}
				if (this.minShiftY > 1) {
					y = Math.floor(y / this.minShiftY) * this.minShiftY;
				}
				switch (this.obstacleType) {
					case ObstacleType.Bush:
						this.roundObstacles.push(new Bush(0, x - this.bush.size / 2, y - this.bush.size / 2, this.bush.size, randomAngle));
						break;
					case ObstacleType.Rock:
						this.roundObstacles.push(new Rock(0, x - this.rock.size / 2, y - this.rock.size / 2, this.rock.size));
						break;
					case ObstacleType.Tree:
						this.roundObstacles.push(new Tree(0, x - this.tree.size / 2, y - this.tree.size / 2, this.tree.size, randomAngle));
						break;
					case ObstacleType.Box:
						this.rectangleObstacles.push(new Box(0, x - this.box.width / 2, y - this.box.height / 2, this.box.width, this.box.height));
						break;
					case ObstacleType.Block:
						this.rectangleObstacles.push(new Block(0, x - this.block.width / 2, y - this.block.height / 2, this.block.width, this.block.height));
						break;

					default:
						// Delete obstacle

						const editor = this;

						for (let i = 0; i < editor.rectangleObstacles.length; i++) {
							const obstacle = editor.rectangleObstacles[i];
							if (
								obstacle.x <= editor.getX() &&
								obstacle.x + obstacle.width >= editor.getX() &&
								obstacle.y <= editor.getY() &&
								obstacle.y + obstacle.height >= editor.getY()
							) {
								this.rectangleObstacles.splice(i, 1);
								return;
							}
						}

						for (let i = 0; i < editor.roundObstacles.length; i++) {
							const obstacle = editor.roundObstacles[i];
							if (
								obstacle.x <= editor.getX() &&
								obstacle.x + obstacle.size >= editor.getX() &&
								obstacle.y <= editor.getY() &&
								obstacle.y + obstacle.size >= editor.getY()
							) {
								this.roundObstacles.splice(i, 1);
								return;
							}
						}
						break;
				}
			}
		});

		//socket openMapInEditor
		this.socket.on('openMapInEditor', (mapData: MapData) => {
			this.openMap(mapData);
			el.close(el.openMapMenu.main);
			el.open(el.editor.container);
		});
	}
}
