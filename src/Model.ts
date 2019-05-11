import { Keys, Mouse } from './Controller';
import View from './View';
import Player from './Player';
import Map from './Map';
import WaterTerrainData from './WaterTerrainData';
import Bullet from './Bullet';

export default class Model {
	private view: View;
	private player: Player;
	private waterTerrainData: WaterTerrainData;
	private keys: Keys;
	private mouse: Mouse;
	private map: Map;
	private bullets: Bullet[] = [];
	constructor(keys: Keys, mouse: Mouse) {
		this.waterTerrainData = new WaterTerrainData();
		this.map = new Map(this.waterTerrainData);
		this.player = new Player(this.map);
		this.keys = keys;
		this.mouse = mouse;
		this.view = new View(this.map, this.player, this.bullets, this.mouse, this.waterTerrainData);
		this.gameLoop();
	}

	private gameLoop(): void {
		//repeat
		requestAnimationFrame(() => {
			this.gameLoop();
		});

		this.player.playerMove(this.keys.w, this.keys.a, this.keys.s, this.keys.d, this.mouse.x, this.mouse.y);

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

		this.view.draw();
	}

	screenResize(): void {
		this.view.screenResize();
	}
}
