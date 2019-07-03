import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import GranadeSnapshot from './GranadeSnapshot';

export type Snapshot = {
	t: number;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
	g: GranadeSnapshot[];
};
