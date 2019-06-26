import { Weapon } from './Weapon';

export default interface PlayerSnapshot {
	readonly x: number;
	readonly y: number;
	//angle
	readonly a: number;
	//hands
	readonly h: HandPackage[];
	//name
	readonly n: string;
	//active weapon
	readonly w: Weapon;
	//hammer angle
	readonly m: number;
};

type HandPackage = { x: number; y: number };
