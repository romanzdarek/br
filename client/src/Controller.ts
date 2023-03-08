import Model from './Model';
import Socket from './Socket';
import ServerClientSync from './ServerClientSync';
import { Snapshot } from './Snapshot';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import Point from './Point';
import OpenGame from './OpenGame';
import MapData from './MapData';
import PlayerStats from './PlayerStats';
import { Weapon } from './Weapon';

declare const io: {
	connect(url?: string): Socket;
};

enum AppVariant {
	Production,
	Localhost,
}

export type Keys = {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
	e: boolean;
	r: boolean;
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
	private appVariant: AppVariant;
	private keys: Keys = {
		w: false,
		a: false,
		s: false,
		d: false,
		e: false,
		r: false,
	};
	private mouse: Mouse = {
		x: 0,
		y: 0,
		left: false,
		middle: false,
		right: false,
	};
	private touch = {
		aimController: {
			lastTime: 0,
		},
	};

	private playerAngle: number = 0;

	private constructor() {
		this.appVariant = window.location.hostname === 'localhost' ? AppVariant.Localhost : AppVariant.Production;
		this.myHtmlElements = new MyHtmlElements();
		this.canvas = document.getElementsByTagName('canvas')[0];
		if (this.appVariant === AppVariant.Localhost) {
			this.socket = io.connect('http://localhost:8000');
		} else {
			this.socket = io.connect();
		}
		this.serverClientSync = new ServerClientSync();
		this.editor = new Editor(this.myHtmlElements, this.socket);
		this.model = new Model(this.mouse, this.socket, this.serverClientSync, this.myHtmlElements, this.editor);
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
		this.mobileMoveController();
		this.mobileAimController();
		this.inventoryController();
		this.mobileHitController();

		document.body.addEventListener('touchstart', (event) => {
			event.preventDefault();
		});
	}

	static run(): void {
		if (!Controller.instance) {
			Controller.instance = new Controller();
		} else {
			throw new Error('Only one controller!');
		}
	}

	private changePlayerName(): void {
		const el = this.myHtmlElements;
		let nameOk = false;
		if ((<HTMLInputElement>el.mainMenu.name).value.length) {
			nameOk = true;
			//save name
			localStorage.setItem('playerName', (<HTMLInputElement>el.mainMenu.name).value);
		}
		(<HTMLInputElement>el.mainMenu.create).disabled = !nameOk;
		(<HTMLInputElement>el.mainMenu.maps).disabled = !nameOk;
		let gameExists = false;
		if ((<HTMLInputElement>el.mainMenu.games).value) gameExists = true;
		let joinDisabled = true;
		if (nameOk && gameExists) joinDisabled = false;
		(<HTMLInputElement>el.mainMenu.join).disabled = joinDisabled;
		(<HTMLInputElement>el.mainMenu.games).disabled = joinDisabled;
	}

	private colorController(controllerElement: HTMLElement, active: boolean) {
		let color = 'black';
		let opacity = '0.05';

		if (active) {
			color = 'red';
			opacity = '0.2';
		}

		//controllerElement.style.background = color;
		controllerElement.style.opacity = opacity;
	}

	private socketController(): void {
		const el = this.myHtmlElements;

		this.socket.on('debug', (data: any) => {
			console.log('debug:', data);
		});

		//gameOver
		this.socket.on('winner', (stats: PlayerStats) => {
			this.model.view.gameOver(stats, true);
			stats.win = true;
			this.model.storeStats(stats);
		});

		this.socket.on('loser', (stats: PlayerStats) => {
			this.model.view.gameOver(stats, false);
			stats.die = true;
			this.model.storeStats(stats);
		});

		this.socket.on('stopGame', () => {
			this.model.stop();
		});

		this.socket.on('stopSpectate', (stats: PlayerStats, winnerName) => {
			this.model.view.gameOver(stats, true, winnerName);
		});

		//startGame
		this.socket.on('startGame', (mapData: MapData) => {
			this.model.map.openMap(mapData);
			this.model.gameStart();
			el.close(el.lobbyMenu.main);
			setTimeout(() => {
				el.close(el.hideGame);
			}, 100);
		});

		//playerId
		this.socket.on('playerId', (playerId: number) => {
			this.model.setPlayerId(playerId);
		});

		//createGame
		this.socket.on('createGame', (gameId: number, playerName: string, mapName: string) => {
			this.model.setGameId(gameId);
			el.lobbyMenu.mapName.textContent = mapName;
			el.close(el.mainMenu.main, el.lobbyMenu.forJoinPlayers);
			el.open(el.lobbyMenu.main, el.lobbyMenu.forCreatePlayer);
		});

		//joinGame
		this.socket.on('joinGame', (gameId: number, playerName: string, mapName: string) => {
			this.model.setGameId(gameId);
			el.lobbyMenu.mapName.textContent = mapName;
			el.close(el.mainMenu.main, el.lobbyMenu.forCreatePlayer);
			el.open(el.lobbyMenu.main, el.lobbyMenu.forJoinPlayers);
		});

		//leave lobby
		this.socket.on('leaveLobby', () => {
			this.model.setGameId(-1);
			el.close(el.lobbyMenu.main);
			el.open(el.mainMenu.main);
		});

		//cancel lobby
		this.socket.on('cancelLobby', () => {
			this.model.setGameId(-1);
			el.close(el.lobbyMenu.main);
			el.open(el.gameCanceledMenu.main);
		});

		//updateListOpenGames
		this.socket.on('updateListOpenGames', (openGames: OpenGame[]) => {
			el.mainMenu.games.innerHTML = '';
			for (const openGame of openGames) {
				const option = document.createElement('option');
				option.textContent = openGame.name + "'s game";
				option.setAttribute('value', openGame.index.toString());
				el.mainMenu.games.appendChild(option);
			}

			if (openGames.length && (<HTMLInputElement>el.mainMenu.name).value.length) {
				(<HTMLInputElement>el.mainMenu.games).disabled = false;
				(<HTMLInputElement>el.mainMenu.join).disabled = false;
			} else {
				(<HTMLInputElement>el.mainMenu.games).disabled = true;
				(<HTMLInputElement>el.mainMenu.join).disabled = true;
			}
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

		//map saved
		this.socket.on('mapSaved', () => {
			el.close(el.mapEditorMenu.main, el.editor.container);
			el.open(el.saveMapMenu.main);
			this.editor.close();
		});

		//uodate listOfMaps
		this.socket.on('listOfMaps', (maps: string[]) => {
			el.openMapMenu.maps.innerHTML = '';
			el.mainMenu.maps.innerHTML = '';
			for (const map of maps) {
				const option = document.createElement('option');
				option.setAttribute('value', map);
				option.textContent = map;
				el.mainMenu.maps.appendChild(option);
				const optionCopy = option.cloneNode(true);
				el.openMapMenu.maps.appendChild(optionCopy);
			}
		});

		this.socket.on('createPlayer', (name: string) => {
			if (name) {
				this.model.setName(name);
			} else {
				console.log('err: created player');
			}
		});

		//sync
		this.socket.on('serverClientSync', (clientDateNow, serverDateNow) => {
			const timeNow = Date.now();
			const ping = timeNow - clientDateNow;
			console.log('serverClientSync ping:', ping);
			const timeDiferenceClientServer = serverDateNow - (timeNow - ping / 2);
			this.serverClientSync.addData(ping, timeDiferenceClientServer);
		});

		//u === update positions
		this.socket.on('u', (snapshot: Snapshot) => {
			this.model.snapshotManager.addSnapshot(snapshot);
		});
	}
	private inventoryController(): void {
		const el = this.myHtmlElements;

		el.mobileActionController.addEventListener('touchend', (event) => {
			// e action
			this.socket.emit('c', this.model.getGameId(), 'e');
		});

		el.items.item1.addEventListener('touchend', (event: Event) => {
			this.socket.emit('i', this.model.getGameId(), 1, true);
		});

		el.items.item2.addEventListener('touchend', (event: Event) => {
			this.socket.emit('i', this.model.getGameId(), 2, true);
		});

		el.items.item3.addEventListener('touchend', (event: Event) => {
			this.socket.emit('i', this.model.getGameId(), 3);
		});

		el.items.item4.addEventListener('touchend', (event: Event) => {
			this.socket.emit('i', this.model.getGameId(), 4);
		});

		el.items.item5.addEventListener('touchend', (event: Event) => {
			event.preventDefault();
			this.socket.emit('i', this.model.getGameId(), 5);
		});
	}

	private mobileHitController() {
		const el = this.myHtmlElements;

		const mobileHitController = el.mobileHitController;

		let touchstartTime = Date.now();

		mobileHitController.addEventListener('touchstart', (event: TouchEvent) => {
			touchstartTime = Date.now();
			if (!el.items.item4.classList.contains('active')) {
				this.socket.emit('m', this.model.getGameId(), 'l', { x: 0, y: 0 });
			}
		});

		mobileHitController.addEventListener('touchend', (event: TouchEvent) => {
			if (el.items.item4.classList.contains('active')) {
				const touchendDelay = Date.now() - touchstartTime;
				this.socket.emit('m', this.model.getGameId(), 'l', { x: 0, y: 0 }, touchendDelay);
			}
			setTimeout(() => {
				this.socket.emit('m', this.model.getGameId(), '-l');
			}, 16);
		});
	}

	private mobileMoveController(): void {
		const mobileMoveController = this.myHtmlElements.mobileMoveController;

		const touchToKeys = {
			a: false,
			d: false,
			w: false,
			s: false,
		};

		const touchAimStart = {
			x: 0,
			y: 0,
		};
		const touchAimShift = {
			x: 0,
			y: 0,
		};

		const touchMoveStart = {
			x: 0,
			y: 0,
		};
		const touchMoveShift = {
			x: 0,
			y: 0,
		};

		/*

				mobileMoveController.addEventListener('touchstart', (event: TouchEvent) => {
			event.preventDefault();
			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX < event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}
			//console.log('touchstart', event);
			touchAimStart.x = event.touches[fingerNumber].clientX;
			touchAimStart.y = event.touches[fingerNumber].clientY;
		});
		mobileMoveController.addEventListener('touchmove', (event) => {
			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX < event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}

			touchToKeys.a = false;
			touchToKeys.w = false;
			touchToKeys.s = false;
			touchToKeys.d = false;

			//console.log('touchmove', event);
			touchShift.x = event.touches[fingerNumber].clientX - touchStart.x;
			touchShift.y = event.touches[fingerNumber].clientY - touchStart.y;
			//console.log('touchShift', touchShift);

			mobileMoveController.style.left = touchShift.x + 'px';
			mobileMoveController.style.top = touchShift.y + 'px';

			const minShift = 20;
			if (touchShift.x > minShift) touchToKeys.d = true;
			if (touchShift.x < minShift * -1) touchToKeys.a = true;
			if (touchShift.y > minShift) touchToKeys.s = true;
			if (touchShift.y < minShift * -1) touchToKeys.w = true;

			if (touchToKeys.w && !this.keys.w) {
				this.socket.emit('c', this.model.getGameId(), 'u');
				this.keys.w = true;
			}

			if (!touchToKeys.w && this.keys.w) {
				this.socket.emit('c', this.model.getGameId(), '-u');
				this.keys.w = false;
			}

			if (touchToKeys.s && !this.keys.s) {
				this.socket.emit('c', this.model.getGameId(), 'd');
				this.keys.s = true;
			}

			if (!touchToKeys.s && this.keys.s) {
				this.socket.emit('c', this.model.getGameId(), '-d');
				this.keys.s = false;
			}

			if (touchToKeys.a && !this.keys.a) {
				this.socket.emit('c', this.model.getGameId(), 'l');
				this.keys.a = true;
			}

			if (!touchToKeys.a && this.keys.a) {
				this.socket.emit('c', this.model.getGameId(), '-l');
				this.keys.a = false;
			}

			if (touchToKeys.d && !this.keys.d) {
				this.socket.emit('c', this.model.getGameId(), 'r');
				this.keys.d = true;
			}

			if (!touchToKeys.d && this.keys.d) {
				this.socket.emit('c', this.model.getGameId(), '-r');
				this.keys.d = false;
			}
		});

		mobileMoveController.addEventListener('touchend', (event) => {
			//console.log('touchend', event);
			touchAimShift.x = 0;
			touchAimShift.y = 0;
			mobileMoveController.style.left = '0';
			mobileMoveController.style.top = '0';
			//console.log('touchShift', touchShift);
			this.socket.emit('c', this.model.getGameId(), '-u');
			this.socket.emit('c', this.model.getGameId(), '-d');
			this.socket.emit('c', this.model.getGameId(), '-r');
			this.socket.emit('c', this.model.getGameId(), '-l');
		});
		*/

		mobileMoveController.addEventListener('touchstart', (event: TouchEvent) => {
			event.preventDefault();
			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX < event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}
			//console.log('touchstart', event);
			touchAimStart.x = event.touches[fingerNumber].clientX;
			touchAimStart.y = event.touches[fingerNumber].clientY;

			touchMoveStart.x = event.touches[fingerNumber].clientX;
			touchMoveStart.y = event.touches[fingerNumber].clientY;
		});

		let lastSendAngle = 0;

		mobileMoveController.addEventListener('touchmove', (event) => {
			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX < event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}

			touchMoveShift.x = event.touches[fingerNumber].clientX - touchMoveStart.x;
			touchMoveShift.y = event.touches[fingerNumber].clientY - touchMoveStart.y;

			const maxControllerShift = 15;
			/*
			let controllerShiftX = touchMoveShift.x;
			let controllerShiftY = touchMoveShift.y;

			if (touchMoveShift.x > maxControllerShift) controllerShiftX = maxControllerShift;
			if (touchMoveShift.x < maxControllerShift * -1) controllerShiftX = maxControllerShift * -1;
			if (touchMoveShift.y > maxControllerShift) controllerShiftY = maxControllerShift;
			if (touchMoveShift.y < maxControllerShift * -1) controllerShiftY = maxControllerShift * -1;
			*/

			const angle = this.getAngleFromCombatController(touchMoveShift);
			const touchShiftZ = Math.sqrt(touchMoveShift.x * touchMoveShift.x + touchMoveShift.y * touchMoveShift.y);
			let controllerShiftZ = touchShiftZ;
			if (controllerShiftZ > maxControllerShift) controllerShiftZ = maxControllerShift;

			const controllerShiftX = Math.sin((angle * Math.PI) / 180) * controllerShiftZ;
			const controllerShiftY = Math.cos((angle * Math.PI) / 180) * controllerShiftZ * -1;

			mobileMoveController.style.left = controllerShiftX + 'px';
			mobileMoveController.style.top = controllerShiftY + 'px';

			if (touchShiftZ > maxControllerShift) {
				this.colorController(mobileMoveController, true);
				if (lastSendAngle !== angle) {
					// send
					//console.log(angle);
					this.socket.emit('moveAngle', this.model.getGameId(), true, angle);
					lastSendAngle = angle;
				}
			} else {
				this.colorController(mobileMoveController, false);
				this.socket.emit('moveAngle', this.model.getGameId(), false);
			}
			const minDelayFromAim = 500;
			if (Date.now() - this.touch.aimController.lastTime > minDelayFromAim) {
				this.socket.emit('a', this.model.getGameId(), angle);
			}
		});

		mobileMoveController.addEventListener('touchend', (event) => {
			//console.log('touchend', event);
			this.colorController(mobileMoveController, false);
			touchAimShift.x = 0;
			touchAimShift.y = 0;
			mobileMoveController.style.left = '0';
			mobileMoveController.style.top = '0';
			this.socket.emit('moveAngle', this.model.getGameId(), false);
			//console.log('touchShift', touchShift);
			/*
			this.socket.emit('c', this.model.getGameId(), '-u');
			this.socket.emit('c', this.model.getGameId(), '-d');
			this.socket.emit('c', this.model.getGameId(), '-r');
			this.socket.emit('c', this.model.getGameId(), '-l');
			*/
		});
	}

	private mobileAimController(): void {
		const el = this.myHtmlElements;
		const mobileAimController = el.mobileAimController;

		const touchStart = {
			x: 0,
			y: 0,
		};
		const touchShift = {
			x: 0,
			y: 0,
		};

		let touchstartTime = Date.now();
		let triggerReady = false;
		mobileAimController.addEventListener('touchstart', (event: TouchEvent) => {
			event.preventDefault();

			triggerReady = true;

			//event.preventDefault();
			touchstartTime = Date.now();

			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX > event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}

			touchStart.x = event.touches[fingerNumber].clientX;
			touchStart.y = event.touches[fingerNumber].clientY;
		});

		const minDelayBetweenCombats = 200;
		let lastCombatTime = Date.now();

		mobileAimController.addEventListener('touchmove', (event) => {
			let fingerNumber = 0;
			if (event.touches[0] && event.touches[1]) {
				if (event.touches[1].clientX > event.touches[0].clientX) {
					fingerNumber = 1;
				}
			}

			this.touch.aimController.lastTime = Date.now();

			touchShift.x = event.touches[fingerNumber].clientX - touchStart.x;
			touchShift.y = event.touches[fingerNumber].clientY - touchStart.y;

			const previousPlayerAngle = this.playerAngle;
			this.playerAngle = this.getAngleFromCombatController(touchShift);
			//change
			if (this.playerAngle !== previousPlayerAngle) {
				this.socket.emit('a', this.model.getGameId(), this.playerAngle);
			}

			const maxControllerShift = 15;

			const touchShiftZ = Math.sqrt(touchShift.x * touchShift.x + touchShift.y * touchShift.y);
			let controllerShiftZ = touchShiftZ;
			if (controllerShiftZ > maxControllerShift) controllerShiftZ = maxControllerShift;

			const controllerShiftX = Math.sin((this.playerAngle * Math.PI) / 180) * controllerShiftZ;
			const controllerShiftY = Math.cos((this.playerAngle * Math.PI) / 180) * controllerShiftZ * -1;

			mobileAimController.style.left = controllerShiftX + 'px';
			mobileAimController.style.top = controllerShiftY + 'px';

			const shiftDistance = Math.sqrt(touchShift.x * touchShift.x + touchShift.y * touchShift.y);
			if (shiftDistance > maxControllerShift) {
				if (!this.model.gameActive()) return;
				triggerReady = true;

				this.colorController(mobileAimController, true);

				const now = Date.now();

				const myPlayer = this.model.snapshotManager.getMyPlayer(this.model.playerId);
				if (
					myPlayer &&
					(myPlayer.getWeapon() === Weapon.Rifle ||
						myPlayer.getWeapon() === Weapon.Shotgun ||
						myPlayer.getWeapon() === Weapon.Granade ||
						myPlayer.getWeapon() === Weapon.Smoke)
				) {
					return;
				}

				if (now > lastCombatTime + minDelayBetweenCombats) {
					lastCombatTime = now;
				} else return;

				if (!el.items.item4.classList.contains('active')) {
					//this.mouse.left = true;
					const clickPoint = new Point(0, 0);
					const serverPosition = this.model.view.calculateServerPosition(clickPoint);
					this.socket.emit('m', this.model.getGameId(), 'l', serverPosition);
				}
			} else {
				if (!this.model.gameActive()) return;
				triggerReady = false;
				this.colorController(mobileAimController, false);
				//this.mouse.left = true;
				this.socket.emit('m', this.model.getGameId(), '-l');
			}
		});

		mobileAimController.addEventListener('touchend', (event) => {
			//console.log('touchend', event);
			touchShift.x = 0;
			touchShift.y = 0;
			mobileAimController.style.left = '0';
			mobileAimController.style.top = '0';
			this.colorController(mobileAimController, false);

			if (!this.model.gameActive()) return;

			const myPlayer = this.model.snapshotManager.getMyPlayer(this.model.playerId);
			if (
				myPlayer &&
				triggerReady &&
				(myPlayer.getWeapon() === Weapon.Rifle ||
					myPlayer.getWeapon() === Weapon.Shotgun ||
					myPlayer.getWeapon() === Weapon.Granade ||
					myPlayer.getWeapon() === Weapon.Smoke)
			) {
				if (el.items.item4.classList.contains('active')) {
					const touchendDelay = Date.now() - touchstartTime;
					console.log('touchendDelay', touchendDelay);
					this.socket.emit('m', this.model.getGameId(), 'l', { x: 0, y: 0 }, touchendDelay);
				} else {
					this.socket.emit('m', this.model.getGameId(), 'l');
				}

				setTimeout(() => {
					this.socket.emit('m', this.model.getGameId(), '-l');
				}, 16);
				return;
			}

			//this.mouse.left = true;
			this.socket.emit('m', this.model.getGameId(), '-l');
		});
	}

	private mouseController(): void {
		//deny right click menu
		document.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});
		//deny middle button
		document.addEventListener('mousedown', function (e) {
			if (e.which === 2) e.preventDefault();
		});

		//player angle
		this.myHtmlElements.transparentLayer.addEventListener('mousemove', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			if (e.x == undefined) {
				this.mouse.x = this.canvas.width / 2;
				this.mouse.y = this.canvas.height / 2;
			} else {
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

		this.myHtmlElements.transparentLayer.addEventListener('mousedown', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			this.mouse.left = true;
			const clickPoint = new Point(e.clientX, e.clientY);
			const serverPosition = this.model.view.calculateServerPosition(clickPoint);
			this.socket.emit('m', this.model.getGameId(), 'l', serverPosition);
		});

		/*
		this.myHtmlElements.transparentLayer.addEventListener('touchstart', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			this.mouse.left = true;
			const clickPoint = new Point(e.clientX, e.clientY);
			const serverPosition = this.model.view.calculateServerPosition(clickPoint);
			this.socket.emit('m', this.model.getGameId(), 'l', serverPosition);
		});
		*/

		this.myHtmlElements.transparentLayer.addEventListener('mouseup', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			this.mouse.left = false;
			this.socket.emit('m', this.model.getGameId(), '-l');
		});

		this.myHtmlElements.transparentLayer.addEventListener('touchend', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			this.mouse.left = false;
			this.socket.emit('m', this.model.getGameId(), '-l');
		});

		this.myHtmlElements.transparentLayer.addEventListener('wheel', (e: any) => {
			if (!this.model.gameActive()) return;
			const wheelDirection = e.deltaY < 0 ? -1 : 1;
			if (this.model.spectate) this.socket.emit('wheelChangeSpectate', this.model.getGameId(), wheelDirection);
			else this.socket.emit('wheelChangeInventory', this.model.getGameId(), wheelDirection);
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
		let angle = Math.abs((Math.atan(x / y) * 180) / Math.PI);
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

	private getAngleFromCombatController(shiftPosition: Point): number {
		//atangens
		let angle = Math.abs((Math.atan(shiftPosition.x / shiftPosition.y) * 180) / Math.PI);
		//1..2..3..4.. Q; 0 - 90, 90 - 180...
		//1

		//2
		if (shiftPosition.x >= 0 && shiftPosition.y >= 0) {
			angle = 90 + 90 - angle;
		}
		//3
		if (shiftPosition.x < 0 && shiftPosition.y >= 0) {
			angle = 180 + angle;
		}
		//4
		if (shiftPosition.x < 0 && shiftPosition.y < 0) {
			angle = 270 + 90 - angle;
		}

		angle = Math.round(angle);
		if (angle === 360) angle = 0;

		return angle;
	}

	private keysController(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			//esc
			if (e.which === 27) {
				if (this.model.gameActive() || this.model.getSpectate()) {
					this.myHtmlElements.escFromGameMenu.main.style.display = 'block';
				}
			}
			if (!this.model.gameActive()) return;
			//w
			switch (e.which) {
				case 87:
					if (!this.keys.w) this.socket.emit('c', this.model.getGameId(), 'u');
					this.keys.w = true;
					break;
				//a
				case 65:
					if (!this.keys.a) this.socket.emit('c', this.model.getGameId(), 'l');
					this.keys.a = true;
					break;
				//s
				case 83:
					if (!this.keys.s) this.socket.emit('c', this.model.getGameId(), 'd');
					this.keys.s = true;

					break;
				//d
				case 68:
					if (!this.keys.d) this.socket.emit('c', this.model.getGameId(), 'r');
					this.keys.d = true;
					break;
				//e
				case 69:
					if (!this.keys.e) this.socket.emit('c', this.model.getGameId(), 'e');
					this.keys.e = true;
					break;
				//r
				case 82:
					if (!this.keys.e) this.socket.emit('c', this.model.getGameId(), 're');
					this.keys.r = true;
					break;
				//0
				case 48:
					this.socket.emit('i', this.model.getGameId(), 0);
					break;
				//1
				case 49:
					this.socket.emit('i', this.model.getGameId(), 1);
					break;
				//2
				case 50:
					this.socket.emit('i', this.model.getGameId(), 2);
					break;
				//3
				case 51:
					this.socket.emit('i', this.model.getGameId(), 3);
					break;
				//4
				case 52:
					this.socket.emit('i', this.model.getGameId(), 4);
					break;
				//5
				case 53:
					this.socket.emit('i', this.model.getGameId(), 5);
					break;
				//6
				case 54:
					this.socket.emit('i', this.model.getGameId(), 6);
					break;
				//7
				case 55:
					this.socket.emit('i', this.model.getGameId(), 7);
					break;
				//8
				case 56:
					this.socket.emit('i', this.model.getGameId(), 8);
					break;
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			if (!this.model.gameActive()) return;
			switch (e.which) {
				//w
				case 87:
					if (this.keys.w) this.socket.emit('c', this.model.getGameId(), '-u');
					this.keys.w = false;
					break;
				//a
				case 65:
					if (this.keys.a) this.socket.emit('c', this.model.getGameId(), '-l');
					this.keys.a = false;
					break;
				//s
				case 83:
					if (this.keys.s) this.socket.emit('c', this.model.getGameId(), '-d');
					this.keys.s = false;
					break;
				//d
				case 68:
					if (this.keys.d) this.socket.emit('c', this.model.getGameId(), '-r');
					this.keys.d = false;
					break;
				//e
				case 69:
					this.keys.e = false;
					break;
				//r
				case 82:
					this.keys.r = false;
					break;
				//q
				/*
				case 81:
					this.socket.emit('changeSpectate', this.model.getGameId());
					break;
					*/
			}
		});
	}

	private menuController(): void {
		const el = this.myHtmlElements;

		//load player name
		if (localStorage.getItem('playerName')) {
			(<HTMLInputElement>el.mainMenu.name).value = localStorage.getItem('playerName');
			this.changePlayerName();
		}

		//+++++++++++++ ESC MENU
		el.escFromGameMenu.back.addEventListener('click', () => {
			el.escFromGameMenu.main.style.display = 'none';
		});

		el.escFromGameMenu.leave.addEventListener('click', () => {
			el.escFromGameMenu.main.style.display = 'none';
			this.socket.emit('leaveGame', this.model.getGameId());
			this.model.reset();
		});

		//+++++++++++++ GAME OVER MENU
		el.gameOverMenu.back.addEventListener('click', () => {
			this.socket.emit('leaveGame', this.model.getGameId());
			this.model.reset();
		});

		el.gameOverMenu.spectate.addEventListener('click', () => {
			this.socket.emit('spectate', this.model.getGameId());
			el.close(el.gameOverMenu.main);
			this.model.startSpectate();
		});

		//+++++++++++++ MAP SIZE MENU
		//mapSize ok button
		el.mapSizeMenu.ok.addEventListener('click', () => {
			this.editor.changeSize(parseInt((<HTMLInputElement>document.getElementById('mapSizeValue')).value));
			el.open(el.editor.container);
			el.close(el.mapSizeMenu.main);
		});
		//mapSize back button
		el.mapSizeMenu.back.addEventListener('click', () => {
			el.close(el.mapSizeMenu.main);
			if (this.editor.isActive()) {
				el.open(el.mapEditorMenu.main);
			} else {
				el.open(el.mapMenu.main);
			}
		});

		//+++++++++++++ MAP EDITOR MAIN MENU
		//create a new map
		el.mapMenu.create.addEventListener('click', () => {
			this.editor.create();
			el.close(el.mapMenu.main);
			el.open(el.mapSizeMenu.main);
		});
		//open maps
		el.mapMenu.open.addEventListener('click', () => {
			el.close(el.mapMenu.main);
			el.open(el.openMapMenu.main);
		});
		//close mapMenu
		el.mapMenu.back.addEventListener('click', () => {
			el.close(el.mapMenu.main);
			el.open(el.mainMenu.main);
		});

		//+++++++++++++ OPEN MAP MENU
		//back
		el.openMapMenu.back.addEventListener('click', () => {
			el.close(el.openMapMenu.main);
			el.open(el.mapMenu.main);
		});
		//open
		el.openMapMenu.ok.addEventListener('click', () => {
			const mapName = (<HTMLInputElement>el.openMapMenu.maps).value;
			this.socket.emit('openMapInEditor', mapName);
		});
		//+++++++++++++ EDITOR MENU - from editor...
		//open menu
		el.editor.openMenu.addEventListener('click', () => {
			el.open(el.mapEditorMenu.main);
		});
		//back
		el.mapEditorMenu.back.addEventListener('click', () => {
			el.close(el.mapEditorMenu.main);
		});
		//close editor
		el.mapEditorMenu.close.addEventListener('click', () => {
			el.close(el.mapEditorMenu.main, el.editor.container);
			el.open(el.mainMenu.main);
			this.editor.close();
		});
		//save
		el.mapEditorMenu.save.addEventListener('click', () => {
			const mapData = this.editor.getMapData();
			const mapName = (<HTMLInputElement>el.mapEditorMenu.name).value;
			if (this.model.isNameOk(mapName)) {
				this.socket.emit('editorSaveMap', mapName, mapData);
			} else {
				el.open(el.alertMenu.main);
			}
		});
		//change size
		el.mapEditorMenu.changeSize.addEventListener('click', () => {
			el.close(el.mapEditorMenu.main);
			el.open(el.mapSizeMenu.main);
		});

		//+++++++++++++ SAVE MAP MENU
		//return to main menu
		el.saveMapMenu.back.addEventListener('click', () => {
			el.close(el.saveMapMenu.main);
			el.open(el.mainMenu.main);
		});

		el.statsMenu.back.addEventListener('click', () => {
			el.open(el.mainMenu.main);
			el.close(el.statsMenu.main);
		});

		//+++++++++++++ MAIN MENU
		el.mainMenu.stats.addEventListener('click', () => {
			el.open(el.statsMenu.main);
			el.close(el.mainMenu.main);

			let stats: any = localStorage.getItem('stats');
			if (!stats) return;
			stats = JSON.parse(stats);

			let kdColor = stats.kill / stats.die >= 1 ? 'green' : 'red';
			let wlColor = stats.win / stats.lost >= 1 ? 'green' : 'red';

			let statsString = `
				<table>
				<tr><th>Played games:</th><td>${stats.numberOfGames}</td></tr>
				<tr><th>Play time:</th><td>${Math.round((stats.survive / 60 / 60) * 100) / 100}h</td></tr>
				<tr><th>Kill/Dead ratio:</th><th style="color:${kdColor}">${Math.round((stats.kill / stats.die) * 100) / 100}</th></tr>
				<tr><th>Win/Lose ratio:</th><th style="color:${wlColor}">${Math.round((stats.win / stats.lost) * 100) / 100}</th></tr>
				<tr><th>Win:</th><td>${stats.win}</td></tr>
				<tr><th>Lose:</th><td>${stats.lost}</td></tr>
				<tr><th>Kill:</th><td>${stats.kill}</td></tr>
				<tr><th>Die:</th><td>${stats.die}</td></tr>
				<tr><th>Avg survive:</th><td>${Math.round((stats.survive / stats.numberOfGames) * 100) / 100}s</td></tr>
				<tr><th>Avg damage dealt:</th><td>${Math.round(stats.damageDealt / stats.numberOfGames)}</td></tr>
				<tr><th>Avg damage taken:</th><td>${Math.round(stats.damageTaken / stats.numberOfGames)}</td></tr>
				</table>
			`;

			el.statsMenu.content.innerHTML = statsString;
		});

		//open editor menu and close main menu
		el.mainMenu.openEditor.addEventListener('click', () => {
			el.open(el.mapMenu.main);
			el.close(el.mainMenu.main);
		});
		//change player name and allow create game
		el.mainMenu.name.addEventListener('input', () => {
			this.changePlayerName();
		});
		//select game - allow join
		/*
		el.mainMenu.games.addEventListener('change', () => {
			let disabled = true;
			if ((<HTMLInputElement>el.mainMenu.name).value.length) disabled = false;
			let disabled2 = true;
			if ((<HTMLInputElement>el.mainMenu.games).value) disabled2 = false;
			if (!disabled && !disabled2) (<HTMLInputElement>el.mainMenu.join).disabled = false;
		});
		*/
		//create a new game
		el.mainMenu.create.addEventListener('click', () => {
			if ((<HTMLInputElement>el.mainMenu.name).value.length) {
				const playerName = (<HTMLInputElement>el.mainMenu.name).value;
				const selectedMap = (<HTMLInputElement>el.mainMenu.maps).value;
				if (this.model.isNameOk(playerName)) {
					this.socket.emit('createGame', playerName, selectedMap);
				} else {
					el.open(el.alertMenu.main);
				}
			}
		});
		//join
		el.mainMenu.join.addEventListener('click', () => {
			if ((<HTMLInputElement>el.mainMenu.name).value.length && (<HTMLInputElement>el.mainMenu.games).value) {
				const playerName = (<HTMLInputElement>el.mainMenu.name).value;
				const gameIndex = parseInt((<HTMLInputElement>el.mainMenu.games).value);
				if (this.model.isNameOk(playerName)) {
					this.socket.emit('joinGame', playerName, gameIndex);
				} else {
					el.open(el.alertMenu.main);
				}
			}
		});
		//cancel lobby
		el.gameCanceledMenu.back.addEventListener('click', () => {
			el.close(el.gameCanceledMenu.main);
			el.open(el.mainMenu.main);
		});
		//controls
		el.mainMenu.controls.addEventListener('click', () => {
			el.open(el.controlsMenu.main);
			el.close(el.mainMenu.main);
		});
		//+++++++++++++ ALERT MENU
		el.alertMenu.ok.addEventListener('click', () => {
			el.close(el.alertMenu.main);
		});

		//+++++++++++++ LOBBY MENU
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

		//+++++++++++++ CONTROLS MENU
		el.controlsMenu.back.addEventListener('click', () => {
			el.open(el.mainMenu.main);
			el.close(el.controlsMenu.main);
		});
	}
}
