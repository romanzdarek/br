import * as SocketIO from 'socket.io';
import Model from './Model';

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
			socket.on('c', (game: number, id: string, key: string) => {
				if (this.model.games[game] && id && key) {
					for (const player of this.model.games[game].players) {
						if (player.id === id) {
							player.keyController(key);
							return;
						}
					}
				}
				console.log('Error: c (controll player)');
			});

			//change angle
			socket.on('a', (game: number, id: string, angle: number) => {
				if (this.model.games[game] && id && angle >= 0) {
					for (const player of this.model.games[game].players) {
						if (player.id === id) {
							player.changeAngle(angle);
							return;
						}
					}
				}
				console.log('Error: a (controll player)');
			});

			//controll mouse
			socket.on('m', (game: number, id: string, mouse: string) => {
				if (this.model.games[game] && id && mouse) {
					for (const player of this.model.games[game].players) {
						if (player.id === id) {
							player.mouseController(mouse);
							return;
						}
					}
				}
				console.log('Error: m (controll player)');
			});
		});
	}
}
