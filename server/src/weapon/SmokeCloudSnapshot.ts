import SmokeCloud from './SmokeCloud';

export default class SmokeCloudSnapshot {
	readonly x: number;
    readonly y: number;
    //size
    readonly s: number;
    //opacity
    readonly o: number;

	constructor(smokeCloud: SmokeCloud) {
		//1 = zero digit after the comma
		//10 = one digit after the comma
		//100 = two digits after the comma
		const afterComma = 10;
		this.x = Math.round(smokeCloud.getX() * afterComma) / afterComma;
        this.y = Math.round(smokeCloud.getY() * afterComma) / afterComma;
        this.s = smokeCloud.getSize();
        this.o = smokeCloud.getOpacity();
	}
}
