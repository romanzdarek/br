import View from './View';
import Map from './Map';
import WaterTerrainData from './WaterTerrainData';
import CollisionPoints from './CollisionPoints';
import SnapshotManager from './SnapshotManager';
export default class Model {
    constructor(keys, mouse, socket, serverClientSync, myHtmlElements, editor) {
        this.gameId = -1;
        this.playerId = -1;
        this.bullets = [];
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
        this.view = new View(this.map, this.bullets, this.mouse, this.waterTerrainData, this.serverClientSync, this.myHtmlElements, this.collisionPoints);
        setTimeout(() => {
            this.loop();
        }, 200);
    }
    isNameOk(name) {
        let state = false;
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
        const nameMaxLength = 20;
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
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getGameId() {
        return this.gameId;
    }
    setGameId(gameId) {
        this.gameId = gameId;
    }
    getPlayerId() {
        return this.playerId;
    }
    setPlayerId(playerId) {
        this.playerId = playerId;
    }
    loop() {
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
        this.view.drawGame(this.snapshotManager, this.playerId);
    }
}
//# sourceMappingURL=Model.js.map