import { Player } from './Player';
import { LootType } from './LootType';
import Map from './Map';
import RectangleObstacle from './obstacle/RectangleObstacle';
import RoundObstacle from './obstacle/RoundObstacle';
import Tree from './obstacle/Tree';
import { ObstacleType } from './obstacle/ObstacleType';

export default class LootItem {
	readonly id: number;
	size: number;
	readonly type: LootType;
	readonly finalSize = 60;
	readonly radius: number;
	private x: number;
	private y: number;
	private active: boolean = true;
	readonly quantity: number;
	private lootTimer = 15;

	constructor(id: number, centerX: number, centerY: number, type: LootType, quantity: number) {
		this.id = id;

		this.size = 30;
		this.radius = this.finalSize / 2;
		this.x = centerX - this.radius + this.size / 2;
		this.y = centerY - this.radius + this.size / 2;
		this.type = type;
		this.quantity = quantity;
	}

	isPlayerIn(player: Player): boolean {
		const lootAndPlayerRadius = Player.radius + this.radius;
		const x = this.getCenterX() - player.getCenterX();
		const y = this.getCenterY() - player.getCenterY();
		const distance = Math.sqrt(x * x + y * y);
		return distance < lootAndPlayerRadius;
	}

	isActive(): boolean {
		return this.active;
	}

	setX(x: number): void {
		this.x = x;
	}

	setY(y: number): void {
		this.y = y;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
		return this.y + this.radius;
	}

	private calcAngle(objectCenterX: number, objectCenterY: number): number {
		let x = this.getCenterX() - objectCenterX;
		let y = this.getCenterY() - objectCenterY;
		if (x === 0) x += 0.1;
		if (y === 0) y -= 0.1;
		//atangens
		let angle = Math.abs((Math.atan(x / y) * 180) / Math.PI);
		let finalAngle = 0;
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1
		if (objectCenterX >= this.getCenterX() && objectCenterY < this.getCenterY()) {
			finalAngle = angle;
		} else if (objectCenterX >= this.getCenterX() && objectCenterY >= this.getCenterY()) {
			//2
			finalAngle = 180 - angle;
		} else if (objectCenterX < this.getCenterX() && objectCenterY >= this.getCenterY()) {
			//3
			finalAngle = 180 + angle;
		} else if (objectCenterX < this.getCenterX() && objectCenterY < this.getCenterY()) {
			//4
			finalAngle = 360 - angle;
		}
		finalAngle = Math.round(finalAngle);
		//random change
		const change = Math.floor(Math.random() * 30);
		let direction = 1;
		if (Math.round(Math.random())) direction = -1;
		finalAngle = finalAngle + direction * change;
		if (finalAngle > 359) finalAngle = finalAngle - 360;
		return finalAngle;
	}

	move(lootItems: LootItem[], map: Map): void {
		if (this.lootTimer > 0) {
			this.size += 2;
			this.x--;
			this.y--;

			this.lootTimer--;
		}
		for (const lootItem of lootItems) {
			if (lootItem === this) continue;
			if (this.objectIn(lootItem)) {
				const angle = this.calcAngle(lootItem.getCenterX(), lootItem.getCenterY());
				this.shift(angle, map);
			}
		}

		for (const obstacle of map.roundObstacles) {
			if (obstacle.type !== ObstacleType.Rock && obstacle.type !== ObstacleType.Tree) continue;
			if (obstacle.isActive() && this.objectIn(obstacle)) {
				const angle = this.calcAngle(obstacle.getCenterX(), obstacle.getCenterY());
				this.shift(angle, map);
			}
		}

		for (const object of map.rectangleObstacles) {
			if (object.isActive() && this.objectIn(object)) {
				const angle = this.calcAngle(object.x + object.width / 2, object.y + object.height / 2);
				this.shift(angle, map);
			}
		}
	}

	private shift(angle: number, map: Map): void {
		const shiftZ = 5 * Math.random();
		let shiftX = Math.sin((angle * Math.PI) / 180) * shiftZ;
		let shiftY = Math.cos((angle * Math.PI) / 180) * shiftZ;
		this.x -= shiftX;
		this.y += shiftY;

		//map border
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.size > map.getSize()) this.x = map.getSize() - this.size;
		if (this.y + this.size > map.getSize()) this.y = map.getSize() - this.size;
	}

	private objectIn(object: LootItem | RectangleObstacle | RoundObstacle): boolean {
		//triangle
		let objectRadius, objectCenterX, objectCenterY;
		if (object instanceof LootItem || object instanceof RoundObstacle) {
			objectRadius = object.radius;
			if (object instanceof Tree) objectRadius = object.treeTrankRadius;
			objectCenterX = object.getCenterX();
			objectCenterY = object.getCenterY();
		} else if (object instanceof RectangleObstacle) {
			//rectangle rectangle
			//loot + gap
			const gap = 10;
			//rectangle loot in rectangle wall
			if (
				this.x - gap <= object.x + object.width &&
				this.x + this.finalSize + gap >= object.x &&
				this.y - gap <= object.y + object.height &&
				this.y + this.finalSize + gap >= object.y
			) {
				return true;
			} else {
				return false;
			}
		}
		const x = this.getCenterX() - objectCenterX;
		const y = this.getCenterY() - objectCenterY;
		const radius = Math.sqrt(x * x + y * y);
		const gap = 20;
		return radius < objectRadius + this.radius + gap;
	}

	take(): void {
		this.active = false;
	}
}
