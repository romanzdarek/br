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
import MapData from './MapData';
import LootSnapshot from './LootSnapshot';
import Snapshot from './Snapshot';
import Loot from './Loot';
import MyPlayerSnapshot from './MyPlayerSnapshot';
import PlayerFactory from './PlayerFactory';
import BulletFactory from './BulletFactory';
import ObstacleSnapshot from './ObstacleSnapshot';
import WaterCircleSnapshot from './WaterCircleSnapshot';
import Sound, { SoundType } from './Sound';

export default class Game {
	private map: Map;
	private mapData: MapData;
	private zone: Zone;
	players: Player[] = [];
	private previousSnapshot: Snapshot;
	private bullets: Bullet[] = [];
	private sounds: Sound[] = [];
	private loot: Loot;
	private smokeClouds: SmokeCloud[] = [];
	private granades: ThrowingObject[] = [];
	private collisionPoints: CollisionPoints;
	private active: boolean = false;
	private endingTimer: number = -1;
	private playerFactory: PlayerFactory;
	private bulletFactory: BulletFactory;
	private previousMyPlayerSnapshots: MyPlayerSnapshot[];
	private killMessages: string[] = [];
	readonly createTime: number;
	readonly mapName: string;

	constructor(waterTerrainData: WaterTerrainData, collisionPoints: CollisionPoints, mapData: MapData, mapName: string) {
		this.collisionPoints = collisionPoints;
		this.mapData = mapData;
		this.map = new Map(waterTerrainData, mapData);
		this.zone = new Zone(this.map);
		this.loot = new Loot(this.map);
		this.playerFactory = new PlayerFactory();
		this.bulletFactory = new BulletFactory();
		this.createTime = Date.now();
		this.mapName = mapName;
	}

	isEnd(): boolean {
		return this.endingTimer === 0;
	}

	private gameOver(): boolean {
		let state = false;
		let activePlayers = 0;
		let lastActivePlayer: Player;
		for (const player of this.players) {
			if (player.isActive()) {
				activePlayers++;
				lastActivePlayer = player;
			}
		}
		//last player win
		if (this.players.length > 1 && activePlayers === 1 && this.endingTimer === -1) {
			lastActivePlayer.win();
			if (lastActivePlayer.socket) lastActivePlayer.socket.emit('winner', lastActivePlayer.getStats());
			state = true;
			//end spectacting
			for (const player of this.players) {
				if (player.socket && player.getSpectate()) {
					player.socket.emit('stopSpectate', lastActivePlayer.getStats(), lastActivePlayer.name);
				}
			}
		}
		//no one win
		if (activePlayers === 0) {
			state = true;
		}
		//ending
		if (state && this.endingTimer === -1) {
			this.endingTimer = 60 * 3;
		}
		if (this.endingTimer > 0) this.endingTimer--;
		return state;
	}

	private updateListOfPlayers(): void {
		const list = [];
		for (const player of this.players) {
			list.push(player.name);
		}
		for (const player of this.players) {
			if (player.socket) player.socket.emit('listOfPlayers', list);
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
			if (player.socket) {
				player.socket.emit('cancelLobby');
			}
		}
	}

