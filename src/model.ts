import { Keys, Mouse } from './controller';
import View from './view';
import Player from './player';
import Map from './map';

export class Model {
	private view: View;
	private player: Player;
	private keys: Keys;
	private mouse: Mouse;
	private map: Map;
	constructor(keys: Keys, mouse: Mouse) {
		this.view = new View();
		this.createMap();
		this.player = new Player(this.map);
		this.keys = keys;
		this.mouse = mouse;
		this.gameLoop();
	}

	private createMap(): void {
		this.map = new Map();

	}

	private gameLoop(): void {
		//repeat
		requestAnimationFrame(() => {
			this.gameLoop();
		});

		this.player.playerMove(this.keys.w, this.keys.a, this.keys.s, this.keys.d, this.mouse.x, this.mouse.y);
		//hit
		if(this.mouse.left){
			this.player.hit();
			this.mouse.left = false;
		}

		this.view.draw(this.map, this.player);
	}
}
