import Hand from './Hand';
import Pistol from './Pistol';
import Machinegun from './Machinegun';
import Shotgun from './Shotgun';
import Rifle from './Rifle';
import Hammer from './Hammer';
import Map from './Map';
import Point from './Point';
import Tree from './Tree';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import { TerrainType } from './Terrain';
import { Weapon } from './Weapon';
import * as SocketIO from 'socket.io';
import CollisionPoints from './CollisionPoints';
import LootItem from './LootItem';
import Inventory from './Inventory';
import Loot from './Loot';
import Gun from './Gun';
import Bullet from './Bullet';
import Smoke from './Smoke';
import Granade from './Granade';
import ThrowingObject from './ThrowingObject';
import BulletFactory from './BulletFactory';

export class Player {
	socket: SocketIO.Socket;
	readonly id: number;
	readonly name: string;
	static readonly size: number = 80;
	static readonly radius: number = Player.size / 2;
	readonly speed: number = 10; //6
	private x: number = 0;
	private y: number = 0;
	private angle: number = 0;
	private map: Map;
	private bullets: Bullet[];
	private granades: ThrowingObject[];
	private loot: Loot;
	private players: Player[];
	hands: Hand[] = [];
	inventory: Inventory;
	private slowAroundObstacle: boolean = false;
	private goAroundObstacleCalls: number = 0;
	private goAroundObstacleMaxCalls: number = 10;
	private health: number = 100;
	private collisionPoints: CollisionPoints;
	private bulletFactory: BulletFactory;
	private killMessages: string[];
	private randomPositionAttempts: number = 0;
	private maxRandomPositionAttempts: number = 100;

	private controll = {
		up: false,
		down: false,
		left: false,
		right: false,
		action: false,
		reload: false
	};

	private mouseControll = {
		left: false,
		middle: false,
		right: false,
		x: 0,
		y: 0
	};

	constructor(
		id: number,
		name: string,
		socket: SocketIO.Socket,
		map: Map,
		collisionPoints: CollisionPoints,
		players: Player[],
		bullets: Bullet[],
		granades: ThrowingObject[],
		loot: Loot,
		bulletFactory: BulletFactory,
		killMessages: string[]
	) {
		this.id = id;
		this.socket = socket;
		this.name = name;
		this.players = players;
		this.map = map;
		this.loot = loot;
		this.collisionPoints = collisionPoints;
		this.hands.push(new Hand(this, players, map, collisionPoints));
		this.hands.push(new Hand(this, players, map, collisionPoints));
		this.bullets = bullets;
		this.granades = granades;
		const hammer = new Hammer(this, players, map, collisionPoints);
		this.inventory = new Inventory(this, loot, hammer);
		this.bulletFactory = bulletFactory;
		this.killMessages = killMessages;
		this.setRandomPosition();
	}

	private setRandomPosition(): void {
		const randomX = Math.floor(Math.random() * (this.map.getSize() - Player.size));
		const randomY = Math.floor(Math.random() * (this.map.getSize() - Player.size));
		this.setX(randomX);
		this.setY(randomY);
		if (this.randomPositionCollision()) {
			this.randomPositionAttempts++;
			if (this.randomPositionAttempts < this.maxRandomPositionAttempts) this.setRandomPosition();
		}
	}

	private randomPositionCollision(): boolean {
		//walls
		for (const wall of this.map.rectangleObstacles) {
			if (this.playerInObstacle(wall)) return true;
		}

		//rounds
		for (const round of this.map.impassableRoundObstacles) {
			if (this.playerInObstacle(round)) return true;
		}

		//players
		for (const player of this.players) {
			if (this.playerInObstacle(player)) return true;
		}
		return false;
	}

	private playerInObstacle(object: Player | RoundObstacle | RectangleObstacle): boolean {
		let x = 0,
			y = 0,
			width = 0,
			height = 0;
		if (object instanceof RectangleObstacle) {
			width = object.width;
			height = object.height;
			x = object.x;
			y = object.y;
		}
		if (object instanceof RoundObstacle) {
			width = object.size;
			height = object.size;
			x = object.x;
			y = object.y;
		}
		if (object instanceof Player) {
			width = Player.size;
			height = Player.size;
			x = object.getX();
			y = object.getY();
		}
		//object in object
		if (x + width >= this.x && x <= this.x + Player.size && this.y + Player.size >= y && this.y <= y + height) {
			return true;
		}
		else {
			return false;
		}
	}

