import Point from './Point';
import RotateCollisionPoints from './RotateCollisionPoints';
import { Player } from './player/Player';
import Hand from './player/Hand';

export default class CollisionPoints {
	readonly mace: RotateCollisionPoints;
	readonly maceBlock: RotateCollisionPoints;

	readonly sword: RotateCollisionPoints;
	readonly swordBlock: RotateCollisionPoints;

	readonly halberd: RotateCollisionPoints;
	readonly halberdBlock: RotateCollisionPoints;

	readonly body: Point[];
	readonly hand: Point[];

	constructor() {
		const maceBlockCollisionPoints = [
			new Point(309, 215),
			new Point(319, 215),
			new Point(329, 215),
			new Point(339, 215),
			new Point(349, 215),
			new Point(359, 215),
			new Point(369, 215),
			new Point(379, 215),
			new Point(389, 215),
			new Point(399, 215),
			new Point(409, 215),
			new Point(419, 215),
			new Point(429, 215),
		];

		const maceCollisionPoints = [
			new Point(298, 205),
			new Point(310, 192),
			new Point(326, 206),
			new Point(348, 192),
			new Point(367, 206),
			new Point(386, 192),
			new Point(405, 206),
			new Point(423, 192),
			new Point(434, 207),
			new Point(434, 222),
			new Point(423, 238),
			new Point(404, 225),
			new Point(385, 238),
			new Point(368, 225),
			new Point(349, 238),
			new Point(328, 225),
			new Point(310, 238),
			new Point(298, 225),
		];

		const swordCollisionPoints = [
			new Point(303, 200),
			new Point(318, 200),
			new Point(336, 200),
			new Point(354, 198),
			new Point(376, 196),
			new Point(394, 195),
			new Point(414, 194),
			new Point(437, 193),
			new Point(452, 194),
			new Point(461, 201),
			new Point(470, 207),
			new Point(478, 212),
			new Point(484, 216),
			new Point(472, 223),
			new Point(465, 227),
			new Point(456, 233),
			new Point(440, 239),
			new Point(418, 237),
			new Point(399, 236),
			new Point(378, 235),
			new Point(363, 234),
			new Point(337, 233),
			new Point(319, 231),
			new Point(302, 230),
		];

		const swordBlockCollisionPoints = [
			new Point(312, 215),
			new Point(322, 215),
			new Point(332, 215),
			new Point(342, 215),
			new Point(352, 215),
			new Point(362, 215),
			new Point(372, 215),
			new Point(382, 215),
			new Point(392, 215),
			new Point(402, 215),
			new Point(412, 215),
			new Point(422, 215),
			new Point(432, 215),
			new Point(442, 215),
			new Point(452, 215),
			new Point(462, 215),
			new Point(472, 215),
		];

		const halberdCollisionPoints = [
			new Point(532, 305),
			new Point(543, 304),
			new Point(554, 303),
			new Point(567, 303),
			new Point(582, 302),
			new Point(594, 301),
			new Point(608, 300),
			new Point(623, 299),
			new Point(635, 298),
			new Point(649, 298),
			new Point(659, 304),
			new Point(666, 309),
			new Point(668, 322),
			new Point(653, 331),
			new Point(642, 333),
			new Point(629, 332),
			new Point(616, 331),
			new Point(601, 331),
			new Point(584, 329),
			new Point(566, 328),
			new Point(551, 329),
			new Point(539, 327),
			new Point(532, 327),
		];

		const halberdBlockCollisionPoints = [
			new Point(542, 316),
			new Point(552, 316),
			new Point(562, 316),
			new Point(572, 316),
			new Point(582, 316),
			new Point(592, 316),
			new Point(602, 316),
			new Point(612, 316),
			new Point(622, 316),
			new Point(632, 316),
			new Point(642, 316),
			new Point(652, 316),
			new Point(662, 316),
			new Point(672, 316),
		];

		this.mace = new RotateCollisionPoints(maceCollisionPoints, 500);
		this.maceBlock = new RotateCollisionPoints(maceBlockCollisionPoints, 500);

		this.sword = new RotateCollisionPoints(swordCollisionPoints, 500);
		this.swordBlock = new RotateCollisionPoints(swordBlockCollisionPoints, 500);

		this.halberd = new RotateCollisionPoints(halberdCollisionPoints, 700);
		this.halberdBlock = new RotateCollisionPoints(halberdBlockCollisionPoints, 700);

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
