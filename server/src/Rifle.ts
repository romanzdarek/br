import Gun from './Gun';

export default class Rifle extends Gun {
	constructor(bullets: number) {
		const length = 100;
		const range = 30;
		const bulletSpeed = 18;
		const spray = 1;
		const bulletsMax = 5;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
