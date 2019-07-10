import * as SocketIO from 'socket.io';
import Game from './Game';
import WaterTerrainData from './WaterTerrainData';
import CollisionPoints from './CollisionPoints';
import { Socket } from 'dgram';

export default class Model {
	private io: SocketIO.Server;
	readonly games: Game[] = [];
	private waterTerrainData: WaterTerrainData;
	readonly collisionPoints: CollisionPoints;

	constructor(io: SocketIO.Server) {
		this.io = io;
		this.waterTerrainData = new WaterTerrainData();
		this.collisionPoints = new CollisionPoints();
		//this.games.push(new Game(this.waterTerrainData, this.collisionPoints));
		setInterval(() => {
			this.loop();
		}, 1000 / 60);
	}

	createGame(playerName: string, socket: SocketIO.Socket): void {
		const game = new Game(this.waterTerrainData, this.collisionPoints);
		this.games.push(game);
		const gameIndex = this.games.length - 1;
		//create first player
		const playerUniqueName = this.games[gameIndex].createPlayer(playerName, socket);
		socket.emit('createPlayer', playerUniqueName);
		socket.emit('createGame', gameIndex, playerUniqueName);
		this.updateListOpenGames();
	}

	cancelGame(gameId: number, socket: SocketIO.Socket): void {
		if (this.games[gameId] && this.games[gameId].amIGameOwner(socket)) {
			//send info
			this.games[gameId].cancelGame();
			//delete game
			delete this.games[gameId];
			this.updateListOpenGames();
		}
	}

	updateListOpenGames(): void {
		const openGames = [];
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i] && !this.games[i].isActive()) {
				//player must exist!
				if (this.games[i].players[0]) {
					const gameInfo = { index: i, name: this.games[i].players[0].name };
					openGames.push(gameInfo);
				}
			}
		}
		this.io.emit('updateListOpenGames', openGames);
	}

	private loop(): void {
		for (const game of this.games) {
			if (game && game.isActive()) game.loop();
		}
	}
}
