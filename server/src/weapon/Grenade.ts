import ThrowingObject from './ThrowingObject';
import Hand from '../player/Hand';
import { Player } from '../player/Player';
import Sound, { SoundType } from '../Sound';

export default class Grenade extends ThrowingObject {
	readonly fragmentRange: number = 22;
	readonly fragmentSpeed: number = 6;
	readonly fragmentSpray: number = 20;
	readonly fragmentCount: number = 20;
	readonly sounds: Sound[];

	constructor(player: Player, hand: Hand, targetX: number, targetY: number, sounds: Sound[], touchDelay: number) {
		super(player, hand, targetX, targetY, touchDelay);
		this.sounds = sounds;
	}

	createExplodeSound() {
		this.sounds.push(new Sound(SoundType.Grenade, this.getX(), this.getY()));
	}
}
