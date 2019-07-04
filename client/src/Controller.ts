import Model from './Model';
import Socket from './Socket';
import ServerClientSync from './ServerClientSync';
import { Snapshot } from './Snapshot';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import CollisionPoints from './CollisionPoints';
import Point from './Point';

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
	private myHtmlElements: MyHtmlElements;
	private model: Model;
	private editor: Editor;
	private socket: Socket;
	private serverClientSync: ServerClientSync;
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

	private playerAngle: number = 0;

	private constructor() {
		this.myHtmlElements = new MyHtmlElements();
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.socket = io.connect('http://192.168.0.2:8888');
		this.serverClientSync = new ServerClientSync();
		this.editor = new Editor(this.myHtmlElements, this.socket);
		this.model = new Model(
			this.keys,
			this.mouse,
			this.socket,
			this.serverClientSync,
			this.myHtmlElements,
			this.editor
		);
		window.addEventListener('resize', () => {
			this.model.view.screenResize();
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
		this.socket.emit('createPlayer', 'playerName', this.model.getGame());
		this.socket.emit('sendMap', 0);

		this.socket.on('collisionPoints', (body: Point[], hand: Point[], hammer: Point[][]) => {
			this.model.collisionPoints.setData(body, hand, hammer);
		});

		//map
		this.socket.on('sendMap', (map) => {
			this.model.map.openMap(map);
		});

		this.socket.on('createPlayer', (id: string, name: string) => {
			if (id && name) {
				this.model.setID(id);
				this.model.setName(name);

				//this.model.players.push(new PlayerFromServer(id, name));
				console.log('player created', id);
			}
			else {
				console.log('error created player', id, name);
			}
		});

		//sync
		this.socket.on('serverClientSync', (clientDateNow, serverDateNow) => {
			const timeNow = Date.now();
			const ping = timeNow - clientDateNow;
			const timeDiferenceClientServer = serverDateNow - (timeNow - ping / 2);
			this.serverClientSync.addData(ping, timeDiferenceClientServer);
		});

		//u === update positions
		this.socket.on('u', (snapshot: Snapshot) => {
			const ping = Math.round(Math.random() * 50);
			setTimeout(() => {
				this.model.snapshots.push(snapshot);
				//delete old snapshots
				if (this.model.snapshots.length > 50) {
					this.model.snapshots.splice(0, 1);
				}
			}, ping);
		});

		//update map
		this.socket.on('m', (mapObject, serverTime, data) => {
			const updateTime =
				this.serverClientSync.getDrawDelay() - (this.serverClientSync.getServerTime() - serverTime);
			//walls
			if (mapObject === 'w') {
				for (const wall of this.model.map.rectangleObstacles) {
					if (wall.id === data.id) {
						setTimeout(() => {
							wall.update(data.opacity);
						}, updateTime);
						break;
					}
				}
			}
			//rounds
			if (mapObject === 'r') {
				for (const round of this.model.map.impassableRoundObstacles) {
					if (round.id === data.id) {
						setTimeout(() => {
							round.update(data.opacity);
						}, updateTime);
						break;
					}
				}
			}
			//bushes
			if (mapObject === 'b') {
				for (const round of this.model.map.bushes) {
					if (round.id === data.id) {
						setTimeout(() => {
							round.update(data.opacity);
						}, updateTime);
						break;
					}
				}
			}
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

			const previousPlayerAngle = this.playerAngle;
			this.rotatePlayer(this.mouse.x, this.mouse.y);
			//change
			if (this.playerAngle !== previousPlayerAngle) {
				this.socket.emit('a', this.model.getGame(), this.playerAngle);
			}
		});
		this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
			this.mouse.left = true;
			const clickPosition = this.model.view.calculateServerPositionFromClick(e);
			console.log(clickPosition);
			this.socket.emit('m', this.model.getGame(), 'l', clickPosition);
		});
		this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
			this.mouse.left = false;
			this.socket.emit('m', this.model.getGame(), '-l');
		});
	}

	private rotatePlayer(mouseX: number, mouseY: number): void {
		//triangular sides
		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;
		let x = centerX - mouseX;
		let y = centerY - mouseY;
		//can not set x and y to 0 because angle
		if (x === 0) x = 0.1;
		//atangens
		let angle = Math.abs(Math.atan(x / y) * 180 / Math.PI);
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1
		if (mouseX >= centerX && mouseY < centerY) {
			this.playerAngle = angle;
		}
		//2
		if (mouseX >= centerX && mouseY >= centerY) {
			this.playerAngle = 90 + 90 - angle;
		}
		//3
		if (mouseX < centerX && mouseY >= centerY) {
			this.playerAngle = 180 + angle;
		}
		//4
		if (mouseX < centerX && mouseY < centerY) {
			this.playerAngle = 270 + 90 - angle;
		}
		this.playerAngle = Math.round(this.playerAngle);
		if (this.playerAngle === 360) this.playerAngle = 0;
	}

	private keysController(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					if (!this.keys.w) this.socket.emit('c', this.model.getGame(), 'u');
					this.keys.w = true;
					break;
				case 'KeyA':
					if (!this.keys.a) this.socket.emit('c', this.model.getGame(), 'l');
					this.keys.a = true;

					break;
				case 'KeyS':
					if (!this.keys.s) this.socket.emit('c', this.model.getGame(), 'd');
					this.keys.s = true;

					break;
				case 'KeyD':
					if (!this.keys.d) this.socket.emit('c', this.model.getGame(), 'r');
					this.keys.d = true;
					break;

				case 'Digit0':
					this.socket.emit('i', this.model.getGame(), 0);
					break;

				case 'Digit1':
					this.socket.emit('i', this.model.getGame(), 1);
					break;
				case 'Digit2':
					this.socket.emit('i', this.model.getGame(), 2);
					break;
				case 'Digit3':
					this.socket.emit('i', this.model.getGame(), 3);
					break;
				case 'Digit4':
					this.socket.emit('i', this.model.getGame(), 4);
					break;
				case 'Digit5':
					this.socket.emit('i', this.model.getGame(), 5);
					break;
				case 'Digit6':
					this.socket.emit('i', this.model.getGame(), 6);
					break;
				case 'Digit7':
					this.socket.emit('i', this.model.getGame(), 7);
					break;
				case 'Digit8':
					this.socket.emit('i', this.model.getGame(), 8);
					break;
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					if (this.keys.w) this.socket.emit('c', this.model.getGame(), '-u');
					this.keys.w = false;
					break;
				case 'KeyA':
					if (this.keys.a) this.socket.emit('c', this.model.getGame(), '-l');
					this.keys.a = false;
					break;
				case 'KeyS':
					if (this.keys.s) this.socket.emit('c', this.model.getGame(), '-d');
					this.keys.s = false;
					break;
				case 'KeyD':
					if (this.keys.d) this.socket.emit('c', this.model.getGame(), '-r');
					this.keys.d = false;
					break;
			}
		});
	}
}
