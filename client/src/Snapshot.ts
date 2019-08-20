import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import GranadeSnapshot from './GranadeSnapshot';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './LootSnapshot';
import MyPlayerSnapshot from './MyPlayerSnapshot';
import ObstacleSnapshot from './ObstacleSnapshot';

export type Snapshot = {
	t: number;
	i: MyPlayerSnapshot;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: GranadeSnapshot[];
	s: SmokeCloudSnapshot[];
	z: ZoneSnapshot;
	l: LootSnapshot[];
	o: ObstacleSnapshot[];
	//messages
	m?:string[];
};
