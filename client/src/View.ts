import Player from './Player';
import Map from './Map';
import { Mouse } from './Controller';
import WaterTerrainData from './WaterTerrainData';
import { TerrainType } from './Terrain';
import Bullet from './Bullet';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import Tree from './Tree';
import ServerClientSync from './ServerClientSync';

import { Controller } from './Controller';

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
	private helperCanvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
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

	private startDraw = false;
	private lastDrawFrameTS: number;
	private lastDrawFrame: number;
	private lastDraw: any;

	private serverClientSync: ServerClientSync;

	constructor(
		map: Map,
		player: Player,
		bullets: Bullet[],
		mouse: Mouse,
		waterTerrainData: WaterTerrainData,
		serverClientSync: ServerClientSync
	) {
		this.serverClientSync = serverClientSync;
		this.map = map;
		this.player = player;
		this.bullets = bullets;
		this.mouse = mouse;
		this.canvas = <HTMLCanvasElement>document.getElementById('gameScreen');
		this.helperCanvas = <HTMLCanvasElement>document.getElementById('helper');
		this.ctx = this.canvas.getContext('2d');

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
		//console.log('finalAdjustment:', finalAdjustment);
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

	draw(): void {
		const ctx = this.ctx;
		//clear canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//water
		ctx.fillStyle = '#69A2E0';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
					this.ctx.save();
					this.ctx.translate(x + middleImage, y + middleImage);
					this.ctx.rotate(terrain.angle * Math.PI / 180);
					this.ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage, width, height);
					this.ctx.restore();
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

		//player
		{
			//hands
			for (const hand of this.player.hands) {
				const { x, y, size } = this.howToDraw({
					x: hand.getX(),
					y: hand.getY(),
					size: hand.size
				});
				ctx.drawImage(this.playerHandSVG, x, y, size, size);
				//collisionPoints
				for (const point of hand.collisionPoints) {
					const { x, y, size } = this.howToDraw({
						x: hand.getCenterX() + point.x,
						y: hand.getCenterY() + point.y,
						size: 1
					});
					ctx.fillRect(x, y, size, size);
				}
			}
			//player
			/*
			//client data
			const { x, y, size } = this.howToDraw({
				x: this.player.getX(),
				y: this.player.getY(),
				size: this.player.size
			});
			*/

			//1. urcime si cas pred nejakou dobou a budeme hledat snimky hry pred timto a za timto bodem
			//2. nemuzeme se spolehnout jen na cas klienta a musime nejperve synchronizovat
			//3. dopocitame priblizny stav mezi snimky
			//4. vykreslime

			//sort - zatim nutne pro simulaci pingu...
			Controller.playerData.sort((a, b) => {
				return a.tick - b.tick;
			});

			//mazani dat ze zasobniku
			if (Controller.playerData.length > 50) {
				Controller.playerData.splice(0, 5);
			}

			if (this.serverClientSync.ready()) {
				ctx.fillStyle = 'white';
				ctx.fillText('Count frames: ' + Controller.playerData.length, 20, 40);
				ctx.fillText('Time Diference: ' + this.serverClientSync.getTimeDiference(), 20, 80);
				ctx.fillText('Draw delay ' + this.serverClientSync.getDrawDelay(), 20, 120);

				//time
				//server time is <
				let direction = 1;
				//server time is >
				if (this.serverClientSync.getTimeDiference() < 0) direction = -1;
				//time on server
				const timeNowOnServer = Date.now() + this.serverClientSync.getTimeDiference() * direction;
				//const delay = 70;
				const wantedFrameTime = timeNowOnServer - this.serverClientSync.getDrawDelay();

				//find last older (or same <=) frame
				let olderFrame;
				for (const frame of Controller.playerData) {
					if (frame.time <= wantedFrameTime) olderFrame = frame;
				}

				//find newer (or same >=) frame
				let newerFrame;
				let sumaNewer = 0;
				for (let i = Controller.playerData.length - 1; i >= 0; i--) {
					const frame = Controller.playerData[i];
					if (frame.time >= wantedFrameTime) {
						newerFrame = frame;
						sumaNewer++;
					}
				}

				//change delay
				if (sumaNewer > 2) this.serverClientSync.changeDrawDelay(-0.1);
				if (sumaNewer < 2) this.serverClientSync.changeDrawDelay(0.1);

				//err
				if (!olderFrame) console.log('olderFrame is missing');
				if (!newerFrame) console.log('newerFrame is missing');
				if (!olderFrame || !newerFrame) {
					//Controller._socket.emit('syncTime', 0);
					//console.log('new sync');
					this.serverClientSync.reset();

					//err
					ctx.fillStyle = 'white';
					ctx.fillText('frame missing', 20, 300);
				}

				//count position
				if (olderFrame && newerFrame) {
					const timeDistance = newerFrame.time - olderFrame.time;
					const distanceOlderFromWantedFrameTime = wantedFrameTime - olderFrame.time;
					let percentShift = 0;
					if (timeDistance) {
						percentShift = distanceOlderFromWantedFrameTime / timeDistance;
					}

					//console.log('percentShift', percentShift);

					const xDiference = Math.abs(newerFrame.x - olderFrame.x);
					let direction = 1;
					if (newerFrame.x < olderFrame.x) direction = -1;
					let calculatedX = olderFrame.x + xDiference * percentShift * direction;
					//calculatedX = olderFrame.x;
					const { x, y, size } = this.howToDraw({
						x: calculatedX,
						y: 300,
						size: this.player.size
					});
					ctx.drawImage(this.playerSVG, x, y, size, size);
				}
			}

			/*
			if (!this.lastDrawFrameTS && Controller.playerData.length) {
				this.lastDrawFrameTS = Controller.playerData[Controller.playerData.length - 1].time;
				console.log(1111, this.lastDrawFrameTS);
			}

			//////////////

			const serverData = Controller.playerData;
			if (serverData.length >= 5) {
				let drawThis;
				if (this.lastDrawFrame) {
					for (const frame of serverData) {
						if (frame.tick === this.lastDrawFrame + 1) {
							drawThis = frame;
						}
					}
				}

				let nahrada = false;
				if (!drawThis && this.lastDraw) {
					drawThis = this.lastDraw;
					console.log('frame nenalezen');
					nahrada = true;

					const last = this.lastDraw;
					const lastLastTick = this.lastDraw.tick - 1;
					let lastLast;
					for (const frame of serverData) {
						if (frame.tick === lastLastTick) {
							lastLast = frame;
						}
					}
					let calculatedFrame = { x: 0, y: this.lastDraw.y, tick: this.lastDraw + 1 };
					if (last && lastLast) {
						const diference = Math.abs(last.x - lastLast.x);
						let direction = 1;
						if (lastLast.x > last.x) direction = -1;
						calculatedFrame.x = last.x + diference * direction;
						drawThis = calculatedFrame;
						console.log('frame dopocitan');
						
					}

					
				}

				if (drawThis) {
					this.lastDraw = drawThis;
					this.lastDrawFrame = drawThis.tick;
					//console.log('drawwwwwwwwwwww');
					const { x, y, size } = this.howToDraw({
						x: drawThis.x,
						y: drawThis.y,
						size: this.player.size
					});
					ctx.drawImage(this.playerSVG, x, y, size, size);
				}
				if (nahrada) this.lastDrawFrame = null;

				if (serverData.length >= 5 && !this.lastDrawFrame) {
					this.lastDrawFrame = serverData[serverData.length - 3].tick;
					console.log('okkkkkkkkkkkkkkkkkkkk');
					console.log(this.lastDrawFrame);
				}
			}

			//////////////////

			if (Controller.playerData.length > 10 && this.lastDrawFrameTS) {
				const frameDelay = 100;

				let thisFrameTime;
				thisFrameTime = this.lastDrawFrameTS + frameDelay;

				//find older (<= or equal) and newer (or equal)
				let older;
				for (let i = 0; i < Controller.playerData.length; i++) {
					const frame = Controller.playerData[i];
					if (frame.time <= thisFrameTime) {
						older = frame;
						//console.log('older', i);
					}
				}
				let newer;
				for (let i = Controller.playerData.length - 1; i >= 0; i--) {
					const frame = Controller.playerData[i];
					if (frame.time >= thisFrameTime) {
						newer = frame;
						//console.log('newer', i);
					}
				}

				//newer do not exists
				if (!newer) newer = older;

				let drawFrame;
				if (older && newer) {
					//which is closer?
					if (Math.abs(thisFrameTime - older) <= Math.abs(thisFrameTime - newer)) {
						//older
						drawFrame = older;
					}
					else {
						//newer
						drawFrame = newer;
					}
				}
				if (drawFrame && false) {
					this.lastDrawFrameTS = drawFrame.time;
					
					//let xx = drawFrame.x;
					//let yy = drawFrame.y;


					//const last = Controller.playerData[Controller.playerData.length - 3];
					let xx = drawFrame.x;
					let yy = drawFrame.y;

					
					//draw between frames
					//xx = (older.x + newer.x) / 2;
					//yy = (older.y + newer.y) / 2;
					

					const { x, y, size } = this.howToDraw({
						x: xx,
						y: yy,
						size: this.player.size
					});
					ctx.drawImage(this.playerSVG, x, y, size, size);
				}

				if (Controller.playerData.length > 20) {
					Controller.playerData.splice(0, 5);
				}
			}
			//console.log(Controller.playerData.length);
*/
			//collision points
			ctx.fillStyle = 'blue';
			for (const point of this.player.collisionPoints) {
				const { x, y, size } = this.howToDraw({
					x: this.player.getCenterX() + point.x,
					y: this.player.getCenterY() + point.y,
					size: 1
				});
				ctx.fillRect(x, y, size, size);
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
			const fontSize = 31 * this.resolutionAdjustment;
			ctx.font = fontSize + 'px Arial';
			ctx.fillStyle = 'white';
			ctx.fillText(timeToEnd.toString(), x + 28 * this.resolutionAdjustment, y + 59 * this.resolutionAdjustment);
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
			this.screenCenterX + (gameObject.x + animateShiftX - this.player.getCenterX()) * this.resolutionAdjustment;
		const y =
			this.screenCenterY + (gameObject.y + animateShiftY - this.player.getCenterY()) * this.resolutionAdjustment;
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
