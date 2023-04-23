import CollisionPoints from '../CollisionPoints';
import Map from '../map/Map';
import { Player } from '../player/Player';
import HandWeapon from './HandWeapon';
import { Weapon } from './Weapon';

export default class Sword extends HandWeapon {
	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		super(myPlayer, players, map, collisionPoints);
		this.moveSpeed = 7;
		this.hitTimerMax = 20;
		this.returnTimerMax = 20;
		this.type = Weapon.Sword;
	}
}
