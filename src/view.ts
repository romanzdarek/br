import Player from './player';
import Map from './map';
import WaterTerrainData from './waterTerrainData';

export default class View {
	private canvas: HTMLCanvasElement;
	private helperCanvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private playerSVG: HTMLImageElement;
	private playerHandSVG: HTMLImageElement;
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
		console.log('Resize: x: width ' + this.canvas.width + ' height: ' + this.canvas.height);
		this.changeResolutionAdjustment();
	}

	private changeResolutionAdjustment(): void {
		const defaultWidth = 1920;
		const defaultHeight = 1050;
		const width = this.canvas.width / defaultWidth;
		const height = this.canvas.height / defaultHeight;
		const finalAdjustment = (width + height) / 2;
		this.resolutionAdjustment = finalAdjustment;
		console.log('finalAdjustment:', finalAdjustment);
	}

	private saveWaterPixels(waterType: string): void {
		const ctx = this.helperCanvas.getContext('2d');
		let waterData: boolean[][] = [];
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

	draw(map: Map, player: Player): void {
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
		for (const block of map.blocks) {
			ctx.fillStyle = '#A2CB69';
			const x = screenCenterX + (block.x - playerCenterX) * this.resolutionAdjustment;
			const y = screenCenterY + (block.y - playerCenterY) * this.resolutionAdjustment;
			ctx.fillRect(x, y, gridSize, gridSize);
		}

		//terrain
		for (const terrain of map.terrain) {
			ctx.fillStyle = '#69A2E0';
			//position on screen from center
			const x = screenCenterX + (terrain.x - playerCenterX) * this.resolutionAdjustment;
			const y = screenCenterY + (terrain.y - playerCenterY) * this.resolutionAdjustment;
			if (terrain.type === 'water') {
				ctx.fillRect(
					x,
					y,
					terrain.width * this.resolutionAdjustment,
					terrain.height * this.resolutionAdjustment
				);
			}
			if (terrain.type === 'waterTriangle1') {
				ctx.drawImage(
					this.waterTrianglePNG,
					x,
					y,
					this.waterTrianglePNG.width * this.resolutionAdjustment,
					this.waterTrianglePNG.height * this.resolutionAdjustment
				);
			}
			if (
				terrain.type === 'waterTriangle2' ||
				terrain.type === 'waterTriangle3' ||
				terrain.type === 'waterTriangle4'
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
		for (const block of map.blocks) {
			ctx.fillStyle = 'gray';
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

		//player
		ctx.drawImage(
			this.playerSVG,
			screenCenterX - player.size * this.resolutionAdjustment / 2,
			screenCenterY - player.size * this.resolutionAdjustment / 2,
			this.playerSVG.width * this.resolutionAdjustment,
			this.playerSVG.height * this.resolutionAdjustment
		);

		//player hands
		for (let i = 0; i < player.hands.length; i++) {
			ctx.drawImage(
				this.playerHandSVG,
				screenCenterX + (player.hands[i].getX() - playerCenterX) * this.resolutionAdjustment,
				screenCenterY + (player.hands[i].getY() - playerCenterY) * this.resolutionAdjustment,
				this.playerHandSVG.width * this.resolutionAdjustment,
				this.playerHandSVG.height * this.resolutionAdjustment
			);
		}
	}
}
