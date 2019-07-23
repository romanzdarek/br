import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './LootSnapshot';
import ThrowingObjectSnapshot from './ThrowingObjectSnapshot';

export default class Snapshot {
	t: number;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: ThrowingObjectSnapshot[];
	s: SmokeCloudSnapshot[];
	z: ZoneSnapshot;
	l: LootSnapshot[];
	constructor(
		time: number,
		players: PlayerSnapshot[],
		bullets: BulletSnapshot[],
		granades: ThrowingObjectSnapshot[],
		smokes: SmokeCloudSnapshot[],
		zone: ZoneSnapshot,
		loots: LootSnapshot[]
	) {
		this.t = time;
		this.p = players;
		this.b = bullets;
		this.g = granades;
		this.s = smokes;
		this.z = zone;
		this.l = loots;
	}
}
