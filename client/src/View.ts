import Player from './Player';
import { Weapon } from './Weapon';
import Map from './Map';
import { Mouse } from './Controller';
import WaterTerrainData from './WaterTerrainData';
import { TerrainType } from './Terrain';
import Bullet from './Bullet';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import Tree from './Tree';
import Rock from './Rock';
import Bush from './Bush';
import Wall from './Wall';
import ServerClientSync from './ServerClientSync';
import { Snapshot } from './Snapshot';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import Colors from './Colors';
import BulletLine from './BulletLine';
import PartBulletLine from './PartBulletLine';
import CollisionPoints from './CollisionPoints';
import Point from './Point';
import ZoneSnapshot from './ZoneSnapshot';
import SnapshotManager from './SnapshotManager';
import { PlayerOld } from './PlayerOld';

type DrawData = {
	x: number;
	y: number;
	size: number;
	width: number;
	height: number;
	isOnScreen: boolean;
};

interface RoundObject {
	x: number;
	y: number;
	size: number;
}

interface RectObject {
	x: number;
	y: number;
	width: number;
	height: number;
}

export default class View {
	private gameScreen: HTMLCanvasElement;
	private editorScreen: HTMLCanvasElement;
	private mapScreen: HTMLCanvasElement;
	private helperScreen: HTMLCanvasElement;
	private ctxGame: CanvasRenderingContext2D;
	private ctxMap: CanvasRenderingContext2D;
	private ctxEditor: CanvasRenderingContext2D;
	private playerSVG: HTMLImageElement;
	private playerHandSVG: HTMLImageElement;
	private bushSVG: HTMLImageElement;
	private rockSVG: HTMLImageElement;
	private treeSVG: HTMLImageElement;
	private pistolSVG: HTMLImageElement;
	private machinegunSVG: HTMLImageElement;
	private shotgunSVG: HTMLImageElement;
	private rifleSVG: HTMLImageElement;
	private hammerSVG: HTMLImageElement;
	private cursorSVG: HTMLImageElement;
	private granadeSVG: HTMLImageElement;
	private smokeSVG: HTMLImageElement;
	private smokeCloudSVG: HTMLImageElement;
	private loadingProgresSVG: HTMLImageElement;
	private loadingCircleSVG: HTMLImageElement;
	private waterTrianglePNG: HTMLImageElement;

	private rifleLootSVG: HTMLImageElement;

	private waterTerrainData: WaterTerrainData;
	private resolutionAdjustment: number = 1;
	private screenCenterX: number;
	private screenCenterY: number;
	private map: Map;
	private bullets: Bullet[];
	private mouse: Mouse;
	private myPlayerCenterX: number = 0;
	private myPlayerCenterY: number = 0;

	private serverClientSync: ServerClientSync;
	private myHtmlElements: MyHtmlElements;

	private colors: Colors;
	private bulletLines: BulletLine[] = [];
	private collisionPoints: CollisionPoints;

	private outerCircle = {
		x: 0,
		y: 0,
		radius: 0,
		opacity: 0.4,
		opacityDirection: 1
	};
	private innerCircle = {
		x: 0,
		y: 0,
		radius: 0
	};

