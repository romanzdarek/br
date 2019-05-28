import * as socketIO from 'socket.io';
import Model from './Model';

export default class Controller {
	private io: socketIO.Server;
	private model: Model;

	constructor(http: any) {
		this.io = socketIO(http);
		this.model = new Model(this.io);
		this.controll();
	}

	private controll(): void {
		this.io.on('connection', (socket: socketIO.Socket) => {
			socket.on('serverClientSync', (clientDateNow) => {
				socket.emit('serverClientSync', clientDateNow, Date.now());
				console.log(socket.id, 'serverClientSync');
			});

			socket.on('syncTime', () => {
				socket.emit('syncTime', Date.now());
			});

			console.log('connect');
			socket.on('disconnect', () => {
				console.log('disconnect');
			});

			socket.on('socketEvent', (...rest: any) => {
				console.log(rest);
				socket.emit('socketEvent', 'hi from server');
			});

			socket.on('p', (x: number, y: number, time: number) => {
				this.model.playerData = { x, y, time };
			});
		});
	}
}
