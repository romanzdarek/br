import Map from './Map';
import Zone from './Zone';
import Granade from './Granade';
import Smoke from './Smoke';
import SmokeCloud from './SmokeCloud';
import Bullet from './Bullet';
import { Player } from './Player';
import { Weapon } from './Weapon';
import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import WaterTerrainData from './WaterTerrainData';
import CollisionPoints from './CollisionPoints';
import ThrowingObjectSnapshot from './ThrowingObjectSnapshot';
import * as SocketIO from 'socket.io';
import SmokeCloudSnapshot from './SmokeCloudSnapshot';
import ThrowingObject from './ThrowingObject';
import ZoneSnapshot from './ZoneSnapshot';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import Point from './Point';
import MapData from './Mapdata';
import Loot from './Loot';
import { LootType } from './LootType';
import LootSnapshot from './LootSnapshot';
import Snapshot from './Snapshot';

export default class Game {
	private map: Map;
	private mapData: MapData;
	private zone: Zone;
	private playerId: number = 0;
	players: Player[] = [];
	private lastSnapshot: Snapshot;
	private bullets: Bullet[] = [];
	private loots: Loot[] = [];
	private smokeClouds: SmokeCloud[] = [];
	private granades: ThrowingObject[] = [];
	private numberOfBullets: number = 0;
	private collisionPoints: CollisionPoints;
	private active: boolean = false;
	private randomPositionAttempts: number = 0;
	private maxRandomPositionAttempts: number = 1000;

	constructor(waterTerrainData: WaterTerrainData, collisionPoints: CollisionPoints, mapData: MapData) {
		this.collisionPoints = collisionPoints;
		this.mapData = mapData;
		this.map = new Map(waterTerrainData, mapData);
		this.zone = new Zone(this.map);
		this.createLoot();
	}

	private createLoot(): void {
		let id = 0;
		for (let i = 0; i < 10; i++) {
			this.loots.push(new Loot(id++, 300 * i, 300 * i, LootType.Rifle));
		}
	}

	private updateListOfPlayers(): void {
		const list = [];
		for (const player of this.players) {
			list.push(player.name);
		}
		for (const player of this.players) {
			player.socket.emit('listOfPlayers', list);
		}
	}

	isActive(): boolean {
		return this.active;
	}

	//player who created this game
	amIGameOwner(socket: SocketIO.Socket): boolean {
		return this.players[0].socket === socket;
	}

	cancelGame(): void {
		for (const player of this.players) {
			player.socket.emit('leaveLobby');
		}
	}

	start(socket: SocketIO.Socket): void {
		if (this.players.length) {
			//only first player can start game
			if (this.players[0].socket === socket) {
				this.active = true;
				this.zone.start();
				//start clients
				for (const player of this.players) {
					player.socket.emit('startGame', this.mapData);
				}
			}
		}
	}

	leaveLobby(socket: SocketIO.Socket): void {
		for (let i = this.players.length - 1; i >= 0; i--) {
			const player = this.players[i];
			if (player.socket === socket) {
				this.players.splice(i, 1);
				this.updateListOfPlayers();
				socket.emit('leaveLobby');
				break;
			}
		}
	}

	createPlayer(name: string, socket: SocketIO.Socket): string {
		for (const player of this.players) {
			//unique name
			if (player.name === name) {
				const uniqueName = (num: number): string => {
					for (const player of this.players) {
						//unique name
						if (player.name === name + num) {
							return uniqueName(num + 1);
						}
					}
					return name + num;
				};
				name = uniqueName(2);
			}
		}
		const newPlayer = new Player(this.playerId++, name, socket, this.map, this.collisionPoints, this.players);
		this.setRandomPosition(newPlayer);
		this.players.push(newPlayer);
		//send it to the client
		this.updateListOfPlayers();
		//player ID for client
		newPlayer.socket.emit('playerId', newPlayer.id);
		return name;
	}

	/*
	makeID(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const length = 6;
		let id = '';
		for (let i = 0; i < length; i++) {
			const randomChar = chars[Math.floor(Math.random() * chars.length)];
			id += randomChar;
		}
		return id;
	}
	*/

