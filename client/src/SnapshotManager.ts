import { Snapshot } from './Snapshot';
import ServerClientSync from './ServerClientSync';
import Player from './Player';
import PlayerSnapshot from './PlayerSnapshot';
import Zone from './Zone';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './LootSnapshot';
import { Weapon } from './Weapon';
import ObstacleSnapshot from './ObstacleSnapshot';
import Map from './Map';
import MyPlayerSnapshot from './MyPlayerSnapshot';
import Message from './Message';

export default class SnapshotManager {
	private serverClientSync: ServerClientSync;
	private snapshots: Snapshot[] = [];
	private map: Map;
	messages: Message[] = [];
	betweenSnapshot: Snapshot | null;
	players: Player[] = [];
	zone: Zone;
	private numberOfPlayers: number;

	newerExists: boolean = false;
	olderExists: boolean = false;
	sumaNewer: number = 0;

	constructor(serverClientSync: ServerClientSync, map: Map) {
		this.serverClientSync = serverClientSync;
		this.zone = new Zone();
		this.map = map;
	}

	reset(): void {
		this.snapshots.splice(0, this.snapshots.length);
		this.betweenSnapshot = null;
		this.players.splice(0, this.players.length);
	}

	messageManager(): void {
		//delete old messages
		const viewTime = 1000 * 5;
		for (let i = this.messages.length - 1; i >= 0; i--) {
			const message = this.messages[i];
			if (message.time + viewTime < Date.now()) this.messages.splice(i, 1);
		}
		//max 5 messages
		if (this.messages.length > 5) {
			const cut = this.messages.length - 5;
			this.messages.splice(0, cut);
		}
	}

	addSnapshot(snapshot: Snapshot): void {
		if (this.snapshots.length === 0) this.numberOfPlayers = snapshot.p.length;
		this.snapshots.push(snapshot);
		if (this.snapshots.length > 1) {
			this.completeSnapshot(this.snapshots[this.snapshots.length - 2], snapshot);
		}

		//add message
		if (snapshot.m) {
			for (const message of snapshot.m) {
				const updateDelay =
					this.serverClientSync.getDrawDelay() - (this.serverClientSync.getServerTime() - snapshot.t);
				setTimeout(() => {
					this.messages.push(new Message(Date.now(), message));
				}, updateDelay);
			}
		}

		//update map
		this.updateMap(snapshot);

		//delete old snapshots
		if (this.snapshots.length > 50) {
			this.snapshots.splice(0, 1);
		}
	}

	private updateMap(snapshot: Snapshot): void {
		const obsacleSnapshots = snapshot.o;
		const updateDelay = this.serverClientSync.getDrawDelay() - (this.serverClientSync.getServerTime() - snapshot.t);
		for (const obstacleSnapshot of obsacleSnapshots) {
			switch (obstacleSnapshot.t) {
				case 'w':
					for (const obstacle of this.map.rectangleObstacles) {
						if (obstacle.id === obstacleSnapshot.i) {
							setTimeout(() => {
								obstacle.update(obstacleSnapshot.o);
							}, updateDelay);
							break;
						}
					}
					break;
				case 'r':
					for (const obstacle of this.map.rocks) {
						if (obstacle.id === obstacleSnapshot.i) {
							setTimeout(() => {
								obstacle.update(obstacleSnapshot.o);
							}, updateDelay);
							break;
						}
					}
					break;
				case 't':
					for (const obstacle of this.map.trees) {
						if (obstacle.id === obstacleSnapshot.i) {
							setTimeout(() => {
								obstacle.update(obstacleSnapshot.o);
							}, updateDelay);
							break;
						}
					}
					break;
				case 'b':
					for (const obstacle of this.map.bushes) {
						if (obstacle.id === obstacleSnapshot.i) {
							setTimeout(() => {
								obstacle.update(obstacleSnapshot.o);
							}, updateDelay);
							break;
						}
					}
					break;
			}
		}
	}

	private updateZone(): void {
		if (!this.betweenSnapshot) return;
		const zoneSnapshot = this.betweenSnapshot.z;
		//inner
		this.zone.innerCircle.setRadius(zoneSnapshot.iR);
		this.zone.innerCircle.setCenterX(zoneSnapshot.iX);
		this.zone.innerCircle.setCenterY(zoneSnapshot.iY);
		//outer
		this.zone.outerCircle.setRadius(zoneSnapshot.oR);
		this.zone.outerCircle.setCenterX(zoneSnapshot.oX);
		this.zone.outerCircle.setCenterY(zoneSnapshot.oY);
	}

