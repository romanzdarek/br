import ThrowingObject from './ThrowingObject';
import Hand from '../player/Hand';
import { Player } from '../player/Player';

export default class Smoke extends ThrowingObject {
	readonly cloudCount: number = 6;

	constructor(player: Player, hand: Hand, targetX: number, targetY: number, touchDelay: number) {
		super(player, hand, targetX, targetY, touchDelay);
	}
}