	private shuffleFragments(fragments: Bullet[]): Bullet[] {
		const shuffleFragments = [];
		while (fragments.length) {
			const randomIndex = Math.floor(Math.random() * fragments.length);
			shuffleFragments.push(fragments[randomIndex]);
			fragments.splice(randomIndex, 1);
		}
		return shuffleFragments;
	}

	private setRandomPosition(gameObject: Player): void {
		const randomX = Math.floor(Math.random() * (this.map.getSize() - Player.size));
		const randomY = Math.floor(Math.random() * (this.map.getSize() - Player.size));
		gameObject.setX(randomX);
		gameObject.setY(randomY);
		if (this.randomPositionCollision(gameObject)) {
			this.randomPositionAttempts++;
			if (this.randomPositionAttempts < this.maxRandomPositionAttempts) this.setRandomPosition(gameObject);
		}
	}

	private randomPositionCollision(gameObject: Player): boolean {
		//walls
		for (const wall of this.map.rectangleObstacles) {
			if (this.isObjectInObject(gameObject, wall)) return true;
		}

		//rounds
		for (const round of this.map.impassableRoundObstacles) {
			if (this.isObjectInObject(gameObject, round)) return true;
		}

		//players
		for (const player of this.players) {
			if (this.isObjectInObject(gameObject, player)) return true;
		}
		return false;
	}

	private isObjectInObject(
		object1: Player | RoundObstacle | RectangleObstacle,
		object2: Player | RoundObstacle | RectangleObstacle
	): boolean {
		let x1 = 0,
			y1 = 0,
			width1 = 0,
			height1 = 0,
			x2 = 0,
			y2 = 0,
			width2 = 0,
			height2 = 0;
		//1
		if (object1 instanceof RectangleObstacle) {
			width1 = object1.width;
			height1 = object1.height;
			x1 = object1.x;
			y1 = object1.y;
		}
		if (object1 instanceof RoundObstacle) {
			width1 = object1.size;
			height1 = object1.size;
			x1 = object1.x;
			y1 = object1.y;
		}
		if (object1 instanceof Player) {
			width1 = Player.size;
			height1 = Player.size;
			x1 = object1.getX();
			y1 = object1.getY();
		}
		//2
		if (object2 instanceof RectangleObstacle) {
			width2 = object2.width;
			height2 = object2.height;
			x2 = object2.x;
			y2 = object2.y;
		}
		if (object2 instanceof RoundObstacle) {
			width2 = object2.size;
			height2 = object2.size;
			x2 = object2.x;
			y2 = object2.y;
		}
		if (object2 instanceof Player) {
			width2 = Player.size;
			height2 = Player.size;
			x2 = object2.getX();
			y2 = object2.getY();
		}
		//object in object
		if (x1 + width1 >= x2 && x1 <= x2 + width2 && y1 + height1 >= y2 && y1 <= y2 + height2) {
			return true;
		}
		else {
			return false;
		}
	}

	loop(): void {
		//zone move
		this.zone.move();

		//move granades
		for (let i = this.granades.length - 1; i >= 0; i--) {
			const granade = this.granades[i];
			if (!granade.explode()) {
				granade.move();
				granade.tick();
			}
			else {
				//explode
				//create fragments
				if (granade instanceof Granade) {
					const shiftAngle = 360 / granade.fragmentCount;
					const fragments = [];
					for (let i = 0; i < granade.fragmentCount; i++) {
						const angle = i * shiftAngle;
						fragments.push(
							Bullet.makeFragment(++this.numberOfBullets, granade, this.map, this.players, angle)
						);
					}
					this.bullets = [ ...this.bullets, ...this.shuffleFragments(fragments) ];
				}
				//create smoke clouds
				if (granade instanceof Smoke) {
					const shiftAngle = 360 / granade.cloudCount;
					for (let i = 0; i < granade.cloudCount; i++) {
						const angle = i * shiftAngle;
						this.smokeClouds.push(new SmokeCloud(granade, angle));
					}
				}
				this.granades.splice(i, 1);
			}
		}

		//move or delete smoke clouds
		for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
			const smokeCloud = this.smokeClouds[i];
			if (smokeCloud.isActive()) {
				smokeCloud.move();
			}
			else {
				this.smokeClouds.splice(i, 1);
			}
		}

