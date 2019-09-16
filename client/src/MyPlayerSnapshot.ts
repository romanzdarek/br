import { Weapon } from './Weapon';

export default interface MyPlayerSnapshot {
	//health
	h: number;
	//inventory
	i1: Weapon;
	i2: Weapon;
	i3: Weapon;
	i4: Weapon;
	i5: Weapon;
	//suma
	s4: number;
	s5: number;
	//active item
	ai: number;
	//bullets
	r: number;
	g: number;
	b: number;
	o: number;
	//active weapon
	//ammmo in mag
	a?: number;
	//max ammo in mag
	aM?: number;
	//scope
	s: number;
	//vest
	v: number;
	//loading
	l: number;
	lE: number;
	lT: string;
	spectate: number;
	spectateName: string;
};
