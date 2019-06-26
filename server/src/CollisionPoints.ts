import Point from './Point';
import RotateCollisionPoints from './RotateCollisionPoints';

export default class CollisionPoints {
	readonly hammer: RotateCollisionPoints;
	readonly body: Point[];
	readonly hand: Point[];

	constructor() {
		const hammerCollisionPoints = [
			new Point(152, 36),
			new Point(182, 36),
			new Point(152, 56),
			new Point(182, 56),
			new Point(152, 78),
			new Point(182, 78),
			new Point(152, 95),
			new Point(182, 95)
		];
        this.hammer = new RotateCollisionPoints(hammerCollisionPoints, 200);

        this.body = this.calculateRoundPoints(80, 10);
        this.hand = this.calculateRoundPoints(40, 20);
        
    }
    
    private calculateRoundPoints(radius: number, density: number): Point[] {
        const points = [];
		for (let i = 0; i < 360; i += density) {
			//triangle
			const x = Math.sin(i * Math.PI / 180) * radius;
            const y = Math.cos(i * Math.PI / 180) * radius;
			points.push(new Point(x, y));
        }
        return points;
	}
}
