import ThrowingObject from './ThrowingObject';
import Hand from './hand';
import { Player } from './Player';
import Sound, { SoundType } from './Sound';

export default class Granade extends ThrowingObject {
	readonly fragmentRange: number = 22;
	readonly fragmentSpeed: number = 6;
	readonly fragmentSpray: number = 20;
	readonly fragmentCount: number = 20;
	readonly sounds: Sound[];

	constructor(player: Player, hand: Hand, targetX: number, targetY: number, sounds: Sound[]) {
		super(player, hand, targetX, targetY);
		this.sounds = sounds;
	}

	createExplodeSound() {
		this.sounds.push(new Sound(SoundType.Pistol, this.getX() + Math.random() * 100, this.getY() + Math.random() * 100));
		this.sounds.push(new Sound(SoundType.Pistol, this.getX() + Math.random() * -100, this.getY() + Math.random() * 100));
		this.sounds.push(new Sound(SoundType.Pistol, this.getX() + Math.random() * 100, this.getY() + Math.random() * -100));
	}
}
