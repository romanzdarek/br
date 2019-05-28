import { Keys, Mouse } from './Controller';
import Socket from './Socket';
import View from './View';
import Player from './Player';
import Map from './Map';
import WaterTerrainData from './WaterTerrainData';
import Bullet from './Bullet';
import ServerClientSync from './ServerClientSync';

export default class Model {
	private view: View;
	private player: Player;
	private socket: Socket;
	private waterTerrainData: WaterTerrainData;
	private keys: Keys;
	private mouse: Mouse;
	private map: Map;
	private bullets: Bullet[] = [];
	private halfFPS: boolean = true;
	private time = Date.now();
	private serverClientSync: ServerClientSync;

	constructor(keys: Keys, mouse: Mouse, socket: Socket, serverClientSync: ServerClientSync) {
		this.socket = socket;
		this.serverClientSync = serverClientSync;
		this.waterTerrainData = new WaterTerrainData();
		this.map = new Map(this.waterTerrainData);
		this.player = new Player(this.map);
		this.keys = keys;
		this.mouse = mouse;
		this.view = new View(
			this.map,
			this.player,
			this.bullets,
			this.mouse,
			this.waterTerrainData,
			this.serverClientSync
		);
		//this.gameLoop();
		setTimeout(() => {
			this.gameLoop();
		}, 200);
		/*
		setInterval(() => {
			this.gameLoop();
		}, 1000 / 60);
		*/
	}

	private gameLoop(): void {
		//repeat
		requestAnimationFrame(() => {
			this.gameLoop();
		});

		//sync
		if (!this.serverClientSync.ready()) {
			this.socket.emit('serverClientSync', Date.now());
		}

		//const now = Date.now();
		//console.log(now - this.time);
		//this.time = now;

		this.player.playerMove(this.keys.w, this.keys.a, this.keys.s, this.keys.d, this.mouse.x, this.mouse.y);

		//#################################
		//send player Data...
		const playerData = {
			x: this.player.getX(),
			y: this.player.getY()
		};
		//this.socket.emit('p', this.player.getX(), this.player.getY(), Date.now());
		//#################################

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
		//hit
		if (this.mouse.left) {
			this.player.hit();
			if (this.player.gun.ready()) {
				this.bullets.push(
					new Bullet(
						this.player.getCenterX(),
						this.player.getCenterY(),
						this.player.getAngle(),
						this.player.gun.range
					)
				);
			}
			this.mouse.left = false;
		}
		/*
		if(this.halfFPS){
			this.view.draw();
			this.halfFPS = false;
		}
		else{
			this.halfFPS = true;
		}
		*/
		this.view.draw();
	}

	screenResize(): void {
		this.view.screenResize();
	}
}
