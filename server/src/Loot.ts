import LootItem from './LootItem';
import { LootType } from './LootType';
import Map from './Map';
import RoundObstacle from './obstacle/RoundObstacle';
import RectangleObstacle from './obstacle/RectangleObstacle';
import { AppVariant, appVariant } from './app';

export default class Loot {
	private map: Map;
	private lootId: number = 0;
	lootItems: LootItem[] = [];
	private randomPositionAttempts: number = 0;
	private maxRandomPositionAttempts: number = 1000;

	constructor(map: Map) {
		this.map = map;
	}

	createRandomLootItem(centerX: number, centerY: number) {
		this.createLootItem(centerX, centerY, LootType.Granade, 1, false);
	}

	createLootItem(centerX: number, centerY: number, type: LootType, quantity: number = 1, includeAmmo = false): void {
		const loot = new LootItem(this.lootId++, centerX, centerY, type, quantity);
		if (centerX === 0 && centerY === 0) this.setRandomPosition(loot);
		this.lootItems.push(loot);

		// Add ammo
		if (includeAmmo) {
			const lootItemGap = loot.size;
			if (loot.type === LootType.Pistol) {
				let directionX = 1;
				let directionY = 1;
				if (Math.random() > 0.5) directionX = -1;
				if (Math.random() > 0.5) directionY = -1;
				//+ammo
				this.lootItems.push(
					new LootItem(
						this.lootId++,
						loot.getCenterX() + lootItemGap * directionX,
						loot.getCenterY() + lootItemGap * directionY,
						LootType.OrangeAmmo,
						20
					)
				);
			} else if (loot.type === LootType.Rifle) {
				let directionX = 1;
				let directionY = 1;
				if (Math.random() > 0.5) directionX = -1;
				if (Math.random() > 0.5) directionY = -1;
				//+ammo
				this.lootItems.push(
					new LootItem(
						this.lootId++,
						loot.getCenterX() + lootItemGap * directionX,
						loot.getCenterY() + lootItemGap * directionY,
						LootType.GreenAmmo,
						5
					)
				);
			} else if (loot.type === LootType.Shotgun) {
				//+ammo
				let directionX = 1;
				let directionY = 1;
				if (Math.random() > 0.5) directionX = -1;
				if (Math.random() > 0.5) directionY = -1;
				this.lootItems.push(
					new LootItem(this.lootId++, loot.getCenterX() + lootItemGap * directionX, loot.getCenterY() + lootItemGap * directionY, LootType.RedAmmo, 4)
				);
			} else if (loot.type === LootType.Machinegun) {
				//+ammo
				let directionX = 1;
				let directionY = 1;
				if (Math.random() > 0.5) directionX = -1;
				if (Math.random() > 0.5) directionY = -1;
				this.lootItems.push(
					new LootItem(
						this.lootId++,
						loot.getCenterX() + lootItemGap * directionX,
						loot.getCenterY() + lootItemGap * directionY,
						LootType.BlueAmmo,
						30
					)
				);
			}
		}
	}

	private setRandomPosition(loot: LootItem) {
		this.randomPositionAttempts++;
		if (this.randomPositionAttempts > this.maxRandomPositionAttempts) console.log('err: maxRandomPositionAttempts');
		const lootSize = loot.size * 3;
		const randomX = Math.floor(Math.random() * (this.map.getSize() - lootSize * 2)) + lootSize;
		const randomY = Math.floor(Math.random() * (this.map.getSize() - lootSize * 2)) + lootSize;
		loot.setX(randomX);
		loot.setY(randomY);
		//repeat
		if (this.randomPositionCollision(loot) && this.randomPositionAttempts < this.maxRandomPositionAttempts) {
			this.setRandomPosition(loot);
		}
	}

	private randomPositionCollision(loot: LootItem): boolean {
		for (const obstacle of this.map.rectangleObstacles) {
			if (this.lootInObstacle(loot, obstacle)) return true;
		}
		for (const obstacle of this.map.roundObstacles) {
			if (this.lootInObstacle(loot, obstacle)) return true;
		}
		for (const obstacle of this.lootItems) {
			if (this.lootInObstacle(loot, obstacle)) return true;
		}
		return false;
	}

	private lootInObstacle(loot: LootItem, obstacle: RoundObstacle | RectangleObstacle | LootItem): boolean {
		let x = 0,
			y = 0,
			width = 0,
			height = 0;
		if (obstacle instanceof RectangleObstacle) {
			width = obstacle.width;
			height = obstacle.height;
			x = obstacle.x;
			y = obstacle.y;
		}
		if (obstacle instanceof RoundObstacle) {
			width = obstacle.size;
			height = obstacle.size;
			x = obstacle.x;
			y = obstacle.y;
		}
		if (obstacle instanceof LootItem) {
			width = obstacle.size;
			height = obstacle.size;
			x = obstacle.getX();
			y = obstacle.getY();
		}

		//bigger loot size
		const gap = 2 * loot.size;
		const lootSize = loot.size + gap;
		if (x <= loot.getX() + lootSize && x + width >= loot.getX() && y <= loot.getY() + lootSize && y + height >= loot.getY()) {
			return true;
		} else {
			return false;
		}
	}

	//loot balancer
	createMainLootItems(players: number): void {
		if (appVariant == AppVariant.Localhost) {
			// TODO
			players = 5;
		}

		for (let i = 0; i < players; i++) {
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Pistol, 10, true);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Pistol, 10, true);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Rifle, 1, true);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Shotgun, 2, true);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Machinegun, 30, true);

			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Hammer);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Vest);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Scope2);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Scope4);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Scope6);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Granade, 3);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Smoke, 3);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Granade, 3);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Smoke, 3);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Medkit);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.Medkit);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.RedAmmo, 4);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.GreenAmmo, 5);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.BlueAmmo, 30);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.OrangeAmmo, 20);

			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.RedAmmo, 4);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.GreenAmmo, 5);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.BlueAmmo, 30);
			if (Math.random() > 0.5) this.createLootItem(0, 0, LootType.OrangeAmmo, 20);
		}
	}

	/*
	removeLootItem(lootItem: LootItem): void {
		for (let i = 0; i < this.lootItems.length; i++) {
			if (lootItem === this.lootItems[i]) this.lootItems.splice(i, 1);
		}
	}
	*/
}
