import Hand from './Hand';
import Gun from './Gun';
import Map from './Map';
import Point from './Point';
import Tree from './Tree';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import { TerrainType } from './Terrain';

type Loading = {
	time: number;
	max: number;
};

export enum Weapon {
	hand,
	pistol
}

export class Player {
	readonly size: number = 80;
	readonly radius: number = this.size / 2;
	readonly speed: number = 6;
	private x: number;
	private y: number;
	private angle: number = 0;
	private map: Map;
	hands: Hand[] = [];
	gun: Gun;
	private canvas: HTMLCanvasElement;
	readonly collisionPoints: Point[] = [];
	private slowAroundObstacle: boolean = false;
	private loadingTime: number = 0;
	private loadingMaxTime: number = 3 * 60;

	constructor(map: Map) {
		this.x = 550;
		this.y = 700;
		this.canvas = <HTMLCanvasElement>document.getElementById('gameScreen');
		this.hands.push(new Hand(this.size));
		this.hands.push(new Hand(this.size));
		this.gun = new Gun(this.size, 20);
		this.map = map;
		this.calculateCollisionsPoints();
	}

	private calculateCollisionsPoints(): void {
		for (let i = 0; i < 360; i += 10) {
			//triangle
			const x = Math.sin(i * Math.PI / 180) * this.radius;
			const y = Math.cos(i * Math.PI / 180) * this.radius;
			this.collisionPoints.push(new Point(x, y));
		}
	}

	loading(): Loading {
		if (this.loadingTime < this.loadingMaxTime) this.loadingTime++;
		return { time: this.loadingTime, max: this.loadingMaxTime };
	}

	getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
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
					if (this.map.terrain[i].type === TerrainType.Water) {
						shift = shift / 2;
					}
					if (
						this.map.terrain[i].type === TerrainType.WaterTriangle1 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle2 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle3 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle4
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
		this.gun.move(this.angle, this.getCenterX(), this.getCenterY());
		this.changeHandsPosition();
	}

	private changeHandsPosition(): void {
		this.hands[0].moveHand(this.angle, -1, this.size, this.x, this.y, this.map);
		this.hands[1].moveHand(this.angle, 1, this.size, this.x, this.y, this.map);
	}

	private shiftOnPosition(shiftX: number, shiftY: number): void {
		//one or two shifts?
		let countShifts = 0;
		if (shiftX !== 0) countShifts++;
		if (shiftY !== 0) countShifts++;

		//y shift
		let shiftDirection = 1;
		if (shiftY < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftY); i++) {
			if (this.canIshift(0, shiftY - i * shiftDirection, countShifts)) {
				this.y += shiftY - i * shiftDirection;
				break;
			}
		}

		//x shift
		shiftDirection = 1;
		if (shiftX < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftX); i++) {
			if (this.canIshift(shiftX - i * shiftDirection, 0, countShifts)) {
				this.x += shiftX - i * shiftDirection;
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
		//rectangles
		for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
			const rectangleObstacle = this.map.rectangleObstacles[i];
			if (rectangleObstacle.isActive()) {
				//collision rectangle - rectangle
				if (
					this.x + shiftX + this.size >= rectangleObstacle.x &&
					this.x + shiftX <= rectangleObstacle.x + rectangleObstacle.width &&
					this.y + shiftY <= rectangleObstacle.y + rectangleObstacle.height &&
					this.y + shiftY + this.size >= rectangleObstacle.y
				) {
					for (let j = 0; j < this.collisionPoints.length; j++) {
						const point = this.collisionPoints[j];
						const pointOnMyPosition = new Point(
							this.getCenterX() + shiftX + point.x,
							this.getCenterY() + shiftY + point.y
						);
						//point collisions
						if (rectangleObstacle.isPointIn(pointOnMyPosition)) {
							this.goAroundRectangleObstacle(shiftX, shiftY, countShifts, rectangleObstacle);
							return false;
						}
					}
				}
			}
		}

		//rounds
		for (let i = 0; i < this.map.impassableRoundObstacles.length; i++) {
			const roundObstacle = this.map.impassableRoundObstacles[i];
			if (roundObstacle.isActive()) {
				let obstacleRadius = roundObstacle.radius;
				if (roundObstacle instanceof Tree) obstacleRadius = roundObstacle.treeTrankRadius;
				const obstacleAndPlayerRadius = obstacleRadius + this.radius;
				const x = this.getCenterX() + shiftX - roundObstacle.getCenterX();
				const y = this.getCenterY() + shiftY - roundObstacle.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < obstacleAndPlayerRadius) {
					this.goAroundRoundObstacle(shiftX, shiftY, countShifts, roundObstacle);
					return false;
				}
			}
		}
		return true;
	}

	private goAroundRectangleObstacle(
		shiftX: number,
		shiftY: number,
		countShifts: number,
		rectangleObstacle: RectangleObstacle
	): void {
		this.slowAroundObstacle = true;
		const maxObstacleOverlap = this.size * 0.75;
		if (countShifts === 1) {
			if (shiftX !== 0) {
				//up or down?
				//go up
				if (this.getCenterY() <= rectangleObstacle.y + rectangleObstacle.height / 2) {
					if (this.y + this.size - rectangleObstacle.y < maxObstacleOverlap) this.shiftOnPosition(0, -1);
				}
				else {
					//go down
					if (rectangleObstacle.y + rectangleObstacle.height - this.y < maxObstacleOverlap)
						this.shiftOnPosition(0, 1);
				}
			}
			if (shiftY !== 0) {
				//left or right?
				//go left
				if (this.getCenterX() <= rectangleObstacle.x + rectangleObstacle.width / 2) {
					if (this.x + this.size - rectangleObstacle.x < maxObstacleOverlap) this.shiftOnPosition(-1, 0);
				}
				else {
					//go right
					if (rectangleObstacle.x + rectangleObstacle.width - this.x < maxObstacleOverlap)
						this.shiftOnPosition(1, 0);
				}
			}
		}
		if (countShifts === 2) {
			this.slowAroundObstacle = false;
			//chose way
			//obstacle is up and right
			if (
				this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
				const yDistanceFromCorner = Math.abs(
					this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height)
				);
				//x shift right
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(0.1, 0);
				}
				else {
					//y shift up
					this.shiftOnPosition(0, -0.1);
				}
			}
			else if (
				this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is up and left
				const xDistanceFromCorner = Math.abs(
					this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width)
				);
				const yDistanceFromCorner = Math.abs(
					this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height)
				);
				//x shift left
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(-0.1, 0);
				}
				else {
					//y shift up
					this.shiftOnPosition(0, -0.1);
				}
			}
			else if (
				this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is down and left
				const xDistanceFromCorner = Math.abs(
					this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width)
				);
				const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
				//x shift left
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(-0.1, 0);
				}
				else {
					//y shift down
					this.shiftOnPosition(0, 0.1);
				}
			}
			else if (
				this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is down and right
				const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
				const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
				//x shift right
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(0.1, 0);
				}
				else {
					//y shift down
					this.shiftOnPosition(0, 0.1);
				}
			}
		}
	}

	private goAroundRoundObstacle(
		shiftX: number,
		shiftY: number,
		countShifts: number,
		roundObstacle: RoundObstacle
	): void {
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
		let x = centerX - mouseX;
		let y = centerY - mouseY;
		//can not set x and y to 0 because angle
		if (x === 0) x = 0.1;
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
	}
}