	private completeSnapshot(previousSnapshot: Snapshot, lastSnapshot: Snapshot): void {
		this.completePlayerSnapshots(previousSnapshot.p, lastSnapshot.p);
		this.completeMyPlayerSnapshot(previousSnapshot.i, lastSnapshot.i);
		this.completeLootSnapshots(previousSnapshot.l, lastSnapshot.l);
		this.completeZoneSnapshot(previousSnapshot.z, lastSnapshot.z);
		//zone delay
		if (!lastSnapshot.z.hasOwnProperty('d')) lastSnapshot.z.d = previousSnapshot.z.d;
	}

	private completeMyPlayerSnapshot(
		previousMyPlayerSnapshot: MyPlayerSnapshot,
		lastMyPlayerSnapshot: MyPlayerSnapshot
	): void {
		if (!lastMyPlayerSnapshot.hasOwnProperty('h')) lastMyPlayerSnapshot.h = previousMyPlayerSnapshot.h;

		if (!lastMyPlayerSnapshot.hasOwnProperty('i1')) lastMyPlayerSnapshot.i1 = previousMyPlayerSnapshot.i1;
		if (!lastMyPlayerSnapshot.hasOwnProperty('i2')) lastMyPlayerSnapshot.i2 = previousMyPlayerSnapshot.i2;
		if (!lastMyPlayerSnapshot.hasOwnProperty('i3')) lastMyPlayerSnapshot.i3 = previousMyPlayerSnapshot.i3;
		if (!lastMyPlayerSnapshot.hasOwnProperty('i4')) lastMyPlayerSnapshot.i4 = previousMyPlayerSnapshot.i4;
		if (!lastMyPlayerSnapshot.hasOwnProperty('i5')) lastMyPlayerSnapshot.i5 = previousMyPlayerSnapshot.i5;
		if (!lastMyPlayerSnapshot.hasOwnProperty('s4')) lastMyPlayerSnapshot.s4 = previousMyPlayerSnapshot.s4;
		if (!lastMyPlayerSnapshot.hasOwnProperty('s5')) lastMyPlayerSnapshot.s5 = previousMyPlayerSnapshot.s5;

		if (!lastMyPlayerSnapshot.hasOwnProperty('a')) lastMyPlayerSnapshot.a = previousMyPlayerSnapshot.a;
		if (!lastMyPlayerSnapshot.hasOwnProperty('aM')) lastMyPlayerSnapshot.aM = previousMyPlayerSnapshot.aM;

		if (!lastMyPlayerSnapshot.hasOwnProperty('r')) lastMyPlayerSnapshot.r = previousMyPlayerSnapshot.r;
		if (!lastMyPlayerSnapshot.hasOwnProperty('g')) lastMyPlayerSnapshot.g = previousMyPlayerSnapshot.g;
		if (!lastMyPlayerSnapshot.hasOwnProperty('b')) lastMyPlayerSnapshot.b = previousMyPlayerSnapshot.b;
		if (!lastMyPlayerSnapshot.hasOwnProperty('o')) lastMyPlayerSnapshot.o = previousMyPlayerSnapshot.o;

		if (!lastMyPlayerSnapshot.hasOwnProperty('s')) lastMyPlayerSnapshot.s = previousMyPlayerSnapshot.s;
		if (!lastMyPlayerSnapshot.hasOwnProperty('v')) lastMyPlayerSnapshot.v = previousMyPlayerSnapshot.v;

		if (!lastMyPlayerSnapshot.hasOwnProperty('l')) lastMyPlayerSnapshot.l = previousMyPlayerSnapshot.l;
		if (!lastMyPlayerSnapshot.hasOwnProperty('lE')) lastMyPlayerSnapshot.lE = previousMyPlayerSnapshot.lE;
		if (!lastMyPlayerSnapshot.hasOwnProperty('lT')) lastMyPlayerSnapshot.lT = previousMyPlayerSnapshot.lT;
		if (!lastMyPlayerSnapshot.hasOwnProperty('spectate'))
			lastMyPlayerSnapshot.spectate = previousMyPlayerSnapshot.spectate;
		if (!lastMyPlayerSnapshot.hasOwnProperty('spectateName'))
			lastMyPlayerSnapshot.spectateName = previousMyPlayerSnapshot.spectateName;
		if (!lastMyPlayerSnapshot.hasOwnProperty('ai')) lastMyPlayerSnapshot.ai = previousMyPlayerSnapshot.ai;
	}

