import Gun from './Gun';

export default class Pistol extends Gun {
	constructor(playerRadius: number) {
		const length = 70;
		const range = 20;
        const bulletSpeed = 15;
        const spray = 3;
		super(playerRadius, length, range, bulletSpeed, spray);
	}
}
