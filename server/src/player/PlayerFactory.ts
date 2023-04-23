import Map from '../map/Map';
import CollisionPoints from '../CollisionPoints';
import { Player } from './Player';
import Bullet from '../weapon/Bullet';
import ThrowingObject from '../weapon/ThrowingObject';
import Loot from '../loot/Loot';
import BulletFactory from '../weapon/BulletFactory';
import Sound from '../Sound';

export default class PlayerFactory {
	private playerId: number = 0;
	create(
		name: string,
		socket: SocketIO.Socket,
		map: Map,
		collisionPoints: CollisionPoints,
		players: Player[],
		bullets: Bullet[],
		grenades: ThrowingObject[],
		loot: Loot,
		bulletFacory: BulletFactory,
		killmessages: string[],
		sounds: Sound[]
	): Player {
		return new Player(this.playerId++, name, socket, map, collisionPoints, players, bullets, grenades, loot, bulletFacory, killmessages, sounds);
	}
}
