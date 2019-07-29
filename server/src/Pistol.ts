import Gun from './Gun';

export default class Pistol extends Gun {
	constructor(bullets: number) {
		const length = 70;
		const range = 20;
		const bulletSpeed = 15;
		const spray = 3;
		const bulletsMax = 10;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
	}
}
