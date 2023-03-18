import Player from './Player';
import { Weapon } from './Weapon';
import Map from './Map';
import { Mouse } from './Controller';
import WaterTerrainData from './WaterTerrainData';
import { TerrainType } from './Terrain';
import RoundObstacle from './obstacle/RoundObstacle';
import RectangleObstacle from './obstacle/RectangleObstacle';
import Tree from './obstacle/Tree';
import Rock from './obstacle/Rock';
import Bush from './obstacle/Bush';
import ServerClientSync from './ServerClientSync';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import Colors from './Colors';
import BulletLine from './BulletLine';
import CollisionPoints from './CollisionPoints';
import Point from './Point';
import SnapshotManager from './SnapshotManager';
import { LootType } from './LootType';
import Scope from './Scope';
import PlayerStats from './PlayerStats';
import { ObstacleType } from './obstacle/ObstacleType';

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
	private devicePixelRatio = 1;
	private scope: Scope;
	private snapshotManager: SnapshotManager;
	private gameScreen: HTMLCanvasElement;
	private editorScreen: HTMLCanvasElement;
	private mapScreen: HTMLCanvasElement;
	private helperScreen: HTMLCanvasElement;
	private ctxGame: CanvasRenderingContext2D;
	private ctxMap: CanvasRenderingContext2D;
	private ctxEditor: CanvasRenderingContext2D;
	private bushPNG: HTMLImageElement;
	private rockPNG: HTMLImageElement;

	private blockPNG: HTMLImageElement;
	private boxPNG: HTMLImageElement;

	private treePNG: HTMLImageElement;

	private pistolPNG: HTMLImageElement;
	private machinegunPNG: HTMLImageElement;
	private shotgunPNG: HTMLImageElement;
	private riflePNG: HTMLImageElement;
	private hammerPNG: HTMLImageElement;
	private clubPNG: HTMLImageElement;

	private cursorSVG: HTMLImageElement;
	private granadePNG: HTMLImageElement;
	private smokePNG: HTMLImageElement;
	private medkitPNG: HTMLImageElement;
	private smokeCloudPNG: HTMLImageElement;
	private loadingProgresSVG: HTMLImageElement;
	private loadingCircleSVG: HTMLImageElement;

	private waterTrianglePNG: HTMLImageElement;

	private pistolLootPNG: HTMLImageElement;
	private shotgunLootPNG: HTMLImageElement;
	private machinegunLootPNG: HTMLImageElement;
	private rifleLootPNG: HTMLImageElement;
	private hammerLootPNG: HTMLImageElement;
	private granadeLootPNG: HTMLImageElement;
	private smokeLootPNG: HTMLImageElement;
	private redAmmoLootPNG: HTMLImageElement;
	private greenAmmoLootPNG: HTMLImageElement;
	private blueAmmoLootPNG: HTMLImageElement;
	private orangeAmmoLootPNG: HTMLImageElement;
	private medkitLootPNG: HTMLImageElement;
	private vestLootPNG: HTMLImageElement;
	private scope2LootPNG: HTMLImageElement;
	private scope4LootPNG: HTMLImageElement;
	private scope6LootPNG: HTMLImageElement;
	private deadPlayerPNG: HTMLImageElement;
	private waterTerrainData: WaterTerrainData;
	private resolutionAdjustment: number = 1;
	private finalResolutionAdjustment: number = 1;
	private screenCenterX: number;
	private screenCenterY: number;
	private map: Map;
	private mouse: Mouse;
	myPlayer: Player;
	private myHtmlElements: MyHtmlElements;
	private colors: Colors;
	private bulletLines: BulletLine[] = [];
	private collisionPoints: CollisionPoints;

	private lastdrawTime = 0;

	constructor(
		map: Map,
		mouse: Mouse,
		waterTerrainData: WaterTerrainData,
		myHtmlElements: MyHtmlElements,
		collisionPoints: CollisionPoints,
		snapshotManager: SnapshotManager
	) {
		this.scope = new Scope();
		this.snapshotManager = snapshotManager;
		this.colors = new Colors();
		this.myHtmlElements = myHtmlElements;
		this.map = map;
		this.collisionPoints = collisionPoints;
		this.mouse = mouse;
		this.gameScreen = <HTMLCanvasElement>this.myHtmlElements.gameScreen;
		this.editorScreen = <HTMLCanvasElement>this.myHtmlElements.editor.screen;
		this.mapScreen = <HTMLCanvasElement>this.myHtmlElements.mapScreen;
		this.helperScreen = <HTMLCanvasElement>this.myHtmlElements.helperScreen;
		this.ctxGame = this.gameScreen.getContext('2d');
		this.ctxMap = this.mapScreen.getContext('2d');
		this.ctxEditor = this.editorScreen.getContext('2d');

		this.bushPNG = new Image();
		this.bushPNG.src = 'img/png/bush.png';

		this.rockPNG = new Image();
		this.rockPNG.src = 'img/png/rock.png';

		this.blockPNG = new Image();
		this.blockPNG.src = 'img/png/block.png';

		this.boxPNG = new Image();
		this.boxPNG.src = 'img/svg/box.png';

		this.boxPNG = new Image();
		this.boxPNG.src = 'img/png/box.png';

		this.treePNG = new Image();
		this.treePNG.src = 'img/png/tree.png';

		this.cursorSVG = new Image();
		this.cursorSVG.src = 'img/cursor.svg';

		this.loadingProgresSVG = new Image();
		this.loadingProgresSVG.src = 'img/loadingProgres.svg';

		this.loadingCircleSVG = new Image();
		this.loadingCircleSVG.src = 'img/loadingCircle.svg';

		this.pistolPNG = new Image();
		this.pistolPNG.src = 'img/png/pistol.png';

		this.machinegunPNG = new Image();
		this.machinegunPNG.src = 'img/png/machinegun.png';

		this.riflePNG = new Image();
		this.riflePNG.src = 'img/png/rifle.png';

		this.shotgunPNG = new Image();
		this.shotgunPNG.src = 'img/png/shotgun.png';

		this.hammerPNG = new Image();
		this.hammerPNG.src = 'img/png/hammer.png';

		this.clubPNG = new Image();
		this.clubPNG.src = 'img/png/club.png';

		this.granadePNG = new Image();
		this.granadePNG.src = 'img/png/grenade.png';

		this.smokePNG = new Image();
		this.smokePNG.src = 'img/png/smoke.png';

		this.medkitPNG = new Image();
		this.medkitPNG.src = 'img/png/medkit.png';

		this.smokeCloudPNG = new Image();
		this.smokeCloudPNG.src = 'img/png/smokeCloud.png';

		this.rifleLootPNG = new Image();
		this.rifleLootPNG.src = 'img/png/rifleLoot.png';

		this.pistolLootPNG = new Image();
		this.pistolLootPNG.src = 'img/png/pistolLoot.png';

		this.shotgunLootPNG = new Image();
		this.shotgunLootPNG.src = 'img/png/shotgunLoot.png';

		this.machinegunLootPNG = new Image();
		this.machinegunLootPNG.src = 'img/png/machinegunLoot.png';

		this.hammerLootPNG = new Image();
		this.hammerLootPNG.src = 'img/png/hammerLoot.png';

		this.granadeLootPNG = new Image();
		this.granadeLootPNG.src = 'img/png/grenadeLoot.png';

		this.smokeLootPNG = new Image();
		this.smokeLootPNG.src = 'img/png/smokeLoot.png';

		this.redAmmoLootPNG = new Image();
		this.redAmmoLootPNG.src = 'img/png/redAmmoLoot.png';

		this.greenAmmoLootPNG = new Image();
		this.greenAmmoLootPNG.src = 'img/png/greenAmmoLoot.png';

		this.blueAmmoLootPNG = new Image();
		this.blueAmmoLootPNG.src = 'img/png/blueAmmoLoot.png';

		this.orangeAmmoLootPNG = new Image();
		this.orangeAmmoLootPNG.src = 'img/png/orangeAmmoLoot.png';

		this.medkitLootPNG = new Image();
		this.medkitLootPNG.src = 'img/png/medkitLoot.png';
		this.vestLootPNG = new Image();
		this.vestLootPNG.src = 'img/png/vestLoot.png';
		this.scope2LootPNG = new Image();
		this.scope2LootPNG.src = 'img/png/scope2Loot.png';
		this.scope4LootPNG = new Image();
		this.scope4LootPNG.src = 'img/png/scope4Loot.png';
		this.scope6LootPNG = new Image();
		this.scope6LootPNG.src = 'img/png/scope6Loot.png';

		this.deadPlayerPNG = new Image();
		this.deadPlayerPNG.src = 'img/png/deadPlayer.png';

		this.waterTrianglePNG = new Image();
		this.waterTrianglePNG.src = 'img/waterTriangle.png';

		this.waterTerrainData = waterTerrainData;

		/*
		//water data
		this.waterTrianglePNG.onload = () => {
			this.saveWaterPixels(TerrainType.WaterTriangle1);
			this.saveWaterPixels(TerrainType.WaterTriangle2);
			this.saveWaterPixels(TerrainType.WaterTriangle3);
			this.saveWaterPixels(TerrainType.WaterTriangle4);
			this.waterTerrainData.write();
		};
		*/

		this.screenResize();
	}

	reset(): void {
		this.lastdrawTime = 0;
		this.myPlayer = null;
		this.scope = new Scope();
		// solves bullet line error
		// in some caces there can stay bullet lines without lineparts
		this.bulletLines = [];
	}

	screenResize(): void {
		const el = this.myHtmlElements;
		//gameScreen

		this.devicePixelRatio = window.devicePixelRatio || 1;
		this.gameScreen.width = window.innerWidth * this.devicePixelRatio;
		this.gameScreen.height = window.innerHeight * this.devicePixelRatio;
		el.zoneSVG.setAttribute('width', window.innerWidth.toString());
		el.zoneSVG.setAttribute('height', window.innerHeight.toString());
		//mapScreen
		//const mapSize = Math.floor((window.innerWidth / 6 + window.innerHeight / 6) / 2);
		this.mapScreen.width = 180 * this.devicePixelRatio;
		this.mapScreen.height = 180 * this.devicePixelRatio;

		if (window.innerHeight <= 600) {
			this.mapScreen.width = 100 * this.devicePixelRatio;
			this.mapScreen.height = 100 * this.devicePixelRatio;
		}
		el.mapZoneSVG.setAttribute('width', this.mapScreen.width.toString());
		el.mapZoneSVG.setAttribute('height', this.mapScreen.height.toString());
		//el.mapContainer.style.width = (mapSize + 10).toString() + 'px';
		//el.mapContainer.style.height = (mapSize + 10).toString() + 'px';

		//center
		this.screenCenterX = this.gameScreen.width / 2;
		this.screenCenterY = this.gameScreen.height / 2;
		this.changeResolutionAdjustment();
		if (this.myPlayer) {
			this.drawGame(this.myPlayer.id);
		}
	}

	calculateServerPosition(point: Point): Point {
		let x, y;
		if (this.screenCenterX > point.x) {
			x = (this.screenCenterX - point.x) * -1;
		} else {
			x = point.x - this.screenCenterX;
		}
		if (this.screenCenterY > point.y) {
			y = (this.screenCenterY - point.y) * -1;
		} else {
			y = point.y - this.screenCenterY;
		}
		x /= this.finalResolutionAdjustment;
		y /= this.finalResolutionAdjustment;
		x += this.myPlayer.getCenterX();
		y += this.myPlayer.getCenterY();
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
				ctx.rotate((0 * Math.PI) / 180);
				break;
			case TerrainType.WaterTriangle2:
				ctx.rotate((90 * Math.PI) / 180);
				break;
			case TerrainType.WaterTriangle3:
				ctx.rotate((180 * Math.PI) / 180);
				break;
			case TerrainType.WaterTriangle4:
				ctx.rotate((270 * Math.PI) / 180);
				break;
		}
		ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage);
		ctx.restore();

		//worker
		if (typeof Worker !== 'undefined') {
			const worker = new Worker('js/workerFindWater.js');
			worker.onmessage = (e) => {
				this.waterTerrainData.setData(e.data.type, e.data.data);
			};
			const data = ctx.getImageData(0, 0, this.waterTrianglePNG.width, this.waterTrianglePNG.height).data;
			worker.postMessage({
				data,
				size: this.waterTrianglePNG.width,
				type: waterType,
				time: new Date().getTime(),
			});
		} else {
			console.log("err: Your browser doesn't support web workers.");
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
				ctx.rotate((terrain.angle * Math.PI) / 180);
				ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, blockSize, blockSize);
				ctx.restore();
			}
		}
		//player
		{
			const playerSize = this.mapScreen.width / 30;
			const x = this.myPlayer.getCenterX() * sizeReduction;
			const y = this.myPlayer.getCenterY() * sizeReduction;
			ctx.beginPath();
			ctx.arc(x, y, playerSize / 2, 0, 2 * Math.PI);
			ctx.fillStyle = 'red';
			ctx.fill();
		}
		//zone
		//inner
		{
			const x = this.snapshotManager.zone.innerCircle.getCenterX() * sizeReduction;
			const y = this.snapshotManager.zone.innerCircle.getCenterY() * sizeReduction;
			const radius = this.snapshotManager.zone.innerCircle.getRadius() * sizeReduction;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.strokeStyle = 'green';
			ctx.stroke();
		}
		//outer
		{
			const x = this.snapshotManager.zone.outerCircle.getCenterX() * sizeReduction;
			const y = this.snapshotManager.zone.outerCircle.getCenterY() * sizeReduction;
			const radius = this.snapshotManager.zone.outerCircle.getRadius() * sizeReduction;
			//SVG change
			el.mapZoneCircle.setAttribute('r', (radius / this.devicePixelRatio).toString());
			el.mapZoneCircle.setAttribute('cx', (x / this.devicePixelRatio).toString());
			el.mapZoneCircle.setAttribute('cy', (y / this.devicePixelRatio).toString());
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
					ctx.rotate((terrain.angle * Math.PI) / 180);
					ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, editor.blockSize, editor.blockSize);
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
				ctx.rotate((angle * Math.PI) / 180);
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

		if (editor.getTerrainType()) {
			//frame
			ctx.fillStyle = this.colors.blockFrameActive;
			ctx.fillRect(blockX, blockY, editor.blockSize, 1);
			ctx.fillRect(blockX, blockY + editor.blockSize, editor.blockSize, 1);

			ctx.fillRect(blockX, blockY, 1, editor.blockSize);
			ctx.fillRect(blockX + editor.blockSize, blockY, 1, editor.blockSize);
		}

		// Obstacles
		ctx.save();
		if (!editor.getObstacleType()) ctx.globalAlpha = 0.6;

		for (const obstacle of editor.rectangleObstacles) {
			switch (obstacle.type) {
				case ObstacleType.Block:
					ctx.drawImage(this.blockPNG, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;
				case ObstacleType.Box:
					ctx.drawImage(this.boxPNG, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
					break;
			}
		}

		for (const obstacle of editor.roundObstacles) {
			switch (obstacle.type) {
				case ObstacleType.Rock:
					ctx.drawImage(this.rockPNG, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
					break;
				case ObstacleType.Bush:
					ctx.drawImage(this.bushPNG, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
					break;
				case ObstacleType.Tree:
					ctx.drawImage(this.treePNG, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
					break;
			}
		}

		ctx.restore();

		if (!editor.getObstacleType()) {
			//  Draw delete obstacle

			let deleteObstacle;

			for (let i = 0; i < editor.rectangleObstacles.length; i++) {
				const obstacle = editor.rectangleObstacles[i];
				if (
					obstacle.x <= editor.getX() &&
					obstacle.x + obstacle.width >= editor.getX() &&
					obstacle.y <= editor.getY() &&
					obstacle.y + obstacle.height >= editor.getY()
				) {
					deleteObstacle = obstacle;

					break;
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
					deleteObstacle = obstacle;

					break;
				}
			}

			if (deleteObstacle) {
				switch (deleteObstacle.type) {
					case ObstacleType.Rock:
						ctx.drawImage(
							this.rockPNG,
							deleteObstacle.x,
							deleteObstacle.y,
							(<RoundObstacle>deleteObstacle).size,
							(<RoundObstacle>deleteObstacle).size
						);
						break;
					case ObstacleType.Tree:
						ctx.drawImage(
							this.treePNG,
							deleteObstacle.x,
							deleteObstacle.y,
							(<RoundObstacle>deleteObstacle).size,
							(<RoundObstacle>deleteObstacle).size
						);
						break;
					case ObstacleType.Bush:
						ctx.drawImage(
							this.bushPNG,
							deleteObstacle.x,
							deleteObstacle.y,
							(<RoundObstacle>deleteObstacle).size,
							(<RoundObstacle>deleteObstacle).size
						);
						break;
					case ObstacleType.Box:
						ctx.drawImage(
							this.boxPNG,
							deleteObstacle.x,
							deleteObstacle.y,
							(<RectangleObstacle>deleteObstacle).width,
							(<RectangleObstacle>deleteObstacle).height
						);
						break;
					case ObstacleType.Block:
						ctx.drawImage(
							this.blockPNG,
							deleteObstacle.x,
							deleteObstacle.y,
							(<RectangleObstacle>deleteObstacle).width,
							(<RectangleObstacle>deleteObstacle).height
						);
						break;
				}
			}
		}

		// Obstacle under mouse
		if (editor.getObstacleType()) {
			let x = editor.getX();
			let y = editor.getY();

			if (editor.minShiftX > 1) {
				x = Math.floor(x / editor.minShiftX) * editor.minShiftX;
			}
			if (editor.minShiftY > 1) {
				y = Math.floor(y / editor.minShiftY) * editor.minShiftY;
			}

			let size;
			switch (editor.getObstacleType()) {
				case ObstacleType.Bush:
					size = editor.bush.size;
					ctx.drawImage(this.bushPNG, x - size / 2, y - size / 2, size, size);
					break;
				case ObstacleType.Rock:
					size = editor.rock.size;
					ctx.drawImage(this.rockPNG, x - size / 2, y - size / 2, size, size);
					break;
				case ObstacleType.Tree:
					size = editor.tree.size;
					ctx.drawImage(this.treePNG, x - size / 2, y - size / 2, size, size);
					break;
				case ObstacleType.Box:
					ctx.drawImage(this.boxPNG, x - editor.box.width / 2, y - editor.box.height / 2, editor.box.width, editor.box.height);
					break;
				case ObstacleType.Block:
					ctx.drawImage(this.blockPNG, x - editor.block.width / 2, y - editor.block.height / 2, editor.block.width, editor.block.height);
					break;
			}
		}
	}

	private frameRateAdjuster() {
		const now = Date.now();
		if (!this.lastdrawTime) this.lastdrawTime = now;
		const delayFromLastFrame = now - this.lastdrawTime;
		const defaultDelayBetweenFrame = 16.66666;
		this.lastdrawTime = now;
		return delayFromLastFrame / defaultDelayBetweenFrame;
	}

	private isPlayerUnderRoundObject(player: Player, roudObject: Tree | Bush): boolean {
		//triangle
		const x = player.getCenterX() - roudObject.getCenterX();
		const y = player.getCenterY() - roudObject.getCenterY();
		const radius = Math.sqrt(x * x + y * y);
		return radius < player.radius + roudObject.radius;
	}

	drawGame(myPlayerId: number): void {
		const adjustFrameRate = this.frameRateAdjuster();

		const betweenSnapshot = this.snapshotManager.betweenSnapshot;
		const players = this.snapshotManager.players;
		if (!betweenSnapshot) return;

		//spectate
		if (betweenSnapshot.i.spectate !== -1) {
			myPlayerId = betweenSnapshot.i.spectate;
		}
		//my player or spectate
		this.myPlayer = this.snapshotManager.getMyPlayer(myPlayerId);

		if (!this.myPlayer) return;

		//scope
		this.scope.setScope(this.snapshotManager.betweenSnapshot.i.s);

		this.finalResolutionAdjustment = this.scope.getFinalResolutionAdjustment(this.resolutionAdjustment, adjustFrameRate);

		this.drawMap();

		const ctx = this.ctxGame;
		const el = this.myHtmlElements;

		//clear canvas
		ctx.clearRect(0, 0, this.gameScreen.width, this.gameScreen.height);

		//water
		ctx.fillStyle = this.colors.water;
		ctx.fillRect(0, 0, this.gameScreen.width, this.gameScreen.height);

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
				size: terrain.size,
			});
			if (isOnScreen) {
				if (terrain.type === TerrainType.Water) {
					ctx.fillRect(x, y, width, height);
				} else if (terrain.type === TerrainType.WaterTriangle1) {
					ctx.drawImage(this.waterTrianglePNG, x, y, width, height);
				} else if (
					terrain.type === TerrainType.WaterTriangle2 ||
					terrain.type === TerrainType.WaterTriangle3 ||
					terrain.type === TerrainType.WaterTriangle4
				) {
					let middleImage = width / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((terrain.angle * Math.PI) / 180);
					ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, width, height);
					ctx.restore();
				}
			}
		}

		//water circles
		ctx.fillStyle = this.colors.waterCircle;
		for (const waterCircle of this.snapshotManager.waterCircles) {
			if (!waterCircle.isActive()) continue;
			waterCircle.flow(adjustFrameRate);
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: waterCircle.getX(),
				y: waterCircle.getY(),
				size: waterCircle.getSize(),
			});
			if (isOnScreen) {
				const radius = size / 2;
				ctx.save();
				ctx.globalAlpha = waterCircle.getOpacity();
				ctx.beginPath();
				ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
				ctx.fill();
				ctx.restore();
			}
		}

		//mapGrid
		ctx.fillStyle = this.colors.blockFrame;
		const size2 = 1 * this.resolutionAdjustment;
		for (const block of this.map.blocks) {
			//top
			if (block.y === 0) {
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y,
					size: blockSize,
				});
				if (isOnScreen) ctx.fillRect(x, y, size, size2);
			}
			//bottom
			{
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y + blockSize,
					size: blockSize,
				});
				if (isOnScreen) ctx.fillRect(x, y, size, size2);
			}
			//left
			if (block.x === 0) {
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x,
					y: block.y,
					size: blockSize,
				});
				if (isOnScreen) ctx.fillRect(x, y, size2, size);
			}
			//right
			{
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: block.x + blockSize,
					y: block.y,
					size: blockSize,
				});
				if (isOnScreen) ctx.fillRect(x, y, size2, size);
			}
		}

		// rocks
		for (const obstacle of this.map.roundObstacles) {
			if (obstacle.type !== ObstacleType.Rock) continue;
			const rock: Rock = <Rock>obstacle;

			if (rock.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(rock);
				if (isOnScreen) {
					/*
					ctx.save();
					ctx.globalAlpha = rock.getOpacity();
					ctx.drawImage(this.rockSVG, x, y, size, size);
					ctx.restore();
					*/

					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((rock.angle * Math.PI) / 180);
					ctx.globalAlpha = rock.getOpacity();
					ctx.drawImage(this.rockPNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
		}

		// rectangleObstacles
		for (const rectangleObstacle of this.map.rectangleObstacles) {
			if (rectangleObstacle.isActive()) {
				const { x, y, width, height, isOnScreen } = this.howToDraw({
					x: rectangleObstacle.x,
					y: rectangleObstacle.y,
					width: rectangleObstacle.width,
					height: rectangleObstacle.height,
				});
				if (isOnScreen) {
					let svgSource;

					switch (rectangleObstacle.type) {
						case ObstacleType.Block:
							svgSource = this.blockPNG;
							break;

						case ObstacleType.Box:
							svgSource = this.boxPNG;
							break;
					}

					ctx.save();
					ctx.globalAlpha = rectangleObstacle.getOpacity();
					ctx.drawImage(svgSource, x, y, width, height);
					ctx.restore();
				}
			}
		}

		//dead players
		for (const player of players) {
			if (player.alive()) continue;
			const { x, y, width, height, isOnScreen } = this.howToDraw({
				x: player.getX(),
				y: player.getY(),
				size: player.size,
			});
			if (isOnScreen) {
				ctx.drawImage(this.deadPlayerPNG, x, y, width, height);
			}
		}

		//loot
		for (const loot of betweenSnapshot.l) {
			const { x, y, size, isOnScreen } = this.howToDraw(loot);
			if (!isOnScreen) continue;
			let lootPNG;
			switch (loot.type) {
				case LootType.Pistol:
					lootPNG = this.pistolLootPNG;
					break;
				case LootType.Machinegun:
					lootPNG = this.machinegunLootPNG;
					break;
				case LootType.Shotgun:
					lootPNG = this.shotgunLootPNG;
					break;
				case LootType.Rifle:
					lootPNG = this.rifleLootPNG;
					break;

				case LootType.Smoke:
					lootPNG = this.smokeLootPNG;
					break;

				case LootType.Granade:
					lootPNG = this.granadeLootPNG;
					break;

				case LootType.Hammer:
					lootPNG = this.hammerLootPNG;
					break;

				case LootType.RedAmmo:
					lootPNG = this.redAmmoLootPNG;
					break;

				case LootType.BlueAmmo:
					lootPNG = this.blueAmmoLootPNG;
					break;

				case LootType.GreenAmmo:
					lootPNG = this.greenAmmoLootPNG;
					break;

				case LootType.OrangeAmmo:
					lootPNG = this.orangeAmmoLootPNG;
					break;

				case LootType.Vest:
					lootPNG = this.vestLootPNG;
					break;

				case LootType.Medkit:
					lootPNG = this.medkitLootPNG;
					break;

				case LootType.Scope2:
					lootPNG = this.scope2LootPNG;
					break;

				case LootType.Scope4:
					lootPNG = this.scope4LootPNG;
					break;

				case LootType.Scope6:
					lootPNG = this.scope6LootPNG;
					break;
			}
			ctx.drawImage(lootPNG, x, y, size, size);
		}

		//players
		for (const player of players) {
			if (!player.alive()) continue;

			//player body
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: player.getX(),
				y: player.getY(),
				size: player.size,
			});
			if (isOnScreen) {
				//vest
				const radius = size / 2;
				ctx.beginPath();
				ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
				let colorVest = this.colors.player;
				if (player.getVest()) colorVest = this.colors.vest;
				ctx.fillStyle = colorVest;
				ctx.fill();
				//body
				let bodyRadius = radius * 0.92;
				ctx.beginPath();
				ctx.arc(x + radius, y + radius, bodyRadius, 0, 2 * Math.PI);
				ctx.fillStyle = this.colors.player;
				ctx.fill();
				/*
				//collisionPoints
				if (this.collisionPoints.isReady()){
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
				*/
			}

			const gunSize = 280;
			//pistol
			if (player.getWeapon() === Weapon.Pistol) {
				//draw pistol
				const gunX = player.getCenterX() - gunSize / 2;
				const gunY = player.getCenterY() - gunSize / 2;
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: gunX,
					y: gunY,
					size: gunSize,
				});
				if (isOnScreen) {
					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((player.getAngle() * Math.PI) / 180);
					ctx.drawImage(this.pistolPNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
			//machinegun
			if (player.getWeapon() === Weapon.Machinegun) {
				const gunX = player.getCenterX() - gunSize / 2;
				const gunY = player.getCenterY() - gunSize / 2;
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: gunX,
					y: gunY,
					size: gunSize,
				});
				if (isOnScreen) {
					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((player.getAngle() * Math.PI) / 180);
					ctx.drawImage(this.machinegunPNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
			//shotgun
			if (player.getWeapon() === Weapon.Shotgun) {
				const gunX = player.getCenterX() - gunSize / 2;
				const gunY = player.getCenterY() - gunSize / 2;
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: gunX,
					y: gunY,
					size: gunSize,
				});
				if (isOnScreen) {
					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((player.getAngle() * Math.PI) / 180);
					ctx.drawImage(this.shotgunPNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
			//rifle
			if (player.getWeapon() === Weapon.Rifle) {
				const gunX = player.getCenterX() - gunSize / 2;
				const gunY = player.getCenterY() - gunSize / 2;
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: gunX,
					y: gunY,
					size: gunSize,
				});
				if (isOnScreen) {
					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((player.getAngle() * Math.PI) / 180);
					ctx.drawImage(this.riflePNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
			//hammer
			if (player.getWeapon() === Weapon.Hammer) {
				const gunX = player.getCenterX() - gunSize / 2;
				const gunY = player.getCenterY() - gunSize / 2;
				const { x, y, size, isOnScreen } = this.howToDraw({
					x: gunX,
					y: gunY,
					size: gunSize,
				});
				if (isOnScreen) {
					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((player.getHammerAngle() * Math.PI) / 180);
					//ctx.drawImage(this.hammerPNG, -middleImage, -middleImage, size, size);
					ctx.drawImage(this.clubPNG, -middleImage, -middleImage, size, size);

					ctx.restore();

					/*
					if (this.collisionPoints.isReady()) {
						//collisionPoints
						ctx.fillStyle = this.colors.collisionPoint;
						for (const point of this.collisionPoints.hammer[player.getHammerAngle()]) {
							const { x, y, size } = this.howToDraw({
								x: player.getCenterX() - gunSize / 2 + point.x,
								y: player.getCenterY() - gunSize / 2 + point.y,
								size: 1,
							});
							ctx.fillRect(x, y, size, size);
						}
					}
					*/
				}
			}

			//player hands
			if (
				player.getWeapon() === Weapon.Hand ||
				player.getWeapon() === Weapon.Granade ||
				player.getWeapon() === Weapon.Smoke ||
				player.getWeapon() === Weapon.Medkit
			) {
				for (let i = 0; i < 2; i++) {
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: player.hands[i].getX(),
						y: player.hands[i].getY(),
						size: player.hands[i].size,
					});
					if (isOnScreen) {
						const radius = size / 2;
						//hand border
						ctx.beginPath();
						ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
						ctx.fillStyle = this.colors.handBorder;
						ctx.fill();
						//hand
						const radiusHand = radius * 0.8;
						ctx.beginPath();
						ctx.arc(x + radius, y + radius, radiusHand, 0, 2 * Math.PI);
						ctx.fillStyle = this.colors.hand;
						ctx.fill();
						//hand collisionPoints
						/*
						if (this.collisionPoints.isReady()){
							ctx.fillStyle = this.colors.collisionPoint;
							for (const point of this.collisionPoints.hand) {
								const { x, y, size } = this.howToDraw({
									x: player.hands[i].getCenterX() + point.x,
									y: player.hands[i].getCenterY() + point.y,
									size: 1
								});
								ctx.fillRect(x, y, size, size);
							}
						}
						*/

						//granade || smoke || medkit in hand
						if ((player.getWeapon() === Weapon.Granade || player.getWeapon() === Weapon.Smoke || player.getWeapon() === Weapon.Medkit) && i === 1) {
							const playerAngle = player.getAngle();
							const percentSize = 1.2;
							const shiftZ = player.hands[i].radius * percentSize;
							//triangle
							const shiftX = Math.sin((playerAngle * Math.PI) / 180) * shiftZ;
							const shiftY = Math.cos((playerAngle * Math.PI) / 180) * shiftZ;

							const { x, y, size, isOnScreen } = this.howToDraw({
								x: player.hands[i].getCenterX() + shiftX - player.hands[i].radius * percentSize,
								y: player.hands[i].getCenterY() - shiftY - player.hands[i].radius * percentSize,
								size: player.hands[i].size * percentSize,
							});

							if (isOnScreen) {
								const granadeShiftAngle = 30;
								let middleImage = size / 2;
								ctx.save();
								ctx.translate(x + middleImage, y + middleImage);
								ctx.rotate(((playerAngle - granadeShiftAngle) * Math.PI) / 180);
								let SVG;
								if (player.getWeapon() === Weapon.Granade) SVG = this.granadePNG;
								if (player.getWeapon() === Weapon.Smoke) SVG = this.smokePNG;
								if (player.getWeapon() === Weapon.Medkit) SVG = this.medkitPNG;
								ctx.drawImage(SVG, -middleImage, -middleImage, size, size);
								ctx.restore();
							}
						}
					}
				}
			}
			//hand on weapon
			if (player.getWeapon() === Weapon.Pistol) {
				this.drawHandOnWeapon(player, 27, 0);
				this.drawHandOnWeapon(player, 60, 12);
			}
			if (player.getWeapon() === Weapon.Machinegun) {
				this.drawHandOnWeapon(player, 27, 0);
				this.drawHandOnWeapon(player, 75, 10);
			}
			if (player.getWeapon() === Weapon.Shotgun) {
				this.drawHandOnWeapon(player, 27, 0);
				this.drawHandOnWeapon(player, 75, 10);
			}
			if (player.getWeapon() === Weapon.Rifle) {
				this.drawHandOnWeapon(player, 27, 0);
				this.drawHandOnWeapon(player, 80, 9);
			}
			if (player.getWeapon() === Weapon.Hammer) {
				this.drawHandOnWeapon(player, 40, 30);
				this.drawHandOnWeapon(player, 40, -30);
			}
		}

		//blood
		for (const player of this.snapshotManager.players) {
			ctx.fillStyle = this.colors.collisionPoint;
			for (let i = player.bloods.length - 1; i >= 0; i--) {
				const blood = player.bloods[i];
				if (blood.getTimer() < blood.timerMax) {
					blood.shift();
					const bloodX = player.getCenterX() + blood.getX();
					const bloodY = player.getCenterY() + blood.getY();
					const { x, y, size, isOnScreen } = this.howToDraw({
						x: bloodX,
						y: bloodY,
						size: blood.size,
					});
					if (isOnScreen) {
						const alpha = 1 - blood.getTimer() / blood.timerMax;
						ctx.save();
						ctx.globalAlpha = alpha;
						ctx.fillRect(x, y, size, size);
						ctx.restore();
					}
				} else {
					player.bloods.splice(i, 1);
				}
			}
		}

		//granades
		for (const granade of betweenSnapshot.g) {
			const granadeSize = 40 * granade.b;
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: granade.x - granadeSize / 2,
				y: granade.y - granadeSize / 2,
				size: granadeSize,
			});
			if (isOnScreen) {
				let middleImage = size / 2;
				ctx.save();
				ctx.translate(x + middleImage, y + middleImage);
				ctx.rotate((granade.a * Math.PI) / 180);
				if (granade.t === 'g') {
					ctx.drawImage(this.granadePNG, -middleImage, -middleImage, size, size);
				}
				if (granade.t === 's') {
					ctx.drawImage(this.smokePNG, -middleImage, -middleImage, size, size);
				}
				ctx.restore();
			}
		}

		//bullet points
		/*
		ctx.fillStyle = 'red';
		for (const bullet of betweenSnapshot.b) {
			//bullet point
			const bulletRadius = 2;
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: bullet.x - bulletRadius,
				y: bullet.y - bulletRadius,
				size: bulletRadius * 2,
			});
			if (isOnScreen) {
				ctx.fillRect(x, y, size, size);
			}
		}
		*/

		this.createBulletLines();
		//draw bullet lines
		for (const line of this.bulletLines) {
			//if (!line.parts.length) console.log('empty bullet line');
			let partCounter = 0;
			for (const partLine of line.parts) {
				partCounter++;
				let baseAlpha = partCounter * 0.05 + 0.1;
				if (baseAlpha > 0.8) baseAlpha = 0.8;
				if (partLine.isActive()) {
					let finalAlpha = baseAlpha - partLine.getAge() / 14.3;
					if (finalAlpha < 0) finalAlpha = 0;
					const { x: startX, y: startY } = this.howToDraw({
						x: partLine.startX,
						y: partLine.startY,
						size: 1,
					});
					const { x: endX, y: endY } = this.howToDraw({
						x: partLine.endX,
						y: partLine.endY,
						size: 1,
					});

					//draw part
					ctx.save();
					ctx.globalAlpha = finalAlpha;
					ctx.beginPath();
					ctx.moveTo(startX, startY);
					ctx.lineTo(endX, endY);
					ctx.lineWidth = (6 - partLine.getAge() / 3.33) * this.finalResolutionAdjustment;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.restore();
					partLine.increaseAge();
				}
			}
		}

		// Bushes
		for (const obstacle of this.map.roundObstacles) {
			if (obstacle.type !== ObstacleType.Bush) continue;
			const bush: Bush = <Bush>obstacle;

			if (bush.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(bush);
				if (isOnScreen) {
					// am i under the tree?
					if (this.isPlayerUnderRoundObject(this.myPlayer, bush)) {
						bush.decreaseOpacity(adjustFrameRate);
					} else {
						bush.increaseOpacity(adjustFrameRate);
					}

					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((bush.angle * Math.PI) / 180);
					ctx.globalAlpha = bush.getOpacity();
					ctx.drawImage(this.bushPNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
		}

		// Trees
		for (const obstacle of this.map.roundObstacles) {
			if (obstacle.type !== ObstacleType.Tree) continue;
			const tree: Tree = <Tree>obstacle;

			if (tree.isActive()) {
				const { x, y, size, isOnScreen } = this.howToDraw(tree);
				if (isOnScreen) {
					if (this.isPlayerUnderRoundObject(this.myPlayer, tree)) {
						tree.decreaseOpacity(adjustFrameRate);
					} else {
						tree.increaseOpacity(adjustFrameRate);
					}

					let middleImage = size / 2;
					ctx.save();
					ctx.translate(x + middleImage, y + middleImage);
					ctx.rotate((tree.angle * Math.PI) / 180);
					ctx.globalAlpha = tree.getOpacity();
					ctx.drawImage(this.treePNG, -middleImage, -middleImage, size, size);
					ctx.restore();
				}
			}
		}

		//smokes
		for (const smoke of betweenSnapshot.s) {
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: smoke.x - smoke.s / 2,
				y: smoke.y - smoke.s / 2,
				size: smoke.s,
			});
			if (isOnScreen) {
				ctx.save();
				ctx.globalAlpha = smoke.o;
				ctx.drawImage(this.smokeCloudPNG, x, y, size, size);
				ctx.restore();
			}
		}

		//zone
		const {
			x,
			y,
			size: outerRadius,
		} = this.howToDraw({
			x: this.snapshotManager.zone.outerCircle.getCenterX(),
			y: this.snapshotManager.zone.outerCircle.getCenterY(),
			size: this.snapshotManager.zone.outerCircle.getRadius(),
		});

		el.zoneCircle.setAttribute('r', (outerRadius / this.devicePixelRatio).toString());
		el.zoneCircle.setAttribute('cx', (x / this.devicePixelRatio).toString());
		el.zoneCircle.setAttribute('cy', (y / this.devicePixelRatio).toString());

		//info
		/*
		{
			ctx.font = '20px Arial';
			ctx.fillStyle = this.colors.text;
			const x = 15;
			let row = 30;
			let rowMultiple = 8;
			//ctx.fillText('snapshots: ' + this.snapshots.length, x, row * ++rowMultiple);
			ctx.fillText('newerSnapshots: ' + this.snapshotManager.sumaNewer, x, row * ++rowMultiple);
			ctx.fillText('ping: ' + this.serverClientSync.getPing(), x, row * ++rowMultiple);
			ctx.fillText('timeDiference: ' + this.serverClientSync.getTimeDiference(), x, row * ++rowMultiple);
			ctx.fillText('drawDelay: ' + this.serverClientSync.getDrawDelay(), x, row * ++rowMultiple);
			if (!this.snapshotManager.olderExists) {
				ctx.fillText('olderSnapshot missing', x, row * ++rowMultiple);
			}
			if (!this.snapshotManager.newerExists) {
				ctx.fillText('newerSnapshot missing', x, row * ++rowMultiple);
			}
		}
		*/

		//healthBar
		el.healthBar.in.style.width = betweenSnapshot.i.h + '%';

		//loading
		const progres = Math.round((betweenSnapshot.i.l / betweenSnapshot.i.lE) * 100);
		const seconds = Math.round(((betweenSnapshot.i.lE - betweenSnapshot.i.l) / 1000) * 10) / 10;
		if (seconds && this.myPlayer.alive()) {
			el.takeLoot.style.display = 'none';
			el.loading.main.style.visibility = 'visible';
			el.loading.text.style.display = 'block';
			el.loading.text.textContent = betweenSnapshot.i.lT;
			let secondsString = seconds.toString();
			switch (secondsString) {
				case '0':
					secondsString = ' 0.0';
					break;
				case '1':
					secondsString = ' 1.0';
					break;
				case '2':
					secondsString = ' 2.0';
					break;
				case '3':
					secondsString = ' 3.0';
					break;
				case '4':
					secondsString = ' 4.0';
					break;
				case '5':
					secondsString = ' 5.0';
					break;
			}
			el.loading.counter.textContent = secondsString;
			el.loading.circle.setAttribute('stroke-dasharray', progres + ', 100');
		} else {
			el.loading.main.style.visibility = 'hidden';
			el.loading.text.style.display = 'none';
			//take loot info
			el.takeLoot.style.display = 'block';
			this.takeLootInfo();
		}

		//items
		el.items.redAmmo.textContent = this.snapshotManager.betweenSnapshot.i.r.toString();
		el.items.greenAmmo.textContent = this.snapshotManager.betweenSnapshot.i.g.toString();
		el.items.blueAmmo.textContent = this.snapshotManager.betweenSnapshot.i.b.toString();
		el.items.orangeAmmo.textContent = this.snapshotManager.betweenSnapshot.i.o.toString();

		el.items.item1in.textContent = this.itemName(this.snapshotManager.betweenSnapshot.i.i1);
		el.items.item2in.textContent = this.itemName(this.snapshotManager.betweenSnapshot.i.i2);
		//ammo color
		this.itemAmmoColor(1, this.snapshotManager.betweenSnapshot.i.i1);
		this.itemAmmoColor(2, this.snapshotManager.betweenSnapshot.i.i2);
		el.items.item3in.textContent = this.itemName(this.snapshotManager.betweenSnapshot.i.i3);
		let item4Text = this.itemName(this.snapshotManager.betweenSnapshot.i.i4);
		const item4Count = this.snapshotManager.betweenSnapshot.i.s4;
		if (item4Text) item4Text += ' ' + item4Count;
		el.items.item4in.textContent = item4Text;

		let item5Text = this.itemName(this.snapshotManager.betweenSnapshot.i.i5);
		const item5Count = this.snapshotManager.betweenSnapshot.i.s5;
		if (item5Text) item5Text += ' ' + item5Count;
		el.items.item5in.textContent = item5Text;

		//active item
		this.activeItem(betweenSnapshot.i.ai);

		//activeGunAmmo
		let ammo = '';
		if (
			this.myPlayer.getWeapon() === Weapon.Pistol ||
			this.myPlayer.getWeapon() === Weapon.Rifle ||
			this.myPlayer.getWeapon() === Weapon.Machinegun ||
			this.myPlayer.getWeapon() === Weapon.Shotgun
		) {
			let extraAmmoForActiveGun = 0;
			switch (this.myPlayer.getWeapon()) {
				// r g b o
				case Weapon.Pistol:
					extraAmmoForActiveGun = betweenSnapshot.i.o;
					break;
				case Weapon.Rifle:
					extraAmmoForActiveGun = betweenSnapshot.i.g;
					break;
				case Weapon.Machinegun:
					extraAmmoForActiveGun = betweenSnapshot.i.b;
					break;
				case Weapon.Shotgun:
					extraAmmoForActiveGun = betweenSnapshot.i.r;
					break;
			}

			ammo = betweenSnapshot.i.a.toString() + ' / ' + extraAmmoForActiveGun;
		} else if (this.myPlayer.getWeapon() === Weapon.Hand || this.myPlayer.getWeapon() === Weapon.Hammer) {
			ammo = '∞';
		} else if (this.myPlayer.getWeapon() === Weapon.Granade || this.myPlayer.getWeapon() === Weapon.Smoke) {
			ammo = item4Count.toString();
		} else if (this.myPlayer.getWeapon() === Weapon.Medkit) {
			ammo = item5Count.toString();
		}
		el.activeGunAmmo.textContent = ammo;

		//alive
		let count = 0;
		for (const player of this.snapshotManager.players) {
			if (player.alive()) count++;
		}
		el.alive.textContent = count.toString();

		//top items
		let display = 'none';
		if (this.snapshotManager.betweenSnapshot.i.s !== 1) {
			display = 'block';
			switch (this.snapshotManager.betweenSnapshot.i.s) {
				case 2:
					el.items.scope2.style.display = 'block';
					el.items.scope4.style.display = 'none';
					el.items.scope6.style.display = 'none';
					break;
				case 4:
					el.items.scope2.style.display = 'none';
					el.items.scope4.style.display = 'block';
					el.items.scope6.style.display = 'none';
					break;
				case 6:
					el.items.scope2.style.display = 'none';
					el.items.scope4.style.display = 'none';
					el.items.scope6.style.display = 'block';
					break;
			}
		}
		el.items.scope.style.display = display;
		display = 'none';
		if (this.snapshotManager.betweenSnapshot.i.v) display = 'block';
		el.items.vest.style.display = display;

		//messages
		this.snapshotManager.messageManager();
		el.messages.innerHTML = '';
		for (let i = this.snapshotManager.messages.length - 1; i >= 0; i--) {
			const message = this.snapshotManager.messages[i];
			const element = document.createElement('p');
			element.textContent = message.text;
			el.messages.appendChild(element);
		}

		//zone time
		if (this.snapshotManager.betweenSnapshot.z.hasOwnProperty('d')) {
			let text = '';
			if (this.snapshotManager.betweenSnapshot.z.d > 0) {
				text += this.snapshotManager.betweenSnapshot.z.d;
			} else {
				text = 'Zone is moving!';
			}
			el.zoneTimer.innerText = text;
		}

		//spectate text
		el.spectate.style.display = 'none';
		if (betweenSnapshot.i.spectateName) {
			el.spectateName.innerText = betweenSnapshot.i.spectateName;
			el.spectate.style.display = 'block';
		}
	}

	private drawHandOnWeapon(player: Player, shiftHandZ: number, shiftHandAngle: number): void {
		const ctx = this.ctxGame;
		let finalAngle = shiftHandAngle + player.getAngle();
		if (player.getWeapon() === Weapon.Hammer) finalAngle = shiftHandAngle + player.getHammerAngle();
		if (finalAngle >= 360) finalAngle -= 360;
		const shiftHandX = Math.sin((finalAngle * Math.PI) / 180) * shiftHandZ;
		const shiftHandY = Math.cos((finalAngle * Math.PI) / 180) * shiftHandZ;
		const handX = player.getCenterX() + shiftHandX - player.hands[0].radius;
		const handY = player.getCenterY() - shiftHandY - player.hands[0].radius;
		const { x, y, size, isOnScreen } = this.howToDraw({
			x: handX,
			y: handY,
			size: player.hands[0].size,
		});
		if (isOnScreen) {
			const radius = size / 2;
			//hand border
			ctx.beginPath();
			ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.colors.handBorder;
			ctx.fill();
			//hand
			const radiusHand = radius * 0.8;
			ctx.beginPath();
			ctx.arc(x + radius, y + radius, radiusHand, 0, 2 * Math.PI);
			ctx.fillStyle = this.colors.hand;
			ctx.fill();
		}
	}

	private createBulletLines(): void {
		for (const bullet of this.snapshotManager.betweenSnapshot.b) {
			let thereIsLine = false;
			//set end in line
			for (const line of this.bulletLines) {
				if (line.id === bullet.id) {
					line.setEnd(bullet.x, bullet.y);
					thereIsLine = true;
					break;
				}
			}
			//create new line
			if (!thereIsLine) this.bulletLines.push(new BulletLine(bullet.id, bullet.x, bullet.y));
		}
		//delete old bullet lines
		for (let i = this.bulletLines.length - 1; i >= 0; i--) {
			if (!this.bulletLines[i].isActive()) {
				this.bulletLines.splice(i, 1);
			}
		}
	}

	private activeItem(activeItem: number): void {
		const el = this.myHtmlElements;
		switch (activeItem) {
			case 1:
				el.items.item2.classList.remove('active');
				el.items.item3.classList.remove('active');
				el.items.item4.classList.remove('active');
				el.items.item5.classList.remove('active');
				break;
			case 2:
				el.items.item1.classList.remove('active');
				el.items.item3.classList.remove('active');
				el.items.item4.classList.remove('active');
				el.items.item5.classList.remove('active');
				break;

			case 3:
				el.items.item1.classList.remove('active');
				el.items.item2.classList.remove('active');
				el.items.item4.classList.remove('active');
				el.items.item5.classList.remove('active');
				break;

			case 4:
				el.items.item1.classList.remove('active');
				el.items.item2.classList.remove('active');
				el.items.item3.classList.remove('active');
				el.items.item5.classList.remove('active');
				break;

			case 5:
				el.items.item1.classList.remove('active');
				el.items.item2.classList.remove('active');
				el.items.item3.classList.remove('active');
				el.items.item4.classList.remove('active');
				break;
		}

		switch (activeItem) {
			case 1:
				if (!el.items.item1.classList.contains('active')) el.items.item1.classList.add('active');
				break;
			case 2:
				if (!el.items.item2.classList.contains('active')) el.items.item2.classList.add('active');
				break;
			case 3:
				if (!el.items.item3.classList.contains('active')) el.items.item3.classList.add('active');
				break;
			case 4:
				if (!el.items.item4.classList.contains('active')) el.items.item4.classList.add('active');
				break;
			case 5:
				if (!el.items.item5.classList.contains('active')) el.items.item5.classList.add('active');
				break;
		}
	}

	private itemAmmoColor(item: number, weapon: Weapon): void {
		let el;
		if (item === 1) {
			el = this.myHtmlElements.items.item1Ammo;
		} else if (item === 2) {
			el = this.myHtmlElements.items.item2Ammo;
		}
		let background = 'transparent';
		switch (weapon) {
			case Weapon.Pistol:
				background = 'orange';
				break;
			case Weapon.Machinegun:
				background = 'blue';
				break;
			case Weapon.Rifle:
				background = 'Green';
				break;
			case Weapon.Shotgun:
				background = 'red';
				break;
		}
		if (el) el.style.background = background;
	}

	private itemName(item: any): string {
		let weaponName: string = '';
		if (item === Weapon.Pistol) weaponName = 'Pistol';
		if (item === Weapon.Rifle) weaponName = 'Rifle';
		if (item === Weapon.Machinegun) weaponName = 'Machinegun';
		if (item === Weapon.Shotgun) weaponName = 'Shotgun';
		if (item === Weapon.Granade) weaponName = 'Grenade';
		if (item === Weapon.Smoke) weaponName = 'Smoke';
		if (item === Weapon.Hand) weaponName = 'Hands';
		if (item === Weapon.Hammer) weaponName = 'Hammer';
		if (item === Weapon.Medkit) weaponName = 'Medkit';
		return weaponName;
	}

	private takeLootInfo(): void {
		const el = this.myHtmlElements;
		let takeLootText = '';
		if (!this.snapshotManager.betweenSnapshot || !this.myPlayer.alive()) {
			el.takeLoot.innerText = takeLootText;
			return;
		}

		for (const loot of this.snapshotManager.betweenSnapshot.l) {
			const x = this.myPlayer.getCenterX() - (loot.x + loot.size / 2);
			const y = this.myPlayer.getCenterY() - (loot.y + loot.size / 2);
			const distance = Math.sqrt(x * x + y * y);
			const lootAndPlayerRadius = this.snapshotManager.players[0].radius + loot.size / 2;
			if (distance < lootAndPlayerRadius) {
				let lootName = '';
				switch (loot.type) {
					case LootType.BlueAmmo:
					case LootType.RedAmmo:
					case LootType.GreenAmmo:
					case LootType.OrangeAmmo:
						lootName = 'Ammo';
						break;
					case LootType.Pistol:
						lootName = 'Pistol';
						break;
					case LootType.Rifle:
						lootName = 'Rifle';
						break;
					case LootType.Machinegun:
						lootName = 'Machinegun';
						break;
					case LootType.Shotgun:
						lootName = 'Shotgun';
						break;
					case LootType.Scope2:
						lootName = '2X scope';
						break;
					case LootType.Scope4:
						lootName = '4X scope';
						break;
					case LootType.Scope6:
						lootName = '6X scope';
						break;
					case LootType.Granade:
						lootName = 'Grenade';
						break;
					case LootType.Smoke:
						lootName = 'Smoke';
						break;
					case LootType.Medkit:
						lootName = 'Medkit';
						break;
					case LootType.Vest:
						lootName = 'Vest';
						break;
					case LootType.Hammer:
						lootName = 'Hammer';
						break;
				}

				let quantity = '';
				if (loot.quantity) quantity += loot.quantity;
				takeLootText = lootName + ' ' + quantity + ' (E)';
				el.takeLoot.innerText = takeLootText;
				return;
			}
		}
		el.takeLoot.innerText = takeLootText;
	}

	private howToDraw(gameObject: RoundObject | RectObject | RectangleObstacle | RoundObstacle): DrawData {
		//size
		let size = 0;
		let width = 0;
		let height = 0;
		//round or square
		if ((<RoundObject>gameObject).size) {
			size = (<RoundObject>gameObject).size * this.finalResolutionAdjustment;
			width = size;
			height = size;
		} else {
			//rect
			width = (<RectObject>gameObject).width * this.finalResolutionAdjustment;
			height = (<RectObject>gameObject).height * this.finalResolutionAdjustment;
		}

		//positions on screen
		const x = this.screenCenterX + (gameObject.x - this.myPlayer.getCenterX()) * this.finalResolutionAdjustment;
		const y = this.screenCenterY + (gameObject.y - this.myPlayer.getCenterY()) * this.finalResolutionAdjustment;
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
			isOnScreen,
		};
	}

	gameOver(stats: PlayerStats, win: boolean, winnerName?: string): void {
		setTimeout(() => {
			const el = this.myHtmlElements;
			if (win || winnerName) {
				el.gameOverMenu.h1.textContent = 'Winner!';
				if (!stats.damageTaken) el.gameOverMenu.h1.textContent = 'Clean job!';

				if (winnerName) el.gameOverMenu.h1.textContent = winnerName + ' win';
				el.gameOverMenu.spectate.style.display = 'none';
			} else {
				el.gameOverMenu.h1.textContent = "You cried :'(";
				el.gameOverMenu.spectate.style.display = 'block';
			}
			el.open(el.gameOverMenu.main);
			//remove stats
			el.gameOverMenu.stats.innerHTML = '';
			const kills = document.createElement('p');
			kills.textContent = 'Kills: ' + stats.kills.toString();
			const damageDealt = document.createElement('p');
			damageDealt.textContent = 'Damage dealt: ' + stats.damageDealt.toString();
			const damageTaken = document.createElement('p');
			damageTaken.textContent = 'Damage taken: ' + stats.damageTaken.toString();
			const survive = document.createElement('p');
			const minutes = Math.floor(stats.survive / 60);
			const seconds = stats.survive - minutes * 60;
			const surviveTime = minutes + 'm ' + seconds + 's';
			survive.textContent = 'Survived: ' + surviveTime;
			el.gameOverMenu.stats.appendChild(kills);
			el.gameOverMenu.stats.appendChild(damageDealt);
			el.gameOverMenu.stats.appendChild(damageTaken);
			if (!win) el.gameOverMenu.stats.appendChild(survive);
		}, 2000);
	}
}
