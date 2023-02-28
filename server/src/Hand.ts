import Map from './Map';
import Point from './Point';
import { Player } from './Player';
import CollisionPoints from './CollisionPoints';
import { Weapon } from './Weapon';

export default class Hand {
	static readonly size: number = 30;
	static readonly radius: number = Hand.size / 2;
	readonly power: number = 50; //25
	private x: number = 0;
	private y: number = 0;
	private shiftAngle: number = 40;
	private hitTimer: number = 0;
	private throwTimer: number = 0;
	private throwTimerReady: number = -5;
	private map: Map;
	private player: Player;
	private players: Player[];
	private collisionPoints: CollisionPoints;
	private hitObjects: any[] = [];

	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		this.player = myPlayer;
		this.players = players;
		this.map = map;
		this.collisionPoints = collisionPoints;
	}

	hitReady(): boolean {
		return this.hitTimer === 0;
	}

	throwReady(): boolean {
		return this.throwTimer === this.throwTimerReady;
	}

	getCenterX(): number {
		return this.x + Hand.radius;
	}

	getCenterY(): number {
		return this.y + Hand.radius;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	move(direction: number): void {
		let shiftAngle = this.shiftAngle;
		let playerAndHandDistance = Player.radius;
		//hit move
		if (this.hitTimer > 0) {
			switch (this.hitTimer) {
				case 20:
					shiftAngle -= 4;
					playerAndHandDistance += 3;
					break;
				case 19:
					shiftAngle -= 8;
					playerAndHandDistance += 6;
					break;
				case 18:
					shiftAngle -= 12;
					playerAndHandDistance += 9;
					break;
				case 17:
					shiftAngle -= 16;
					playerAndHandDistance += 12;
					break;
				case 16:
					shiftAngle -= 20;
					playerAndHandDistance += 15;
					break;
				case 15:
					shiftAngle -= 24;
					playerAndHandDistance += 18;
					break;
				case 14:
					shiftAngle -= 28;
					playerAndHandDistance += 21;
					break;
				case 13:
					shiftAngle -= 32;
					playerAndHandDistance += 24;
					break;
				case 12:
					shiftAngle -= 36;
					playerAndHandDistance += 27;
					break;
				case 11:
					shiftAngle -= 40;
					playerAndHandDistance += 30;
					break;
				case 10:
					shiftAngle -= 36;
					playerAndHandDistance += 27;
					break;
				case 9:
					shiftAngle -= 32;
					playerAndHandDistance += 24;
					break;
				case 8:
					shiftAngle -= 28;
					playerAndHandDistance += 21;
					break;
				case 7:
					shiftAngle -= 24;
					playerAndHandDistance += 18;
					break;
				case 6:
					shiftAngle -= 20;
					playerAndHandDistance += 15;
					break;
				case 5:
					shiftAngle -= 16;
					playerAndHandDistance += 12;
					break;
				case 4:
					shiftAngle -= 12;
					playerAndHandDistance += 9;
					break;
				case 3:
					shiftAngle -= 8;
					playerAndHandDistance += 6;
					break;
				case 2:
					shiftAngle -= 4;
					playerAndHandDistance += 3;
					break;
				case 1:
					shiftAngle -= 0;
					playerAndHandDistance += 0;
					break;
			}
			this.collisions();
			this.hitTimer--;
		}
		//throw move
		if (this.throwTimer > this.throwTimerReady) {
			switch (this.throwTimer) {
				case 20:
					shiftAngle -= 2;
					playerAndHandDistance += 3;
					break;
				case 19:
					shiftAngle -= 4;
					playerAndHandDistance += 6;
					break;
				case 18:
					shiftAngle -= 6;
					playerAndHandDistance += 9;
					break;
				case 17:
					shiftAngle -= 8;
					playerAndHandDistance += 12;
					break;
				case 16:
					shiftAngle -= 10;
					playerAndHandDistance += 15;
					break;
				case 15:
					shiftAngle -= 12;
					playerAndHandDistance += 18;
					break;
				case 14:
					shiftAngle -= 14;
					playerAndHandDistance += 21;
					break;
				case 13:
					shiftAngle -= 16;
					playerAndHandDistance += 24;
					break;
				case 12:
					shiftAngle -= 18;
					playerAndHandDistance += 27;
					break;
				case 11:
					shiftAngle -= 20;
					playerAndHandDistance += 30;
					break;
				case 10:
					shiftAngle -= 18;
					playerAndHandDistance += 27;
					break;
				case 9:
					shiftAngle -= 16;
					playerAndHandDistance += 24;
					break;
				case 8:
					shiftAngle -= 14;
					playerAndHandDistance += 21;
					break;
				case 7:
					shiftAngle -= 12;
					playerAndHandDistance += 18;
					break;
				case 6:
					shiftAngle -= 10;
					playerAndHandDistance += 15;
					break;
				case 5:
					shiftAngle -= 8;
					playerAndHandDistance += 12;
					break;
				case 4:
					shiftAngle -= 6;
					playerAndHandDistance += 9;
					break;
				case 3:
					shiftAngle -= 4;
					playerAndHandDistance += 6;
					break;
				case 2:
					shiftAngle -= 2;
					playerAndHandDistance += 3;
					break;
				case 1:
					shiftAngle -= 0;
					playerAndHandDistance += 0;
					break;
			}
			this.throwTimer--;
		}

		let playerAngleForHand = this.player.getAngle() + shiftAngle * direction;
		//0 - 359...
		if (playerAngleForHand < 0) playerAngleForHand = 359 + playerAngleForHand;
		if (playerAngleForHand > 359) playerAngleForHand = playerAngleForHand - 359;
		//triangle
		const x = Math.sin((playerAngleForHand * Math.PI) / 180) * playerAndHandDistance;
		const y = Math.cos((playerAngleForHand * Math.PI) / 180) * playerAndHandDistance;
		//set final position from center
		this.x = this.player.getX() + Player.size / 2 + x - Hand.size / 2;
		this.y = this.player.getY() + Player.size / 2 - y - Hand.size / 2;
	}

	hit(): void {
		this.hitTimer = 20;
		this.hitObjects = [];
	}

	throw(): void {
		this.throwTimer = 20;
	}

	private collisions(): void {
		//hit?
		//hit players
		for (const player of this.players) {
			if (!this.hitObjects.includes(player) && player.isActive() && player != this.player) {
				const playerAndHandRadius = Player.radius + Hand.radius;
				const x = this.getCenterX() - player.getCenterX();
				const y = this.getCenterY() - player.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < playerAndHandRadius) {
					player.acceptHit(this.power, this.player, Weapon.Hand);
					this.hitObjects.push(player);
				}
			}
		}

		for (let i = 0; i < this.map.bushes.length; i++) {
			const obstacle = this.map.bushes[i];
			if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
				const obstacleAndHandRadius = obstacle.radius + Hand.radius;
				const x = this.getCenterX() - obstacle.getCenterX();
				const y = this.getCenterY() - obstacle.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < obstacleAndHandRadius) {
					obstacle.acceptHit(this.power);
					this.hitObjects.push(obstacle);
				}
			}
		}

		for (let i = 0; i < this.map.rocks.length; i++) {
			const obstacle = this.map.rocks[i];
			if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
				const obstacleAndHandRadius = obstacle.radius + Hand.radius;
				const x = this.getCenterX() - obstacle.getCenterX();
				const y = this.getCenterY() - obstacle.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < obstacleAndHandRadius) {
					obstacle.acceptHit(this.power);
					this.hitObjects.push(obstacle);
				}
			}
		}

		for (let i = 0; i < this.map.trees.length; i++) {
			const obstacle = this.map.trees[i];
			if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
				const obstacleAndHandRadius = obstacle.treeTrankRadius + Hand.radius;
				const x = this.getCenterX() - obstacle.getCenterX();
				const y = this.getCenterY() - obstacle.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < obstacleAndHandRadius) {
					obstacle.acceptHit(this.power);
					this.hitObjects.push(obstacle);
				}
			}
		}

		//walls
		for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
			const obstacle = this.map.rectangleObstacles[i];
			if (!this.hitObjects.includes(obstacle) && obstacle.isActive()) {
				if (
					this.x <= obstacle.x + obstacle.width &&
					this.x + Hand.size >= obstacle.x &&
					this.y <= obstacle.y + obstacle.height &&
					this.y + Hand.size >= obstacle.y
				) {
					for (let j = 0; j < this.collisionPoints.hand.length; j++) {
						const point = this.collisionPoints.hand[j];
						if (obstacle.isPointIn(new Point(this.getCenterX() + point.x, this.getCenterY() + point.y))) {
							obstacle.acceptHit(this.power);
							this.hitObjects.push(obstacle);
							break;
						}
					}
				}
			}
		}
	}
}