	constructor(
		map: Map,
		bullets: Bullet[],
		mouse: Mouse,
		waterTerrainData: WaterTerrainData,
		serverClientSync: ServerClientSync,
		myHtmlElements: MyHtmlElements,
		collisionPoints: CollisionPoints
	) {
		this.colors = new Colors();
		this.serverClientSync = serverClientSync;
		this.myHtmlElements = myHtmlElements;
		this.map = map;
		this.collisionPoints = collisionPoints;
		this.bullets = bullets;
		this.mouse = mouse;
		this.gameScreen = <HTMLCanvasElement>this.myHtmlElements.gameScreen;
		this.editorScreen = <HTMLCanvasElement>this.myHtmlElements.editor.screen;
		this.mapScreen = <HTMLCanvasElement>this.myHtmlElements.mapScreen;
		this.helperScreen = <HTMLCanvasElement>this.myHtmlElements.helperScreen;
		this.ctxGame = this.gameScreen.getContext('2d');
		this.ctxMap = this.mapScreen.getContext('2d');
		this.ctxEditor = this.editorScreen.getContext('2d');

		this.playerSVG = new Image();
		this.playerSVG.src = 'img/player.svg';

		this.playerHandSVG = new Image();
		this.playerHandSVG.src = 'img/hand.svg';

		this.bushSVG = new Image();
		this.bushSVG.src = 'img/bush.svg';

		this.rockSVG = new Image();
		this.rockSVG.src = 'img/rock.svg';

		this.treeSVG = new Image();
		this.treeSVG.src = 'img/tree.svg';

		this.cursorSVG = new Image();
		this.cursorSVG.src = 'img/cursor.svg';

		this.loadingProgresSVG = new Image();
		this.loadingProgresSVG.src = 'img/loadingProgres.svg';

		this.loadingCircleSVG = new Image();
		this.loadingCircleSVG.src = 'img/loadingCircle.svg';

		this.pistolSVG = new Image();
		this.pistolSVG.src = 'img/pistol.svg';

		this.machinegunSVG = new Image();
		this.machinegunSVG.src = 'img/machinegun.svg';

		this.rifleSVG = new Image();
		this.rifleSVG.src = 'img/rifle.svg';

		this.shotgunSVG = new Image();
		this.shotgunSVG.src = 'img/shotgun.svg';

		this.hammerSVG = new Image();
		this.hammerSVG.src = 'img/hammer.svg';

		this.granadeSVG = new Image();
		this.granadeSVG.src = 'img/granade.svg';

		this.smokeSVG = new Image();
		this.smokeSVG.src = 'img/smoke.svg';

		this.smokeCloudSVG = new Image();
		this.smokeCloudSVG.src = 'img/smokeCloud.svg';

		this.rifleLootSVG = new Image();
		this.rifleLootSVG.src = 'img/rifleLoot.svg';

		this.waterTrianglePNG = new Image();
		this.waterTrianglePNG.src = 'img/waterTriangle.png';

		this.waterTerrainData = waterTerrainData;
		this.waterTrianglePNG.onload = () => {
			this.saveWaterPixels(TerrainType.WaterTriangle1);
			this.saveWaterPixels(TerrainType.WaterTriangle2);
			this.saveWaterPixels(TerrainType.WaterTriangle3);
			this.saveWaterPixels(TerrainType.WaterTriangle4);
			//this.waterTerrainData.write();
		};
		this.screenResize();
	}

	screenResize(): void {
		const el = this.myHtmlElements;
		this.gameScreen.width = window.innerWidth;
		this.gameScreen.height = window.innerHeight;
		const mapSize = Math.floor((window.innerWidth / 5 + window.innerHeight / 5) / 2);
		this.mapScreen.width = mapSize;
		this.mapScreen.height = mapSize;
		this.mapScreen.style.right = Math.floor(mapSize / 5).toString() + 'px';
		this.mapScreen.style.bottom = Math.floor(mapSize / 5).toString() + 'px';
		el.zoneSVG.setAttribute('width', window.innerWidth.toString());
		el.zoneSVG.setAttribute('height', window.innerHeight.toString());
		el.mapZoneSVG.style.right = Math.floor(mapSize / 5).toString() + 'px';
		el.mapZoneSVG.style.bottom = Math.floor(mapSize / 5).toString() + 'px';
		el.mapZoneSVG.setAttribute('width', mapSize.toString());
		el.mapZoneSVG.setAttribute('height', mapSize.toString());
		this.screenCenterX = window.innerWidth / 2;
		this.screenCenterY = window.innerHeight / 2;
		this.changeResolutionAdjustment();
	}

	calculateServerPosition(point: Point): Point {
		let x, y;
		if (this.screenCenterX > point.x) {
			x = (this.screenCenterX - point.x) * -1;
		}
		else {
			x = point.x - this.screenCenterX;
		}
		if (this.screenCenterY > point.y) {
			y = (this.screenCenterY - point.y) * -1;
		}
		else {
			y = point.y - this.screenCenterY;
		}
		x /= this.resolutionAdjustment;
		y /= this.resolutionAdjustment;
		x += this.myPlayerCenterX;
		y += this.myPlayerCenterY;
		return new Point(x, y);
	}

	/*
	private isPointInZone(serverPoint: Point, zoneSnapshot: ZoneSnapshot): boolean {
		//triangle
		const x = zoneSnapshot.oX - serverPoint.x;
		const y = zoneSnapshot.oY - serverPoint.y;
		const radius = Math.sqrt(x * x + y * y);
		if (radius <= zoneSnapshot.oR) return true;
		return false;
	}
	*/

	private changeResolutionAdjustment(): void {
		const defaultWidth = 1920;
		const defaultHeight = 1050;
		const width = this.gameScreen.width / defaultWidth;
		const height = this.gameScreen.height / defaultHeight;
		const finalAdjustment = (width + height) / 2;
		this.resolutionAdjustment = finalAdjustment;
	}

