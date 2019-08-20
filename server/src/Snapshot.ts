import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './LootSnapshot';
import ThrowingObjectSnapshot from './ThrowingObjectSnapshot';
import MyPlayerSnapshot from './MyPlayerSnapshot';
import ObstacleSnapshot from './ObstacleSnapshot';

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
	constructor(
		time: number,
		players: PlayerSnapshot[],
		bullets: BulletSnapshot[],
		granades: ThrowingObjectSnapshot[],
		smokes: SmokeCloudSnapshot[],
		zone: ZoneSnapshot,
		loots: LootSnapshot[],
		obstacles: ObstacleSnapshot[],
		messages: string[],
		myPlayerSnapshot?: MyPlayerSnapshot
	) {
		this.t = time;
		this.p = players;
		this.b = bullets;
		this.g = granades;
		this.s = smokes;
		this.z = zone;
		this.l = loots;
		this.o = obstacles;
		if (messages.length) this.m = messages;
		if (myPlayerSnapshot) this.i = myPlayerSnapshot;
	}
}
