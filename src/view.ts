import Player from './Player';
import Map from './Map';
import { Mouse } from './Controller';
import WaterTerrainData from './WaterTerrainData';
import { TerrainType } from './Terrain';

export default class View {
	private canvas: HTMLCanvasElement;
	private helperCanvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private playerSVG: HTMLImageElement;
	private playerHandSVG: HTMLImageElement;
	private bushSVG: HTMLImageElement;
	private rockSVG: HTMLImageElement;
	private treeSVG: HTMLImageElement;
	private cursorSVG: HTMLImageElement;
	private waterTrianglePNG: HTMLImageElement;
	private waterTerrainData: WaterTerrainData;
	private resolutionAdjustment: number = 1;

	constructor(waterTerrainData: WaterTerrainData) {
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

		this.waterTrianglePNG = new Image();
		this.waterTrianglePNG.src = 'img/waterTriangle.png';

		this.waterTerrainData = waterTerrainData;
		this.waterTrianglePNG.onload = () => {
			this.saveWaterPixels('waterTriangle1');
			this.saveWaterPixels('waterTriangle2');
			this.saveWaterPixels('waterTriangle3');
			this.saveWaterPixels('waterTriangle4');
			//this.waterTerrainData.write();
		};
	}

	screenResize(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		//console.log('Resize');
		//console.log('width: width ' + this.canvas.width + ' height: ' + this.canvas.height);
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

	private saveWaterPixels(waterType: string): void {
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
			case 'waterTriangle1':
				ctx.rotate(0 * Math.PI / 180);
				break;
			case 'waterTriangle2':
				ctx.rotate(90 * Math.PI / 180);
				break;
			case 'waterTriangle3':
				ctx.rotate(180 * Math.PI / 180);
				break;
			case 'waterTriangle4':
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

		/*
		let waterData: boolean[][] = [];
		console.time('a');
		for (let x = 0; x < this.waterTrianglePNG.width; x++) {
			waterData[x] = [];
			for (let y = 0; y < this.waterTrianglePNG.height; y++) {
				//const r = ctx.getImageData(x, y, 1, 1).data[0];
				//const g = ctx.getImageData(x, y, 1, 1).data[1];
				const b = ctx.getImageData(x, y, 1, 1).data[2];
				if (b === 255) {
					waterData[x][y] = false;
				}
				else {
					waterData[x][y] = true;
				}
			}
		}
		console.timeEnd('a');
		this.waterTerrainData.setData(waterType, waterData);
		*/
	}

	draw(map: Map, player: Player, mouse: Mouse): void {
		const ctx = this.ctx;
		//clear canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//center player
		const playerCenterX = player.getX() + player.size / 2;
		const playerCenterY = player.getY() + player.size / 2;

		//center screen
		const screenCenterX = this.canvas.width / 2;
		const screenCenterY = this.canvas.height / 2;

		//water
		ctx.fillStyle = '#69A2E0';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		const gridSize = map.blocks[1].x * this.resolutionAdjustment;
		//grass
		ctx.fillStyle = '#A2CB69';
		for (const block of map.blocks) {
			const x = screenCenterX + (block.x - playerCenterX) * this.resolutionAdjustment;
			const y = screenCenterY + (block.y - playerCenterY) * this.resolutionAdjustment;
			ctx.fillRect(x, y, gridSize, gridSize);
		}

		//terrain
		ctx.fillStyle = '#69A2E0';
		for (const terrain of map.terrain) {
			//position on screen from center
			const x = screenCenterX + (terrain.x - playerCenterX) * this.resolutionAdjustment;
			const y = screenCenterY + (terrain.y - playerCenterY) * this.resolutionAdjustment;
			if (terrain.type === TerrainType.Water) {
				ctx.fillRect(
					x,
					y,
					terrain.width * this.resolutionAdjustment,
					terrain.height * this.resolutionAdjustment
				);
			}
			if (terrain.type === TerrainType.WaterTriangle1) {
				ctx.drawImage(
					this.waterTrianglePNG,
					x,
					y,
					this.waterTrianglePNG.width * this.resolutionAdjustment,
					this.waterTrianglePNG.height * this.resolutionAdjustment
				);
			}
			if (
				terrain.type === TerrainType.WaterTriangle2 ||
				terrain.type === TerrainType.WaterTriangle3 ||
				terrain.type === TerrainType.WaterTriangle4
			) {
				let middleImage = terrain.width / 2 * this.resolutionAdjustment;
				this.ctx.save();
				this.ctx.translate(x + middleImage, y + middleImage);
				this.ctx.rotate(terrain.angle * Math.PI / 180);
				this.ctx.drawImage(
					this.waterTrianglePNG,
					-middleImage,
					-middleImage,
					this.waterTrianglePNG.width * this.resolutionAdjustment,
					this.waterTrianglePNG.height * this.resolutionAdjustment
				);
				this.ctx.restore();
			}
		}

		//mapGrid
		ctx.fillStyle = 'gray';
		for (const block of map.blocks) {
			const x = screenCenterX + (block.x - playerCenterX) * this.resolutionAdjustment;
			const y = screenCenterY + (block.y - playerCenterY) * this.resolutionAdjustment;
			//top
			if (block.y === 0) ctx.fillRect(x, y, gridSize, 1);
			//bottom
			ctx.fillRect(x, y + gridSize, gridSize, 1);
			//left
			if (block.x === 0) ctx.fillRect(x, y, 1, gridSize);
			//right
			ctx.fillRect(x + gridSize, y, 1, gridSize);
		}

		//rocks
		for (let i = 0; i < map.rocks.length; i++) {
			const rock = map.rocks[i];
			ctx.save();
			ctx.globalAlpha = rock.getOpacity();
			ctx.drawImage(
				this.rockSVG,
				screenCenterX + (rock.x - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (rock.y - playerCenterY) * this.resolutionAdjustment,
				rock.size * this.resolutionAdjustment,
				rock.size * this.resolutionAdjustment
			);
			ctx.restore();
		}

		//walls
		ctx.fillStyle = 'black';
		for (let i = 0; i < map.rectangleObstacles.length; i++) {
			const rectangleObstacle = map.rectangleObstacles[i];
			ctx.fillRect(
				screenCenterX + (rectangleObstacle.x - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (rectangleObstacle.y - playerCenterY) * this.resolutionAdjustment,
				rectangleObstacle.width * this.resolutionAdjustment,
				rectangleObstacle.height * this.resolutionAdjustment
			);
		}

		//player
		ctx.drawImage(
			this.playerSVG,
			screenCenterX - player.size * this.resolutionAdjustment / 2,
			screenCenterY - player.size * this.resolutionAdjustment / 2,
			player.size * this.resolutionAdjustment,
			player.size * this.resolutionAdjustment
		);

		//collision points
		ctx.fillStyle = 'red';
		for (let i = 0; i < player.collisionPoints.length; i++) {
			const point = player.collisionPoints[i];
			const x = screenCenterX + point.x * this.resolutionAdjustment;
			const y = screenCenterY + point.y * this.resolutionAdjustment;
			ctx.fillRect(x, y, 1, 1);
		}

		//player hands
		for (let i = 0; i < player.hands.length; i++) {
			ctx.drawImage(
				this.playerHandSVG,
				screenCenterX + (player.hands[i].getX() - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (player.hands[i].getY() - playerCenterY) * this.resolutionAdjustment,
				player.hands[i].size * this.resolutionAdjustment,
				player.hands[i].size * this.resolutionAdjustment
			);
		}

		//bushes
		for (let i = 0; i < map.bushes.length; i++) {
			const bush = map.bushes[i];
			ctx.save();
			ctx.globalAlpha = bush.getOpacity();
			ctx.drawImage(
				this.bushSVG,
				screenCenterX + (bush.x - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (bush.y - playerCenterY) * this.resolutionAdjustment,
				bush.size * this.resolutionAdjustment,
				bush.size * this.resolutionAdjustment
			);
			ctx.restore();
		}

		//trees
		for (let i = 0; i < map.trees.length; i++) {
			const tree = map.trees[i];
			ctx.save();
			ctx.globalAlpha = tree.getOpacity();
			ctx.drawImage(
				this.treeSVG,
				screenCenterX + (tree.x - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (tree.y - playerCenterY) * this.resolutionAdjustment,
				tree.size * this.resolutionAdjustment,
				tree.size * this.resolutionAdjustment
			);
			ctx.restore();
		}

		//cursor
		const mouseSize = 25;
		ctx.drawImage(
			this.cursorSVG,
			mouse.x - mouseSize * this.resolutionAdjustment / 2,
			mouse.y - mouseSize * this.resolutionAdjustment / 2,
			mouseSize * this.resolutionAdjustment,
			mouseSize * this.resolutionAdjustment
		);
	}
}
