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

export default class Sound {
	readonly soundType: SoundType;
	readonly x: number;
	readonly y: number;

	constructor(soundType: SoundType, x: number, y: number) {
		this.soundType = soundType;
		this.x = x;
		this.y = y;
	}
}
