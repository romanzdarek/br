import ThrowingObject from './ThrowingObject';
import Hand from './hand';
import { Player } from './Player';

export default class Granade extends ThrowingObject {
	readonly fragmentRange: number = 22;
	readonly fragmentSpeed: number = 6;
	readonly fragmentSpray: number = 20;
	readonly fragmentCount: number = 20;

	constructor(player: Player, hand: Hand, targetX: number, targetY: number) {
		super(player, hand, targetX, targetY);
	}
}
