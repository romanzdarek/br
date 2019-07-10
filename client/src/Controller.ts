import Model from './Model';
import Socket from './Socket';
import ServerClientSync from './ServerClientSync';
import { Snapshot } from './Snapshot';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import CollisionPoints from './CollisionPoints';
import Point from './Point';
import { Weapon } from './Weapon';
import OpenGame from './OpenGame';

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
		window.addEventListener('beforeunload', (e) => {
			// Cancel the event as stated by the standard.
			e.preventDefault();
			// Chrome requires returnValue to be set.
			e.returnValue = '';
		});
		this.keysController();
		this.mouseController();
		this.socketController();
		this.menuController();
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
		const el = this.myHtmlElements;
		//this.socket.emit('createPlayer', 'playerName', this.model.getGame());
		this.socket.emit('sendMap', 0);

		//startGame
		this.socket.on('startGame', () => {
			el.close(el.lobbyMenu.main);
		});

		//createGame
		this.socket.on('createGame', (gameId: number, playerName: string) => {
			this.model.setGameId(gameId);
			el.close(el.mainMenu.main, el.lobbyMenu.forJoinPlayers);
			el.open(el.lobbyMenu.main, el.lobbyMenu.forCreatePlayer);
		});

		//joinGame
		this.socket.on('joinGame', (gameId: number, playerName: string) => {
			this.model.setGameId(gameId);
			el.close(el.mainMenu.main, el.lobbyMenu.forCreatePlayer);
			el.open(el.lobbyMenu.main, el.lobbyMenu.forJoinPlayers);
		});

		//leave lobby
		this.socket.on('leaveLobby', () => {
			this.model.setGameId(-1);
			el.close(el.lobbyMenu.main);
			el.open(el.mainMenu.main);
		});

		//updateListOpenGames
		this.socket.on('updateListOpenGames', (openGames: OpenGame[]) => {
			console.log(openGames);
			el.mainMenu.games.innerHTML = '';
			for (const openGame of openGames) {
				const option = document.createElement('option');
				option.textContent = openGame.name + "'s game";
				option.setAttribute('value', openGame.index.toString());
				el.mainMenu.games.appendChild(option);
			}
			let noGame = true;
			if (openGames.length) noGame = false;
			(<HTMLInputElement>el.mainMenu.games).disabled = noGame;
		});

		//update listOfPlayers in lobby
		this.socket.on('listOfPlayers', (playerNames: string[]) => {
			//title
			el.lobbyMenu.gameName.textContent = playerNames[0] + "'s game";
			//list
			el.lobbyMenu.players.innerHTML = '';
			for (const playerName of playerNames) {
				const li = document.createElement('li');
				li.textContent = playerName;
				el.lobbyMenu.players.appendChild(li);
			}
		});

		this.socket.on('collisionPoints', (body: Point[], hand: Point[], hammer: Point[][]) => {
			this.model.collisionPoints.setData(body, hand, hammer);
		});

		//map
		this.socket.on('sendMap', (map) => {
			this.model.map.openMap(map);
		});

		this.socket.on('createPlayer', (name: string) => {
			if (name) {
				this.model.setName(name);
			}
			else {
				console.log('error created player');
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
		this.myHtmlElements.zoneSVG.addEventListener('mousemove', (e: MouseEvent) => {
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
				this.socket.emit('a', this.model.getGameId(), this.playerAngle);
			}
		});
		this.myHtmlElements.zoneSVG.addEventListener('mousedown', (e: MouseEvent) => {
			this.mouse.left = true;
			const clickPoint = new Point(e.clientX, e.clientY);
			const serverPosition = this.model.view.calculateServerPosition(clickPoint);
			//TODO optimalization: send click position only if i have granade or smoke...
			this.socket.emit('m', this.model.getGameId(), 'l', serverPosition);
		});
		this.myHtmlElements.zoneSVG.addEventListener('mouseup', (e: MouseEvent) => {
			this.mouse.left = false;
			this.socket.emit('m', this.model.getGameId(), '-l');
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
					if (!this.keys.w) this.socket.emit('c', this.model.getGameId(), 'u');
					this.keys.w = true;
					break;
				case 'KeyA':
					if (!this.keys.a) this.socket.emit('c', this.model.getGameId(), 'l');
					this.keys.a = true;

					break;
				case 'KeyS':
					if (!this.keys.s) this.socket.emit('c', this.model.getGameId(), 'd');
					this.keys.s = true;

					break;
				case 'KeyD':
					if (!this.keys.d) this.socket.emit('c', this.model.getGameId(), 'r');
					this.keys.d = true;
					break;

				case 'Digit0':
					this.socket.emit('i', this.model.getGameId(), 0);
					break;

				case 'Digit1':
					this.socket.emit('i', this.model.getGameId(), 1);
					break;
				case 'Digit2':
					this.socket.emit('i', this.model.getGameId(), 2);
					break;
				case 'Digit3':
					this.socket.emit('i', this.model.getGameId(), 3);
					break;
				case 'Digit4':
					this.socket.emit('i', this.model.getGameId(), 4);
					break;
				case 'Digit5':
					this.socket.emit('i', this.model.getGameId(), 5);
					break;
				case 'Digit6':
					this.socket.emit('i', this.model.getGameId(), 6);
					break;
				case 'Digit7':
					this.socket.emit('i', this.model.getGameId(), 7);
					break;
				case 'Digit8':
					this.socket.emit('i', this.model.getGameId(), 8);
					break;
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					if (this.keys.w) this.socket.emit('c', this.model.getGameId(), '-u');
					this.keys.w = false;
					break;
				case 'KeyA':
					if (this.keys.a) this.socket.emit('c', this.model.getGameId(), '-l');
					this.keys.a = false;
					break;
				case 'KeyS':
					if (this.keys.s) this.socket.emit('c', this.model.getGameId(), '-d');
					this.keys.s = false;
					break;
				case 'KeyD':
					if (this.keys.d) this.socket.emit('c', this.model.getGameId(), '-r');
					this.keys.d = false;
					break;
			}
		});
	}

	private menuController(): void {
		const el = this.myHtmlElements;

		//open editor menu and close main menu
		el.mainMenu.openEditor.addEventListener('click', () => {
			el.open(el.mapSizeMenu.main);
			el.close(el.mainMenu.main);
		});

		//change player name and allow create game
		el.mainMenu.name.addEventListener('input', () => {
			let disabled = true;
			if ((<HTMLInputElement>el.mainMenu.name).value.length) disabled = false;
			(<HTMLInputElement>el.mainMenu.create).disabled = disabled;
			let disabled2 = true;
			if ((<HTMLInputElement>el.mainMenu.games).value) disabled2 = false;
			if (!disabled && !disabled2) (<HTMLInputElement>el.mainMenu.join).disabled = false;
		});

		//select game - allow join
		el.mainMenu.games.addEventListener('change', () => {
			let disabled = true;
			if ((<HTMLInputElement>el.mainMenu.name).value.length) disabled = false;
			let disabled2 = true;
			if ((<HTMLInputElement>el.mainMenu.games).value) disabled2 = false;
			if (!disabled && !disabled2) (<HTMLInputElement>el.mainMenu.join).disabled = false;
		});

		//create a new game
		el.mainMenu.create.addEventListener('click', () => {
			if ((<HTMLInputElement>el.mainMenu.name).value.length) {
				const playerName = (<HTMLInputElement>el.mainMenu.name).value;
				this.socket.emit('createGame', playerName);
			}
		});

		//join
		el.mainMenu.join.addEventListener('click', () => {
			if ((<HTMLInputElement>el.mainMenu.name).value.length && (<HTMLInputElement>el.mainMenu.games).value) {
				const playerName = (<HTMLInputElement>el.mainMenu.name).value;
				const gameIndex = parseInt((<HTMLInputElement>el.mainMenu.games).value);
				this.socket.emit('joinGame', playerName, gameIndex);
			}
		});

		//leave join in lobby
		el.lobbyMenu.leave.addEventListener('click', () => {
			this.socket.emit('leaveLobby', this.model.getGameId());
		});

		//cancel game in lobby
		el.lobbyMenu.cancel.addEventListener('click', () => {
			this.socket.emit('cancelLobby', this.model.getGameId());
		});

		//start game
		el.lobbyMenu.start.addEventListener('click', () => {
			el.close(el.lobbyMenu.main);
			this.socket.emit('startGame', this.model.getGameId());
		});
	}
}
