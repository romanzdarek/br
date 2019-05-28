import Model from './Model';
import Socket from './Socket';
import ServerClientSync from './ServerClientSync';

//import { io, Socket } from './socket.io.d';

declare const io: {
	connect(url: string): Socket;
};

export type Keys = {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
};

export type Mouse = {
	x: number;
	y: number;
	left: boolean;
	middle: boolean;
	right: boolean;
};

export class Controller {
	private static instance: Controller;
	private model: Model;
	private socket: Socket;
	private serverClientSync: ServerClientSync;
	static _socket: Socket;
	private canvas: HTMLCanvasElement;
	private keys: Keys = {
		w: false,
		a: false,
		s: false,
		d: false
	};
	private mouse: Mouse = {
		x: 0,
		y: 0,
		left: false,
		middle: false,
		right: false
	};

	static playerData: any[] = [];
	static timeDiference: number;

	private constructor() {
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.socket = io.connect('http://192.168.0.2:8888');
		this.serverClientSync = new ServerClientSync();
		Controller._socket = this.socket;
		this.model = new Model(this.keys, this.mouse, this.socket, this.serverClientSync);
		window.addEventListener('resize', () => {
			this.model.screenResize();
			const event = new Event('mousemove');
			this.canvas.dispatchEvent(event);
		});
		this.keysController();
		this.mouseController();
		this.socketController();
	}

	static run(): void {
		if (!Controller.instance) {
			Controller.instance = new Controller();
		}
		else {
			throw new Error('Only one controller!');
		}
	}

	private socketController(): void {
		this.socket.emit('syncTime', 0);
		this.socket.on('serverClientSync', (clientDateNow, serverDateNow) => {
			const timeNow = Date.now();
			const ping = timeNow - clientDateNow;
			const timeDiferenceClientServer = timeNow - serverDateNow;
			this.serverClientSync.addData(ping, timeDiferenceClientServer);
			console.log(this.serverClientSync);
		});

		this.socket.on('socketEvent', (data) => {
			console.log(data);
		});

		this.socket.on('syncTime', (serverTime) => {
			Controller.timeDiference = Date.now() - serverTime;
			console.log('syncTime', Controller.timeDiference);
		});

		this.socket.on('p', (x, y, time, tick) => {
			//console.log('transport time:', Date.now() - time);
			const ping = Math.round(Math.random() * 25);
			//console.log('ping:', ping);
			setTimeout(() => {
				if (Controller.playerData.length) {
					const lastTick = Controller.playerData[Controller.playerData.length - 1].tick;
					//if (tick - 1 !== lastTick) console.log('spatne poradi ticku');
				}

				Controller.playerData.push({ x, y, time: time, tick: tick });
			}, ping);
		});
	}

	private mouseController(): void {
		this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
			if (e.x == undefined) {
				this.mouse.x = this.canvas.width / 2;
				this.mouse.y = this.canvas.height / 2;
			}
			else {
				this.mouse.x = e.x;
				this.mouse.y = e.y;
			}
		});
		this.canvas.addEventListener('click', (e: MouseEvent) => {
			this.mouse.left = true;
		});
	}

	private keysController(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					this.keys.w = true;
					break;
				case 'KeyA':
					this.keys.a = true;
					break;
				case 'KeyS':
					this.keys.s = true;
					break;
				case 'KeyD':
					this.keys.d = true;
					break;
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					this.keys.w = false;
					break;
				case 'KeyA':
					this.keys.a = false;
					break;
				case 'KeyS':
					this.keys.s = false;
					break;
				case 'KeyD':
					this.keys.d = false;
					break;
			}
		});
	}
}
