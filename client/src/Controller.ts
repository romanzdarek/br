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
import MapData from './MapData';
import PlayerStats from './PlayerStats';

declare const io: {
	connect(url?: string): Socket;
};

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
	private keys: Keys = {
		w: false,
		a: false,
		s: false,
		d: false,
		e: false,
		r: false
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
		//http://localhost:8080 // 'http://mbr.rostiapp.cz'
		this.socket = io.connect('http://mbr.rostiapp.cz');
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
		//itnetwork
		this.myHtmlElements.itNetwork.addEventListener('click', () => {
			this.myHtmlElements.itNetwork.style.display = 'none';
		});
		setTimeout(() => {
			this.myHtmlElements.itNetwork.style.display = 'none';
		}, 4000);
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

	private socketController(): void {
		const el = this.myHtmlElements;

		//gameOver
		this.socket.on('winner', (stats: PlayerStats) => {
			this.model.view.gameOver(stats, true);
		});

		this.socket.on('loser', (stats: PlayerStats) => {
			this.model.view.gameOver(stats, false);
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
			}
			else {
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
			}
			else {
				console.log('err: created player');
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
			this.model.snapshotManager.addSnapshot(snapshot);
		});
	}

	private mouseController(): void {
		//deny right click menu
		document.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		});
		//deny middle button
		document.addEventListener('mousedown', function(e) {
			if (e.which === 2) e.preventDefault();
		});

		//player angle
		this.myHtmlElements.transparentLayer.addEventListener('mousemove', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
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
		this.myHtmlElements.transparentLayer.addEventListener('mousedown', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
			this.mouse.left = true;
			const clickPoint = new Point(e.clientX, e.clientY);
			const serverPosition = this.model.view.calculateServerPosition(clickPoint);
			this.socket.emit('m', this.model.getGameId(), 'l', serverPosition);
		});
		this.myHtmlElements.transparentLayer.addEventListener('mouseup', (e: MouseEvent) => {
			if (!this.model.gameActive()) return;
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
			}
			else {
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
			}
			else {
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

		//+++++++++++++ MAIN MENU
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
				}
				else {
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
				}
				else {
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
