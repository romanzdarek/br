import PlayerSnapshot from './player/PlayerSnapshot';
import BulletSnapshot from './weapon/BulletSnapshot';
import SmokeCloudSnapshot from './weapon/SmokeCloudSnapshot';
import ZoneSnapshot from './zone/ZoneSnapshot';
import LootSnapshot from './loot/LootSnapshot';
import ThrowingObjectSnapshot from './weapon/ThrowingObjectSnapshot';
import MyPlayerSnapshot from './player/MyPlayerSnapshot';
import ObstacleSnapshot from './obstacle/ObstacleSnapshot';
import WaterCircleSnapshot from './WaterCircleSnapshot';
import Sound from './Sound';

export default class Snapshot {
	t: number;
	i?: MyPlayerSnapshot;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: ThrowingObjectSnapshot[];
	s: SmokeCloudSnapshot[];
	z: ZoneSnapshot;
	l: LootSnapshot[];
	o: ObstacleSnapshot[];
	m?: string[];
	w?: WaterCircleSnapshot[];
	sounds?: Sound[];

	constructor(
		time: number,
		players: PlayerSnapshot[],
		bullets: BulletSnapshot[],
		grenades: ThrowingObjectSnapshot[],
		smokes: SmokeCloudSnapshot[],
		zone: ZoneSnapshot,
		loots: LootSnapshot[],
		obstacles: ObstacleSnapshot[],
		messages: string[],
		waterCircleSnapshots: WaterCircleSnapshot[],
		sounds: Sound[],
		myPlayerSnapshot?: MyPlayerSnapshot
	) {
		this.t = time;
		this.p = players;
		this.b = bullets;
		this.g = grenades;
		this.s = smokes;
		this.z = zone;
		this.l = loots;
		this.o = obstacles;
		if (messages.length) this.m = messages;
		if (myPlayerSnapshot) this.i = myPlayerSnapshot;
		if (waterCircleSnapshots.length) this.w = waterCircleSnapshots;
		if (sounds.length) this.sounds = sounds;
	}
}
