import Gun from './Gun';

export default class Machinegun extends Gun {
	private delay: number;

	constructor(playerRadius: number) {
		const length = 70;
		const range = 20;
		const bulletSpeed = 15;
		const spray = 5;
		super(playerRadius, length, range, bulletSpeed, spray);
		this.delay = 0;
	}

	ready(): boolean {
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