	start(socket: SocketIO.Socket): void {
		if (this.players.length) {
			//only first player can start game
			if (this.players[0].socket === socket) {
				this.active = true;
				this.zone.start();
				this.loot.createMainLootItems(this.players.length);
				//start clients
				const startTime = Date.now();
				for (const player of this.players) {
					player.setStartTime(startTime);
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
		const newPlayer = this.playerFactory.create(
			name,
			socket,
			this.map,
			this.collisionPoints,
			this.players,
			this.bullets,
			this.granades,
			this.loot,
			this.bulletFactory,
			this.killMessages,
			this.sounds
		);
		this.players.push(newPlayer);
		//send it to the client
		this.updateListOfPlayers();
		//player ID for client
		newPlayer.socket.emit('playerId', newPlayer.id);
		return name;
	}

	private shuffleFragments(fragments: Bullet[]): Bullet[] {
		const shuffleFragments = [];
		while (fragments.length) {
			const randomIndex = Math.floor(Math.random() * fragments.length);
			shuffleFragments.push(fragments[randomIndex]);
			fragments.splice(randomIndex, 1);
		}
		return shuffleFragments;
	}

	loop(): void {
		//ending
		if (this.gameOver()) this.endingTimer--;

		//zone move
		this.zone.move();

		//move loot
		for (const loot of this.loot.lootItems) {
			loot.move(this.loot.lootItems, this.map);
		}

		//move granades
		for (let i = this.granades.length - 1; i >= 0; i--) {
			const granade = this.granades[i];
			if (!granade.explode()) {
				granade.move();
				granade.moveFromObstacle(this.map);
				granade.tick();
			} else {
				//explode
				//create fragments
				if (granade instanceof Granade) {
					const shiftAngle = 360 / granade.fragmentCount;
					const fragments = [];
					for (let i = 0; i < granade.fragmentCount; i++) {
						const angle = i * shiftAngle;
						fragments.push(this.bulletFactory.createFragment(granade, this.map, this.players, angle));
					}
					this.bullets.push(...this.shuffleFragments(fragments));

					//
					granade.createExplodeSound();
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

			for (const player of this.players) {
				smokeCloud.hitPlayer(player);
			}

			if (smokeCloud.isActive()) {
				smokeCloud.move();
			} else {
				this.smokeClouds.splice(i, 1);
			}
		}

		//move and delete bullets
		for (let i = this.bullets.length - 1; i >= 0; i--) {
			const bullet = this.bullets[i];
			if (bullet.flying()) {
				bullet.move();
				bullet.move();
				bullet.move();
			} else {
				this.bullets.splice(i, 1);
			}
		}

		//player move
		for (const player of this.players) {
			if (player.isActive()) {
				player.loop();
				//zone damage
				if (!this.zone.playertIn(player)) player.acceptHit(this.zone.getDamage());
			}
		}

		this.clientsUpdate();
	}

	private clientsUpdate(): void {
		const dateNow = Date.now();
		//loots
		const lootSnapshots: LootSnapshot[] = [];
		for (const loot of this.loot.lootItems) {
			lootSnapshots.push(new LootSnapshot(loot));
		}
		//loot snapshots copy for optimalization
		const lootSnapshotsOptimalization: LootSnapshot[] = [];
		for (const loot of this.loot.lootItems) {
			lootSnapshotsOptimalization.push(new LootSnapshot(loot));
		}

		//granades & smokes
		const granadeSnapshots: ThrowingObjectSnapshot[] = [];
		for (const granade of this.granades) {
			granadeSnapshots.push(new ThrowingObjectSnapshot(granade));
		}

		//bullets
		const bulletSnapshots: BulletSnapshot[] = [];
		for (const bullet of this.bullets) {
			bulletSnapshots.push(new BulletSnapshot(bullet));
		}

		//smoke clouds
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
		for (const player of playerSnapshots) {
			playerSnapshotsOptimalization.push({ ...player });
		}

		//Sounds
		const sounds: Sound[] = [...this.sounds];
		this.sounds.splice(0, this.sounds.length);

		//find same values and delete them
		//players
		for (const playerNow of playerSnapshotsOptimalization) {
			if (this.previousSnapshot) {
				for (const playerBefore of this.previousSnapshot.p) {
					if (playerNow.i === playerBefore.i) {
						//for deny create beetween snapshot for hands
						if (
							(playerNow.w === Weapon.Hand || playerNow.w === Weapon.Smoke || playerNow.w === Weapon.Granade || playerNow.w === Weapon.Medkit) &&
							playerBefore.w !== Weapon.Hand &&
							playerBefore.w !== Weapon.Smoke &&
							playerBefore.w !== Weapon.Granade &&
							playerBefore.w !== Weapon.Medkit
						) {
							playerNow.h = 1;
						}

						//player
						if (playerNow.x === playerBefore.x) delete playerNow.x;
						if (playerNow.y === playerBefore.y) delete playerNow.y;
						if (playerNow.a === playerBefore.a) delete playerNow.a;
						if (playerNow.m === playerBefore.m) delete playerNow.m;
						if (playerNow.w === playerBefore.w) delete playerNow.w;
						if (playerNow.size === playerBefore.size) delete playerNow.size;
						if (playerNow.l === playerBefore.l) delete playerNow.l;
						if (playerNow.v === playerBefore.v) delete playerNow.v;
						//hands
						if (playerNow.hSize === playerBefore.hSize) delete playerNow.hSize;
						if (playerNow.lX === playerBefore.lX) delete playerNow.lX;
						if (playerNow.lY === playerBefore.lY) delete playerNow.lY;
						if (playerNow.rX === playerBefore.rX) delete playerNow.rX;
						if (playerNow.rY === playerBefore.rY) delete playerNow.rY;
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
				!player.hasOwnProperty('hSize') &&
				!player.hasOwnProperty('lX') &&
				!player.hasOwnProperty('lY') &&
				!player.hasOwnProperty('rX') &&
				!player.hasOwnProperty('rY') &&
				!player.hasOwnProperty('l') &&
				!player.hasOwnProperty('d') &&
				!player.hasOwnProperty('v')
			) {
				playerSnapshotsOptimalization.splice(i, 1);
			}
		}

		//loot optimalization
		{
			//find same values and delete them
			for (const lootNow of lootSnapshotsOptimalization) {
				if (this.previousSnapshot) {
					for (const lootPrevious of this.previousSnapshot.l) {
						if (lootNow.i === lootPrevious.i) {
							if (lootNow.x === lootPrevious.x) delete lootNow.x;
							if (lootNow.y === lootPrevious.y) delete lootNow.y;
							if (lootNow.type === lootPrevious.type) delete lootNow.type;
							if (lootNow.size === lootPrevious.size) delete lootNow.size;
							if (lootNow.quantity === lootPrevious.quantity) delete lootNow.quantity;
						}
					}
				}
			}
			//delete empty loot snapshots
			for (let i = lootSnapshotsOptimalization.length - 1; i >= 0; i--) {
				const loot = lootSnapshotsOptimalization[i];
				if (
					!loot.hasOwnProperty('x') &&
					!loot.hasOwnProperty('y') &&
					!loot.hasOwnProperty('size') &&
					!loot.hasOwnProperty('type') &&
					!loot.hasOwnProperty('quantity') &&
					!loot.hasOwnProperty('del')
				) {
					lootSnapshotsOptimalization.splice(i, 1);
				}
			}
		}

		//zone
		if (this.previousSnapshot) {
			if (this.previousSnapshot.z.iR === zoneSnapshot.iR) delete zoneSnapshotOptimalization.iR;
			if (this.previousSnapshot.z.iX === zoneSnapshot.iX) delete zoneSnapshotOptimalization.iX;
			if (this.previousSnapshot.z.iY === zoneSnapshot.iY) delete zoneSnapshotOptimalization.iY;
			if (this.previousSnapshot.z.oR === zoneSnapshot.oR) delete zoneSnapshotOptimalization.oR;
			if (this.previousSnapshot.z.oX === zoneSnapshot.oX) delete zoneSnapshotOptimalization.oX;
			if (this.previousSnapshot.z.oY === zoneSnapshot.oY) delete zoneSnapshotOptimalization.oY;
			if (this.previousSnapshot.z.d === zoneSnapshot.d) delete zoneSnapshotOptimalization.d;
		}

		//change obstacles
		const obstacleSnapshots = [];
		//map objects
		for (const obstacle of this.map.rectangleObstacles) {
			if (obstacle.getChanged()) {
				obstacle.nullChanged();
				obstacleSnapshots.push(new ObstacleSnapshot(obstacle));
			}
		}
		for (const obstacle of this.map.impassableRoundObstacles) {
			if (obstacle.getChanged()) {
				obstacle.nullChanged();
				obstacleSnapshots.push(new ObstacleSnapshot(obstacle));
			}
		}
		for (const obstacle of this.map.bushes) {
			if (obstacle.getChanged()) {
				obstacle.nullChanged();
				obstacleSnapshots.push(new ObstacleSnapshot(obstacle));
			}
		}

		//water circles
		const waterCircles: WaterCircleSnapshot[] = [];
		for (const player of this.players) {
			if (player.isActive() && player.getWaterCircleTimer() >= player.waterCircleTimerMax) {
				player.nullWaterCircleTimer();
				waterCircles.push(new WaterCircleSnapshot(player.getCenterX(), player.getCenterY()));
				this.sounds.push(new Sound(SoundType.Water, player.getCenterX(), player.getCenterY()));
			}
		}

		//save this snapshot
		this.previousSnapshot = new Snapshot(
			dateNow,
			playerSnapshots,
			bulletSnapshots,
			granadeSnapshots,
			smokeCloudSnapshots,
			zoneSnapshot,
			lootSnapshots,
			obstacleSnapshots,
			[...this.killMessages],
			waterCircles,
			sounds
		);

		//emit changes
		for (const player of this.players) {
			//spectate
			const myPlayerId = player.id;
			let myOrspectatePlayer = player;
			let spectateId = -1;
			let spectateName = '';
			if (player.getSpectate()) {
				spectateId = player.spectatePlayer().id;
				myOrspectatePlayer = player.spectatePlayer();
				spectateName = player.spectatePlayer().name;
			}
			const lastMyPlayerSnapshot = new MyPlayerSnapshot(myOrspectatePlayer);
			lastMyPlayerSnapshot.spectate = spectateId;
			lastMyPlayerSnapshot.spectateName = spectateName;
			lastMyPlayerSnapshot.id = myPlayerId;

			//delete same values
			if (this.previousMyPlayerSnapshots) {
				for (const previousMyPlayerSnapshot of this.previousMyPlayerSnapshots) {
					if (previousMyPlayerSnapshot.id === lastMyPlayerSnapshot.id) {
						if (previousMyPlayerSnapshot.h === lastMyPlayerSnapshot.h) delete lastMyPlayerSnapshot.h;
						if (previousMyPlayerSnapshot.i1 === lastMyPlayerSnapshot.i1) delete lastMyPlayerSnapshot.i1;
						if (previousMyPlayerSnapshot.i2 === lastMyPlayerSnapshot.i2) delete lastMyPlayerSnapshot.i2;
						if (previousMyPlayerSnapshot.i3 === lastMyPlayerSnapshot.i3) delete lastMyPlayerSnapshot.i3;
						if (previousMyPlayerSnapshot.i4 === lastMyPlayerSnapshot.i4) delete lastMyPlayerSnapshot.i4;
						if (previousMyPlayerSnapshot.i5 === lastMyPlayerSnapshot.i5) delete lastMyPlayerSnapshot.i5;
						if (previousMyPlayerSnapshot.s4 === lastMyPlayerSnapshot.s4) delete lastMyPlayerSnapshot.s4;
						if (previousMyPlayerSnapshot.s5 === lastMyPlayerSnapshot.s5) delete lastMyPlayerSnapshot.s5;

						if (previousMyPlayerSnapshot.r === lastMyPlayerSnapshot.r) delete lastMyPlayerSnapshot.r;
						if (previousMyPlayerSnapshot.g === lastMyPlayerSnapshot.g) delete lastMyPlayerSnapshot.g;
						if (previousMyPlayerSnapshot.b === lastMyPlayerSnapshot.b) delete lastMyPlayerSnapshot.b;
						if (previousMyPlayerSnapshot.o === lastMyPlayerSnapshot.o) delete lastMyPlayerSnapshot.o;

						if (previousMyPlayerSnapshot.a === lastMyPlayerSnapshot.a) delete lastMyPlayerSnapshot.a;
						if (previousMyPlayerSnapshot.aM === lastMyPlayerSnapshot.aM) delete lastMyPlayerSnapshot.aM;

						if (previousMyPlayerSnapshot.s === lastMyPlayerSnapshot.s) delete lastMyPlayerSnapshot.s;
						if (previousMyPlayerSnapshot.v === lastMyPlayerSnapshot.v) delete lastMyPlayerSnapshot.v;

						if (previousMyPlayerSnapshot.l === lastMyPlayerSnapshot.l) delete lastMyPlayerSnapshot.l;
						if (previousMyPlayerSnapshot.lE === lastMyPlayerSnapshot.lE) delete lastMyPlayerSnapshot.lE;
						if (previousMyPlayerSnapshot.lT === lastMyPlayerSnapshot.lT) delete lastMyPlayerSnapshot.lT;

						if (previousMyPlayerSnapshot.ai === lastMyPlayerSnapshot.ai) delete lastMyPlayerSnapshot.ai;

						if (previousMyPlayerSnapshot.spectateName === lastMyPlayerSnapshot.spectateName) delete lastMyPlayerSnapshot.spectateName;
						if (previousMyPlayerSnapshot.spectate === lastMyPlayerSnapshot.spectate) delete lastMyPlayerSnapshot.spectate;
					}
				}
			}
			delete lastMyPlayerSnapshot.id;

			const snapshot = new Snapshot(
				dateNow,
				playerSnapshotsOptimalization,
				bulletSnapshots,
				granadeSnapshots,
				smokeCloudSnapshots,
				zoneSnapshotOptimalization,
				lootSnapshotsOptimalization,
				obstacleSnapshots,
				[...this.killMessages],
				waterCircles,
				sounds,
				lastMyPlayerSnapshot
			);
			if (player.socket) player.socket.emit('u', snapshot);
		}

		//clear messages
		this.killMessages.splice(0, this.killMessages.length);

		//save 'previous' myPlayerSnapshot
		this.previousMyPlayerSnapshots = [];
		for (const player of this.players) {
			const myPlayerId = player.id;
			let myOrspectatePlayer = player;
			let spectateId = -1;
			let spectateName = '';
			if (player.getSpectate()) {
				spectateId = player.spectatePlayer().id;
				myOrspectatePlayer = player.spectatePlayer();
				spectateName = player.spectatePlayer().name;
			}
			const myPlayerOrspectateSnapshot = new MyPlayerSnapshot(myOrspectatePlayer);
			myPlayerOrspectateSnapshot.spectate = spectateId;
			myPlayerOrspectateSnapshot.id = myPlayerId;
			myPlayerOrspectateSnapshot.spectateName = spectateName;
			this.previousMyPlayerSnapshots.push(myPlayerOrspectateSnapshot);
		}

		//delete !active loot
		for (let i = lootSnapshots.length - 1; i >= 0; i--) {
			const loot = lootSnapshots[i];
			if (loot.hasOwnProperty('del')) {
				//from last snapshot
				lootSnapshots.splice(i, 1);
				//from this.loots
				this.loot.lootItems.splice(i, 1);
			}
		}
	}
}
