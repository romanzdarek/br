import Gun from './Gun';

export default class Rifle extends Gun {
	constructor(bullets: number) {
		const length = 70;
		const range = 40;
		const bulletSpeed = 20;
		const spray = 1;
		const bulletsMax = 5;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
