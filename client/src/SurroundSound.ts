import Player from './Player';
import Sound from './Sound';
import { Howl, Howler } from 'howler';

export default class SurroundSound {
	constructor() {
		const pistolShotPath = '../sound/pistol-shot.wav';
		const sound = new Howl({
			src: [pistolShotPath],
			volume: 0,
		});
		sound.play();
	}

	play(playerCenterX: number, playerCenterY: number, soundToPlay: Sound) {
		/*
		console.log('sound', sound);
		const audio = new Audio('../sound/pistol-shot.wav');
		audio.play();
		*/

		const x = Math.abs(playerCenterX - soundToPlay.x);
		const y = Math.abs(playerCenterY - soundToPlay.y);
		const soundDistance = Math.abs(Math.sqrt(x * x + y * y));
		console.log('distance', soundDistance);

		//blocksize = 300
		//max distance to play sound  = 3000

		const maxDistanceToPlaySound = 3000;
		let volumeByDistance = 1 - soundDistance / maxDistanceToPlaySound;
		if (volumeByDistance < 0) volumeByDistance = 0;

		const baseVolume = 0.1;
		const finalVolume = baseVolume * volumeByDistance;
		console.log('volumeByDistance', volumeByDistance);

		const pistolShotPath = '../sound/pistol-shot.wav';

		const sound = new Howl({
			src: [pistolShotPath],
			volume: finalVolume,
		});

		//sound from direction
		let xDistance = Math.abs(playerCenterX - soundToPlay.x);
		let yDistance = Math.abs(playerCenterY - soundToPlay.y);
		if (soundToPlay.x < playerCenterX) xDistance *= -1;
		if (soundToPlay.y < playerCenterY) yDistance *= -1;
		let xDirection = xDistance / maxDistanceToPlaySound;
		let yDirection = yDistance / maxDistanceToPlaySound;

		console.log('xDirection, yDirection', xDirection, yDirection);
		//sound.stereo(1);

		if (Math.abs(xDirection) > 0.01 || Math.abs(yDirection) > 0.01) {
			sound.pos(xDirection, 0, yDirection);
		}

		const id = sound.play();
		//sound.fade(1, 0, 0);
		//sound.volume(finalVolume);
		//sound.pos(1, 0, 0, id); // v pravo dole
		//sound.pos(-1, 0, -1); // v levo dole

		//sound.fade(1, 0, 1000, id);
	}
}
