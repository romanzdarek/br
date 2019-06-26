import CollisionPoints from './CollisionPoints';
import Point from './Point';
import Map from './Map';
import { Player } from './Player';

export default class Hammer {
	private angle: number = 0;
	readonly size: number = 200;
	private active: boolean = false;
	private inAction: boolean = false;
	private hitTimer: number = 0;
	private hitTimerMax: number = 20;
	private collisionPoints: CollisionPoints;
	private player: Player;
	private players: Player[];
	private map: Map;

	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		this.player = myPlayer;
		this.players = players;
		this.map = map;
		this.collisionPoints = collisionPoints;
	}

	hit(): void {
		this.active = true;
		this.inAction = true;
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
			}
		}
	}

	private collisions(): void {
		if (this.inAction) {
			const hammerX = this.player.getCenterX() - this.size / 2;
			const hammerY = this.player.getCenterY() - this.size / 2;
			for (const point of this.collisionPoints.hammer.getPointsForAngle(this.getAngle())) {
				const pointX = hammerX + point.x;
				const pointY = hammerY + point.y;
				const collisionPoint = new Point(pointX, pointY);
				for (const round of this.map.impassableRoundObstacles) {
					if (round.isActive && round.isPointIn(collisionPoint)) {
						round.acceptHit(collisionPoint);
						this.inAction = false;
						break;
					}
				}
				for (const rect of this.map.rectangleObstacles) {
					if (rect.isActive && rect.isPointIn(collisionPoint)) {
						rect.acceptHit();
						this.inAction = false;
						break;
					}
				}
			}
		}
	}
}
