import { Keys, Mouse } from './Controller';
import Socket from './Socket';
import View from './View';
import Player from './Player';
import Map from './Map';
import WaterTerrainData from './WaterTerrainData';
import Bullet from './Bullet';
import ServerClientSync from './ServerClientSync';
import { Snapshot } from './Snapshot';
import MyHtmlElements from './MyHtmlElements';
import Editor from './Editor';
import CollisionPoints from './CollisionPoints';
import SnapshotManager from './SnapshotManager';

export default class Model {
	private gameRun: boolean = false;
	private gameId: number = -1;
	private playerId: number = -1;
	private name: string;
	view: View;
	private socket: Socket;
	private waterTerrainData: WaterTerrainData;
	private keys: Keys;
	private mouse: Mouse;
	map: Map;
	private bullets: Bullet[] = [];
	private serverClientSync: ServerClientSync;
	snapshotManager: SnapshotManager;
	private myHtmlElements: MyHtmlElements;
	private editor: Editor;
	collisionPoints: CollisionPoints;

	constructor(
		keys: Keys,
		mouse: Mouse,
		socket: Socket,
		serverClientSync: ServerClientSync,
		myHtmlElements: MyHtmlElements,
		editor: Editor
	) {
		this.socket = socket;
		this.serverClientSync = serverClientSync;
		this.snapshotManager = new SnapshotManager(serverClientSync);
		this.waterTerrainData = new WaterTerrainData();
		this.map = new Map(this.waterTerrainData);
		//this.player = new Player(this.map);
		this.keys = keys;
		this.mouse = mouse;
		this.myHtmlElements = myHtmlElements;
		this.editor = editor;
		this.collisionPoints = new CollisionPoints();
		this.view = new View(
			this.map,
			this.bullets,
			this.mouse,
			this.waterTerrainData,
			this.serverClientSync,
			this.myHtmlElements,
			this.collisionPoints,
			this.snapshotManager
		);
		setTimeout(() => {
			this.loop();
		}, 200);
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
		console.log('playerId:', playerId);
	}

	gameStart(): void {
		this.gameRun = true;
	}

	gameActive(): boolean {
		return this.gameRun;
	}
	private loop(): void {
		//repeat
		requestAnimationFrame(() => {
			this.loop();
		});
		//sync
		if (!this.serverClientSync.ready()) {
			this.socket.emit('serverClientSync', Date.now());
		}
		if (this.editor.isActive()) {
			this.view.drawEditor(this.editor);
		}
		this.snapshotManager.createBetweenSnapshot();
		if (this.gameRun) this.view.drawGame(this.playerId);
	}
}
