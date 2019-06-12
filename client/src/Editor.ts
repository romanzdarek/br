import { Terrain, TerrainType } from './Terrain';
import MyHtmlElements from './MyHtmlElements';
import { Mouse } from './Controller';
import Bush from './Bush';
import Rock from './Rock';
import Tree from './Tree';
import Wall from './Wall';
import Socket from './Socket';
import Colors from './Colors';

export default class Editor {
	private terrainType: TerrainType | null;
	private objectType: string | null;
	bush: Bush;
	rock: Rock;
	tree: Tree;
	private x: number;
	private y: number;
	private active: boolean = false;
	private name: string;
	private width: number;
	private height: number;
	readonly blockSize: number = 300;
	terrains: Terrain[] = [];
	bushes: Bush[] = [];
	rocks: Rock[] = [];
	trees: Tree[] = [];
	walls: Wall[] = [];
	private objects: any[] = [];
	private myHtmlElements: MyHtmlElements;
	private socket: Socket;
	private colors: Colors;

	constructor(myHtmlElements: MyHtmlElements, socket: Socket) {
		this.myHtmlElements = myHtmlElements;
		this.socket = socket;
		this.colors = new Colors();
		this.bush = new Bush(0, 0, 0);
		this.rock = new Rock(0, 0, 0);
		this.tree = new Tree(0, 0, 0);
		this.controller();
	}

	isActive(): boolean {
		return this.active;
	}

	getTerrainType(): TerrainType | null {
		return this.terrainType;
	}

	getObjectType(): string | null {
		return this.objectType;
	}

	getWidth(): number {
		return this.width;
	}

