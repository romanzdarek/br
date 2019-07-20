import { Weapon } from './Weapon';
import HandSnapshot from './HandSnapshot';

export default interface PlayerSnapshot {
	//id
	readonly i: number;
	x?: number;
	y?: number;
	//angle
	a?: number;
	//hands
	h?: HandSnapshot[];
	//name
	//readonly n: string;
	//active weapon
	w?: Weapon;
	//hammer angle
	m?: number;
	size?: number;
};


