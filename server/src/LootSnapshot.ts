import Loot from './LootItem';

export default class LootSnapshot {
	//id
	readonly i: number;
	x: number;
	y: number;
	size: number;
    type: number;
    del?: number;

	constructor(loot: Loot) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(loot.getX() * afterComma) / afterComma;
		this.y = Math.round(loot.getY() * afterComma) / afterComma;
		this.i = loot.id;
		this.size = loot.size;
        this.type = loot.type;
        if(!loot.isActive()) this.del = 1;
	}
}