	getHeight(): number {
		return this.height;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	create(width: number, height: number): void {
		const el = this.myHtmlElements;
		this.active = true;
		this.width = width;
		this.height = height;
		(<HTMLCanvasElement>el.editor.screen).width = width * this.blockSize;
		(<HTMLCanvasElement>el.editor.screen).height = height * this.blockSize;
		const widthString = (width * this.blockSize).toString();
		el.editor.screen.style.width = widthString;
		const heightString = (height * this.blockSize).toString();
		el.editor.screen.style.width = heightString;
		el.open(el.editor.screen);
		el.close(el.gameScreen, el.editor.mapSizeMenu);
		document.body.style.overflow = 'auto';
	}

	controller(): void {
		const el = this.myHtmlElements;
		//mapSize ok button
		document.getElementById('mapSizeOk').addEventListener('click', () => {
			this.create(
				parseInt((<HTMLInputElement>document.getElementById('mapSizeWidth')).value),
				parseInt((<HTMLInputElement>document.getElementById('mapSizeHeight')).value)
			);
			el.close(el.gameScreen, el.editor.mapSizeMenu);
			el.open(el.editor.container);
			this.active = true;
		});
		//mapSize back button
		document.getElementById('mapSizeBack').addEventListener('click', () => {
			el.close(el.editor.mapSizeMenu);
		});
		//editorScreen mouse move
		el.editor.screen.addEventListener('mousemove', (e: MouseEvent) => {
			const canvasRect = el.editor.screen.getBoundingClientRect();
			this.x = e.clientX + el.editor.screen.scrollLeft - canvasRect.left;
			this.y = e.clientY + el.editor.screen.scrollTop - canvasRect.top;
			el.editor.coordinates.innerText = `x: ${this.x} y: ${this.y}`;
		});

		//choose terrain type
		el.editor.terrainImgs.addEventListener('click', (e: MouseEvent) => {
			const terrainImgs = el.editor.terrainImgs.children;
			for (let i = 0; i < terrainImgs.length; i++) {
				(<HTMLElement>terrainImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			const objectImgs = el.editor.objectImgs.children;
			for (let i = 0; i < objectImgs.length; i++) {
				(<HTMLElement>objectImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			(<HTMLElement>e.target).style.borderColor = this.colors.blockFrameActive;
			this.objectType = null;
			switch (e.target) {
				case el.editor.terrainWater:
					this.terrainType = TerrainType.Water;
					break;
				case el.editor.terrainGrass:
					this.terrainType = TerrainType.Grass;
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

		//choose object
		el.editor.objectImgs.addEventListener('click', (e: MouseEvent) => {
			const terrainImgs = el.editor.terrainImgs.children;
			for (let i = 0; i < terrainImgs.length; i++) {
				(<HTMLElement>terrainImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			const objectImgs = el.editor.objectImgs.children;
			for (let i = 0; i < objectImgs.length; i++) {
				(<HTMLElement>objectImgs[i]).style.borderColor = this.colors.blockFrame;
			}
			(<HTMLElement>e.target).style.borderColor = this.colors.blockFrameActive;
			this.terrainType = null;
			switch (e.target) {
				case el.editor.objectBush:
					this.objectType = 'bush';
					break;
				case el.editor.objectRock:
					this.objectType = 'rock';
					break;
				case el.editor.objectTree:
					this.objectType = 'tree';
					break;
				case el.editor.objectRect:
					this.objectType = 'rect';
					break;
				case el.editor.objectDelete:
					this.objectType = 'delete';
					break;
			}
		});

		//editorScreenClick
		el.editor.screen.addEventListener('click', () => {
			if (this.getTerrainType() != null) {
				const blockX = Math.floor(this.getX() / this.blockSize) * this.blockSize;
				const blockY = Math.floor(this.getY() / this.blockSize) * this.blockSize;
				//find block on this position and delete
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
					this.terrains.push(
						new Terrain(this.getTerrainType(), blockX, blockY, this.blockSize, this.blockSize)
					);
				}
			}

			if (this.getObjectType() != null) {
				switch (this.getObjectType()) {
					case 'bush':
						this.bushes.push(new Bush(0, this.x - this.bush.size / 2, this.y - this.bush.size / 2));
						break;
					case 'rock':
						this.rocks.push(new Rock(0, this.x - this.rock.size / 2, this.y - this.rock.size / 2));
						break;
					case 'tree':
						this.trees.push(new Tree(0, this.x - this.tree.size / 2, this.y - this.tree.size / 2));
						break;
					case 'rect':
						this.walls.push(
							new Wall(
								0,
								this.x - this.bush.size / 2,
								this.y - this.bush.size / 2,
								this.bush.size,
								this.bush.size
							)
						);
						break;
					case 'delete':
						//find delete object
						let deleteObject;
						const editor = this;
						for (const rock of editor.rocks) {
							const object = rock;
							if (
								object.x <= editor.getX() &&
								object.x + object.size >= editor.getX() &&
								object.y <= editor.getY() &&
								object.y + object.size >= editor.getY()
							) {
								deleteObject = object;
							}
						}
						for (const wall of editor.walls) {
							const object = wall;
							if (
								object.x <= editor.getX() &&
								object.x + object.width >= editor.getX() &&
								object.y <= editor.getY() &&
								object.y + object.height >= editor.getY()
							) {
								deleteObject = object;
							}
						}
						for (const bush of editor.bushes) {
							const object = bush;
							if (
								object.x <= editor.getX() &&
								object.x + object.size >= editor.getX() &&
								object.y <= editor.getY() &&
								object.y + object.size >= editor.getY()
							) {
								deleteObject = object;
							}
						}
						for (const tree of editor.trees) {
							const object = tree;
							if (
								object.x <= editor.getX() &&
								object.x + object.size >= editor.getX() &&
								object.y <= editor.getY() &&
								object.y + object.size >= editor.getY()
							) {
								deleteObject = object;
							}
						}

						//delete
						let deleteIndex = -1;
						for (let i = 0; i < this.rocks.length; i++) {
							if (deleteObject == this.rocks[i]) deleteIndex = i;
						}
						if (deleteIndex !== -1) {
							this.rocks.splice(deleteIndex, 1);
							deleteIndex = -1;
						}

						for (let i = 0; i < this.bushes.length; i++) {
							if (deleteObject == this.bushes[i]) deleteIndex = i;
						}
						if (deleteIndex !== -1) {
							this.bushes.splice(deleteIndex, 1);
							deleteIndex = -1;
						}

						for (let i = 0; i < this.trees.length; i++) {
							if (deleteObject == this.trees[i]) deleteIndex = i;
						}
						if (deleteIndex !== -1) {
							this.trees.splice(deleteIndex, 1);
							deleteIndex = -1;
						}

						for (let i = 0; i < this.walls.length; i++) {
							if (deleteObject == this.walls[i]) deleteIndex = i;
						}
						if (deleteIndex !== -1) {
							this.walls.splice(deleteIndex, 1);
							deleteIndex = -1;
						}
						break;
				}
			}
		});

		//save
		el.editor.save.addEventListener('click', () => {
			const map = {
				blockSize: this.blockSize,
				width: this.getWidth(),
				height: this.getHeight(),
				terrains: this.terrains,
				rects: this.walls,
				bushes: this.bushes,
				rocks: this.rocks,
				trees: this.trees
			};
			this.socket.emit('editorSaveMap', map);
		});
	}
}