	private completeZoneSnapshot(previousZoneSnapshot: ZoneSnapshot, lastZoneSnapshot: ZoneSnapshot): void {
		if (!lastZoneSnapshot.hasOwnProperty('iX')) lastZoneSnapshot.iX = previousZoneSnapshot.iX;
		if (!lastZoneSnapshot.hasOwnProperty('iY')) lastZoneSnapshot.iY = previousZoneSnapshot.iY;
		if (!lastZoneSnapshot.hasOwnProperty('iR')) lastZoneSnapshot.iR = previousZoneSnapshot.iR;
		if (!lastZoneSnapshot.hasOwnProperty('oX')) lastZoneSnapshot.oX = previousZoneSnapshot.oX;
		if (!lastZoneSnapshot.hasOwnProperty('oY')) lastZoneSnapshot.oY = previousZoneSnapshot.oY;
		if (!lastZoneSnapshot.hasOwnProperty('oR')) lastZoneSnapshot.oR = previousZoneSnapshot.oR;
	}

	private completeLootSnapshots(previousSnapshotLoots: LootSnapshot[], lastSnapshotLoots: LootSnapshot[]): void {
		//copy missing values
		for (const lastSnapshotLoot of lastSnapshotLoots) {
			let previousSnapshotLoot;
			for (const loot of previousSnapshotLoots) {
				if (loot.i === lastSnapshotLoot.i) previousSnapshotLoot = loot;
			}
			if (previousSnapshotLoot) {
				if (!lastSnapshotLoot.hasOwnProperty('size')) lastSnapshotLoot.size = previousSnapshotLoot.size;
				if (!lastSnapshotLoot.hasOwnProperty('type')) lastSnapshotLoot.type = previousSnapshotLoot.type;
				if (!lastSnapshotLoot.hasOwnProperty('x')) lastSnapshotLoot.x = previousSnapshotLoot.x;
				if (!lastSnapshotLoot.hasOwnProperty('y')) lastSnapshotLoot.y = previousSnapshotLoot.y;
				if (!lastSnapshotLoot.hasOwnProperty('quantity') && previousSnapshotLoot.hasOwnProperty('quantity'))
					lastSnapshotLoot.quantity = previousSnapshotLoot.quantity;
			}
		}
		//find missing objects and copy previous values
		const missingLoots = [];
		for (const previous of previousSnapshotLoots) {
			let lootExists = false;
			for (const last of lastSnapshotLoots) {
				if (previous.i === last.i) {
					lootExists = true;
					break;
				}
			}
			if (!lootExists) {
				missingLoots.push(previous);
			}
		}
		for (const missingLoot of missingLoots) {
			lastSnapshotLoots.push(missingLoot);
		}

		//delete !active loot
		for (let i = lastSnapshotLoots.length - 1; i >= 0; i--) {
			if (lastSnapshotLoots[i].hasOwnProperty('del')) {
				lastSnapshotLoots.splice(i, 1);
			}
		}
	}

