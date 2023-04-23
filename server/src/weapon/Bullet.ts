import Map from '../map/Map';
import Point from '../Point';
import { Player } from '../player/Player';
import Gun from './Gun';
import Grenade from './Grenade';
import Bush from '../obstacle/Bush';
import { Weapon } from './Weapon';
import Pistol from './Pistol';
import Rifle from './Rifle';
import Shotgun from './Shotgun';
import Machinegun from './Machinegun';
import { ObstacleType } from '../obstacle/ObstacleType';

export default class Bullet {
	readonly id: number;
	readonly size: number = 1;
	readonly range: number;
	readonly weapon: Weapon;
	readonly power: number;
	private x: number = 0;
	private y: number = 0;
	private angle: number = 0;
	private shiftX: number = 0;
	private shiftY: number = 0;
	private distance: number = 0;
	private active: boolean = true;
	private map: Map;
	private player: Player;
	private players: Player[] = [];
	private hitBushes: Bush[] = [];

	private constructor(id: number, range: number, gun?: Gun) {
		this.id = id;
		this.range = range;
		if (!gun) {
			this.weapon = Weapon.Grenade;
			this.power = 50;
		} else {
			if (gun instanceof Pistol) {
				this.weapon = Weapon.Pistol;
				this.power = 30; //20
			}
			if (gun instanceof Rifle) {
				this.weapon = Weapon.Rifle;
				this.power = 200; //50
			}
			if (gun instanceof Shotgun) {
				this.weapon = Weapon.Shotgun;
				this.power = 20;
			}
			if (gun instanceof Machinegun) {
				this.weapon = Weapon.Machinegun;
				this.power = 30; //30
			}
		}
	}

	//constructor
	static createBullet(id: number, player: Player, gun: Gun, map: Map, players: Player[], shiftAngle: number = 0): Bullet {
		const bulletRange = Math.floor(Math.random() * 3) + gun.range;
		const instance = new Bullet(id, bulletRange, gun);
		instance.map = map;
		instance.players = players;
		instance.player = player;

		instance.x = player.getCenterX();
		instance.y = player.getCenterY();

		// posunutí počáteční pozice kvuli dvou hlavním
		if (gun instanceof Shotgun) {
			const angle = 90 - player.getAngle();
			const hypotenuse = 6;
			const xShift = Math.sin((angle * Math.PI) / 180) * hypotenuse;
			const yShift = Math.cos((angle * Math.PI) / 180) * hypotenuse;

			if (Shotgun.lastUsedShotgunBarrel === 0) {
				Shotgun.lastUsedShotgunBarrel = 1;
				instance.x += xShift;
				instance.y += yShift;
			} else {
				Shotgun.lastUsedShotgunBarrel = 0;
				instance.x -= xShift;
				instance.y -= yShift;
			}
		}

		// Shift bullet from center of player to the end of gun
		// triangel
		const hypotenuse = Player.size / 2 + gun.length;
		const xShift = Math.sin((player.getAngle() * Math.PI) / 180) * hypotenuse;
		const yShift = Math.cos((player.getAngle() * Math.PI) / 180) * hypotenuse;

		instance.x += xShift;
		instance.y -= yShift;

		//spray
		let randomchange = Math.round(Math.random() * gun.spray * 100) / 100;
		let randomDirection = Math.round(Math.random());
		if (!randomDirection) randomDirection = -1;
		instance.angle = player.getAngle() + randomchange * randomDirection;
		instance.angle += shiftAngle;
		if (instance.angle < 0) {
			instance.angle = 360 + instance.angle;
		} else if (instance.angle >= 360) {
			instance.angle = instance.angle - 360;
		}
		//triangle
		const bulletSpeed = gun.bulletSpeed;
		instance.shiftX = Math.sin((instance.angle * Math.PI) / 180) * bulletSpeed;
		instance.shiftY = Math.cos((instance.angle * Math.PI) / 180) * bulletSpeed;

		//start shift to edge the of player
		/*
		const bulletStartShift = Player.radius / gun.bulletSpeed + 0.1;
		instance.x += instance.shiftX * bulletStartShift;
		instance.y -= instance.shiftY * bulletStartShift;
		*/

		//shift to the edge of gun

		/*
		const bulletShiftToTheGunEdge = Math.ceil(gun.length / gun.bulletSpeed);
		for (let i = 0; i < bulletShiftToTheGunEdge; i++) {
			instance.move();
		}
		*/

		return instance;
	}

	//constructor
	static createFragment(id: number, player: Player, Grenade: Grenade, map: Map, players: Player[], shiftAngle: number): Bullet {
		let fragmentRange = Math.floor(Math.random() * (Grenade.fragmentRange / 2)) + Grenade.fragmentRange / 2;
		fragmentRange *= 2;

		const instance = new Bullet(id, fragmentRange);
		instance.map = map;
		instance.players = players;
		instance.player = player;
		instance.x = Grenade.getX();
		instance.y = Grenade.getY();
		//spray
		let randomchange = Math.round(Math.random() * Grenade.fragmentSpray * 100) / 100;
		let randomDirection = Math.round(Math.random());
		if (!randomDirection) randomDirection = -1;
		instance.angle = randomchange * randomDirection;
		instance.angle += shiftAngle;
		if (instance.angle < 0) {
			instance.angle = 360 + instance.angle;
		}
		if (instance.angle >= 360) {
			instance.angle = 360 - instance.angle;
		}
		//triangle
		const bulletSpeed = Grenade.fragmentSpeed;
		instance.shiftX = Math.sin((instance.angle * Math.PI) / 180) * bulletSpeed;
		instance.shiftY = Math.cos((instance.angle * Math.PI) / 180) * bulletSpeed;
		return instance;
	}

	move(): void {
		if (!this.collisions()) {
			this.x += this.shiftX;
			this.y -= this.shiftY;

			if (this.shiftX > 100 || this.shiftY > 100) {
				console.error(this);
				throw 'bullet line error';
			}
		}
	}

	private collisions(): boolean {
		const bulletPoint = new Point(this.getCenterX(), this.getCenterY());
		if (!this.active) return false;

		// Rounds
		for (const obstacle of this.map.roundObstacles) {
			if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
				obstacle.acceptHit(this.power);
				if (obstacle.type === ObstacleType.Rock || obstacle.type === ObstacleType.Tree) {
					this.active = false;
					return true;
				} else if (obstacle.type === ObstacleType.Bush) {
					this.hitBushes.push(<Bush>obstacle);
				}
			}
		}

		// Rects

		for (const obstacle of this.map.rectangleObstacles) {
			if (obstacle.type === ObstacleType.Camo) continue;
			if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
				obstacle.acceptHit(this.power, this);
				this.active = false;
				return true;
			}
		}

		function shuffle(array) {
			let currentIndex = array.length,
				randomIndex;

			// While there remain elements to shuffle.
			while (currentIndex != 0) {
				// Pick a remaining element.
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
			}

			return array;
		}

		// shufle players because first players has disadvantage (two players at same position and the first acceps hit)
		const players = shuffle([...this.players]);

		for (const player of players) {
			if (player.isPointIn(bulletPoint)) {
				player.acceptHit(this.power, this.player, this.weapon);
				this.active = false;
				return true;
			}
		}

		return false;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getCenterX(): number {
		return this.x + this.size / 2;
	}

	getCenterY(): number {
		return this.y + this.size / 2;
	}

	getAngle(): number {
		return this.angle;
	}

	flying(): boolean {
		let state = true;
		this.distance++;
		if (this.distance > this.range) state = false;
		if (!this.active) state = false;
		return state;
	}
}
