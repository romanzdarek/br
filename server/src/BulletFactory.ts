import Map from './Map';
import Point from './Point';
import { Player } from './Player';
import Gun from './Gun';
import Granade from './Granade';
import Bush from './Bush';
import Bullet from './Bullet';

export default class  BulletFactory {
	private bulletId: number = 0;

	createBullet(player: Player, gun: Gun, map: Map, players: Player[], shiftAngle: number = 0): Bullet {
		return Bullet.createBullet(this.bulletId++, player, gun, map, players, shiftAngle);
    }
    
    createFragment(granade: Granade, map: Map, players: Player[], shiftAngle): Bullet {
        return Bullet.createFragment(this.bulletId++, granade.player, granade, map, players, shiftAngle);
	}
}