	private completePlayerSnapshots(
		previousSnapshotPlayers: PlayerSnapshot[],
		lastSnapshotPlayers: PlayerSnapshot[]
	): void {
		//copy missing values
		for (const lastSnapshotPlayer of lastSnapshotPlayers) {
			let previousSnapshotPlayer;
			for (const player of previousSnapshotPlayers) {
				if (player.i === lastSnapshotPlayer.i) previousSnapshotPlayer = player;
			}
			if (previousSnapshotPlayer) {
				if (!lastSnapshotPlayer.hasOwnProperty('a')) lastSnapshotPlayer.a = previousSnapshotPlayer.a;
				if (!lastSnapshotPlayer.hasOwnProperty('m')) lastSnapshotPlayer.m = previousSnapshotPlayer.m;
				if (!lastSnapshotPlayer.hasOwnProperty('size')) lastSnapshotPlayer.size = previousSnapshotPlayer.size;
				if (!lastSnapshotPlayer.hasOwnProperty('w')) lastSnapshotPlayer.w = previousSnapshotPlayer.w;
				if (!lastSnapshotPlayer.hasOwnProperty('x')) lastSnapshotPlayer.x = previousSnapshotPlayer.x;
				if (!lastSnapshotPlayer.hasOwnProperty('y')) lastSnapshotPlayer.y = previousSnapshotPlayer.y;
				if (!lastSnapshotPlayer.hasOwnProperty('l')) lastSnapshotPlayer.l = previousSnapshotPlayer.l;
				//hands
				if (!lastSnapshotPlayer.hasOwnProperty('hSize'))
					lastSnapshotPlayer.hSize = previousSnapshotPlayer.hSize;
				if (!lastSnapshotPlayer.hasOwnProperty('lX')) lastSnapshotPlayer.lX = previousSnapshotPlayer.lX;
				if (!lastSnapshotPlayer.hasOwnProperty('lY')) lastSnapshotPlayer.lY = previousSnapshotPlayer.lY;
				if (!lastSnapshotPlayer.hasOwnProperty('rX')) lastSnapshotPlayer.rX = previousSnapshotPlayer.rX;
				if (!lastSnapshotPlayer.hasOwnProperty('rY')) lastSnapshotPlayer.rY = previousSnapshotPlayer.rY;
			}
		}

		//find missing players and copy previous values
		const missingPlayerIds = [];
		for (const previousSnapshotPlayer of previousSnapshotPlayers) {
			let playerExists = false;
			for (const lastSnapshotPlayer of lastSnapshotPlayers) {
				if (previousSnapshotPlayer.i === lastSnapshotPlayer.i) {
					playerExists = true;
					break;
				}
			}
			if (!playerExists) {
				missingPlayerIds.push(previousSnapshotPlayer.i);
			}
		}
		//copy previous snapshot
		for (const missingPlayerId of missingPlayerIds) {
			for (const previousSnapshotPlayer of previousSnapshotPlayers) {
				if (missingPlayerId === previousSnapshotPlayer.i) {
					lastSnapshotPlayers.push(previousSnapshotPlayer);
					break;
				}
			}
		}
		//sort by id!
		lastSnapshotPlayers.sort((a: PlayerSnapshot, b: PlayerSnapshot) => {
			return a.i - b.i;
		});
	}

