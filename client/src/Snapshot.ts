import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import GrenadeSnapshot from './GrenadeSnapshot';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './loot/LootSnapshot';
import MyPlayerSnapshot from './MyPlayerSnapshot';
import ObstacleSnapshot from './ObstacleSnapshot';
import WaterCircleSnapshot from './WaterCircleSnapshot';
import Sound from './Sound';

export type Snapshot = {
	t: number;
	i: MyPlayerSnapshot;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: GrenadeSnapshot[];
	s: SmokeCloudSnapshot[];
	z: ZoneSnapshot;
	l: LootSnapshot[];
	o: ObstacleSnapshot[];
	//messages
	m?: string[];
	w?: WaterCircleSnapshot[];
	sounds?: Sound[];
};