	healing(healthPoints: number): void {
		this.health += healthPoints;
		if (this.health > 100) this.health = 100;
	}

	isPointIn(point: Point): boolean {
		//triangle
		const x = this.x + Player.radius - point.x;
		const y = this.y + Player.radius - point.y;
		const radius = Math.sqrt(x * x + y * y);
		if (radius <= Player.radius) return true;
		return false;
	}

	acceptHit(power: number, attacker?: Player, weapon?: Weapon): void {
		if (this.inventory.vest) power /= 2;
		this.health -= power;
		this.health = Math.round(this.health * 10) / 10;
		if (!this.isActive()) this.die(attacker, weapon);
	}

	isActive(): boolean {
		return this.health > 0;
	}

	private die(attacker?: Player, weapon?: Weapon): void {
		this.inventory.throwAllLoot();
		this.x = -10000;
		//this.health = 100;

		let message = 'zona killed ' + this.name;
		if (attacker && weapon) {
			let weaponName = '';
			switch (weapon) {
				case Weapon.Hammer:
					weaponName = 'hammer';
					break;
				case Weapon.Hand:
					weaponName = 'hand';
					break;
				case Weapon.Pistol:
					weaponName = 'pistol';
					break;
				case Weapon.Rifle:
					weaponName = 'rifle';
					break;
				case Weapon.Shotgun:
					weaponName = 'shotgun';
					break;
				case Weapon.Machinegun:
					weaponName = 'machinegun';
					break;
				case Weapon.Granade:
					weaponName = 'granade';
					break;
			}
			message = attacker.name + ' killed ' + this.name + ' with ' + weaponName;
		}
		this.killMessages.push(message);
	}

	keyController(key: string): void {
		switch (key) {
			case 'u':
				this.controll.up = true;
				break;
			case 'd':
				this.controll.down = true;
				break;
			case 'l':
				this.controll.left = true;
				break;
			case 'r':
				this.controll.right = true;
				break;
			case 'e':
				this.controll.action = true;
				break;
			case 're':
				this.controll.reload = true;
				break;
			case '-u':
				this.controll.up = false;
				break;
			case '-d':
				this.controll.down = false;
				break;
			case '-l':
				this.controll.left = false;
				break;
			case '-r':
				this.controll.right = false;
				break;
		}
	}

	mouseController(button: string, position?: Point): void {
		switch (button) {
			case 'l':
				this.mouseControll.left = true;
				if (position) {
					this.mouseControll.x = position.x;
					this.mouseControll.y = position.y;
				}
				break;
			case 'm':
				break;
			case 'r':
				break;
			case '-l':
				this.mouseControll.left = false;
				break;
			case '-m':
				break;
			case '-r':
				break;
		}
	}

	changeAngle(angle: number): void {
		if (angle >= 360 || angle < 0) angle = 0;
		this.angle = angle;
	}

	getCenterX(): number {
		return this.x + Player.radius;
	}

