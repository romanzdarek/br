import * as SocketIO from 'socket.io';
import Model from './Model';
import Point from './Point';
import Editor from './Editor';
import MapData from './MapData';
import { appVariant } from './app';

export default class Controller {
	private io: SocketIO.Server;
	private model: Model;
	private editor: Editor;

	constructor(http: number) {
		this.io = SocketIO(http);
		this.model = new Model(this.io);
		this.editor = new Editor();
		this.controll();
	}

	private controll(): void {
		this.io.on('connection', (socket: SocketIO.Socket) => {
			console.log(socket.id, 'connect');
			socket.emit('debug', `Server (${appVariant} variant) connected.`);
			this.model.updateListOpenGames();
			socket.emit('listOfMaps', this.model.getMapNames());
			socket.emit('collisionPoints', this.model.collisionPoints.body, this.model.collisionPoints.hand, this.model.collisionPoints.hammer.getAllPoints());

			//leave game
			socket.on('leaveGame', (gameId: number) => {
				if (gameId >= 0 && this.model.games[gameId]) {
					for (const player of this.model.games[gameId].players) {
						if (player.socket === socket) {
							player.leaveGame();
							return;
						}
					}
				}
				console.log('Err: leaveGame');
			});

			//spectate
			socket.on('spectate', (gameId: number) => {
				if (gameId >= 0 && this.model.games[gameId]) {
					for (const player of this.model.games[gameId].players) {
						if (player.socket === socket) {
							player.startSpectate();
							return;
						}
					}
				}
				console.log('Err: spectate');
			});

			//changeSpectate
			socket.on('wheelChangeSpectate', (gameId: number, direction: number) => {
				if (gameId >= 0 && this.model.games[gameId]) {
					for (const player of this.model.games[gameId].players) {
						if (player.socket === socket) {
							if (!player.isActive()) {
								player.changeSpectatePlayer(direction);
								return;
							}
						}
					}
				}
				console.log('Err: wheelChangeSpectate');
			});

			//create a new game
			socket.on('createGame', (playerName: string, mapName: string) => {
				if (playerName && mapName && this.model.isNameOk(playerName) && this.model.isNameOk(mapName)) {
					this.model.createGame(playerName, mapName, socket);
				} else {
					console.log('Err: createGame');
				}
			});

			//join
			socket.on('joinGame', (playerName: string, gameIndex: number) => {
				if (playerName && this.model.isNameOk(playerName) && gameIndex >= 0 && this.model.games[gameIndex]) {
					if (!this.model.games[gameIndex].isActive()) {
						let samePlayerInGame = false;
						for (const player of this.model.games[gameIndex].players) {
							if (player.socket === socket) samePlayerInGame = true;
						}
						if (!samePlayerInGame) {
							const playerUniqueName = this.model.games[gameIndex].createPlayer(playerName, socket);
							socket.emit('createPlayer', playerUniqueName);
							socket.emit('joinGame', gameIndex, playerUniqueName, this.model.games[gameIndex].mapName);
						}
					}
				} else {
					console.log('Err: joinGame');
				}
			});

			//leave lobby (join player)
			socket.on('leaveLobby', (gameId: number) => {
				if (this.model.games[gameId]) {
					this.model.games[gameId].leaveLobby(socket);
				} else {
					console.log('Err: leaveLobby');
				}
			});

			//cancel lobby (create player)
			socket.on('cancelLobby', (gameId: number) => {
				if (this.model.games[gameId]) {
					this.model.cancelGame(gameId, socket);
				} else {
					console.log('Err: cancelLobby');
				}
			});

			//start a new game
			socket.on('startGame', (gameIndex: number) => {
				if (gameIndex >= 0 && this.model.games[gameIndex]) {
					this.model.games[gameIndex].start(socket);
					this.model.updateListOpenGames();
				} else {
					console.log('Err: startGame');
				}
			});

			socket.on('disconnect', () => {
				console.log(socket.id, 'disconnect');
				for (let i = 0; i < this.model.games.length; i++) {
					if (this.model.games[i]) {
						const game = this.model.games[i];
						for (const player of game.players) {
							if (player.socket == socket) {
								if (!game.isActive()) {
									//cancel lobby
									if (player.id === 0) this.model.cancelGame(i, socket);
									//leave lobby
									else game.leaveLobby(socket);
								}
								player.leaveGame();
							}
						}
					}
				}
			});

			//sync
			socket.on('serverClientSync', (clientDateNow) => {
				socket.emit('serverClientSync', clientDateNow, Date.now());
			});

			//'c' === controll player
			socket.on('c', (game: number, key: string) => {
				if (this.model.games[game] && key) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.keyController(key);
							return;
						}
					}
				}
				console.log('Error: c (controll player)', game, this.model.games[game]);
			});

			//change angle
			socket.on('a', (game: number, angle: number) => {
				if (this.model.games[game] && angle >= 0) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.changeAngle(angle);
							return;
						}
					}
				}
				console.log('Error: a (controll player)');
			});

			//move angle
			socket.on('moveAngle', (game: number, moveState, angle?: number) => {
				if (this.model.games[game]) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							if (moveState) {
								//player.changeAngle(angle);
								player.moveAngle(moveState, angle);
							} else {
								player.moveAngle(moveState);
							}
							return;
						}
					}
				}
				console.log('Error: a (controll player)');
			});

			//controll mouse
			socket.on('m', (game: number, mouse: string, position: Point, touchendDelay: number) => {
				if (this.model.games[game] && mouse) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.mouseController(mouse, position, touchendDelay);
							return;
						}
					}
				}
				console.log('Error: m (controll player)');
			});

			//throw item
			socket.on('throwItem', (game: number, inventoryIndex: number) => {
				if (this.model.games[game]) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.inventory.throwItemFromInventory(inventoryIndex);
							return;
						}
					}
				}
				console.log('Error: throwItem (controll player)');
			});

			//change item
			socket.on('i', (game: number, inventoryIndex: number, reload = false) => {
				if (this.model.games[game] && inventoryIndex > -1) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							if (reload && player.inventory.getActiveItemNumber() === inventoryIndex) {
								//reload
								player.keyController('re');
							} else {
								player.inventory.changeActiveItem(inventoryIndex);
							}

							return;
						}
					}
				}
				console.log('Error: i (controll player)');
			});

			//change item
			socket.on('wheelChangeInventory', (game: number, wheelDirection: number) => {
				if (this.model.games[game]) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.inventory.changeActiveItemByWheel(wheelDirection);
							return;
						}
					}
				}
				console.log('Error: wheelChangeInventory (controll player)');
			});

			//save map from editor
			socket.on('editorSaveMap', async (mapName: string, mapData: MapData) => {
				if (this.model.isNameOk(mapName) && mapData.size >= 5) {
					const saveDone = await this.editor.saveMap(mapName, mapData);
					if (saveDone) {
						socket.emit('mapSaved');
						this.io.emit('listOfMaps', this.model.getMapNames());
					} else {
						console.log('err: save level');
					}
				} else {
					console.log('err: editorSaveMap');
				}
			});

			//openMapInEditor
			socket.on('openMapInEditor', (mapName: string) => {
				if (typeof mapName == 'string' && mapName.length) {
					const mapData = this.model.loadMap(mapName);
					if (mapData) {
						socket.emit('openMapInEditor', mapData);
					}
				}
			});
		});
	}
}
