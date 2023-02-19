export enum SoundType {
	Pistol,
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