	getCenterY(): number {
		return this.y + Player.radius;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	setX(x: number): void {
		this.x = x;
	}

	setY(y: number): void {
		this.y = y;
	}

	getAngle(): number {
		return this.angle;
	}

	getHealth(): number {
		return this.health;
	}

	hit(): void {
		if (this.hands[0].hitReady() && this.hands[1].hitReady()) {
			let random = Math.round(Math.random());
			this.hands[random].hit();
		}
		this.mouseControll.left = false;
	}

	throw(): void {
		if (this.hands[1].throwReady()) {
			this.hands[1].throw();
			this.inventory.throwNade();
		}
		this.mouseControll.left = false;
	}

	private takeLoot(): void {
		if (!this.controll.action) return;
		if (this.inventory.ready()) {
			for (const loot of this.loot.lootItems) {
				if (!loot.isActive()) continue;
				const x = this.getCenterX() - loot.getCenterX();
				const y = this.getCenterY() - loot.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				const lootAndPlayerRadius = Player.radius + loot.radius;
				if (distance < lootAndPlayerRadius) {
					loot.take();
					this.inventory.take(loot);
					this.controll.action = false;
					return;
				}
			}
		}
		this.controll.action = false;
	}

	loop(): void {
		//player move
		this.move();
		this.takeLoot();
		this.reload();
		this.inventory.loading();
		//hammer move
		if (this.inventory.activeItem instanceof Hammer) this.inventory.activeItem.move();

		//left click
		if (this.mouseControll.left) {
			if (this.inventory.activeItem === Weapon.Hand) {
				this.hit();
			}
			else if (
				(this.inventory.activeItem instanceof Pistol ||
					this.inventory.activeItem instanceof Machinegun ||
					this.inventory.activeItem instanceof Shotgun ||
					this.inventory.activeItem instanceof Rifle) &&
				(this.inventory.activeItem.ready() && this.inventory.ready())
			) {
				if (this.inventory.activeItem instanceof Shotgun) {
					let shotgunSpray = -12;
					for (let i = 0; i < 7; i++) {
						shotgunSpray += 3;
						this.bullets.push(
							this.bulletFactory.createBullet(
								this,
								this.inventory.activeItem,
								this.map,
								this.players,
								shotgunSpray
							)
						);
					}
				}
				else {
					this.bullets.push(
						this.bulletFactory.createBullet(this, this.inventory.activeItem, this.map, this.players)
					);
				}
				this.inventory.activeItem.fire();
				if (!(this.inventory.activeItem instanceof Machinegun)) this.mouseControll.left = false;
			}
			else if (this.inventory.activeItem instanceof Hammer) {
				if (this.inventory.activeItem.ready()) {
					this.inventory.activeItem.hit();
					this.mouseControll.left = false;
				}
			}
			else if (this.inventory.activeItem === Weapon.Granade) {
				if (this.hands[1].throwReady()) {
					this.throw();
					this.granades.push(new Granade(this, this.hands[1], this.mouseControll.x, this.mouseControll.y));
					this.mouseControll.left = false;
				}
			}
			else if (this.inventory.activeItem === Weapon.Smoke) {
				if (this.hands[1].throwReady()) {
					this.throw();
					this.granades.push(new Smoke(this, this.hands[1], this.mouseControll.x, this.mouseControll.y));
					this.mouseControll.left = false;
				}
			}
			else if (this.inventory.activeItem === Weapon.Medkit) {
				this.inventory.heal();
				this.mouseControll.left = false;
			}
		}
	}

	private move(): void {
		this.goAroundObstacleCalls = 0;
		const { up, down, left, right } = this.controll;
		if (up || down || left || right) {
			//standart shift (speed)
			let shift = this.speed;
			//reloading & healing speed
			if (!this.inventory.ready()) shift /= 2;
			//diagonal shift and slow around obstacle
			if ((up && left) || (up && right) || (down && left) || (down && right) || this.slowAroundObstacle) {
				shift = shift / Math.sqrt(2);
				this.slowAroundObstacle = false;
			}
			//shift in water
			for (let i = 0; i < this.map.terrain.length; i++) {
				//terrain block is under my center
				if (
					this.getCenterX() < this.map.terrain[i].x + this.map.terrain[i].size &&
					this.getCenterX() >= this.map.terrain[i].x &&
					this.getCenterY() < this.map.terrain[i].y + this.map.terrain[i].size &&
					this.getCenterY() >= this.map.terrain[i].y
				) {
					if (this.map.terrain[i].type === TerrainType.Water) {
						shift = shift / 3 * 2;
					}
					if (
						this.map.terrain[i].type === TerrainType.WaterTriangle1 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle2 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle3 ||
						this.map.terrain[i].type === TerrainType.WaterTriangle4
					) {
						//Math.floor!!!
						const myXPositionOnTerrain = Math.floor(this.getCenterX() - this.map.terrain[i].x);
						const myYPositionOnTerrain = Math.floor(this.getCenterY() - this.map.terrain[i].y);
						if (
							this.map.waterTerrainData.includeWater(
								this.map.terrain[i].type,
								myXPositionOnTerrain,
								myYPositionOnTerrain
							)
						) {
							shift = shift / 3 * 2;
						}
					}
				}
			}
			//player shift
			let shiftX = 0;
			let shiftY = 0;
			if (up) shiftY += -shift;
			if (down) shiftY += shift;
			if (left) shiftX += -shift;
			if (right) shiftX += shift;
			//i want to go this way...
			this.shiftOnPosition(shiftX, shiftY);
		}
		this.changeHandsPosition();
	}

	private reload(): void {
		if (!this.controll.reload) return;
		this.controll.reload = false;
		if (this.inventory.activeItem instanceof Gun) this.inventory.reload(this.inventory.activeItem);
	}

	private changeHandsPosition(): void {
		this.hands[0].move(-1);
		this.hands[1].move(1);
	}

	private shiftOnPosition(shiftX: number, shiftY: number): void {
		//one or two shifts?
		let countShifts = 0;
		if (shiftX !== 0) countShifts++;
		if (shiftY !== 0) countShifts++;

		//y shift
		let shiftDirection = 1;
		if (shiftY < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftY); i++) {
			if (this.canIshift(0, shiftY - i * shiftDirection, countShifts)) {
				this.y += shiftY - i * shiftDirection;
				break;
			}
		}

		//x shift
		shiftDirection = 1;
		if (shiftX < 0) shiftDirection = -1;
		for (let i = 0; i < Math.abs(shiftX); i++) {
			if (this.canIshift(shiftX - i * shiftDirection, 0, countShifts)) {
				this.x += shiftX - i * shiftDirection;
				break;
			}
		}

		//move only on map area
		if (this.x + Player.size > this.map.getSize()) this.x = this.map.getSize() - Player.size;
		if (this.x < 0) this.x = 0;
		if (this.y + Player.size > this.map.getSize()) this.y = this.map.getSize() - Player.size;
		if (this.y < 0) this.y = 0;
	}

