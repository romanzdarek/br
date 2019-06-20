export default class Gun {
	readonly range: number;
	readonly bulletSpeed: number;
	readonly playerRadius: number;
	readonly length: number;
	readonly spray: number;

	constructor(playerRadius: number, length: number, range: number, bulletSpeed: number, spray: number) {
		this.range = range;
		this.bulletSpeed = bulletSpeed;
		this.playerRadius = playerRadius;
		this.length = length;
		this.spray = spray;
	}

	ready(): boolean {
		return true;
	}
}
