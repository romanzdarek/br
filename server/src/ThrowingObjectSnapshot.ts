import ThrowingObject from './ThrowingObject';

export default class ThrowingObjectSnapshot {
	readonly x: number;
    readonly y: number;
    readonly a: number;
    //obove ground
    readonly b: number;

	constructor(throwingObject: ThrowingObject) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(throwingObject.getX() * afterComma) / afterComma;
        this.y = Math.round(throwingObject.getY() * afterComma) / afterComma;
        this.a = throwingObject.getAngle();
        this.b = throwingObject.getAboveGround();
	}
}
