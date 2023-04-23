export enum SoundType {
	Pistol,
	Shotgun,
	Rifle,
	Machinegun,
	Grenade,
	Punch,
	Water,
	Hit,
	Footstep,
	HandWeapon,
	Throw,
	SwordBlock,
}

export default interface Sound {
	readonly soundType: SoundType;
	readonly x: number;
	readonly y: number;
	readonly playerId?: number;
}
