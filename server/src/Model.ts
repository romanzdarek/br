import * as SocketIO from 'socket.io';
import Game from './Game';
import WaterTerrainData from './WaterTerrainData';
import CollisionPoints from './CollisionPoints';
import MapData from './MapData';
//node modules
import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { AppVariant, appVariant } from './app';

export default class Model {
	private io: SocketIO.Server;
	readonly games: Game[] = [];
	private waterTerrainData: WaterTerrainData;
	readonly collisionPoints: CollisionPoints;

	constructor(io: SocketIO.Server) {
		this.io = io;
		this.waterTerrainData = new WaterTerrainData();
		this.collisionPoints = new CollisionPoints();
		//game loop

		if (appVariant === AppVariant.Production) {
			setInterval(() => {
				this.loop();
			}, 1000 / 60);
		} else {
			// because problem with setInterval on windows
			let lastLoopExecutionTime = Date.now();
			const minLoopDelay = 16;
			const loop = () => {
				setImmediate(() => {
					const now = Date.now();
					if (now - lastLoopExecutionTime >= minLoopDelay) {
						//console.log(now - lastLoopExecutionTime);
						this.loop();
						lastLoopExecutionTime = now;
					}
					loop();
				});
			};
			loop();
		}

		//game closer
		setInterval(() => {
			this.gameCloser();
		}, 1000 * 60);
	}

	private gameCloser(): void {
		const maxOpenLobbyTime = 1000 * 60 * 10;
		const maxActiveGameTime = 1000 * 60 * 10;
		for (let i = this.games.length - 1; i >= 0; i--) {
			const game = this.games[i];
			if (!game) continue;
			//lobby
			if (!game.isActive()) {
				//close lobby
				if (Date.now() > game.createTime + maxOpenLobbyTime) {
					//send info
					game.cancelGame();
					//delete game
					delete this.games[i];
					this.updateListOpenGames();
				}
			} else {
				//active game
				if (Date.now() > game.createTime + maxOpenLobbyTime + maxActiveGameTime) {
					//send info
					game.cancelGame();
					//delete game
					delete this.games[i];
				}
			}
		}
	}

	isNameOk(name: string): boolean {
		let state = false;
		const allowedCharacters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
		const nameMaxLength: number = 20;
		if (typeof name === 'string') {
			if (name.length > 0 && name.length <= nameMaxLength) {
				//nepovolené znaky v jménu?
				let notAllowedCharacter = false;
				for (let i = 0; i < name.length; i++) {
					if (allowedCharacters.lastIndexOf(name[i]) === -1) {
						notAllowedCharacter = true;
						break;
					}
				}
				//v jmenu nejsou nepovolene znaky
				if (!notAllowedCharacter) {
					state = true;
				}
			}
		}
		return state;
	}

	getMapNames(): string[] {
		const levelNames: string[] = fs.readdirSync(config.directory.maps);
		for (let i = 0; i < levelNames.length; i++) {
			const nameLength = levelNames[i].length;
			//cut .json
			levelNames[i] = levelNames[i].substring(0, nameLength - 5);
		}
		return levelNames;
	}

	createGame(playerName: string, mapName: string, socket: SocketIO.Socket): void {
		if (playerName && mapName) {
			const mapData = this.loadMap(mapName);
			if (mapData) {
				const game = new Game(this.waterTerrainData, this.collisionPoints, mapData, mapName);
				this.games.push(game);
				const gameIndex = this.games.length - 1;
				//create first player
				const playerUniqueName = this.games[gameIndex].createPlayer(playerName, socket);
				socket.emit('createPlayer', playerUniqueName);
				socket.emit('createGame', gameIndex, playerUniqueName, mapName);
				this.updateListOpenGames();
			}
		}
	}

	cancelGame(gameId: number, socket: SocketIO.Socket): void {
		console.log('model.cancelGame()', gameId);
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

	loadMap(mapName: string): MapData | null {
		const fullPath = path.resolve(config.directory.maps + mapName + '.json');
		if (fs.existsSync(fullPath)) {
			//je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
			delete require.cache[fullPath];
			const map = require(fullPath);
			return map;
		} else {
			console.log('err: loadMap');
			return null;
		}
	}

	private lastLoopTime = Date.now();
	private loop(): void {
		const now = Date.now();
		const timeGap = 17;
		const diference = now - this.lastLoopTime;
		if (diference > timeGap) {
			console.error('loop is slow, last time before:', diference);
		}
		this.lastLoopTime = now;

		for (let i = this.games.length - 1; i >= 0; i--) {
			const game = this.games[i];
			if (game && game.isActive()) {
				game.loop();
				//delete game
				if (game.isEnd()) {
					for (const player of game.players) {
						if (player.socket) {
							player.socket.emit('stopGame');

							player.socket.emit('debug', 'model.loop() stopGame');
						}
					}
					console.log('model.loop() delete game', i);
					delete this.games[i];
				}
			}
		}
	}
}
