import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import GranadeSnapshot from './GranadeSnapshot';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';

export type Snapshot = {
	t: number;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: GranadeSnapshot[];
	s: SmokeCloudSnapshot[];
};
