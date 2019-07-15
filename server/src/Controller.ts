import * as SocketIO from 'socket.io';
import Model from './Model';
import Point from './Point';
import Editor from './Editor';

export default class Controller {
	private io: SocketIO.Server;
	private model: Model;
	private editor: Editor;

	constructor(http: any) {
		this.io = SocketIO(http);
		this.model = new Model(this.io);
		this.editor = new Editor();
		this.controll();
	}

	private controll(): void {
		this.io.on('connection', (socket: SocketIO.Socket) => {
			console.log(socket.id, 'connect');
			this.model.updateListOpenGames();
			socket.emit('listOfMaps', this.model.getMapNames());

			socket.emit(
				'collisionPoints',
				this.model.collisionPoints.body,
				this.model.collisionPoints.hand,
				this.model.collisionPoints.hammer.getAllPoints()
			);

			//create a new game
			socket.on('createGame', (playerName: string, mapName: string) => {
				if (playerName && mapName && this.model.isNameOk(playerName) && this.model.isNameOk(mapName)) {
					this.model.createGame(playerName, mapName, socket);
				}
				else {
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
							socket.emit('joinGame', gameIndex, playerUniqueName);
						}
					}
				}
				else {
					console.log('Err: joinGame');
				}
			});

			//leave lobby (join player)
			socket.on('leaveLobby', (gameId: number) => {
				if (this.model.games[gameId]) {
					this.model.games[gameId].leaveLobby(socket);
				}
				else {
					console.log('Err: leaveLobby');
				}
			});

			//cancel lobby (create player)
			socket.on('cancelLobby', (gameId: number) => {
				if (this.model.games[gameId]) {
					this.model.cancelGame(gameId, socket);
				}
				else {
					console.log('Err: cancelLobby');
				}
			});

			//start a new game
			socket.on('startGame', (gameIndex: number) => {
				if (gameIndex >= 0 && this.model.games[gameIndex]) {
					this.model.games[gameIndex].start(socket);
					this.model.updateListOpenGames();
				}
				else {
					console.log('Err: startGame');
				}
			});

			/*
			socket.on('sendMap', () => {
				const map = this.model.loadMap('mainMap');
				if (map) {
					socket.emit('sendMap', map);
				}
			});
			*/

			socket.on('disconnect', () => {
				console.log(socket.id, 'disconnect');
				//delete player
				for (const game of this.model.games) {
					if (game) {
						for (let i = 0; i < game.players.length; i++) {
							if (game.players[i].socket == socket) {
								game.players.splice(i, 1);
							}
						}
					}
				}
			});

			//sync
			socket.on('serverClientSync', (clientDateNow) => {
				socket.emit('serverClientSync', clientDateNow, Date.now());
			});

			//create player
			/*
			socket.on('createPlayer', (name: string, game: number) => {
				if (name && this.model.games[game]) {
					const id = this.model.games[game].createPlayer(name, socket);
					socket.emit('createPlayer', id, name);
				}
				else {
					console.log('Error: createPlayer');
				}
			});
			*/

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
				console.log('Error: c (controll player)');
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

			//controll mouse
			socket.on('m', (game: number, mouse: string, position: Point) => {
				if (this.model.games[game] && mouse) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.mouseController(mouse, position);
							return;
						}
					}
				}
				console.log('Error: m (controll player)');
			});

			//change
			socket.on('i', (game: number, inventoryIndex: number) => {
				if (this.model.games[game] && inventoryIndex > -1) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.changeWeapon(inventoryIndex);
							return;
						}
					}
				}
				console.log('Error: i (controll player)');
			});

			//save level from editor
			socket.on('editorSaveMap', async (mapName: string, mapData: any) => {
				if (this.model.isNameOk(mapName)) {
					const saveDone = await this.editor.saveMap(mapName, mapData);
					if (saveDone) {
						this.io.emit('listOfMaps', this.model.getMapNames());
					}
					else {
						console.log('err: save level');
					}
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
