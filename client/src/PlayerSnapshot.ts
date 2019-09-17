import { Weapon } from './Weapon';

export default interface PlayerSnapshot {
	//id
	readonly i: number;
	x?: number;
	y?: number;
	//live
	l?: number;
	//angle
	a?: number;
	//hammer angle
	m?: number;
	//active weapon
	w?: Weapon;
	size?: number;
	//deny hand beetween snapshot
	h?: number;
	//left hand
	lX?: number;
	lY?: number;
	//right hand
	rX?: number;
	rY?: number;
	//hand size
	hSize?: number;
	//damageTaken
	d?: number;
};
