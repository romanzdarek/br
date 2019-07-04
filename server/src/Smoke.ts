import ThrowingObject from './ThrowingObject';
import Hand from './Hand';

export default class Smoke extends ThrowingObject {
	readonly cloudCount: number = 6;

	constructor(hand: Hand, targetX: number, targetY: number) {
		super(hand, targetX, targetY);
	}
}
