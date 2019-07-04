import ThrowingObject from './ThrowingObject';
import Hand from './hand';

export default class Granade extends ThrowingObject {
	readonly fragmentRange: number = 25;
	readonly fragmentSpeed: number = 5;
	readonly fragmentSpray: number = 10;
	readonly fragmentCount: number = 15;

	constructor(hand: Hand, targetX: number, targetY: number) {
		super(hand, targetX, targetY);
	}
}
