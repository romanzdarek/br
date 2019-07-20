import { Player } from './Player';
import { LootType } from './LootType';

export default class Loot {
	readonly id: number;
	readonly size: number;
	readonly type: LootType;
	readonly radius: number;
	private x: number;
	private y: number;
	private active: boolean = true;

	constructor(id: number, x: number, y: number, type: LootType) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = 80;
		this.radius = this.size / 2;
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
    
    getX():number{
        return this.x;
    }

    getY():number{
        return this.y;
    }

    getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
		return this.y + this.radius;
	}

}
