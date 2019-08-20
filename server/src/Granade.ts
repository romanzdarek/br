import ThrowingObject from './ThrowingObject';
import Hand from './hand';
import { Player } from './Player';

export default class Granade extends ThrowingObject {
	readonly fragmentRange: number = 25;
	readonly fragmentSpeed: number = 5;
	readonly fragmentSpray: number = 10;
	readonly fragmentCount: number = 15;

	constructor(player: Player, hand: Hand, targetX: number, targetY: number) {
		super(player, hand, targetX, targetY);
	}
}
