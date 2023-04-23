import CollisionPoints from '../CollisionPoints';
import Map from '../map/Map';
import { Player } from '../player/Player';
import HandWeapon from './HandWeapon';

export default class Hammer extends HandWeapon {
	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		super(myPlayer, players, map, collisionPoints);
	}
}
