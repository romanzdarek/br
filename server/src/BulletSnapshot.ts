import Bullet from './Bullet';

export default class BulletSnapshot {
	readonly x: number;
	readonly y: number;

	constructor(bullet: Bullet) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(bullet.getX() * afterComma) / afterComma;
		this.y = Math.round(bullet.getY() * afterComma) / afterComma;
	}
}
