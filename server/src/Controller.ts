import * as SocketIO from 'socket.io';
import Model from './Model';
//node modules
import * as fs from 'fs';
import * as path from 'path';

export default class Controller {
	private io: SocketIO.Server;
	private model: Model;

	constructor(http: any) {
		this.io = SocketIO(http);
		this.model = new Model(this.io);
		this.controll();
	}

	private controll(): void {
		this.io.on('connection', (socket: SocketIO.Socket) => {
			console.log(socket.id, 'connect');

			socket.emit(
				'collisionPoints',
				this.model.collisionPoints.body,
				this.model.collisionPoints.hand,
				this.model.collisionPoints.hammer.getAllPoints()
			);

			socket.on('sendMap', () => {
				const fullPath = path.resolve('./dist/maps/mainMap.json');
				if (fs.existsSync(fullPath)) {
					//je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
					delete require.cache[fullPath];
					const map = require(fullPath);
					socket.emit('sendMap', map);
				}
			});

			socket.on('disconnect', () => {
				console.log(socket.id, 'disconnect');
				//delete player
				for (const game of this.model.games) {
					for (let i = 0; i < game.players.length; i++) {
						if (game.players[i].socket == socket) {
							game.players.splice(i, 1);
						}
					}
				}
			});

			//sync
			socket.on('serverClientSync', (clientDateNow) => {
				socket.emit('serverClientSync', clientDateNow, Date.now());
			});

			//create player
			socket.on('createPlayer', (name: string, game: number) => {
				if (name && this.model.games[game]) {
					const id = this.model.games[game].createPlayer(name, socket);
					socket.emit('createPlayer', id, name);
				}
				else {
					console.log('Error: createPlayer');
				}
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
			socket.on('m', (game: number, mouse: string) => {
				if (this.model.games[game] && mouse) {
					for (const player of this.model.games[game].players) {
						if (player.socket === socket) {
							player.mouseController(mouse);
							return;
						}
					}
				}
				console.log('Error: m (controll player)');
			});

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
			socket.on('editorSaveMap', (data: any) => {
				console.log(data);
				let map = JSON.stringify(data);
				fs.writeFile('./dist/maps/' + 'mainMap' + '.json', map, (err) => {
					if (!err) {
						console.log('level saved');
					}
					else {
						console.log('err: sendLevel:  fs.writeFile', err);
					}
				});
			});
		});
	}
}