	//1. urcime si cas pred nejakou dobou a budeme hledat snimky hry pred timto a za timto bodem (ServerClientSync class)
	//2. nemuzeme se spolehnout jen na cas klienta a musime nejperve synchronizovat (ServerClientSync class)
	//3. dopocitame stav mezi snimky
	createBetweenSnapshot(): void {
		if (this.snapshots.length && this.serverClientSync.ready()) {
			let percentShift = 0;
			this.sumaNewer = 0;
			this.newerExists = false;
			this.olderExists = false;
			let newerSnapshot: Snapshot;
			let olderSnapshot: Snapshot;

			const wantedSnapshotTime = this.serverClientSync.getServerTime() - this.serverClientSync.getDrawDelay();
			//find last older (or same <=) snapshot
			for (const snapshot of this.snapshots) {
				if (snapshot.t <= wantedSnapshotTime) {
					olderSnapshot = snapshot;
					this.olderExists = true;
				}
			}
			//find first newer (or same >=) snapshot
			for (const snapshot of this.snapshots) {
				if (snapshot.t >= wantedSnapshotTime) {
					if (!newerSnapshot) {
						newerSnapshot = snapshot;
						this.newerExists = true;
					}
					this.sumaNewer++;
				}
			}
			//if newerSnapshot is missing use older...
			if (!newerSnapshot) {
				newerSnapshot = olderSnapshot;
				this.serverClientSync.reset();
			}

			//change draw delay
			if (this.sumaNewer > 3) this.serverClientSync.changeDrawDelay(-0.1);
			if (this.sumaNewer < 3) this.serverClientSync.changeDrawDelay(0.1);

			//calc positions
			if (olderSnapshot && newerSnapshot) {
				const timeDistance = newerSnapshot.t - olderSnapshot.t;

				const distanceOlderFromWantedTime = wantedSnapshotTime - olderSnapshot.t;
				if (timeDistance) {
					percentShift = distanceOlderFromWantedTime / timeDistance;
				}

				//deep copy!
				const copyFrom = newerSnapshot;
				//slow copy
				//this.betweenSnapshots = JSON.parse(JSON.stringify(copyFrom));

				//fast copy
				this.betweenSnapshot = {
					t: copyFrom.t,
					i: { ...copyFrom.i },
					p: [],
					b: [],
					g: [],
					s: [],
					z: { ...copyFrom.z },
					l: [],
					o: []
				};

				for (const player of copyFrom.p) {
					this.betweenSnapshot.p.push({ ...player });
				}
				for (const bullet of copyFrom.b) {
					this.betweenSnapshot.b.push({ ...bullet });
				}
				for (const granade of copyFrom.g) {
					this.betweenSnapshot.g.push({ ...granade });
				}
				for (const smoke of copyFrom.s) {
					this.betweenSnapshot.s.push({ ...smoke });
				}
				for (const loot of copyFrom.l) {
					this.betweenSnapshot.l.push({ ...loot });
				}

				//players
				for (let i = 0; i < this.betweenSnapshot.p.length; i++) {
					const player = this.betweenSnapshot.p[i];
					player.x = this.positionBetweenSnapshots(olderSnapshot.p[i].x, newerSnapshot.p[i].x, percentShift);
					player.y = this.positionBetweenSnapshots(olderSnapshot.p[i].y, newerSnapshot.p[i].y, percentShift);
					//hands
					//deny between snapshot...
					if (!player.h) {
						player.lX = this.positionBetweenSnapshots(
							olderSnapshot.p[i].lX,
							newerSnapshot.p[i].lX,
							percentShift
						);
						player.lY = this.positionBetweenSnapshots(
							olderSnapshot.p[i].lY,
							newerSnapshot.p[i].lY,
							percentShift
						);
						player.rX = this.positionBetweenSnapshots(
							olderSnapshot.p[i].rX,
							newerSnapshot.p[i].rX,
							percentShift
						);
						player.rY = this.positionBetweenSnapshots(
							olderSnapshot.p[i].rY,
							newerSnapshot.p[i].rY,
							percentShift
						);
					}
				}

				//loot
				for (const loot of this.betweenSnapshot.l) {
					let olderLoot, newerLoot;
					for (const older of olderSnapshot.l) {
						if (loot.i === older.i) {
							olderLoot = older;
							break;
						}
					}
					for (const newer of newerSnapshot.l) {
						if (loot.i === newer.i) {
							newerLoot = newer;
							break;
						}
					}
					if (olderLoot && newerLoot) {
						loot.x = this.positionBetweenSnapshots(olderLoot.x, newerLoot.x, percentShift);
						loot.y = this.positionBetweenSnapshots(olderLoot.y, newerLoot.y, percentShift);
					}
				}

				//zone
				this.betweenSnapshot.z.oR = this.positionBetweenSnapshots(
					olderSnapshot.z.oR,
					newerSnapshot.z.oR,
					percentShift
				);
				this.betweenSnapshot.z.oX = this.positionBetweenSnapshots(
					olderSnapshot.z.oX,
					newerSnapshot.z.oX,
					percentShift
				);
				this.betweenSnapshot.z.oY = this.positionBetweenSnapshots(
					olderSnapshot.z.oY,
					newerSnapshot.z.oY,
					percentShift
				);
			}
		}
		this.updatePlayers();
		this.updateZone();
	}

	private updatePlayers(): void {
		if (!this.betweenSnapshot) return;
		for (const playerSnapshot of this.betweenSnapshot.p) {
			let playerExists = false;
			for (const playerInstance of this.players) {
				if (playerInstance.id === playerSnapshot.i) {
					//update player
					playerInstance.setX(playerSnapshot.x);
					playerInstance.setY(playerSnapshot.y);
					playerInstance.setAngle(playerSnapshot.a);
					playerInstance.setWeapon(playerSnapshot.w);
					playerInstance.setHammerAngle(playerSnapshot.m);
					if (playerSnapshot.l === 0) playerInstance.die();
					//hands
					playerInstance.hands[0].setX(playerSnapshot.lX);
					playerInstance.hands[0].setY(playerSnapshot.lY);
					playerInstance.hands[1].setX(playerSnapshot.rX);
					playerInstance.hands[1].setY(playerSnapshot.rY);
					playerExists = true;
					break;
				}
			}
			if (!playerExists) {
				//create player
				this.players.push(new Player(playerSnapshot));
			}
		}
	}

	private positionBetweenSnapshots(olderPosition: number, newerPosition: number, percentShift: number): number {
		const diference = Math.abs(newerPosition - olderPosition);
		let direction = 1;
		if (newerPosition < olderPosition) direction = -1;
		return olderPosition + diference * direction * percentShift;
	}
}
