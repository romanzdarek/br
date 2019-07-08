import Map from './Map';
import ZoneCircle from './ZoneCircle';

export default class Zone {
	innerCircle: ZoneCircle;
	outerCircle: ZoneCircle;

	constructor(map: Map) {
		//outer
		const mapCenterX = map.width / 2;
		const mapCenterY = map.height / 2;
		const outerRadius = map.width / 2;
		this.outerCircle = new ZoneCircle(mapCenterX, mapCenterY, outerRadius);
		//inner
		const innerRadius = outerRadius / 2;
		const randomAngle = Math.floor(Math.random() * 360);
		const zMax = outerRadius - innerRadius;
		const randomZ = Math.floor(Math.random() * zMax);
		const x = Math.sin(randomAngle * Math.PI / 180) * randomZ;
		const y = Math.cos(randomAngle * Math.PI / 180) * randomZ;
		this.innerCircle = new ZoneCircle(mapCenterX + x, mapCenterY + y, innerRadius);
	}

	move(): void {
		this.outerCircle.move(this.innerCircle);
	}
}
