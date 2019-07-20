import { Snapshot } from './Snapshot';
import ServerClientSync from './ServerClientSync';
import Player from './Player';
import PlayerSnapshot from './PlayerSnapshot';

export default class SnapshotManager {
	private serverClientSync: ServerClientSync;
	private snapshots: Snapshot[] = [];
	betweenSnapshots: Snapshot | null;
	players: Player[] = [];
	private numberOfPlayers: number;

	newerExists: boolean = false;
	olderExists: boolean = false;
	sumaNewer: number = 0;

	constructor(serverClientSync: ServerClientSync) {
		this.serverClientSync = serverClientSync;
	}

	addSnapshot(snapshot: Snapshot): void {
		if (this.snapshots.length === 0) this.numberOfPlayers = snapshot.p.length;
		console.log(JSON.stringify(snapshot.p));
		console.log('----------');
		this.snapshots.push(snapshot);
		if (this.snapshots.length > 1) {
			this.completeSnapshot(this.snapshots[this.snapshots.length - 2], snapshot);
		}

		//delete old snapshots
		if (this.snapshots.length > 50) {
			this.snapshots.splice(0, 1);
		}
	}

	private completeSnapshot(previousSnapshot: Snapshot, lastSnapshot: Snapshot): void {
		//copy missing values
		for (const lastSnapshotPlayer of lastSnapshot.p) {
			//const previousSnapshotPlayer = previousSnapshot.p[lastSnapshotPlayer.i];
			let previousSnapshotPlayer;
			for (const player of previousSnapshot.p) {
				if (player.i === lastSnapshotPlayer.i) previousSnapshotPlayer = player;
			}

			if (!lastSnapshotPlayer.hasOwnProperty('a')) lastSnapshotPlayer.a = previousSnapshotPlayer.a;
			if (!lastSnapshotPlayer.hasOwnProperty('h')) {
				lastSnapshotPlayer.h = [ { ...previousSnapshotPlayer.h[0] }, { ...previousSnapshotPlayer.h[1] } ];
			}
			else {
				lastSnapshotPlayer.h[0].size = previousSnapshotPlayer.h[0].size;
				lastSnapshotPlayer.h[1].size = previousSnapshotPlayer.h[1].size;
			}
			if (!lastSnapshotPlayer.hasOwnProperty('m')) lastSnapshotPlayer.m = previousSnapshotPlayer.m;
			if (!lastSnapshotPlayer.hasOwnProperty('size')) lastSnapshotPlayer.size = previousSnapshotPlayer.size;
			if (!lastSnapshotPlayer.hasOwnProperty('w')) lastSnapshotPlayer.w = previousSnapshotPlayer.w;
			if (!lastSnapshotPlayer.hasOwnProperty('x')) lastSnapshotPlayer.x = previousSnapshotPlayer.x;
			if (!lastSnapshotPlayer.hasOwnProperty('y')) lastSnapshotPlayer.y = previousSnapshotPlayer.y;
		}

		//find missing players and copy previous values
		const missingPlayers = [];
		for (let i = 0; i < this.numberOfPlayers; i++) {
			let playerExists = false;
			for (const player of lastSnapshot.p) {
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
			lastSnapshot.p.push(previousSnapshot.p[missingPlayerIndex]);
		}

		//sort by id!
		lastSnapshot.p.sort((a: PlayerSnapshot, b: PlayerSnapshot) => {
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
				this.betweenSnapshots = {
					t: copyFrom.t,
					p: [],
					b: [],
					g: [],
					s: [],
					z: { ...copyFrom.z },
					l: []
				};
				for (const player of copyFrom.p) {
					this.betweenSnapshots.p.push({ ...player });

					const hands = player.h;
					//opcny postup: nejprve udelame melkou kopii a nasledne znovu vytvorime zdroj, nove pole a nove objekty rukou
					player.h = [];
					for (const hand of hands) {
						player.h.push({ ...hand });
					}
				}
				for (const bullet of copyFrom.b) {
					this.betweenSnapshots.b.push({ ...bullet });
				}
				for (const granade of copyFrom.g) {
					this.betweenSnapshots.g.push({ ...granade });
				}
				for (const smoke of copyFrom.s) {
					this.betweenSnapshots.s.push({ ...smoke });
				}
				for (const loot of copyFrom.l) {
					this.betweenSnapshots.l.push({ ...loot });
				}

				//players
				for (let i = 0; i < this.betweenSnapshots.p.length; i++) {
					const player = this.betweenSnapshots.p[i];
					{
						{
							{
								if (!olderSnapshot.p[i]) {
									console.log(i, olderSnapshot.p);
									debugger;
								}
								player.x = this.positionBetweenSnapshots(
									olderSnapshot.p[i].x,
									newerSnapshot.p[i].x,
									percentShift
								);
								player.y = this.positionBetweenSnapshots(
									olderSnapshot.p[i].y,
									newerSnapshot.p[i].y,
									percentShift
								);
							}
						}
					}

					//hands

					for (let j = 0; j < 2; j++) {
						const hand = player.h[j];
						hand.x = this.positionBetweenSnapshots(
							olderSnapshot.p[i].h[j].x,
							newerSnapshot.p[i].h[j].x,
							percentShift
						);
						hand.y = this.positionBetweenSnapshots(
							olderSnapshot.p[i].h[j].y,
							newerSnapshot.p[i].h[j].y,
							percentShift
						);
					}
				}
				//zone
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
			}
		}
		this.updatePlayers();
	}

	private updatePlayers(): void {
		if (!this.betweenSnapshots) return;
		for (const playerSnapshot of this.betweenSnapshots.p) {
			let playerExists = false;
			for (const playerInstance of this.players) {
				if (playerInstance.id === playerSnapshot.i) {
					//update player
					playerInstance.setX(playerSnapshot.x);
					playerInstance.setY(playerSnapshot.y);
					playerInstance.setAngle(playerSnapshot.a);
					playerInstance.setWeapon(playerSnapshot.w);
					playerInstance.setHammerAngle(playerSnapshot.m);

					for (let i = 0; i < 2; i++) {
						playerInstance.hands[i].setX(playerSnapshot.h[i].x);
						playerInstance.hands[i].setY(playerSnapshot.h[i].y);
					}

					playerExists = true;
					break;
				}
			}
			if (!playerExists) {
				//create player
				this.players.push(
					new Player(
						playerSnapshot.i,
						playerSnapshot.x,
						playerSnapshot.y,
						playerSnapshot.a,
						playerSnapshot.m,
						playerSnapshot.size,
						playerSnapshot.h,
						playerSnapshot.w
					)
				);
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
