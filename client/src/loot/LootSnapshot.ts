import { LootType } from './LootType';

export default interface LootSnapshot {
	//id
	readonly i: number;
	x: number;
	y: number;
	size: number;
	type: LootType;
	del?: number;
	quantity?: number;
}
