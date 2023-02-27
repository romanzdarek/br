export enum SoundType {
	Pistol,
	Shotgun,
	Rifle,
	Machinegun,
	Granade,
	Punch,
	Water,
	Hit,
	Footstep,
	Hammer,
	Throw,
}

export default interface Sound {
	readonly soundType: SoundType;
	readonly x: number;
	readonly y: number;
}
