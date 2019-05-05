import Map from './map';

export default class Hand {
	readonly size: number = 26;
	private x: number = 0;
	private y: number = 0;
	private radius: number;
	private playerRadius: number;
	private shiftAngle: number = 40;
	private hitTimer: number = 0;
	private inAction: boolean = false;

	constructor(playerSize: number) {
		this.playerRadius = playerSize / 2;
		this.radius = this.size / 2;
	}

	ready(): boolean {
		return this.hitTimer === 0;
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

	moveHand(
		playerAngle: number,
		direction: number,
		playerSize: number,
		playerX: number,
		playerY: number,
		map: Map
	): void {
		let shiftAngle = this.shiftAngle;
		let playerRadius = this.playerRadius;
		//hit move
		if (this.hitTimer > 0) {
			switch (this.hitTimer) {
				case 20:
					shiftAngle -= 4;
					playerRadius += 2;
					break;
				case 19:
					shiftAngle -= 8;
					playerRadius += 4;
					break;
				case 18:
					shiftAngle -= 12;
					playerRadius += 6;
					break;
				case 17:
					shiftAngle -= 16;
					playerRadius += 8;
					break;
				case 16:
					shiftAngle -= 20;
					playerRadius += 10;
					break;
				case 15:
					shiftAngle -= 24;
					playerRadius += 12;
					break;
				case 14:
					shiftAngle -= 28;
					playerRadius += 14;
					break;
				case 13:
					shiftAngle -= 32;
					playerRadius += 16;
					break;
				case 12:
					shiftAngle -= 36;
					playerRadius += 18;
					break;
				case 11:
					shiftAngle -= 40;
					playerRadius += 20;
					break;
				case 10:
					shiftAngle -= 36;
					playerRadius += 18;
					break;
				case 9:
					shiftAngle -= 32;
					playerRadius += 16;
					break;
				case 8:
					shiftAngle -= 28;
					playerRadius += 14;
					break;
				case 7:
					shiftAngle -= 24;
					playerRadius += 12;
					break;
				case 6:
					shiftAngle -= 20;
					playerRadius += 10;
					break;
				case 5:
					shiftAngle -= 16;
					playerRadius += 8;
					break;
				case 4:
					shiftAngle -= 12;
					playerRadius += 6;
					break;
				case 3:
					shiftAngle -= 8;
					playerRadius += 4;
					break;
				case 2:
					shiftAngle -= 4;
					playerRadius += 2;
					break;
				case 1:
					shiftAngle -= 0;
					playerRadius += 0;
					break;
			}

			//hit?
			if (this.inAction) {
				for (let i = 0; i < map.bushes.length; i++) {
					const obstacle = map.bushes[i];
					if (obstacle.getActive()) {
						const obstacleAndHandRadius = obstacle.radius + this.radius;
						const x = this.getCenterX() - obstacle.getCenterX();
						const y = this.getCenterY() - obstacle.getCenterY();
						const distance = Math.sqrt(x * x + y * y);
						if (distance < obstacleAndHandRadius) {
							obstacle.acceptHit();
							this.inAction = false;
							break;
						}
					}
				}
			}
			if (this.inAction) {
				for (let i = 0; i < map.rocks.length; i++) {
					const obstacle = map.rocks[i];
					if (obstacle.getActive()) {
						const obstacleAndHandRadius = obstacle.radius + this.radius;
						const x = this.getCenterX() - obstacle.getCenterX();
						const y = this.getCenterY() - obstacle.getCenterY();
						const distance = Math.sqrt(x * x + y * y);
						if (distance < obstacleAndHandRadius) {
							obstacle.acceptHit();
							this.inAction = false;
							break;
						}
					}
				}
			}
			if (this.inAction) {
				for (let i = 0; i < map.trees.length; i++) {
					const obstacle = map.trees[i];
					if (obstacle.getActive()) {
						const obstacleAndHandRadius = obstacle.radius + this.radius;
						const x = this.getCenterX() - obstacle.getCenterX();
						const y = this.getCenterY() - obstacle.getCenterY();
						const distance = Math.sqrt(x * x + y * y);
						if (distance < obstacleAndHandRadius) {
							obstacle.acceptHit();
							this.inAction = false;
							break;
						}
					}
				}
			}
			this.hitTimer--;
		}

		let playerAngleForHand = playerAngle + shiftAngle * direction;
		//0 - 359...
		if (playerAngleForHand < 0) playerAngleForHand = 359 + playerAngleForHand;
		if (playerAngleForHand > 359) playerAngleForHand = playerAngleForHand - 359;
		//triangle
		let x = Math.round(Math.sin(playerAngleForHand * Math.PI / 180) * playerRadius);
		let y = Math.round(Math.cos(playerAngleForHand * Math.PI / 180) * playerRadius);
		//set final position from center
		this.x = playerX + playerSize / 2 + x - this.size / 2;
		this.y = playerY + playerSize / 2 - y - this.size / 2;
	}

	hit(): void {
		this.hitTimer = 20;
		this.inAction = true;
	}
}
