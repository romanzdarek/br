import ThrowingObject from './ThrowingObject';
import Hand from './Hand';
import { Player } from './Player';

export default class Smoke extends ThrowingObject {
	readonly cloudCount: number = 6;

	constructor(player: Player, hand: Hand, targetX: number, targetY: number) {
		super(player, hand, targetX, targetY);
	}
}
