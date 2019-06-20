import Gun from './Gun';

export default class Shotgun extends Gun {
	constructor(playerRadius: number) {
		const length = 70;
		const range = 20;
		const bulletSpeed = 12;
		const spray = 10;
		super(playerRadius, length, range, bulletSpeed, spray);
	}
}