	private canIshift(shiftX: number, shiftY: number, countShifts: number): boolean {
		//rectangles
		for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
			const rectangleObstacle = this.map.rectangleObstacles[i];
			if (rectangleObstacle.isActive()) {
				//collision rectangle - rectangle
				if (
					this.x + shiftX + Player.size >= rectangleObstacle.x &&
					this.x + shiftX <= rectangleObstacle.x + rectangleObstacle.width &&
					this.y + shiftY <= rectangleObstacle.y + rectangleObstacle.height &&
					this.y + shiftY + Player.size >= rectangleObstacle.y
				) {
					for (let j = 0; j < this.collisionPoints.body.length; j++) {
						const point = this.collisionPoints.body[j];
						const pointOnMyPosition = new Point(
							this.getCenterX() + shiftX + point.x,
							this.getCenterY() + shiftY + point.y
						);
						//point collisions
						if (rectangleObstacle.isPointIn(pointOnMyPosition)) {
							if (this.goAroundObstacleCalls <= this.goAroundObstacleMaxCalls) {
								this.goAroundObstacleCalls++;
								this.goAroundRectangleObstacle(shiftX, shiftY, countShifts, rectangleObstacle);
							}
							return false;
						}
					}
				}
			}
		}

		//rounds
		for (let i = 0; i < this.map.impassableRoundObstacles.length; i++) {
			const roundObstacle = this.map.impassableRoundObstacles[i];
			if (roundObstacle.isActive()) {
				let obstacleRadius = roundObstacle.radius;
				if (roundObstacle instanceof Tree) obstacleRadius = roundObstacle.treeTrankRadius;
				const obstacleAndPlayerRadius = obstacleRadius + Player.radius;
				const x = this.getCenterX() + shiftX - roundObstacle.getCenterX();
				const y = this.getCenterY() + shiftY - roundObstacle.getCenterY();
				const distance = Math.sqrt(x * x + y * y);
				if (distance < obstacleAndPlayerRadius) {
					if (this.goAroundObstacleCalls <= this.goAroundObstacleMaxCalls) {
						this.goAroundObstacleCalls++;
						this.goAroundRoundObstacle(shiftX, shiftY, countShifts, roundObstacle);
					}
					return false;
				}
			}
		}
		return true;
	}

	private goAroundRectangleObstacle(
		shiftX: number,
		shiftY: number,
		countShifts: number,
		rectangleObstacle: RectangleObstacle
	): void {
		this.slowAroundObstacle = true;
		const maxObstacleOverlap = Player.size * 0.75;
		if (countShifts === 1) {
			if (shiftX !== 0) {
				//up or down?
				//go up
				if (this.getCenterY() <= rectangleObstacle.y + rectangleObstacle.height / 2) {
					if (this.y + Player.size - rectangleObstacle.y < maxObstacleOverlap) this.shiftOnPosition(0, -1);
				}
				else {
					//go down
					if (rectangleObstacle.y + rectangleObstacle.height - this.y < maxObstacleOverlap)
						this.shiftOnPosition(0, 1);
				}
			}
			if (shiftY !== 0) {
				//left or right?
				//go left
				if (this.getCenterX() <= rectangleObstacle.x + rectangleObstacle.width / 2) {
					if (this.x + Player.size - rectangleObstacle.x < maxObstacleOverlap) this.shiftOnPosition(-1, 0);
				}
				else {
					//go right
					if (rectangleObstacle.x + rectangleObstacle.width - this.x < maxObstacleOverlap)
						this.shiftOnPosition(1, 0);
				}
			}
		}
		if (countShifts === 2) {
			this.slowAroundObstacle = false;
			//chose way
			//obstacle is up and right
			if (
				this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
				const yDistanceFromCorner = Math.abs(
					this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height)
				);
				//x shift right
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(0.1, 0);
				}
				else {
					//y shift up
					this.shiftOnPosition(0, -0.1);
				}
			}
			else if (
				this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is up and left
				const xDistanceFromCorner = Math.abs(
					this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width)
				);
				const yDistanceFromCorner = Math.abs(
					this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height)
				);
				//x shift left
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(-0.1, 0);
				}
				else {
					//y shift up
					this.shiftOnPosition(0, -0.1);
				}
			}
			else if (
				this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is down and left
				const xDistanceFromCorner = Math.abs(
					this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width)
				);
				const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
				//x shift left
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(-0.1, 0);
				}
				else {
					//y shift down
					this.shiftOnPosition(0, 0.1);
				}
			}
			else if (
				this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
				this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2
			) {
				//obstacle is down and right
				const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
				const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
				//x shift right
				if (xDistanceFromCorner <= yDistanceFromCorner) {
					this.shiftOnPosition(0.1, 0);
				}
				else {
					//y shift down
					this.shiftOnPosition(0, 0.1);
				}
			}
		}
	}

	private goAroundRoundObstacle(
		shiftX: number,
		shiftY: number,
		countShifts: number,
		roundObstacle: RoundObstacle
	): void {
		this.slowAroundObstacle = true;
		if (countShifts === 1) {
			if (shiftX !== 0) {
				//obstacle above
				if (this.getCenterY() >= roundObstacle.getCenterY()) {
					//go down
					this.shiftOnPosition(0, 1);
				}
				//obstacle below
				if (this.getCenterY() < roundObstacle.getCenterY()) {
					//go up
					this.shiftOnPosition(0, -1);
				}
			}
			if (shiftY !== 0) {
				//obstacle on left
				if (this.getCenterX() >= roundObstacle.getCenterX()) {
					//go right
					this.shiftOnPosition(1, 0);
				}
				//obstacle on right
				if (this.getCenterX() < roundObstacle.getCenterX()) {
					//go left
					this.shiftOnPosition(-1, 0);
				}
			}
		}
		if (countShifts === 2) {
			//choose shorter way
			const xDistance = Math.abs(this.getCenterX() - roundObstacle.getCenterX());
			const yDistance = Math.abs(this.getCenterY() - roundObstacle.getCenterY());

			//x shift
			if (xDistance <= yDistance) {
				//obstacle on right
				if (this.getCenterX() <= roundObstacle.getCenterX()) {
					//go right
					this.shiftOnPosition(0.5, 0);
				}
				//obstacle on left
				if (this.getCenterX() > roundObstacle.getCenterX()) {
					//go left
					this.shiftOnPosition(-0.5, 0);
				}
			}
			else {
				//y shift
				//obstacle below
				if (this.getCenterY() <= roundObstacle.getCenterY()) {
					//go down
					this.shiftOnPosition(0, 0.5);
				}
				//obstacle above
				if (this.getCenterY() > roundObstacle.getCenterY()) {
					//go up
					this.shiftOnPosition(0, -0.5);
				}
			}
		}
	}

	private rotatePlayer(angle: number): void {
		this.angle = Math.round(angle);
		if (this.angle === 360) this.angle = 0;
	}
}
