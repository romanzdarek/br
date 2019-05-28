import * as socketIO from 'socket.io';

export default class Model {
	private io: socketIO.Server;
	playerData = { x: 0, y: 0, time: 0 };

	private tick: number = 0;
	private x: number = 0;

	private direction: number = 1;

	constructor(io: socketIO.Server) {
		this.io = io;
		setInterval(() => {
			this.gameLoop();
		}, 1000 / 60);
	}

	private gameLoop(): void {
		const shift = 5;
		this.x += shift * this.direction;

		if (this.x === 900) {
			this.direction = -1;
		}
		if (this.x === 0) {
			this.direction = 1;
		}

		this.io.emit('p', this.x, 600, Date.now(), this.tick);
		this.tick++;
	}
}
