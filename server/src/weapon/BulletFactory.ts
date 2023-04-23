import Map from '../map/Map';
import { Player } from '../player/Player';
import Gun from './Gun';
import Grenade from './Grenade';
import Bullet from './Bullet';

export default class BulletFactory {
	private static bulletId: number = 0;

	createBullet(player: Player, gun: Gun, map: Map, players: Player[], shiftAngle: number = 0): Bullet {
		return Bullet.createBullet(BulletFactory.bulletId++, player, gun, map, players, shiftAngle);
	}

	createFragment(Grenade: Grenade, map: Map, players: Player[], shiftAngle): Bullet {
		return Bullet.createFragment(BulletFactory.bulletId++, Grenade.player, Grenade, map, players, shiftAngle);
	}
}
