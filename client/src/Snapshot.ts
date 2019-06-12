import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';

export type Snapshot = {
	t: number;
	p: PlayerSnapshot[];
	b: BulletSnapshot[];
};