		//move and delete bullets
		for (let i = this.bullets.length - 1; i >= 0; i--) {
			const bullet = this.bullets[i];
			if (bullet.flying()) {
				bullet.move();
				bullet.move();
			}
			else {
				this.bullets.splice(i, 1);
			}
		}

		//player move
		for (const player of this.players) {
			player.move();
			//zone damage
			if (!this.zone.isPointIn(new Point(player.getCenterX(), player.getCenterY()))) {
				player.acceptHit(this.zone.getDamage());
			}

			//hit
			if (player.mouseControll.left) {
				switch (player.getActiveWeapon()) {
					case Weapon.Hand:
						player.hit();
						break;

					case Weapon.Pistol:
						if (player.pistol.ready()) {
							this.bullets.push(
								Bullet.makeBullet(++this.numberOfBullets, player, player.pistol, this.map, this.players)
							);
						}
						player.mouseControll.left = false;
						break;

					case Weapon.Machinegun:
						if (player.machinegun.ready()) {
							this.bullets.push(
								Bullet.makeBullet(
									++this.numberOfBullets,
									player,
									player.machinegun,
									this.map,
									this.players
								)
							);
						}
						break;

					case Weapon.Shotgun:
						if (player.shotgun.ready()) {
							let shotgunSpray = -12;
							for (let i = 0; i < 7; i++) {
								shotgunSpray += 3;
								this.bullets.push(
									Bullet.makeBullet(
										++this.numberOfBullets,
										player,
										player.shotgun,
										this.map,
										this.players,
										shotgunSpray
									)
								);
							}
							player.mouseControll.left = false;
						}
						break;

					case Weapon.Rifle:
						if (player.rifle.ready()) {
							this.bullets.push(
								Bullet.makeBullet(++this.numberOfBullets, player, player.rifle, this.map, this.players)
							);
							player.mouseControll.left = false;
						}
						break;

					case Weapon.Hammer:
						if (player.hammer.ready()) {
							player.hammer.hit();
							player.mouseControll.left = false;
						}
						break;

					case Weapon.Granade:
						if (player.hands[1].throwReady()) {
							player.throw();
							this.granades.push(
								new Granade(player.hands[1], player.mouseControll.x, player.mouseControll.y)
							);
							player.mouseControll.left = false;
						}
						break;

					case Weapon.Smoke:
						if (player.hands[1].throwReady()) {
							player.throw();
							this.granades.push(
								new Smoke(player.hands[1], player.mouseControll.x, player.mouseControll.y)
							);
							player.mouseControll.left = false;
						}
						break;
				}
			}
		}
		this.clientsUpdate();
	}

	private clientsUpdate(): void {
		const dateNow = Date.now();
		//loots
		const lootSnapshots: LootSnapshot[] = [];
		for (const loot of this.loots) {
			lootSnapshots.push(new LootSnapshot(loot));
		}

		//granades
		const granadeSnapshots: ThrowingObjectSnapshot[] = [];
		for (const granade of this.granades) {
			granadeSnapshots.push(new ThrowingObjectSnapshot(granade));
		}

		//bullets
		const bulletSnapshots: BulletSnapshot[] = [];
		for (const bullet of this.bullets) {
			bulletSnapshots.push(new BulletSnapshot(bullet));
		}

		//smokes
		const smokeCloudSnapshots: SmokeCloudSnapshot[] = [];
		for (const smokeCloud of this.smokeClouds) {
			smokeCloudSnapshots.push(new SmokeCloudSnapshot(smokeCloud));
		}

		//zone
		const zoneSnapshot = new ZoneSnapshot(this.zone);
		const zoneSnapshotOptimalization = new ZoneSnapshot(this.zone);

		//players snapshots
		const playerSnapshots: PlayerSnapshot[] = [];
		for (const player of this.players) {
			playerSnapshots.push(new PlayerSnapshot(player));
		}
		//players snapshots copy for optimalization
		let playerSnapshotsOptimalization: PlayerSnapshot[] = [];
		for (const player of this.players) {
			playerSnapshotsOptimalization.push(new PlayerSnapshot(player));
		}

		//find same values and delete them
		//players
		for (const playerNow of playerSnapshotsOptimalization) {
			if (this.lastSnapshot) {
				for (const playerBefore of this.lastSnapshot.p) {
					if (playerNow.i === playerBefore.i) {
						if (playerNow.x === playerBefore.x) delete playerNow.x;
						if (playerNow.y === playerBefore.y) delete playerNow.y;
						if (playerNow.a === playerBefore.a) delete playerNow.a;
						if (playerNow.m === playerBefore.m) delete playerNow.m;
						if (playerNow.w === playerBefore.w) delete playerNow.w;
						if (playerNow.size === playerBefore.size) delete playerNow.size;
						if (playerNow.h[0].size === playerBefore.h[0].size) {
							delete playerNow.h[0].size;
							delete playerNow.h[1].size;
						}
						if (
							playerNow.h[0].x === playerBefore.h[0].x &&
							playerNow.h[0].y === playerBefore.h[0].y &&
							playerNow.h[1].x === playerBefore.h[1].x &&
							playerNow.h[1].y === playerBefore.h[1].y
						) {
							delete playerNow.h;
						}
					}
				}
			}
		}
		//delete empty players snapshots
		for (let i = playerSnapshotsOptimalization.length - 1; i >= 0; i--) {
			const player = playerSnapshotsOptimalization[i];
			if (
				!player.hasOwnProperty('x') &&
				!player.hasOwnProperty('y') &&
				!player.hasOwnProperty('a') &&
				!player.hasOwnProperty('m') &&
				!player.hasOwnProperty('w') &&
				!player.hasOwnProperty('size') &&
				!player.hasOwnProperty('h')
			) {
				playerSnapshotsOptimalization.splice(i, 1);
			}
		}

		//zone
		
		if (this.lastSnapshot) {
			if (this.lastSnapshot.z.iR === zoneSnapshot.iR) delete zoneSnapshotOptimalization.iR;
			if (this.lastSnapshot.z.iX === zoneSnapshot.iX) delete zoneSnapshotOptimalization.iX;
			if (this.lastSnapshot.z.iY === zoneSnapshot.iY) delete zoneSnapshotOptimalization.iY;
			if (this.lastSnapshot.z.oR === zoneSnapshot.oR) delete zoneSnapshotOptimalization.oR;
			if (this.lastSnapshot.z.oX === zoneSnapshot.oX) delete zoneSnapshotOptimalization.oX;
			if (this.lastSnapshot.z.oY === zoneSnapshot.oY) delete zoneSnapshotOptimalization.oY;
		}
		

		console.log('----------');
		console.log(JSON.stringify(zoneSnapshotOptimalization));

		//save this snapshot
		this.lastSnapshot = new Snapshot(
			dateNow,
			playerSnapshots,
			bulletSnapshots,
			granadeSnapshots,
			smokeCloudSnapshots,
			zoneSnapshot,
			lootSnapshots
		);

		//emit
		for (const player of this.players) {
			player.socket.emit(
				'u',
				new Snapshot(
					dateNow,
					playerSnapshotsOptimalization,
					bulletSnapshots,
					granadeSnapshots,
					smokeCloudSnapshots,
					zoneSnapshotOptimalization,
					lootSnapshots
				)
			);
		}

		//map objects
		for (const wall of this.map.rectangleObstacles) {
			if (wall.getChanged()) {
				wall.nullChanged();
				for (const player of this.players) {
					player.socket.emit('m', 'w', dateNow, wall.getChangedData());
				}
			}
		}
		for (const round of this.map.impassableRoundObstacles) {
			if (round.getChanged()) {
				round.nullChanged();
				for (const player of this.players) {
					player.socket.emit('m', 'r', dateNow, round.getChangedData());
				}
			}
		}
		for (const bush of this.map.bushes) {
			if (bush.getChanged()) {
				bush.nullChanged();
				for (const player of this.players) {
					player.socket.emit('m', 'b', dateNow, bush.getChangedData());
				}
			}
		}
	}
}
