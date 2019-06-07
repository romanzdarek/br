import Player from './Player';
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
	private canvas: HTMLCanvasElement;
	private editorCanvas: HTMLCanvasElement;
	private helperCanvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private ctxEditor: CanvasRenderingContext2D;
	private playerSVG: HTMLImageElement;
	private playerHandSVG: HTMLImageElement;
	private bushSVG: HTMLImageElement;
	private rockSVG: HTMLImageElement;
	private treeSVG: HTMLImageElement;
	private pistolSVG: HTMLImageElement;
	private cursorSVG: HTMLImageElement;
	private loadingProgresSVG: HTMLImageElement;
	private loadingCircleSVG: HTMLImageElement;
	private waterTrianglePNG: HTMLImageElement;
	private waterTerrainData: WaterTerrainData;
	private resolutionAdjustment: number = 1;
	private screenCenterX: number;
	private screenCenterY: number;
	private map: Map;
	private player: Player;
	private bullets: Bullet[];
	private mouse: Mouse;

	private myPlayerCenterX: number = 0;
	private myPlayerCenterY: number = 0;

	private serverClientSync: ServerClientSync;
	private snapshots: Snapshot[] = [];
	private myHtmlElements: MyHtmlElements;

	constructor(
		map: Map,
		player: Player,
		gameSnapshots: Snapshot[],
		bullets: Bullet[],
		mouse: Mouse,
		waterTerrainData: WaterTerrainData,
		serverClientSync: ServerClientSync,
		myHtmlElements: MyHtmlElements
	) {
		this.serverClientSync = serverClientSync;
		this.myHtmlElements = myHtmlElements;
		this.map = map;
		this.player = player;
		this.snapshots = gameSnapshots;
		this.bullets = bullets;
		this.mouse = mouse;
		this.canvas = <HTMLCanvasElement>this.myHtmlElements.gameScreen;
		this.editorCanvas = <HTMLCanvasElement>this.myHtmlElements.editor.screen;
		this.helperCanvas = <HTMLCanvasElement>document.getElementById('helper');
		this.ctx = this.canvas.getContext('2d');
		this.ctxEditor = this.editorCanvas.getContext('2d');

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
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.screenCenterX = window.innerWidth / 2;
		this.screenCenterY = window.innerHeight / 2;
		this.changeResolutionAdjustment();
	}

	private changeResolutionAdjustment(): void {
		const defaultWidth = 1920;
		const defaultHeight = 1050;
		const width = this.canvas.width / defaultWidth;
		const height = this.canvas.height / defaultHeight;
		const finalAdjustment = (width + height) / 2;
		this.resolutionAdjustment = finalAdjustment;
	}

	private saveWaterPixels(waterType: TerrainType): void {
		const ctx = this.helperCanvas.getContext('2d');
		this.helperCanvas.width = this.waterTrianglePNG.width;
		this.helperCanvas.height = this.waterTrianglePNG.height;
		//white background
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, this.helperCanvas.width, this.helperCanvas.height);
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

	drawEditor(editor: Editor): void {
		const ctx = this.ctxEditor;
		//clear canvas
		ctx.clearRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

		//grass
		ctx.fillStyle = '#A2CB69';
		ctx.fillRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

		//terrain blocks
		ctx.fillStyle = '#69A2E0';
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
					ctx.fillStyle = '#69A2E0';
					ctx.fillRect(blockX, blockY, editor.blockSize, editor.blockSize);
					break;
				case TerrainType.Grass:
					ctx.fillStyle = '#A2CB69';
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
				ctx.fillStyle = '#A2CB69';
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
		ctx.fillStyle = 'gray';
		for (let i = 0; i < editor.getWidth(); i++) {
			ctx.fillRect(i * editor.blockSize, 0, 1, editor.getHeight() * editor.blockSize);
		}
		for (let i = 0; i < editor.getHeight(); i++) {
			ctx.fillRect(0, i * editor.blockSize, editor.getWidth() * editor.blockSize, 1);
		}

		if (editor.getTerrainType() != null) {
			//frame
			ctx.fillStyle = 'red';
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

	draw(): void {
		const ctx = this.ctx;
		//clear canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//water
		ctx.fillStyle = '#69A2E0';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		let percentShift = 0;
		let sumaNewerSnapshots = 0;
		let newerSnapshotMissing = false;
		let newerSnapshot;
		let olderSnapshot;

		//get my player center
		if (this.snapshots.length > 0 && this.serverClientSync.ready()) {
			//sort - zatim nutne pro simulaci pingu...
			this.snapshots.sort((a: Snapshot, b: Snapshot) => {
				return a.t - b.t;
			});
			const wantedSnapshotTime = this.serverClientSync.getServerTime() - this.serverClientSync.getDrawDelay();
			//find last older (or same <=) snapshot

			for (const snapshot of this.snapshots) {
				if (snapshot.t <= wantedSnapshotTime) olderSnapshot = snapshot;
			}
			//find first newer (or same >=) snapshot
			for (const snapshot of this.snapshots) {
				if (snapshot.t >= wantedSnapshotTime) {
					if (!newerSnapshot) newerSnapshot = snapshot;
					sumaNewerSnapshots++;
				}
			}

			//if newerSnapshot is missing use older...
			if (!newerSnapshot) {
				newerSnapshotMissing = true;
				newerSnapshot = olderSnapshot;
				this.serverClientSync.reset();
			}

			//change draw delay
			if (sumaNewerSnapshots > 3) this.serverClientSync.changeDrawDelay(-0.1);
			if (sumaNewerSnapshots < 3) this.serverClientSync.changeDrawDelay(0.1);

			//count my player position
			if (newerSnapshot && olderSnapshot) {
				const timeDistance = newerSnapshot.t - olderSnapshot.t;
				const distanceOlderFromWantedTime = wantedSnapshotTime - olderSnapshot.t;
				if (timeDistance) {
					percentShift = distanceOlderFromWantedTime / timeDistance;
				}
				const xDiference = Math.abs(newerSnapshot.p[0].x - olderSnapshot.p[0].x);
				const yDiference = Math.abs(newerSnapshot.p[0].y - olderSnapshot.p[0].y);
				let directionX = 1;
				let directionY = 1;
				if (newerSnapshot.p[0].x < olderSnapshot.p[0].x) directionX = -1;
				if (newerSnapshot.p[0].y < olderSnapshot.p[0].y) directionY = -1;
				let calculatedX = olderSnapshot.p[0].x + xDiference * percentShift * directionX;
				let calculatedY = olderSnapshot.p[0].y + yDiference * percentShift * directionY;
				this.myPlayerCenterX = calculatedX + this.player.size / 2;
				this.myPlayerCenterY = calculatedY + this.player.size / 2;
			}
		}
		//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

		//grass blocks
		ctx.fillStyle = '#A2CB69';
		const blockSize = this.map.blocks[1].x;
		for (const block of this.map.blocks) {
			const { x, y, size, isOnScreen } = this.howToDraw({ x: block.x, y: block.y, size: blockSize });
			if (isOnScreen) {
				ctx.fillRect(x, y, size, size);
			}
		}

		//water terrain blocks
		ctx.fillStyle = '#69A2E0';
		for (const terrain of this.map.terrain) {
			const { x, y, width, height, isOnScreen } = this.howToDraw({
				x: terrain.x,
				y: terrain.y,
				width: terrain.width,
				height: terrain.height
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
		ctx.fillStyle = 'gray';
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

		//pistol
		/*
		{
			const { x, y, size } = this.howToDraw({
				x: this.player.gun.getX(),
				y: this.player.gun.getY(),
				size: this.player.gun.size
			});
			const middleImage = size / 2;
			this.ctx.save();
			this.ctx.translate(x + middleImage, y + middleImage);
			this.ctx.rotate(this.player.gun.getAngle() * Math.PI / 180);
			ctx.drawImage(this.pistolSVG, -middleImage, -middleImage, size, size);
			this.ctx.restore();
		}
		*/

		//players
		{
			//1. urcime si cas pred nejakou dobou a budeme hledat snimky hry pred timto a za timto bodem
			//2. nemuzeme se spolehnout jen na cas klienta a musime nejperve synchronizovat
			//3. dopocitame stav mezi snimky
			//4. vykreslime

			//count positions
			if (olderSnapshot && newerSnapshot) {
				//all players from server
				for (let i = 0; i < newerSnapshot.p.length; i++) {
					if (newerSnapshot.p[i] && olderSnapshot.p[i]) {
						const newer = newerSnapshot.p[i];
						const older = olderSnapshot.p[i];
						let xDiference = Math.abs(newer.x - older.x);
						let yDiference = Math.abs(newer.y - older.y);
						let directionX = 1;
						let directionY = 1;
						if (newer.x < older.x) directionX = -1;
						if (newer.y < older.y) directionY = -1;
						let calculatedX = older.x + xDiference * percentShift * directionX;
						let calculatedY = older.y + yDiference * percentShift * directionY;

						const { x, y, size, isOnScreen } = this.howToDraw({
							x: calculatedX,
							y: calculatedY,
							size: this.player.size
						});
						if (isOnScreen) {
							ctx.drawImage(this.playerSVG, x, y, size, size);
							//player collision points
							ctx.fillStyle = 'blue';
							for (const point of this.player.collisionPoints) {
								const { x, y, size } = this.howToDraw({
									x: calculatedX + this.player.size / 2 + point.x,
									y: calculatedY + this.player.size / 2 + point.y,
									size: 1
								});
								ctx.fillRect(x, y, size, size);
							}
						}

						//player hands
						for (let i = 0; i < 2; i++) {
							xDiference = Math.abs(newer.h[i].x - older.h[i].x);
							yDiference = Math.abs(newer.h[i].y - older.h[i].y);
							(directionX = 1), (directionY = 1);
							if (newer.h[i].x < older.h[i].x) directionX = -1;
							if (newer.h[i].y < older.h[i].y) directionY = -1;
							calculatedX = older.h[i].x + xDiference * percentShift * directionX;
							calculatedY = older.h[i].y + yDiference * percentShift * directionY;

							const { x, y, size, isOnScreen } = this.howToDraw({
								x: calculatedX,
								y: calculatedY,
								size: this.player.hands[i].size
							});
							if (isOnScreen) {
								ctx.drawImage(this.playerHandSVG, x, y, size, size);
								//hand collisionPoints
								for (const point of this.player.hands[0].collisionPoints) {
									const { x, y, size } = this.howToDraw({
										x: calculatedX + this.player.hands[0].size / 2 + point.x,
										y: calculatedY + this.player.hands[0].size / 2 + point.y,
										size: 1
									});
									ctx.fillRect(x, y, size, size);
								}
							}
						}
					}
				}
			}
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

		//bullets
		ctx.fillStyle = 'red';
		for (const bullet of this.bullets) {
			const { x, y, size, isOnScreen } = this.howToDraw({
				x: bullet.getX(),
				y: bullet.getY(),
				size: bullet.size
			});
			if (isOnScreen) ctx.fillRect(x, y, size, size);
		}

		//loading
		const { time, max } = this.player.loading();
		if (time < max) {
			const maxViewLoadingSteps = 360;
			const passedViewLoadingSteps = maxViewLoadingSteps / (max / time);
			const loadingSVGSize = 100 * this.resolutionAdjustment;
			const middleImage = loadingSVGSize / 2;
			const x = this.screenCenterX - middleImage;
			const y = this.screenCenterY - middleImage - 150 * this.resolutionAdjustment;
			const timeToEnd = Math.round((max - time) / 60 * 10) / 10;
			//background
			ctx.save();
			ctx.globalAlpha = 0.2;
			ctx.drawImage(this.loadingCircleSVG, x, y, loadingSVGSize, loadingSVGSize);

			ctx.restore();
			for (let i = 0; i < passedViewLoadingSteps; i += 10) {
				this.ctx.save();
				this.ctx.translate(x + middleImage, y + middleImage);
				this.ctx.rotate(i * Math.PI / 180);
				ctx.drawImage(this.loadingProgresSVG, -middleImage, -middleImage, loadingSVGSize, loadingSVGSize);
				this.ctx.restore();
			}
			const fontSize = Math.floor(31 * this.resolutionAdjustment);
			ctx.font = fontSize + 'px Arial';
			ctx.fillStyle = 'white';
			ctx.fillText(timeToEnd.toString(), x + 28 * this.resolutionAdjustment, y + 59 * this.resolutionAdjustment);
		}

		//info
		ctx.font = '20px Arial';
		ctx.fillStyle = 'white';
		const x = 15;
		let row = 30;
		let rowMultiple = 0;
		ctx.fillText('snapshots: ' + this.snapshots.length, x, row * ++rowMultiple);
		ctx.fillText('newerSnapshots: ' + sumaNewerSnapshots, x, row * ++rowMultiple);
		ctx.fillText('ping: ' + this.serverClientSync.getPing(), x, row * ++rowMultiple);
		ctx.fillText('timeDiference: ' + this.serverClientSync.getTimeDiference(), x, row * ++rowMultiple);
		ctx.fillText('drawDelay: ' + this.serverClientSync.getDrawDelay(), x, row * ++rowMultiple);
		if (!olderSnapshot) {
			ctx.fillText('olderSnapshot missing', x, row * ++rowMultiple);
		}
		if (newerSnapshotMissing) {
			ctx.fillText('newerSnapshot missing', x, row * ++rowMultiple);
		}

		//cursor
		const mouseSize = 25;
		ctx.drawImage(
			this.cursorSVG,
			this.mouse.x - mouseSize * this.resolutionAdjustment / 2,
			this.mouse.y - mouseSize * this.resolutionAdjustment / 2,
			mouseSize * this.resolutionAdjustment,
			mouseSize * this.resolutionAdjustment
		);
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
		if (x > this.canvas.width || x < -width || y > this.canvas.height || y < -height) {
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
