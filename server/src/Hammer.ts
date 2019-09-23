import CollisionPoints from './CollisionPoints';
import Point from './Point';
import Map from './Map';
import { Player } from './Player';
import { Weapon } from './Weapon';

export default class Hammer {
	private angle: number = 0;
	readonly power: number = 34;
	readonly size: number = 200;
	private active: boolean = false;
	private hitTimer: number = 0;
	private hitTimerMax: number = 20;
	private collisionPoints: CollisionPoints;
	private player: Player;
	private players: Player[];
	private map: Map;
	private hitObjects: any[] = [];

	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		this.player = myPlayer;
		this.players = players;
		this.map = map;
		this.collisionPoints = collisionPoints;
	}

	hit(): void {
		this.active = true;
	}

	getAngle(): number {
		let angle = this.player.getAngle() + this.angle;
		if (angle < 0) angle = 360 + angle;
		if (angle > 359) angle = angle - 360;
		return Math.round(angle);
	}

	isActive(): boolean {
		return this.active;
	}

	ready(): boolean {
		return this.hitTimer === 0;
	}

	move(): void {
		if (this.active) {
			if (this.hitTimer < this.hitTimerMax) {
				const shift = 10;
				if (this.hitTimer < this.hitTimerMax / 2) {
					this.angle -= shift;
					this.collisions();
				}
				else {
					this.angle += shift;
				}
				this.hitTimer++;
			}
			else {
				this.active = false;
				this.hitTimer = 0;
				this.hitObjects = [];
			}
		}
	}

	private collisions(): void {
		const hammerX = this.player.getCenterX() - this.size / 2;
		const hammerY = this.player.getCenterY() - this.size / 2;
		for (const point of this.collisionPoints.hammer.getPointsForAngle(this.getAngle())) {
			const pointX = hammerX + point.x;
			const pointY = hammerY + point.y;
			const collisionPoint = new Point(pointX, pointY);
			for (const round of this.map.impassableRoundObstacles) {
				if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
					round.acceptHit(this.power);
					this.hitObjects.push(round);
				}
			}
			for (const round of this.map.bushes) {
				if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
					round.acceptHit(this.power);
					this.hitObjects.push(round);
				}
			}
			for (const rect of this.map.rectangleObstacles) {
				if (!this.hitObjects.includes(rect) && rect.isActive() && rect.isPointIn(collisionPoint)) {
					rect.acceptHit(this.power);
					this.hitObjects.push(rect);
				}
			}
			for (const player of this.players) {
				if (!this.hitObjects.includes(player) && player.isActive() && player.isPointIn(collisionPoint)) {
					player.acceptHit(this.power, this.player, Weapon.Hammer);
					this.hitObjects.push(player);
				}
			}
		}
	}
}
