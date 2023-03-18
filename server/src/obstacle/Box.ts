import { ObstacleType } from './ObstacleType';
import RectangleObstacle from './RectangleObstacle';

export default class Box extends RectangleObstacle {
	loot = false;
	constructor(id: number, x: number, y: number, width: number, height: number) {
		super(id, x, y, width, height);
		this.healthMax = 250;
		this.health = this.healthMax;
		this.type = ObstacleType.Box;
	}

	acceptHit(power: number) {
		if (!this.isActive()) return;

		super.acceptHit(power);
		if (!this.isActive()) {
			this.loot = true;
		}
	}

	releaseLoot() {
		if (this.loot) {
			this.loot = false;
			return true;
		}
		return false;
	}
}