	private saveWaterPixels(waterType: TerrainType): void {
		const ctx = this.helperScreen.getContext('2d');
		this.helperScreen.width = this.waterTrianglePNG.width;
		this.helperScreen.height = this.waterTrianglePNG.height;
		//white background
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, this.helperScreen.width, this.helperScreen.height);
		let middleImage = this.waterTrianglePNG.width / 2;
		ctx.save();
		ctx.translate(middleImage, middleImage);
		switch (waterType) {
			case TerrainType.WaterTriangle1:
				ctx.rotate(0 * Math.PI / 180);
				break;
			case TerrainType.WaterTriangle2:
				ctx.rotate(90 * Math.PI / 180);
				break;
			case TerrainType.WaterTriangle3:
				ctx.rotate(180 * Math.PI / 180);
				break;
			case TerrainType.WaterTriangle4:
				ctx.rotate(270 * Math.PI / 180);
				break;
		}
		ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage);
		ctx.restore();

		//worker
		if (typeof Worker !== 'undefined') {
			const worker = new Worker('workerFindWater.js');
			worker.onmessage = (e) => {
				//console.log(new Date().getTime() - e.data.time, e.data);
				this.waterTerrainData.setData(e.data.type, e.data.data);
			};
			const data = ctx.getImageData(0, 0, this.waterTrianglePNG.width, this.waterTrianglePNG.height).data;
			worker.postMessage({
				data,
				size: this.waterTrianglePNG.width,
				type: waterType,
				time: new Date().getTime()
			});
		}
		else {
			console.log("Your browser doesn't support web workers.");
		}
	}

	private drawMap(): void {
		const ctx = this.ctxMap;
		const el = this.myHtmlElements;
		//clear canvas
		ctx.clearRect(0, 0, this.mapScreen.width, this.mapScreen.height);
		//background
		ctx.fillStyle = this.colors.grass;
		ctx.fillRect(0, 0, this.mapScreen.width, this.mapScreen.height);
		const blockSize = this.mapScreen.width / (this.map.getSize() / this.map.getBlockSize());
		const sizeReduction = blockSize / this.map.getBlockSize();
		const biggerBlockSize = blockSize + blockSize / 50;
		//terrain
		for (const terrain of this.map.terrain) {
			const x = terrain.x * sizeReduction;
			const y = terrain.y * sizeReduction;
			if (terrain.type === TerrainType.Water) {
				ctx.fillStyle = this.colors.water;
				ctx.fillRect(x, y, biggerBlockSize, biggerBlockSize);
			}
			if (terrain.type !== TerrainType.Water) {
				const middleImage = biggerBlockSize / 2;
				ctx.save();
				ctx.translate(x + middleImage, y + middleImage);
				ctx.rotate(terrain.angle * Math.PI / 180);
				ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, blockSize, blockSize);
				ctx.restore();
			}
		}
		//player
		{
			const playerSize = blockSize / 3;
			const x = this.myPlayerCenterX * sizeReduction - playerSize / 2;
			const y = this.myPlayerCenterY * sizeReduction - playerSize / 2;
			ctx.drawImage(this.playerSVG, x, y, playerSize, playerSize);
		}
		//zone
		{
			if (this.innerCircle.radius && this.outerCircle.radius) {
				//inner
				{
					const x = this.innerCircle.x * sizeReduction;
					const y = this.innerCircle.y * sizeReduction;
					const radius = this.innerCircle.radius * sizeReduction;
					ctx.beginPath();
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
					ctx.strokeStyle = 'green';
					ctx.stroke();
				}
				//outer
				{
					const x = this.outerCircle.x * sizeReduction;
					const y = this.outerCircle.y * sizeReduction;
					const radius = this.outerCircle.radius * sizeReduction;
					/*
					ctx.beginPath();
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
					ctx.strokeStyle = 'red';
					ctx.stroke();
					*/
					//SVG change
					el.mapZoneCircle.setAttribute('r', radius.toString());
					el.mapZoneCircle.setAttribute('cx', x.toString());
					el.mapZoneCircle.setAttribute('cy', y.toString());
				}
			}
		}
	}

	drawEditor(editor: Editor): void {
		const ctx = this.ctxEditor;
		//clear canvas
		ctx.clearRect(0, 0, this.editorScreen.width, this.editorScreen.height);

		//grass
		ctx.fillStyle = this.colors.grass;
		ctx.fillRect(0, 0, this.editorScreen.width, this.editorScreen.height);

		//terrain blocks
		ctx.fillStyle = this.colors.water;
		for (const terrain of editor.terrains) {
			switch (terrain.type) {
				case TerrainType.Water:
					ctx.fillRect(terrain.x, terrain.y, editor.blockSize, editor.blockSize);
					break;
				case TerrainType.WaterTriangle1:
					ctx.drawImage(this.waterTrianglePNG, terrain.x, terrain.y, editor.blockSize, editor.blockSize);
					break;
				case TerrainType.WaterTriangle2:
				case TerrainType.WaterTriangle3:
				case TerrainType.WaterTriangle4:
					let middleImage = editor.blockSize / 2;
					ctx.save();
					ctx.translate(terrain.x + middleImage, terrain.y + middleImage);
					ctx.rotate(terrain.angle * Math.PI / 180);
					ctx.drawImage(
						this.waterTrianglePNG,
						-middleImage,
						-middleImage,
						editor.blockSize,
						editor.blockSize
					);
					ctx.restore();
					break;
			}
		}

		//terrain blocks under mouse
		let blockX, blockY;
		if (editor.getTerrainType() != null) {
			//x, y to [blocks]
			blockX = Math.floor(editor.getX() / editor.blockSize) * editor.blockSize;
			blockY = Math.floor(editor.getY() / editor.blockSize) * editor.blockSize;
			let angle = -1;
			switch (editor.getTerrainType()) {
				case TerrainType.Water:
					ctx.fillStyle = this.colors.water;
					ctx.fillRect(blockX, blockY, editor.blockSize, editor.blockSize);
					break;
				case TerrainType.Grass:
					ctx.fillStyle = this.colors.grass;
					ctx.fillRect(blockX, blockY, editor.blockSize, editor.blockSize);
					break;
				case TerrainType.WaterTriangle1:
					angle = 0;
					break;
				case TerrainType.WaterTriangle2:
					angle = 90;
					break;
				case TerrainType.WaterTriangle3:
					angle = 180;
					break;
				case TerrainType.WaterTriangle4:
					angle = 270;
					break;
			}
			if (angle !== -1) {
				//grass
				ctx.fillStyle = this.colors.grass;
				ctx.fillRect(blockX, blockY, editor.blockSize, editor.blockSize);
				let middleImage = editor.blockSize / 2;
				ctx.save();
				ctx.translate(blockX + middleImage, blockY + middleImage);
				ctx.rotate(angle * Math.PI / 180);
				ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, editor.blockSize, editor.blockSize);
				ctx.restore();
			}
		}

		//mapGrid
		ctx.fillStyle = this.colors.blockFrame;
		for (let i = 0; i < editor.getSize(); i++) {
			ctx.fillRect(i * editor.blockSize, 0, 1, editor.getSize() * editor.blockSize);
		}
		for (let i = 0; i < editor.getSize(); i++) {
			ctx.fillRect(0, i * editor.blockSize, editor.getSize() * editor.blockSize, 1);
		}

		if (editor.getTerrainType() != null) {
			//frame
			ctx.fillStyle = this.colors.blockFrameActive;
			ctx.fillRect(blockX, blockY, editor.blockSize, 1);
			ctx.fillRect(blockX, blockY + editor.blockSize, editor.blockSize, 1);

			ctx.fillRect(blockX, blockY, 1, editor.blockSize);
			ctx.fillRect(blockX + editor.blockSize, blockY, 1, editor.blockSize);
		}

		//objects
		ctx.save();
		if (editor.getObjectType() === 'delete') ctx.globalAlpha = 0.6;

		for (const rock of editor.rocks) {
			ctx.drawImage(this.rockSVG, rock.x, rock.y, rock.size, rock.size);
		}
		ctx.fillStyle = 'black';
		for (const wall of editor.walls) {
			ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
		}
		for (const bush of editor.bushes) {
			ctx.drawImage(this.bushSVG, bush.x, bush.y, bush.size, bush.size);
		}
		for (const tree of editor.trees) {
			ctx.drawImage(this.treeSVG, tree.x, tree.y, tree.size, tree.size);
		}
		ctx.restore();

		if (editor.getObjectType() === 'delete') {
			//delete object
			let deleteObject;
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

			if (deleteObject instanceof Rock) {
				ctx.drawImage(this.rockSVG, deleteObject.x, deleteObject.y, deleteObject.size, deleteObject.size);
			}
			if (deleteObject instanceof Bush) {
				ctx.drawImage(this.bushSVG, deleteObject.x, deleteObject.y, deleteObject.size, deleteObject.size);
			}
			if (deleteObject instanceof Tree) {
				ctx.drawImage(this.treeSVG, deleteObject.x, deleteObject.y, deleteObject.size, deleteObject.size);
			}
			if (deleteObject instanceof Wall) {
				ctx.fillStyle = 'black';
				ctx.fillRect(deleteObject.x, deleteObject.y, deleteObject.width, deleteObject.height);
			}
		}

		//objects under mouse
		if (editor.getObjectType()) {
			let size;
			switch (editor.getObjectType()) {
				case 'bush':
					size = editor.bush.size;
					ctx.drawImage(this.bushSVG, editor.getX() - size / 2, editor.getY() - size / 2, size, size);
					break;
				case 'rock':
					size = editor.rock.size;
					ctx.drawImage(this.rockSVG, editor.getX() - size / 2, editor.getY() - size / 2, size, size);
					break;
				case 'tree':
					size = editor.tree.size;
					ctx.drawImage(this.treeSVG, editor.getX() - size / 2, editor.getY() - size / 2, size, size);
					break;
				case 'rect':
					size = editor.rock.size;
					ctx.fillStyle = 'black';
					ctx.fillRect(editor.getX() - size / 2, editor.getY() - size / 2, size, size);
					break;
			}
		}
	}

	drawGame(snapshotManager: SnapshotManager, myPlayerId: number): void {
		const betweenSnapshots = snapshotManager.betweenSnapshots;
		const players = snapshotManager.players;
		if (!betweenSnapshots) return;
		const ctx = this.ctxGame;
		const el = this.myHtmlElements;
		this.drawMap();

		//clear canvas
		ctx.clearRect(0, 0, this.gameScreen.width, this.gameScreen.height);

		//water
		ctx.fillStyle = this.colors.water;
		ctx.fillRect(0, 0, this.gameScreen.width, this.gameScreen.height);

		//center of my player
		for (const player of players) {
			if (player.id === myPlayerId) {
				this.myPlayerCenterX = player.getCenterX();
				this.myPlayerCenterY = player.getCenterY();
			}
		}

		//grass blocks
		ctx.fillStyle = this.colors.grass;
		const blockSize = 300;
		for (const block of this.map.blocks) {
			const { x, y, size, isOnScreen } = this.howToDraw({ x: block.x, y: block.y, size: blockSize });
			if (isOnScreen) {
				ctx.fillRect(x, y, size, size);
			}
		}

		//water terrain blocks
		ctx.fillStyle = this.colors.water;
		for (const terrain of this.map.terrain) {
			const { x, y, width, height, isOnScreen } = this.howToDraw({
				x: terrain.x,
				y: terrain.y,
				size: terrain.size
			});
			if (isOnScreen) {
				if (terrain.type === TerrainType.Water) {
					ctx.fillRect(x, y, width, height);
				}
				else if (terrain.type === TerrainType.WaterTriangle1) {
					ctx.drawImage(this.waterTrianglePNG, x, y, width, height);
				}
				else if (
					terrain.type === TerrainType.WaterTriangle2 ||
					terrain.type === TerrainType.WaterTriangle3 ||
					terrain.type === TerrainType.WaterTriangle4
				) {
					let middleImage = width / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate(terrain.angle * Math.PI / 180);
					ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, width, height);
					ctx.restore();
				}
			}
		}

		//mapGrid
		ctx.fillStyle = this.colors.blockFrame;
		for (const block of this.map.blocks) {
			//top
			if (block.y === 0) {
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y,
					size: blockSize
				});
				if (isOnScreen) ctx.fillRect(x, y, size, 1);
			}
			//bottom
			{
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y + blockSize,
					size: blockSize
				});
				if (isOnScreen) ctx.fillRect(x, y, size, 1);
			}
			//left
			if (block.x === 0) {
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y,
					size: blockSize
				});
				if (isOnScreen) ctx.fillRect(x, y, 1, size);
			}
			//right
			{
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x + blockSize,
					y: block.y,
					size: blockSize
				});
				if (isOnScreen) ctx.fillRect(x, y, 1, size);
			}
		}

		//rocks
		for (const rock of this.map.rocks) {
			if (rock.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(rock);
				if (isOnScreen) {
					ctx.save();
					ctx.globalAlpha = rock.getOpacity();
					ctx.drawImage(this.rockSVG, x, y, size, size);
					ctx.restore();
				}
			}
		}

		//walls
		ctx.fillStyle = 'black';
		for (const rectangleObstacle of this.map.rectangleObstacles) {
			if (rectangleObstacle.isActive()) {
				const { x, y, width, height, isOnScreen } = this.howToDraw(rectangleObstacle);
				if (isOnScreen) {
					ctx.save();
					ctx.globalAlpha = rectangleObstacle.getOpacity();
					ctx.fillRect(x, y, width, height);
					ctx.restore();
				}
			}
		}

		//players
		{
			for (const player of players) {
				//pistol
				if (player.getWeapon() === Weapon.Pistol) {
					//draw pistol
					const gunSize = 200;
					const gunX = player.getCenterX() - gunSize / 2;
					const gunY = player.getCenterY() - gunSize / 2;
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: gunX,
						y: gunY,
						size: gunSize
					});
					if (isOnScreen) {
						let middleImage = size / 2;
						ctx.save();
						ctx.translate(x + middleImage, y + middleImage);
						ctx.rotate(player.getAngle() * Math.PI / 180);
						ctx.drawImage(this.pistolSVG, -middleImage, -middleImage, size, size);
						ctx.restore();
					}
				}

				//machinegun
				if (player.getWeapon() === Weapon.Machinegun) {
					const gunSize = 200;
					const gunX = player.getCenterX() - gunSize / 2;
					const gunY = player.getCenterY() - gunSize / 2;
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: gunX,
						y: gunY,
						size: gunSize
					});
					if (isOnScreen) {
						let middleImage = size / 2;
						ctx.save();
						ctx.translate(x + middleImage, y + middleImage);
						ctx.rotate(player.getAngle() * Math.PI / 180);
						ctx.drawImage(this.machinegunSVG, -middleImage, -middleImage, size, size);
						ctx.restore();
					}
				}

				//shotgun
				if (player.getWeapon() === Weapon.Shotgun) {
					const gunSize = 200;
					const gunX = player.getCenterX() - gunSize / 2;
					const gunY = player.getCenterY() - gunSize / 2;
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: gunX,
						y: gunY,
						size: gunSize
					});
					if (isOnScreen) {
						let middleImage = size / 2;
						ctx.save();
						ctx.translate(x + middleImage, y + middleImage);
						ctx.rotate(player.getAngle() * Math.PI / 180);
						ctx.drawImage(this.shotgunSVG, -middleImage, -middleImage, size, size);
						ctx.restore();
					}
				}

				//rifle
				if (player.getWeapon() === Weapon.Rifle) {
					const gunSize = 200;
					const gunX = player.getCenterX() - gunSize / 2;
					const gunY = player.getCenterY() - gunSize / 2;
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: gunX,
						y: gunY,
						size: gunSize
					});
					if (isOnScreen) {
						let middleImage = size / 2;
						ctx.save();
						ctx.translate(x + middleImage, y + middleImage);
						ctx.rotate(player.getAngle() * Math.PI / 180);
						ctx.drawImage(this.rifleSVG, -middleImage, -middleImage, size, size);
						ctx.restore();
					}
				}

				//hammer
				if (player.getWeapon() === Weapon.Hammer) {
					const gunSize = 200;
					const gunX = player.getCenterX() - gunSize / 2;
					const gunY = player.getCenterY() - gunSize / 2;
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: gunX,
						y: gunY,
						size: gunSize
					});
					if (isOnScreen) {
						let middleImage = size / 2;
						ctx.save();
						ctx.translate(x + middleImage, y + middleImage);
						ctx.rotate(player.getHammerAngle() * Math.PI / 180);
						ctx.drawImage(this.hammerSVG, -middleImage, -middleImage, size, size);
						ctx.restore();

						if (this.collisionPoints.isReady()) {
							//collisionPoints
							ctx.fillStyle = this.colors.collisionPoint;
							for (const point of this.collisionPoints.hammer[player.getHammerAngle()]) {
								const { x, y, size } = this.howToDraw({
									x: player.getCenterX() - 100 + point.x,
									y: player.getCenterY() - 100 + point.y,
									size: 1
								});
								ctx.fillRect(x, y, size, size);
							}
						}
					}
				}

				//player hands
				if (
					player.getWeapon() === Weapon.Hand ||
					player.getWeapon() === Weapon.Granade ||
					player.getWeapon() === Weapon.Smoke
				) {
					for (let i = 0; i < 2; i++) {
						const { x, y, size, isOnScreen } = this.howToDraw({
							x: player.hands[i].getX(),
							y: player.hands[i].getY(),
							size: player.hands[i].size
						});
						if (isOnScreen) {
							ctx.drawImage(this.playerHandSVG, x, y, size, size);
							//hand collisionPoints
							ctx.fillStyle = this.colors.collisionPoint;
							for (const point of this.collisionPoints.hand) {
								const { x, y, size } = this.howToDraw({
									x: player.hands[i].getCenterX() + point.x,
									y: player.hands[i].getCenterY() + point.y,
									size: 1
								});
								ctx.fillRect(x, y, size, size);
							}

							//granade || smoke in hand
							if (
								(player.getWeapon() === Weapon.Granade || player.getWeapon() === Weapon.Smoke) &&
								i === 1
							) {
								const granadeShiftAngle = 30;
								const playerAngle = player.getAngle();
								const shiftZ = player.hands[1].radius;
								//triangle
								const shiftX = Math.sin(playerAngle * Math.PI / 180) * shiftZ;
								const shiftY = Math.cos(playerAngle * Math.PI / 180) * shiftZ;

								const { x, y, size, isOnScreen } = this.howToDraw({
									x: player.hands[i].getX() + shiftX,
									y: player.hands[i].getY() - shiftY,
									size: player.hands[i].size
								});

								if (isOnScreen) {
									let middleImage = size / 2;
									ctx.save();
									ctx.translate(x + middleImage, y + middleImage);
									ctx.rotate((playerAngle - granadeShiftAngle) * Math.PI / 180);
									let SVG;
									if (player.getWeapon() === Weapon.Granade) SVG = this.granadeSVG;

									if (player.getWeapon() === Weapon.Smoke) SVG = this.smokeSVG;
									ctx.drawImage(SVG, -middleImage, -middleImage, size, size);
									ctx.restore();
								}
							}
						}
					}
				}

				//player body
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: player.getX(),
					y: player.getY(),
					size: player.size
				});
				if (isOnScreen) {
					ctx.drawImage(this.playerSVG, x, y, size, size);
					//collisionPoints
					ctx.fillStyle = this.colors.collisionPoint;
					for (const point of this.collisionPoints.body) {
						const { x, y, size } = this.howToDraw({
							x: player.getCenterX() + point.x,
							y: player.getCenterY() + point.y,
							size: 1
						});
						ctx.fillRect(x, y, size, size);
					}
				}
			}
		}

		//granades
		for (const granade of betweenSnapshots.g) {
			const granadeSize = 30 * granade.b;
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: granade.x - granadeSize / 2,
				y: granade.y - granadeSize / 2,
				size: granadeSize
			});
			if (isOnScreen) {
				let middleImage = size / 2;
				ctx.save();
				ctx.translate(x + middleImage, y + middleImage);
				ctx.rotate(granade.a * Math.PI / 180);
				if (granade.t === 'g') {
					ctx.drawImage(this.granadeSVG, -middleImage, -middleImage, size, size);
				}
				if (granade.t === 's') {
					ctx.drawImage(this.smokeSVG, -middleImage, -middleImage, size, size);
				}
				ctx.restore();
			}
		}

		//bullets
		ctx.fillStyle = this.colors.bullet;
		for (const bullet of betweenSnapshots.b) {
			/*
			//bullet point
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: bullet.x,
				y: bullet.y,
				size: 1
			});
			if (isOnScreen) {
				ctx.fillRect(x, y, size, size);
			}
			*/

			//////////////////  bullet lines
			{
				let thereIsLine = false;
				//set end
				for (const line of this.bulletLines) {
					if (line.id === bullet.id) {
						line.setEnd(bullet.x, bullet.y);
						thereIsLine = true;
						break;
					}
				}
				//create line
				if (!thereIsLine) {
					const newLine = new BulletLine(bullet.id, bullet.x, bullet.y);
					this.bulletLines.push(newLine);
				}
			}
			//////////////////  bullet lines
		}
		//draw bullet lines
		for (const line of this.bulletLines) {
			for (const partLine of line.parts) {
				if (partLine.isActive()) {
					//draw part
					ctx.save();
					ctx.globalAlpha = 0.7 - partLine.getAge() / 14.3;
					ctx.beginPath();
					const { x: startX, y: startY } = this.howToDraw({
						x: partLine.startX,
						y: partLine.startY,
						size: 1
					});
					ctx.moveTo(startX, startY);
					const { x: endX, y: endY } = this.howToDraw({
						x: partLine.endX,
						y: partLine.endY,
						size: 1
					});
					ctx.lineTo(endX, endY);
					ctx.lineWidth = 3 - partLine.getAge() / 3.33;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.restore();
					partLine.increaseAge();
				}
			}
		}
		//delete bullet lines
		for (let i = this.bulletLines.length - 1; i >= 0; i--) {
			if (!this.bulletLines[i].isActive()) {
				this.bulletLines.splice(i, 1);
			}
		}

		//loot
		for (const loot of betweenSnapshots.l) {
			const { x, y, size, isOnScreen } = this.howToDraw(loot);
			ctx.drawImage(this.rifleLootSVG, x, y, size, size);
		}

		//bushes
		for (const bush of this.map.bushes) {
			if (bush.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(bush);
				if (isOnScreen) {
					ctx.save();
					ctx.globalAlpha = bush.getOpacity();
					ctx.drawImage(this.bushSVG, x, y, size, size);
					ctx.restore();
				}
			}
		}

		//trees
		for (const tree of this.map.trees) {
			if (tree.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(tree);
				if (isOnScreen) {
					ctx.save();
					ctx.globalAlpha = tree.getOpacity();
					ctx.drawImage(this.treeSVG, x, y, size, size);
					ctx.restore();
				}
			}
		}

		//smokes
		for (const smoke of betweenSnapshots.s) {
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: smoke.x - smoke.s / 2,
				y: smoke.y - smoke.s / 2,
				size: smoke.s
			});
			if (isOnScreen) {
				ctx.save();
				ctx.globalAlpha = smoke.o;
				ctx.drawImage(this.smokeCloudSVG, x, y, size, size);
				ctx.restore();
			}
		}

		//zone
		//outer circle
		/*
		this.outerCircle.x = betweenSnapshots.z.oX;
		this.outerCircle.y = betweenSnapshots.z.oY;
		this.outerCircle.radius = betweenSnapshots.z.oR;
		*/
		this.outerCircle.x = snapshotManager.zone.outerCircle.getCenterX();
		this.outerCircle.y = snapshotManager.zone.outerCircle.getCenterY();
		this.outerCircle.radius = snapshotManager.zone.outerCircle.getRadius();

		const { x, y } = this.howToDraw({
			x: this.outerCircle.x,
			y: this.outerCircle.y,
			size: 1
		});

		const outerRadius = this.outerCircle.radius * this.resolutionAdjustment;

		/*
		//circle
		ctx.beginPath();
		ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'red';
		ctx.stroke();
		*/

		//SVG change opacity
		let change = 0.003;
		if (this.outerCircle.opacity > 0.6) this.outerCircle.opacityDirection = -1;
		if (this.outerCircle.opacity < 0.2) this.outerCircle.opacityDirection = 1;
		this.outerCircle.opacity += change * this.outerCircle.opacityDirection;
		el.zoneCircle.setAttribute('r', outerRadius.toString());
		el.zoneCircle.setAttribute('cx', x.toString());
		el.zoneCircle.setAttribute('cy', y.toString());
		el.zoneRect.setAttribute('opacity', this.outerCircle.opacity.toString());

		{
			//inner circle
			/*
			this.innerCircle.x = betweenSnapshots.z.iX;
			this.innerCircle.y = betweenSnapshots.z.iY;
			this.innerCircle.radius = betweenSnapshots.z.iR;
			*/
			this.innerCircle.x = snapshotManager.zone.innerCircle.getCenterX();
			this.innerCircle.y = snapshotManager.zone.innerCircle.getCenterY();
			this.innerCircle.radius = snapshotManager.zone.innerCircle.getRadius();

			/*
			const { x, y } = this.howToDraw({
				x: newerSnapshot.z.iX,
				y: newerSnapshot.z.iY,
				size: 1
			});
			const innerRadius = newerSnapshot.z.iR * this.resolutionAdjustment;
			ctx.beginPath();
			ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
			ctx.strokeStyle = 'green';
			ctx.stroke();
			*/
		}

		//info
		{
			ctx.font = '20px Arial';
			ctx.fillStyle = this.colors.text;
			const x = 15;
			let row = 30;
			let rowMultiple = 0;
			//ctx.fillText('snapshots: ' + this.snapshots.length, x, row * ++rowMultiple);
			ctx.fillText('newerSnapshots: ' + snapshotManager.sumaNewer, x, row * ++rowMultiple);
			ctx.fillText('ping: ' + this.serverClientSync.getPing(), x, row * ++rowMultiple);
			ctx.fillText('timeDiference: ' + this.serverClientSync.getTimeDiference(), x, row * ++rowMultiple);
			ctx.fillText('drawDelay: ' + this.serverClientSync.getDrawDelay(), x, row * ++rowMultiple);
			if (!snapshotManager.olderExists) {
				ctx.fillText('olderSnapshot missing', x, row * ++rowMultiple);
			}
			if (!snapshotManager.newerExists) {
				ctx.fillText('newerSnapshot missing', x, row * ++rowMultiple);
			}
		}

		//cursor
		/*
		const size = 35;
		ctx.drawImage(
			this.cursorSVG,
			this.mouse.x - size * this.resolutionAdjustment / 2,
			this.mouse.y - size * this.resolutionAdjustment / 2,
			size * this.resolutionAdjustment,
			size * this.resolutionAdjustment
		);
		*/
	}

	private howToDraw(gameObject: RoundObject | RectObject | RectangleObstacle | RoundObstacle): DrawData {
		//size
		let size = 0;
		let width = 0;
		let height = 0;
		//round or square
		if ((<RoundObject>gameObject).size) {
			size = (<RoundObject>gameObject).size * this.resolutionAdjustment;
			width = size;
			height = size;
		}
		else {
			//rect
			width = (<RectObject>gameObject).width * this.resolutionAdjustment;
			height = (<RectObject>gameObject).height * this.resolutionAdjustment;
		}
		//animate shift
		let animateShiftX = 0;
		let animateShiftY = 0;
		if (gameObject instanceof RoundObstacle) {
			const animateShift = gameObject.animate();
			animateShiftX = animateShift.x;
			animateShiftY = animateShift.y;
		}
		//positions on screen
		const x =
			this.screenCenterX + (gameObject.x + animateShiftX - this.myPlayerCenterX) * this.resolutionAdjustment;
		const y =
			this.screenCenterY + (gameObject.y + animateShiftY - this.myPlayerCenterY) * this.resolutionAdjustment;
		//Is is on the screen?
		let isOnScreen = true;
		if (x > this.gameScreen.width || x < -width || y > this.gameScreen.height || y < -height) {
			isOnScreen = false;
		}
		return {
			x,
			y,
			size,
			width,
			height,
			isOnScreen
		};
	}
}
