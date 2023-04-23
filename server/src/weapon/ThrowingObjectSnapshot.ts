import ThrowingObject from './ThrowingObject';
import Grenade from './Grenade';
import Smoke from './Smoke';

export default class ThrowingObjectSnapshot {
	readonly x: number;
	readonly y: number;
	readonly a: number;
	//obove ground
	readonly b: number;
	//type
	readonly t: string = '';

	constructor(throwingObject: ThrowingObject) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(throwingObject.getX() * afterComma) / afterComma;
		this.y = Math.round(throwingObject.getY() * afterComma) / afterComma;
		this.a = throwingObject.getAngle();
		this.b = throwingObject.getAboveGround();
		if (throwingObject instanceof Grenade) {
			this.t = 'g';
		}
		if (throwingObject instanceof Smoke) {
			this.t = 's';
		}
	}
}
