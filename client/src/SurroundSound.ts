import Player from './Player';
import Sound, { SoundType } from './Sound';
import { Howl, Howler } from 'howler';

export default class SurroundSound {
	private pistolShout: Howl;
	private shotgunShout: Howl;
	private rifleShout: Howl;
	private machinegunShout: Howl;
	private granadeShout: Howl;
	private punch: Howl;
	private water: Howl;
	private hit: Howl;
	private footstep: Howl;
	private hammer: Howl;
	private throw: Howl;

	constructor() {
		this.pistolShout = new Howl({
			src: ['../sound/pistol.wav'],
			volume: 0,
		});

		this.shotgunShout = new Howl({
			src: ['../sound/shotgun.wav'],
			volume: 0,
		});

		this.rifleShout = new Howl({
			src: ['../sound/rifle.wav'],
			volume: 0,
		});

		this.machinegunShout = new Howl({
			src: ['../sound/machinegun.wav'],
			volume: 0,
		});

		this.granadeShout = new Howl({
			src: ['../sound/granade.wav'],
			volume: 0,
		});

		this.punch = new Howl({
			src: ['../sound/punch.wav'],
			volume: 0,
		});

		this.water = new Howl({
			src: ['../sound/water2.wav'],
			volume: 0,
		});

		this.hit = new Howl({
			src: ['../sound/hit.wav'],
			volume: 0,
		});

		this.footstep = new Howl({
			src: ['../sound/footstep.wav'],
			volume: 0,
		});

		this.hammer = new Howl({
			src: ['../sound/hammer.flac'],
			volume: 0,
		});

		this.throw = new Howl({
			src: ['../sound/throw.flac'],
			volume: 0,
		});
	}

	play(playerCenterX: number, playerCenterY: number, soundToPlay: Sound) {
		let sound = this.pistolShout;

		let volumeBySoundType = 1;

		switch (soundToPlay.soundType) {
			case SoundType.Shotgun:
				sound = this.shotgunShout;
				break;
			case SoundType.Rifle:
				volumeBySoundType = 1.5;
				sound = this.rifleShout;
				break;
			case SoundType.Machinegun:
				volumeBySoundType = 1.2;
				sound = this.machinegunShout;
				break;
			case SoundType.Granade:
				sound = this.granadeShout;
				break;
			case SoundType.Punch:
				volumeBySoundType = 0.9;
				sound = this.punch;
				break;
			case SoundType.Water:
				volumeBySoundType = 0.3;
				sound = this.water;
				break;
			case SoundType.Hit:
				sound = this.hit;
				break;
			case SoundType.Footstep:
				volumeBySoundType = 1.5;
				sound = this.footstep;
				break;
			case SoundType.Hammer:
				sound = this.hammer;
				break;
			case SoundType.Throw:
				volumeBySoundType = 0.8;
				sound = this.throw;
				break;
		}

		const x = Math.abs(playerCenterX - soundToPlay.x);
		const y = Math.abs(playerCenterY - soundToPlay.y);
		const soundDistance = Math.abs(Math.sqrt(x * x + y * y));
		//console.log('distance', soundDistance);

		const maxDistanceToPlaySound = 3000;
		let volumeByDistance = 1 - soundDistance / maxDistanceToPlaySound;
		if (volumeByDistance < 0) volumeByDistance = 0;

		const baseVolume = 0.15;
		const finalVolume = baseVolume * volumeByDistance * volumeBySoundType;
		//console.log('volumeByDistance', volumeByDistance);

		//sound from direction
		let xDistance = Math.abs(playerCenterX - soundToPlay.x);
		let yDistance = Math.abs(playerCenterY - soundToPlay.y);
		if (soundToPlay.x < playerCenterX) xDistance *= -1;
		if (soundToPlay.y < playerCenterY) yDistance *= -1;
		let xDirection = xDistance / maxDistanceToPlaySound;
		let yDirection = yDistance / maxDistanceToPlaySound;
		//console.log('xDirection, yDirection', xDirection, yDirection);

		if (Math.abs(xDirection) > 0.01 || Math.abs(yDirection) > 0.01) {
			sound.pos(xDirection, 0, yDirection);
		} else {
			sound.pos(0, 0, 0);
		}

		sound.volume(finalVolume);
		sound.play();
		//sound.fade(1, 0, 1000, id);
	}
}
