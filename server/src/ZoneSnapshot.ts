import Zone from './Zone';

export default class ZoneSnapshot {
	//in
	iX?: number;
	iY?: number;
	iR?: number;
	//out
	oX?: number;
	oY?: number;
	oR?: number;
	//delay (seconds)
	d?: number;

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
		this.d = zone.createZoneTime + zone.moveZoneDelay - Date.now();
		if (this.d < 0) this.d = 0;
		this.d = Math.round(this.d / 1000);
	}
}
