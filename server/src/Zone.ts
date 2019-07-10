import Map from './Map';
import ZoneCircle from './ZoneCircle';

export default class Zone {
	innerCircle: ZoneCircle;
	outerCircle: ZoneCircle;
	private createZoneTime: number;
	private moveZoneDelay: number = 1000 * 10;

	constructor(map: Map) {
		const mapCenterX = map.width / 2;
		const mapCenterY = map.height / 2;
		const outerRadius = Math.sqrt(map.width * map.width + map.width * map.width) / 2;
		this.outerCircle = new ZoneCircle(mapCenterX, mapCenterY, outerRadius);
		this.innerCircle = this.createInnerCircle(this.outerCircle);
		this.createZoneTime = Date.now();
	}

	private createInnerCircle(outerCircle: ZoneCircle): ZoneCircle {
		const innerRadius = outerCircle.getRadius() / 2;
		const randomAngle = Math.floor(Math.random() * 360);
		const zMax = outerCircle.getRadius() - innerRadius;
		const randomZ = Math.floor(Math.random() * zMax);
		const x = Math.sin(randomAngle * Math.PI / 180) * randomZ;
		const y = Math.cos(randomAngle * Math.PI / 180) * randomZ;
		return new ZoneCircle(outerCircle.getCenterX() + x, outerCircle.getCenterY() + y, innerRadius);
	}

	move(): void {
		if (Date.now() > this.createZoneTime + this.moveZoneDelay) {
			if (this.outerCircle.done()) {
				this.innerCircle = this.createInnerCircle(this.outerCircle);
				this.createZoneTime = Date.now();
				this.outerCircle.resetMove();
			}
			else {
				this.outerCircle.move(this.innerCircle);
			}
		}
	}
}
