import Hand from './hand';
import Map from './map';

export default class Player {
	readonly size: number = 100;
	readonly speed: number = 5;
	private x: number;
	private y: number;
	private angle: number = 0;
	private map: Map;
	hands: Hand[];
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor(map: Map) {
		this.x = 200;
		this.y = 200;
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');
		this.hands = [];
		this.hands.push(new Hand(this.size));
		this.hands.push(new Hand(this.size));
		this.map = map;
	}

	getX(): number {
		return this.x;
	}
	getY(): number {
		return this.y;
	}
	getAngle(): number {
		return this.angle;
	}
	setAngle(angle: number): void {
		this.angle = angle;
	}

	hit(): void {
		if (this.hands[0].ready() && this.hands[1].ready()) {
			let random = Math.round(Math.random());
			this.hands[random].hit();
		}
	}

	playerMove(up: boolean, left: boolean, down: boolean, right: boolean, mouseX: number, mouseY: number): void {
		//change player position
		let speed = this.speed;

		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;

		//speed in water
		const playerCorners = [
			{ x: centerX - this.size / 2, y: centerY - this.size / 2 },
			{ x: centerX + this.size / 2, y: centerY - this.size / 2 },
			{ x: centerX - this.size / 2, y: centerY + this.size / 2 },
			{ x: centerX + this.size / 2, y: centerY + this.size / 2 }
		];

		let inWater = 0;
		for (const corner of playerCorners) {
			const px = this.ctx.getImageData(corner.x, corner.y, 1, 1).data;
			console.log(px);
			if (px[0] === 105 && px[1] === 162 && px[2] === 224) {
				inWater++;
			}
		}

		if (inWater === 4) {
			speed /= 2;
		}

		//diagonal speed
		if ((up && left) || (up && right) || (down && left) || (down && right)) {
			speed = speed / Math.sqrt(2);
		}
		if (up) this.y -= speed;
		if (down) this.y += speed;
		if (left) this.x -= speed;
		if (right) this.x += speed;

		//move only on map area
		if (this.x + this.size > this.map.width) this.x = this.map.width - this.size;
		if (this.x < 0) this.x = 0;
		if (this.y + this.size > this.map.height) this.y = this.map.height - this.size;
		if (this.y < 0) this.y = 0;

		//rotate player
		//triangular sides
		const x = centerX - mouseX;
		const y = centerY - mouseY;
		//atangens
		let angle = Math.abs(Math.atan(x / y) * 180 / Math.PI);
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1
		if (mouseX >= centerX && mouseY < centerY) {
			this.angle = angle;
		}
		//2
		if (mouseX >= centerX && mouseY >= centerY) {
			this.angle = 90 + 90 - angle;
		}
		//3
		if (mouseX < centerX && mouseY >= centerY) {
			this.angle = 180 + angle;
		}
		//4
		if (mouseX < centerX && mouseY < centerY) {
			this.angle = 270 + 90 - angle;
		}
		this.angle = Math.round(this.angle);
		if (this.angle === 360) this.angle = 0;

		//change hands positions
		this.hands[0].moveHand(this.angle, -1, this.size, this.x, this.y);
		this.hands[1].moveHand(this.angle, 1, this.size, this.x, this.y);
	}
}
