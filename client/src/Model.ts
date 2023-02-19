import { Mouse } from './Controller';
import Socket from './Socket';
import View from './View';
import Map from './Map';
import WaterTerrainData from './WaterTerrainData';
import ServerClientSync from './ServerClientSync';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import CollisionPoints from './CollisionPoints';
import SnapshotManager from './SnapshotManager';
import SurroundSound from './SurroundSound';

export default class Model {
	spectate: boolean = false;
	private gameRun: boolean = false;
	private gameId: number = -1;
	private playerId: number = -1;
	private name: string;
	view: View;
	private socket: Socket;
	private waterTerrainData: WaterTerrainData;
	private mouse: Mouse;
	map: Map;
	private serverClientSync: ServerClientSync;
	snapshotManager: SnapshotManager;
	private myHtmlElements: MyHtmlElements;
	private editor: Editor;
	collisionPoints: CollisionPoints;
	private surroundSound: SurroundSound = new SurroundSound();

	constructor(mouse: Mouse, socket: Socket, serverClientSync: ServerClientSync, myHtmlElements: MyHtmlElements, editor: Editor) {
		this.socket = socket;
		this.serverClientSync = serverClientSync;
		this.waterTerrainData = new WaterTerrainData();
		this.map = new Map(this.waterTerrainData);
		this.snapshotManager = new SnapshotManager(serverClientSync, this.map);
		this.mouse = mouse;
		this.myHtmlElements = myHtmlElements;
		this.editor = editor;
		this.collisionPoints = new CollisionPoints();
		this.view = new View(this.map, this.mouse, this.waterTerrainData, this.myHtmlElements, this.collisionPoints, this.snapshotManager);
		setTimeout(() => {
			this.loop();
		}, 200);
	}

	reset(): void {
		const el = this.myHtmlElements;
		el.close(el.gameOverMenu.main);
		el.open(el.mainMenu.main, el.hideGame);
		el.gameOverMenu.stats.innerHTML = '';
		this.gameRun = false;
		this.gameId = -1;
		this.playerId = -1;
		this.map.reset();
		this.snapshotManager.reset();
		this.view.reset();
		this.spectate = false;
		this.serverClientSync.reset();
	}

	stop(): void {
		this.gameRun = false;
	}

	isNameOk(name: string): boolean {
		let state = false;
		const allowedCharacters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
		const nameMaxLength: number = 20;
		if (typeof name === 'string') {
			if (name.length > 0 && name.length <= nameMaxLength) {
				//nepovolené znaky v jménu?
				let notAllowedCharacter = false;
				for (let i = 0; i < name.length; i++) {
					if (allowedCharacters.lastIndexOf(name[i]) === -1) {
						notAllowedCharacter = true;
						break;
					}
				}
				//v jmenu nejsou nepovolene znaky
				if (!notAllowedCharacter) {
					state = true;
				}
			}
		}
		return state;
	}

	startSpectate(): void {
		this.spectate = true;
	}

	getSpectate(): boolean {
		return this.spectate;
	}

	setName(name: string): void {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	getGameId(): number {
		return this.gameId;
	}

	setGameId(gameId: number): void {
		this.gameId = gameId;
	}

	getPlayerId(): number {
		return this.playerId;
	}

	setPlayerId(playerId: number): void {
		this.playerId = playerId;
	}

	gameStart(): void {
		this.gameRun = true;
		this.snapshotManager.reset();
	}

	gameActive(): boolean {
		return this.gameRun;
	}
	private loop(): void {
		//repeat
		requestAnimationFrame(() => {
			this.loop();
		});
		if (this.editor.isActive()) {
			this.view.drawEditor(this.editor);
		}
		//sync
		if (!this.serverClientSync.ready()) {
			if (Math.random() > 0.8) this.socket.emit('serverClientSync', Date.now());
		}
		if (!this.gameRun) return;
		this.snapshotManager.createBetweenSnapshot();
		this.view.drawGame(this.playerId);

		//sounds
		for (const sound of this.snapshotManager.soundsToPlay) {
			const myPlayer = this.snapshotManager.getMyPlayer(this.playerId);
			this.surroundSound.play(myPlayer.getCenterX(), myPlayer.getCenterY(), sound);
		}
		this.snapshotManager.soundsToPlay.splice(0, this.snapshotManager.soundsToPlay.length);
	}
}
