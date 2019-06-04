import * as SocketIO from 'socket.io';
import Game from './Game';
import WaterTerrainData from './WaterTerrainData';

export default class Model {
	private io: SocketIO.Server;
	games: Game[] = [];
	private waterTerrainData: WaterTerrainData;

	constructor(io: SocketIO.Server) {
		this.io = io;
		this.waterTerrainData = new WaterTerrainData();
		this.games.push(new Game(this.waterTerrainData));
		setInterval(() => {
			this.loop();
		}, 1000 / 60);
	}

	private loop(): void {
		for (const game of this.games) {
			game.loop();
		}
	}
}
