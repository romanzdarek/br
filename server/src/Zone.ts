import Map from './Map';
import ZoneCircle from './ZoneCircle';
import Point from './Point';

export default class Zone {
	innerCircle: ZoneCircle;
	outerCircle: ZoneCircle;
	private createZoneTime: number | null = null;
	private moveZoneDelay: number = 1000 * 10;
	private damage: number = 0.01;
	private damageIncrease: number = 0.01;

	constructor(map: Map) {
		const mapCenterX = map.getSize() / 2;
		const mapCenterY = map.getSize() / 2;
		const outerRadius = Math.sqrt(map.getSize() * map.getSize() + map.getSize() * map.getSize()) / 2;
		this.outerCircle = new ZoneCircle(mapCenterX, mapCenterY, outerRadius);
		this.innerCircle = this.createInnerCircle(this.outerCircle);
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

	start(): void {
		this.createZoneTime = Date.now();
	}

	move(): void {
		if (this.createZoneTime && Date.now() > this.createZoneTime + this.moveZoneDelay) {
			if (this.outerCircle.done()) {
				this.innerCircle = this.createInnerCircle(this.outerCircle);
				this.createZoneTime = Date.now();
				this.outerCircle.resetMove();
				this.damage += this.damageIncrease;
			}
			else {
				this.outerCircle.move(this.innerCircle);
			}
		}
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.outerCircle.getCenterX() - point.x;
		const y = this.outerCircle.getCenterY() - point.y;
		const radius = Math.sqrt(x * x + y * y);
		return radius <= this.outerCircle.getRadius();
	}

	getDamage(): number {
		return this.damage;
	}
}
