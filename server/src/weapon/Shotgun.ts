import Gun from './Gun';

export default class Shotgun extends Gun {
	static lastUsedShotgunBarrel = 0;

	constructor(bullets: number) {
		const length = 68;
		const range = 20;
		const bulletSpeed = 14;
		const spray = 0.7;
		const bulletsMax = 2;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
