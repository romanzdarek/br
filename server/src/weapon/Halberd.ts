import CollisionPoints from '../CollisionPoints';
import Map from '../map/Map';
import { Player } from '../player/Player';
import HandWeapon from './HandWeapon';
import { Weapon } from './Weapon';

export default class Halberd extends HandWeapon {
	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		super(myPlayer, players, map, collisionPoints);
		this.size = 700;
		this.moveSpeed = 5;
		this.hitTimerMax = 25;
		this.returnTimerMax = 25;
		this.power = 50;
		this.type = Weapon.Halberd;
	}
}
