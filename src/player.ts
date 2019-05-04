import Hand from './hand';
import Map from './map';
import Point from './point';
import Rock from './rock';
import Tree from './tree';
import RoundObstacle from './roundObstacle';

export default class Player {
	readonly size: number = 60;
	readonly radius: number = this.size / 2;
	readonly speed: number = 7;
	private x: number;
	private y: number;
	private angle: number = 0;
	private map: Map;
	hands: Hand[] = [];
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	readonly collisionPoints: Point[] = [];
	private slowAroundObstacle: boolean = false;

	constructor(map: Map) {
		this.x = 550;
		this.y = 700;
		this.canvas = <HTMLCanvasElement>document.getElementById('gameScreen');
		this.ctx = this.canvas.getContext('2d');
		this.hands.push(new Hand(this.size));
		this.hands.push(new Hand(this.size));
		this.map = map;
		this.calculateCollisionsPoints();
	}

	private calculateCollisionsPoints(): void {
		for (let i = 0; i < 360; i++) {
			//triangle
			const playerRadius = this.size / 2;
			let x = Math.sin(i * Math.PI / 180) * playerRadius;
			let y = Math.cos(i * Math.PI / 180) * playerRadius;
			this.collisionPoints.push(new Point(x, y));
		}
	}

	private getCenterX(): number {
		return this.x + this.radius;
	}

	private getCenterY(): number {
		return this.y + this.radius;
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
		if (up || down || left || right) {
			//standart shift (speed)
			let shift = this.speed;

			//diagonal shift and slow around obstacle
			if ((up && left) || (up && right) || (down && left) || (down && right) || this.slowAroundObstacle) {
				shift = shift / Math.sqrt(2);
				this.slowAroundObstacle = false;
			}

			//shift in water
			for (let i = 0; i < this.map.terrain.length; i++) {
				//terrain block is under my center
				if (
					this.getCenterX() < this.map.terrain[i].x + this.map.terrain[i].width &&
					this.getCenterX() >= this.map.terrain[i].x &&
					this.getCenterY() < this.map.terrain[i].y + this.map.terrain[i].height &&
					this.getCenterY() >= this.map.terrain[i].y
				) {
					if (this.map.terrain[i].type === 'water') {
						shift = shift / 2;
					}
					if (
						this.map.terrain[i].type === 'waterTriangle1' ||
						this.map.terrain[i].type === 'waterTriangle2' ||
						this.map.terrain[i].type === 'waterTriangle3' ||
						this.map.terrain[i].type === 'waterTriangle4'
					) {
						//Math.floor!!!
						const myXPositionOnTerrain = Math.floor(this.getCenterX() - this.map.terrain[i].x);
						const myYPositionOnTerrain = Math.floor(this.getCenterY() - this.map.terrain[i].y);
						if (
							this.map.waterTerrainData.includeWater(
								this.map.terrain[i].type,
								myXPositionOnTerrain,
								myYPositionOnTerrain
							)
						) {
							shift = shift / 2;
						}
					}
				}
			}

			//player shift
			let shiftX = 0;
			let shiftY = 0;
			if (up) shiftY += -shift;
			if (down) shiftY += shift;
			if (left) shiftX += -shift;
			if (right) shiftX += shift;
			//i want to go this way...
			this.shiftOnPosition(shiftX, shiftY);
		}
		this.rotatePlayer(mouseX, mouseY);
	}

	private shiftOnPosition(shiftX: number, shiftY: number): void {
		//one or two shifts?
		let countShifts = 0;
		if (shiftX !== 0) countShifts++;
		if (shiftY !== 0) countShifts++;

		//x shift
		let shiftDirection = 1;
		if (shiftX < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftX); i++) {
			if (this.canIshift(shiftX - i * shiftDirection, 0, countShifts)) {
				this.x += shiftX - i * shiftDirection;
				break;
			}
		}

		//y shift
		shiftDirection = 1;
		if (shiftY < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftY); i++) {
			if (this.canIshift(0, shiftY - i * shiftDirection, countShifts)) {
				this.y += shiftY - i * shiftDirection;
				break;
			}
		}

		//move only on map area
		if (this.x + this.size > this.map.width) this.x = this.map.width - this.size;
		if (this.x < 0) this.x = 0;
		if (this.y + this.size > this.map.height) this.y = this.map.height - this.size;
		if (this.y < 0) this.y = 0;
	}

	private canIshift(shiftX: number, shiftY: number, countShifts: number): boolean {
		let isShiftPossilbe = true;
		for (let i = 0; i < this.map.impassableRoundObstacles.length; i++) {
			const roundObstacle = this.map.impassableRoundObstacles[i];
			let obstacleRadius = roundObstacle.radius;
			if (roundObstacle instanceof Tree) obstacleRadius = roundObstacle.treeTrankRadius;
			const obstacleAndPlayerRadius = obstacleRadius + this.radius;
			const x = this.getCenterX() + shiftX - roundObstacle.getCenterX();
			const y = this.getCenterY() + shiftY - roundObstacle.getCenterY();
			const distance = Math.sqrt(x * x + y * y);
			if (distance < obstacleAndPlayerRadius) {
				isShiftPossilbe = false;
				this.goAroundObstacle(shiftX, shiftY, countShifts, roundObstacle);
				break;
			}
		}
		return isShiftPossilbe;
	}

	private goAroundObstacle(shiftX: number, shiftY: number, countShifts: number, roundObstacle: RoundObstacle): void {
		this.slowAroundObstacle = true;
		if (countShifts === 1) {
			if (shiftX !== 0) {
				//obstacle above
				if (this.getCenterY() >= roundObstacle.getCenterY()) {
					//go down
					this.shiftOnPosition(0, 1);
				}
				//obstacle below
				if (this.getCenterY() < roundObstacle.getCenterY()) {
					//go up
					this.shiftOnPosition(0, -1);
				}
			}
			if (shiftY !== 0) {
				//obstacle on left
				if (this.getCenterX() >= roundObstacle.getCenterX()) {
					//go right
					this.shiftOnPosition(1, 0);
				}
				//obstacle on right
				if (this.getCenterX() < roundObstacle.getCenterX()) {
					//go left
					this.shiftOnPosition(-1, 0);
				}
			}
		}
		if (countShifts === 2) {
			//choose shorter way
			const xDistance = Math.abs(this.getCenterX() - roundObstacle.getCenterX());
			const yDistance = Math.abs(this.getCenterY() - roundObstacle.getCenterY());

			//x shift
			if (xDistance <= yDistance) {
				//obstacle on right
				if (this.getCenterX() <= roundObstacle.getCenterX()) {
					//go right
					this.shiftOnPosition(0.5, 0);
				}
				//obstacle on left
				if (this.getCenterX() > roundObstacle.getCenterX()) {
					//go left
					this.shiftOnPosition(-0.5, 0);
				}
			}
			else {
				//y shift
				//obstacle below
				if (this.getCenterY() <= roundObstacle.getCenterY()) {
					//go down
					this.shiftOnPosition(0, 0.5);
				}
				//obstacle above
				if (this.getCenterY() > roundObstacle.getCenterY()) {
					//go up
					this.shiftOnPosition(0, -0.5);
				}
			}
		}
	}

	private rotatePlayer(mouseX: number, mouseY: number): void {
		//triangular sides
		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;
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
