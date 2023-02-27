import Gun from './Gun';

export default class Pistol extends Gun {
	constructor(bullets: number) {
		const length = 48;
		const range = 30;
		const bulletSpeed = 14;
		const spray = 3;
		const bulletsMax = 10;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
