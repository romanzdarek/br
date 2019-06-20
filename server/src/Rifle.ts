import Gun from './Gun';

export default class Rifle extends Gun {
	constructor(playerRadius: number) {
		const length = 70;
		const range = 40;
        const bulletSpeed = 20;
        const spray = 1;
		super(playerRadius, length, range, bulletSpeed, spray);
	}
}
