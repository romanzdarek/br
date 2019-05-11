import Player from './Player';
import Map from './Map';
import { Mouse } from './Controller';
import WaterTerrainData from './WaterTerrainData';
import { TerrainType } from './Terrain';
import Bullet from './Bullet';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import Tree from './Tree';

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
	private waterTrianglePNG: HTMLImageElement;
	private waterTerrainData: WaterTerrainData;
	private resolutionAdjustment: number = 1;
	private screenCenterX: number;
	private screenCenterY: number;
	private map: Map;
	private player: Player;
	private bullets: Bullet[];
	private mouse: Mouse;

	constructor(map: Map, player: Player, bullets: Bullet[], mouse: Mouse, waterTerrainData: WaterTerrainData) {
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
			const { x, y, size } = this.howToDraw({
				x: this.player.getX(),
				y: this.player.getY(),
				size: this.player.size
			});
			ctx.drawImage(this.playerSVG, x, y, size, size);

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
