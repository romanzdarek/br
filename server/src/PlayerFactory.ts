import Map from './Map';
import CollisionPoints from './CollisionPoints';
import { Player } from './Player';
import Bullet from './Bullet';
import ThrowingObject from './ThrowingObject';
import Loot from './Loot';
import BulletFactory from './BulletFactory';

export default class PlayerFactory {
	private playerId: number = 0;
	create(
		name: string,
		socket: SocketIO.Socket,
		map: Map,
		collisionPoints: CollisionPoints,
		players: Player[],
		bullets: Bullet[],
		granades: ThrowingObject[],
		loot: Loot,
		bulletFacory: BulletFactory
	): Player {
		return new Player(
			this.playerId++,
			name,
			socket,
			map,
			collisionPoints,
			players,
			bullets,
			granades,
			loot,
			bulletFacory
		);
	}
}
