import Zone from './Zone';

export default class ZoneSnapshot {
	//in
	readonly iX: number;
	readonly iY: number;
	readonly iR: number;
	//out
	readonly oX: number;
	readonly oY: number;
	readonly oR: number;

	constructor(zone: Zone) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
        const afterComma = 10;
		this.iX = Math.round(zone.innerCircle.getCenterX() * afterComma) / afterComma;
		this.iY = Math.round(zone.innerCircle.getCenterY() * afterComma) / afterComma;
		this.iR = Math.round(zone.innerCircle.getRadius() * afterComma) / afterComma;

		this.oX = Math.round(zone.outerCircle.getCenterX() * afterComma) / afterComma;
		this.oY = Math.round(zone.outerCircle.getCenterY() * afterComma) / afterComma;
		this.oR = Math.round(zone.outerCircle.getRadius() * afterComma) / afterComma;
	}
}
