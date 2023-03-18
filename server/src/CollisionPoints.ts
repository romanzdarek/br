import Point from './Point';
import RotateCollisionPoints from './RotateCollisionPoints';
import { Player } from './Player';
import Hand from './Hand';

export default class CollisionPoints {
	readonly hammer: RotateCollisionPoints;
	readonly body: Point[];
	readonly hand: Point[];

	constructor() {
		const clubCollisionPoints = [
			new Point(203, 87),
			new Point(212, 87),
			new Point(220, 87),
			new Point(228, 87),
			new Point(237, 87),
			new Point(245, 87),
			new Point(254, 87),
			new Point(263, 87),
			new Point(270, 87),
			new Point(277, 91),
			new Point(277, 99),
			new Point(277, 106),
			new Point(277, 114),
			new Point(275, 121),
			new Point(268, 123),
			new Point(259, 123),
			new Point(249, 123),
			new Point(237, 123),
			new Point(226, 123),
			new Point(216, 123),
			new Point(207, 123),
			new Point(200, 121),
			new Point(198, 115),
			new Point(198, 108),
			new Point(198, 103),
			new Point(198, 95),
		];

		const hammerCollisionPoints = [
			new Point(203, 67),
			new Point(211, 68),
			new Point(217, 73),
			new Point(217, 84),
			new Point(217, 95),
			new Point(217, 115),
			new Point(217, 125),
			new Point(217, 134),
			new Point(211, 140),
			new Point(203, 141),
			new Point(194, 140),
			new Point(188, 134),
			new Point(188, 125),
			new Point(188, 115),
			new Point(188, 95),
			new Point(188, 83),
			new Point(188, 73),
			new Point(194, 68),
		];
		//this.hammer = new RotateCollisionPoints(hammerCollisionPoints, 280);
		this.hammer = new RotateCollisionPoints(clubCollisionPoints, 280);

		this.body = this.calculateRoundPoints(Player.radius, 10);
		this.hand = this.calculateRoundPoints(Hand.radius, 20);
	}

	private calculateRoundPoints(radius: number, density: number): Point[] {
		const points = [];
		for (let i = 0; i < 360; i += density) {
			//triangle
			const x = Math.sin((i * Math.PI) / 180) * radius;
			const y = Math.cos((i * Math.PI) / 180) * radius;
			points.push(new Point(x, y));
		}
		return points;
	}
}
