import Gun from './Gun';

export default class Machinegun extends Gun {
	private delay: number;

	constructor(bullets: number) {
		const length = 60;
		const range = 30;
		const bulletSpeed = 14;
		const spray = 5;
		const bulletsMax = 30;
		super(length, range, bulletSpeed, spray, bullets, bulletsMax);
		this.delay = 0;
	}

	ready(): boolean {
		if (!super.ready()) return false;
		if (this.delay === 0) {
			this.delay = 3;
			return true;
		}
		else {
			this.delay--;
			return false;
		}
	}
}
