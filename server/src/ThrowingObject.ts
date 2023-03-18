import Hand from './hand';
import Map from './Map';
import { ObstacleType } from './obstacle/ObstacleType';
import Tree from './obstacle/Tree';
import { Player } from './Player';

export default class ThrowingObject {
	private x: number;
	private y: number;
	private aboveGround: number = 1;
	player: Player;

	private angle: number = 0;
	private angleShift: number = 10;
	private shiftX: number;
	private shiftY: number;
	//shiftZ == speed
	private shiftZ: number = 9;
	private distance: number = 0;
	private steps: number;
	private countdown: number = 120;

	constructor(player: Player, hand: Hand, targetX: number, targetY: number, touchDelay: number, range: number = 110) {
		this.player = player;
		this.x = hand.getCenterX();
		this.y = hand.getCenterY();

		//triangle
		let x, y;

		// mobile controll
		if (touchDelay) {
			//console.log('touchDelay', touchDelay);
			targetX = hand.getCenterX() + Math.sin((player.getAngle() * Math.PI) / 180) * touchDelay;
			targetY = hand.getCenterY() - Math.cos((player.getAngle() * Math.PI) / 180) * touchDelay;

			console.log(targetX, targetY);
		}

		if (hand.getCenterX() >= targetX) {
			x = hand.getCenterX() - targetX;
		} else {
			x = targetX - hand.getCenterX();
		}
		if (hand.getCenterY() >= targetY) {
			y = hand.getCenterY() - targetY;
		} else {
			y = targetY - hand.getCenterY();
		}

		const z = Math.sqrt(x * x + y * y);
		this.steps = Math.round(z / this.shiftZ);

		if (hand.getCenterX() <= targetX) {
			this.shiftX = x / this.steps;
		} else {
			this.shiftX = (x / this.steps) * -1;
		}

		if (hand.getCenterY() <= targetY) {
			this.shiftY = y / this.steps;
		} else {
			this.shiftY = (y / this.steps) * -1;
		}
		if (this.steps > range) this.steps = range;
	}

	move(): void {
		if (this.distance < this.steps) {
			this.x += this.shiftX;
			this.y += this.shiftY;
			//up
			if (this.distance < this.steps / 2) {
				this.aboveGround += 0.05;
			} else {
				//down
				this.aboveGround -= 0.05;
			}
			this.rotate();
			this.distance++;
		}
	}

	rotate(): void {
		this.angle += this.angleShift;
		if (this.angle >= 360) {
			this.angle -= 360;
		}
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

	getAboveGround(): number {
		return this.aboveGround;
	}

	ready(): boolean {
		return true;
	}

	flying(): boolean {
		return this.distance < this.steps;
	}

	tick(): void {
		if (this.countdown > 0) this.countdown--;
	}

	explode(): boolean {
		return this.countdown === 0;
	}

	moveFromObstacle(map: Map) {
		if (this.aboveGround > 1.05) return;

		const minGap = 5;

		for (const obstacle of map.roundObstacles) {
			if (obstacle.type !== ObstacleType.Rock && obstacle.type !== ObstacleType.Tree) continue;

			let minDistance = obstacle.radius + minGap;
			if (obstacle.type === ObstacleType.Tree) minDistance = (<Tree>obstacle).treeTrankRadius + minGap;

			const xDistance = Math.abs(obstacle.getCenterX() - this.x);
			const yDistance = Math.abs(obstacle.getCenterY() - this.y);
			const zDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
			if (zDistance < minDistance) {
				this.x += this.shiftX * Math.random();
				this.y += this.shiftY * Math.random();
				return;
			}
		}

		for (const rectangle of map.rectangleObstacles) {
			if (this.x >= rectangle.x && this.x <= rectangle.x + rectangle.width && this.y >= rectangle.y && this.y <= rectangle.y + rectangle.height) {
				this.x += this.shiftX * Math.random();
				this.y += this.shiftY * Math.random();
				return;
			}
		}
	}
}
