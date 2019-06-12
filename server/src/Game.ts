import Map from './Map';
import Bullet from './Bullet';
import { Player, Weapon } from './Player';
import PlayerSnapshot from './PlayerSnapshot';
import BulletSnapshot from './BulletSnapshot';
import WaterTerrainData from './WaterTerrainData';
import * as SocketIO from 'socket.io';

export default class Game {
	private map: Map;
	players: Player[] = [];
	private bullets: Bullet[] = [];

	constructor(waterTerrainData: WaterTerrainData) {
		this.map = new Map(waterTerrainData);
	}

	createPlayer(name: string, socket: SocketIO.Socket): string {
		const id = this.makeID();
		for (const player of this.players) {
			//unique ID!
			if (player.id === id) {
				return this.createPlayer(name, socket);
			}
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
				name = uniqueName(0);
			}
		}
		this.players.push(new Player(name, id, this.map, socket));
		return id;
	}

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

	loop(): void {
		//move and delete bullets
		for (let i = this.bullets.length - 1; i >= 0; i--) {
			const bullet = this.bullets[i];
			if (bullet.flying()) {
				bullet.move(this.map);
			}
			else {
				this.bullets.splice(i, 1);
			}
		}

		//player move
		for (const player of this.players) {
			player.move();
			//hit
			if (player.mouseControll.left) {
				if (player.getActiveWeapon() === Weapon.hand) player.hit();

				if (player.getActiveWeapon() === Weapon.pistol) {
					if (player.gun.ready()) {
						this.bullets.push(
							new Bullet(player.getCenterX(), player.getCenterY(), player.getAngle(), player.gun.range)
						);
					}
					player.mouseControll.left = false;
				}
			}
		}
		const dateNow = Date.now();
		//update for clients
		//bullets
		const bulletSnapshots: BulletSnapshot[] = [];
		for(const bullet of this.bullets){
			bulletSnapshots.push(new BulletSnapshot(bullet));
		}
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
				b: bulletSnapshots
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
