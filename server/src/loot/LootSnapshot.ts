import LootItem from './LootItem';
import { LootType } from './LootType';

export default class LootSnapshot {
	//id
	readonly i: number;
	x: number;
	y: number;
	size: number;
	type: number;
	del?: number;
	quantity?: number;

	constructor(loot: LootItem) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(loot.getX() * afterComma) / afterComma;
		this.y = Math.round(loot.getY() * afterComma) / afterComma;
		this.i = loot.id;
		this.size = loot.size;
		this.type = loot.type;
		if (!loot.isActive()) this.del = 1;
		if (
			loot.type === LootType.OrangeAmmo ||
			loot.type === LootType.RedAmmo ||
			loot.type === LootType.BlueAmmo ||
			loot.type === LootType.GreenAmmo ||
			loot.type === LootType.Grenade ||
			loot.type === LootType.Smoke
		) {
			this.quantity = loot.quantity;
		}
	}
}
