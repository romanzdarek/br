import Map from './Map';
import Point from './Point';
import { Player } from './Player';
import Gun from './Gun';
import Granade from './Granade';
import Bush from './Bush';
import { Weapon } from './Weapon';
import Pistol from './Pistol';
import Rifle from './Rifle';
import Shotgun from './Shotgun';
import Machinegun from './Machinegun';

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
			this.weapon = Weapon.Granade;
			this.power = 34;
		}
		else {
			if (gun instanceof Pistol) {
				this.weapon = Weapon.Pistol;
				this.power = 20;
			}
			if (gun instanceof Rifle) {
				this.weapon = Weapon.Rifle;
				this.power = 50;
			}
			if (gun instanceof Shotgun) {
				this.weapon = Weapon.Shotgun;
				this.power = 15;
			}
			if (gun instanceof Machinegun) {
				this.weapon = Weapon.Machinegun;
				this.power = 20;
			}
		}
	}

	//constructor
	static createBullet(
		id: number,
		player: Player,
		gun: Gun,
		map: Map,
		players: Player[],
		shiftAngle: number = 0
	): Bullet {
		const bulletRange = Math.floor(Math.random() * 3) + gun.range;
		const instance = new Bullet(id, bulletRange, gun);
		instance.map = map;
		instance.players = players;
		instance.player = player;
		instance.x = player.getCenterX();
		instance.y = player.getCenterY();
		//spray
		let randomchange = Math.round(Math.random() * gun.spray * 100) / 100;
		let randomDirection = Math.round(Math.random());
		if (!randomDirection) randomDirection = -1;
		instance.angle = player.getAngle() + randomchange * randomDirection;
		instance.angle += shiftAngle;
		if (instance.angle < 0) {
			instance.angle = 360 + instance.angle;
		}
		if (instance.angle >= 360) {
			instance.angle = 360 - instance.angle;
		}
		//triangle
		const bulletSpeed = gun.bulletSpeed;
		instance.shiftX = Math.sin(instance.angle * Math.PI / 180) * bulletSpeed;
		instance.shiftY = Math.cos(instance.angle * Math.PI / 180) * bulletSpeed;

		//start shift to edge the of player
		const bulletStartShift = Player.radius / gun.bulletSpeed + 0.1;
		instance.x += instance.shiftX * bulletStartShift;
		instance.y -= instance.shiftY * bulletStartShift;

		//shift to the edge of gun
		const bulletShiftToTheGunEdge = Math.ceil(gun.length / gun.bulletSpeed);
		for (let i = 0; i < bulletShiftToTheGunEdge; i++) {
			instance.move();
		}
		return instance;
	}

	//constructor
	static createFragment(
		id: number,
		player: Player,
		granade: Granade,
		map: Map,
		players: Player[],
		shiftAngle: number
	): Bullet {
		const fragmentRange = Math.floor(Math.random() * granade.fragmentRange) + granade.fragmentRange / 3;
		const instance = new Bullet(id, fragmentRange);
		instance.map = map;
		instance.players = players;
		instance.player = player;
		instance.x = granade.getX();
		instance.y = granade.getY();
		//spray
		let randomchange = Math.round(Math.random() * granade.fragmentSpray * 100) / 100;
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
		const bulletSpeed = Math.floor(Math.random() * granade.fragmentSpeed / 2 ) +  granade.fragmentSpeed / 2;
		instance.shiftX = Math.sin(instance.angle * Math.PI / 180) * bulletSpeed;
		instance.shiftY = Math.cos(instance.angle * Math.PI / 180) * bulletSpeed;
		return instance;
	}

	move(): void {
		if (!this.collisions()) {
			this.x += this.shiftX;
			this.y -= this.shiftY;
		}
	}

	private collisions(): boolean {
		const bulletPoint = new Point(this.getCenterX(), this.getCenterY());
		//rounds
		if (this.active) {
			for (const obstacle of this.map.impassableRoundObstacles) {
				if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
					obstacle.acceptHit(this.power);
					this.active = false;
					return true;
				}
			}
		}
		//bushes
		if (this.active) {
			for (const obstacle of this.map.bushes) {
				if (!this.hitBushes.includes(obstacle) && obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
					obstacle.acceptHit(this.power);
					this.hitBushes.push(obstacle);
				}
			}
		}
		//rects
		if (this.active) {
			for (const obstacle of this.map.rectangleObstacles) {
				if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
					obstacle.acceptHit(this.power);
					this.active = false;
					return true;
				}
			}
		}
		//players
		if (this.active) {
			for (const player of this.players) {
				if (player.isActive() && player.isPointIn(bulletPoint)) {
					player.acceptHit(this.power, this.player, this.weapon);
					this.active = false;
					return true;
				}
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
