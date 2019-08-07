import { Snapshot } from './Snapshot';
import ServerClientSync from './ServerClientSync';
import Player from './Player';
import PlayerSnapshot from './PlayerSnapshot';
import Zone from './Zone';
import ZoneSnapshot from './ZoneSnapshot';
import LootSnapshot from './LootSnapshot';
import { Weapon } from './Weapon';

export default class SnapshotManager {
	private serverClientSync: ServerClientSync;
	private snapshots: Snapshot[] = [];
	betweenSnapshot: Snapshot | null;
	players: Player[] = [];
	zone: Zone;
	private numberOfPlayers: number;

	newerExists: boolean = false;
	olderExists: boolean = false;
	sumaNewer: number = 0;

	constructor(serverClientSync: ServerClientSync) {
		this.serverClientSync = serverClientSync;
		this.zone = new Zone();
	}

	addSnapshot(snapshot: Snapshot): void {
		if (this.snapshots.length === 0) this.numberOfPlayers = snapshot.p.length;
		this.snapshots.push(snapshot);
		if (this.snapshots.length > 1) {
			this.completeSnapshot(this.snapshots[this.snapshots.length - 2], snapshot);
		}

		//update zone
		this.updateZone(snapshot);

		//delete old snapshots
		if (this.snapshots.length > 50) {
			this.snapshots.splice(0, 1);
		}
	}

	private updateZone(snapshot: Snapshot): void {
		const zoneSnapshot = snapshot.z;
		const updateTime = this.serverClientSync.getDrawDelay() - (this.serverClientSync.getServerTime() - snapshot.t);
		//inner
		if (zoneSnapshot.hasOwnProperty('iR')) {
			setTimeout(() => {
				this.zone.innerCircle.setRadius(zoneSnapshot.iR);
			}, updateTime);
		}
		if (zoneSnapshot.hasOwnProperty('iX')) {
			setTimeout(() => {
				this.zone.innerCircle.setCenterX(zoneSnapshot.iX);
			}, updateTime);
		}
		if (zoneSnapshot.hasOwnProperty('iY')) {
			setTimeout(() => {
				this.zone.innerCircle.setCenterY(zoneSnapshot.iY);
			}, updateTime);
		}
		//outer
		if (zoneSnapshot.hasOwnProperty('oR')) {
			setTimeout(() => {
				this.zone.outerCircle.setRadius(zoneSnapshot.oR);
			}, updateTime);
		}
		if (zoneSnapshot.hasOwnProperty('oX')) {
			setTimeout(() => {
				this.zone.outerCircle.setCenterX(zoneSnapshot.oX);
			}, updateTime);
		}
		if (zoneSnapshot.hasOwnProperty('oY')) {
			setTimeout(() => {
				this.zone.outerCircle.setCenterY(zoneSnapshot.oY);
			}, updateTime);
		}
	}

	private completeSnapshot(previousSnapshot: Snapshot, lastSnapshot: Snapshot): void {
		this.completePlayerSnapshots(previousSnapshot.p, lastSnapshot.p);
		this.completeLootSnapshots(previousSnapshot.l, lastSnapshot.l);
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

		////////////////////////////////
		/*
		const missingPlayers = [];
		for (let i = 0; i < this.numberOfPlayers; i++) {
			let playerExists = false;
			for (const player of lastSnapshotPlayers) {
				if (player.i === i) {
					playerExists = true;
					break;
				}
			}
			if (!playerExists) {
				missingPlayers.push(i);
			}
		}
		for (const missingPlayerIndex of missingPlayers) {
			lastSnapshotPlayers.push(previousSnapshotPlayers[missingPlayerIndex]);
		}
		//sort by id!
		lastSnapshotPlayers.sort((a: PlayerSnapshot, b: PlayerSnapshot) => {
			return a.i - b.i;
		});
		*/
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
					l: []
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
				/*
				this.betweenSnapshots.z.oR = this.positionBetweenSnapshots(
					olderSnapshot.z.oR,
					newerSnapshot.z.oR,
					percentShift
				);
				this.betweenSnapshots.z.oX = this.positionBetweenSnapshots(
					olderSnapshot.z.oX,
					newerSnapshot.z.oX,
					percentShift
				);
				this.betweenSnapshots.z.oY = this.positionBetweenSnapshots(
					olderSnapshot.z.oY,
					newerSnapshot.z.oY,
					percentShift
                );
                */
			}
		}
		this.updatePlayers();
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
