import Gun from './Gun';

export default class Shotgun extends Gun {
	constructor(bullets: number) {
		const length = 70;
		const range = 20;
		const bulletSpeed = 12;
		const spray = 0.7;
		const bulletsMax = 2;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
