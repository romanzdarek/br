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
		};
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
		this.waterTerrainData.setData(waterType, waterData);
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

		const gridSize = map.blocks[1].x;
		//grass
		for (const block of map.blocks) {
			ctx.fillStyle = '#A2CB69';
			const x = screenCenterX + (block.x - playerCenterX);
			const y = screenCenterY + (block.y - playerCenterY);
			//top
			ctx.fillRect(x, y, gridSize, gridSize);
		}

		//terrain
		for (const terrain of map.terrain) {
			ctx.fillStyle = '#69A2E0';
			//position on screen from center
			const x = screenCenterX + (terrain.x - playerCenterX);
			const y = screenCenterY + (terrain.y - playerCenterY);
			if (terrain.type === 'water') {
				ctx.fillRect(x, y, terrain.width, terrain.height);
			}
			if (terrain.type === 'waterTriangle1') {
				ctx.drawImage(this.waterTrianglePNG, x, y);
			}
			if (
				terrain.type === 'waterTriangle2' ||
				terrain.type === 'waterTriangle3' ||
				terrain.type === 'waterTriangle4'
			) {
				let middleImage = terrain.width / 2;
				this.ctx.save();
				this.ctx.translate(x + middleImage, y + middleImage);
				this.ctx.rotate(terrain.angle * Math.PI / 180);
				this.ctx.drawImage(this.waterTrianglePNG, -middleImage, -middleImage);
				this.ctx.restore();
			}
		}

		//mapGrid
		for (const block of map.blocks) {
			ctx.fillStyle = 'gray';
			const x = screenCenterX + (block.x - playerCenterX);
			const y = screenCenterY + (block.y - playerCenterY);
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
		ctx.drawImage(this.playerSVG, screenCenterX - player.size / 2, screenCenterY - player.size / 2);

		//player hands
		ctx.drawImage(
			this.playerHandSVG,
			screenCenterX + (player.hands[0].getX() - playerCenterX),
			screenCenterY + (player.hands[0].getY() - playerCenterY)
		);
		ctx.drawImage(
			this.playerHandSVG,
			screenCenterX + (player.hands[1].getX() - playerCenterX),
			screenCenterY + (player.hands[1].getY() - playerCenterY)
		);
	}
}
