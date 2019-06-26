import * as SocketIO from 'socket.io';
import Game from './Game';
import WaterTerrainData from './WaterTerrainData';
import CollisionPoints from './CollisionPoints';

export default class Model {
	private io: SocketIO.Server;
	readonly games: Game[] = [];
	private waterTerrainData: WaterTerrainData;
	readonly collisionPoints: CollisionPoints;

	constructor(io: SocketIO.Server) {
		this.io = io;
		this.waterTerrainData = new WaterTerrainData();
		this.collisionPoints = new CollisionPoints();
		this.games.push(new Game(this.waterTerrainData, this.collisionPoints));
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
