export enum SoundType {
	Pistol,
}

export default interface Sound {
	readonly soundType: SoundType;
	readonly x: number;
	readonly y: number;
}
