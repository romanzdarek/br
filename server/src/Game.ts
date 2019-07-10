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

export default class Game {
	private map: Map;
	private zone: Zone;
	players: Player[] = [];
	private bullets: Bullet[] = [];
	private smokeClouds: SmokeCloud[] = [];
	private granades: ThrowingObject[] = [];
	private numberOfBullets: number = 0;
	private collisionPoints: CollisionPoints;
	private active: boolean = false;

	constructor(waterTerrainData: WaterTerrainData, collisionPoints: CollisionPoints) {
		this.collisionPoints = collisionPoints;
		this.map = new Map(waterTerrainData);
		this.zone = new Zone(this.map);
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
				//start clients
				for (const player of this.players) {
					player.socket.emit('startGame');
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
		this.players.push(new Player(name, socket, this.map, this.collisionPoints, this.players));
		//send it to the client
		this.updateListOfPlayers();
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
			player.move(this.players);
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
		//granades
		const granadesSnapshots: ThrowingObjectSnapshot[] = [];
		for (const granade of this.granades) {
			granadesSnapshots.push(new ThrowingObjectSnapshot(granade));
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

		//players
		for (const player of this.players) {
			const playerSnapshotArr: PlayerSnapshot[] = [];
			//add me
			playerSnapshotArr.push(new PlayerSnapshot(player));
			//add others
			for (const otherPlayer of this.players) {
				if (otherPlayer != player) {
					playerSnapshotArr.push(new PlayerSnapshot(otherPlayer));
				}
			}
			player.socket.emit('u', {
				t: dateNow,
				p: playerSnapshotArr,
				b: bulletSnapshots,
				g: granadesSnapshots,
				s: smokeCloudSnapshots,
				z: zoneSnapshot
			});
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
