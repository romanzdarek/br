import Map from './Map';
import { Player } from './Player';
import Gun from './Gun';
import Granade from './Granade';
import Bullet from './Bullet';

let bulletId = 0;
export default class BulletFactory {
	private bulletId: number = 0;

	createBullet(player: Player, gun: Gun, map: Map, players: Player[], shiftAngle: number = 0): Bullet {
		return Bullet.createBullet(bulletId++, player, gun, map, players, shiftAngle);
	}

	createFragment(granade: Granade, map: Map, players: Player[], shiftAngle): Bullet {
		return Bullet.createFragment(bulletId++, granade.player, granade, map, players, shiftAngle);
	}
}
