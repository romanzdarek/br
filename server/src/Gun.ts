export default class Gun {
	readonly range: number;
	readonly bulletSpeed: number;
	readonly length: number;
	readonly spray: number;
	private bullets: number;
	readonly bulletsMax: number;

	constructor(length: number, range: number, bulletSpeed: number, spray: number, bullets: number, bulletsMax: number) {
		this.range = range;
		this.bulletSpeed = bulletSpeed;
		this.length = length;
		this.spray = spray;
		this.bullets = bullets;
		this.bulletsMax = bulletsMax;
	}

	ready(): boolean {
		return this.bullets > 0;
	}

	empty(): boolean {
		return this.bullets === 0;
	}

	fire(): void {
		//this.bullets--;
	}

	reload(bullets: number): void {
		this.bullets += bullets;
	}

	getBullets(): number {
		return this.bullets;
	}
}
