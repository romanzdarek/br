import LootItem from './LootItem';
import { LootType } from './LootType';

export default class Loot {
	private lootId: number = 0;
	lootItems: LootItem[] = [];

	constructor() {}

	createLootItem(x: number, y: number, type: LootType, quantity: number = 1): void {
		this.lootItems.push(new LootItem(this.lootId++, x, y, type, quantity));
	}

	createMainLootItems(): void {
		let x = 0;
		let y = 0;
		const shift = 100;
		this.createLootItem(x++ * shift, y++ * shift, LootType.Pistol, 10);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Machinegun, 30);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Shotgun, 2);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Rifle, 5);

		this.createLootItem(x++ * shift, y++ * shift, LootType.Hammer);

		this.createLootItem(x++ * shift, y++ * shift, LootType.Granade);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Granade);

		this.createLootItem(x++ * shift, y++ * shift, LootType.Smoke);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Smoke);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Smoke);

		this.createLootItem(x++ * shift, y++ * shift, LootType.RedAmmo, 30);
		this.createLootItem(x++ * shift, y++ * shift, LootType.BlueAmmo, 30);
		this.createLootItem(x++ * shift, y++ * shift, LootType.GreenAmmo, 30);
		this.createLootItem(x++ * shift, y++ * shift, LootType.OrangeAmmo, 30);

		this.createLootItem(x++ * shift, y++ * shift, LootType.Vest);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Vest);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Medkit);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Medkit);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Medkit);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Medkit);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Scope2);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Scope4);
		this.createLootItem(x++ * shift, y++ * shift, LootType.Scope6);
	}

	/*
	removeLootItem(lootItem: LootItem): void {
		for (let i = 0; i < this.lootItems.length; i++) {
			if (lootItem === this.lootItems[i]) this.lootItems.splice(i, 1);
		}
	}
	*/
}
