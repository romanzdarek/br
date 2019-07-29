import { Player } from './Player';
import { LootType } from './LootType';

export default class LootItem {
	readonly id: number;
	readonly size: number;
	readonly type: LootType;
	readonly radius: number;
	private x: number;
	private y: number;
	private active: boolean = true;
	private direction: number = 1;
	readonly bullets: number;

	constructor(id: number, x: number, y: number, type: LootType, bullets: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = 80;
		this.radius = this.size / 2;
		this.bullets = bullets;
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

	move(): void {
		this.x += 5 * this.direction;
		if (this.x > 1000) this.direction = -1;
		if (this.x < 0) this.direction = 1;
	}

	take(): void {
		this.active = false;
	}
}
