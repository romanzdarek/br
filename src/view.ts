import Player from './player';
import Map from './map';

export default class View {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private playerSVG: HTMLImageElement;
	private playerHandSVG: HTMLImageElement;

	constructor() {
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');
		this.playerSVG = new Image();
		this.playerHandSVG = new Image();
		this.playerSVG.src = 'img/player.svg';
		this.playerHandSVG.src = 'img/hand.svg';
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
			ctx.fillRect(x, y, terrain.width, terrain.height);
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
