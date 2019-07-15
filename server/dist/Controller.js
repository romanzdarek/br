"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const Model_1 = require("./Model");
const Editor_1 = require("./Editor");
class Controller {
    constructor(http) {
        this.io = SocketIO(http);
        this.model = new Model_1.default(this.io);
        this.editor = new Editor_1.default();
        this.controll();
    }
    controll() {
        this.io.on('connection', (socket) => {
            console.log(socket.id, 'connect');
            this.model.updateListOpenGames();
            socket.emit('listOfMaps', this.model.getMapNames());
            socket.emit('collisionPoints', this.model.collisionPoints.body, this.model.collisionPoints.hand, this.model.collisionPoints.hammer.getAllPoints());
            //create a new game
            socket.on('createGame', (playerName, mapName) => {
                if (playerName && mapName && this.model.isNameOk(playerName) && this.model.isNameOk(mapName)) {
                    this.model.createGame(playerName, mapName, socket);
                }
                else {
                    console.log('Err: createGame');
                }
            });
            //join
            socket.on('joinGame', (playerName, gameIndex) => {
                if (playerName && this.model.isNameOk(playerName) && gameIndex >= 0 && this.model.games[gameIndex]) {
                    if (!this.model.games[gameIndex].isActive()) {
                        let samePlayerInGame = false;
                        for (const player of this.model.games[gameIndex].players) {
                            if (player.socket === socket)
                                samePlayerInGame = true;
                        }
                        if (!samePlayerInGame) {
                            const playerUniqueName = this.model.games[gameIndex].createPlayer(playerName, socket);
                            socket.emit('createPlayer', playerUniqueName);
                            socket.emit('joinGame', gameIndex, playerUniqueName);
                        }
                    }
                }
                else {
                    console.log('Err: joinGame');
                }
            });
            //leave lobby (join player)
            socket.on('leaveLobby', (gameId) => {
                if (this.model.games[gameId]) {
                    this.model.games[gameId].leaveLobby(socket);
                }
                else {
                    console.log('Err: leaveLobby');
                }
            });
            //cancel lobby (create player)
            socket.on('cancelLobby', (gameId) => {
                if (this.model.games[gameId]) {
                    this.model.cancelGame(gameId, socket);
                }
                else {
                    console.log('Err: cancelLobby');
                }
            });
            //start a new game
            socket.on('startGame', (gameIndex) => {
                if (gameIndex >= 0 && this.model.games[gameIndex]) {
                    this.model.games[gameIndex].start(socket);
                    this.model.updateListOpenGames();
                }
                else {
                    console.log('Err: startGame');
                }
            });
            /*
            socket.on('sendMap', () => {
                const map = this.model.loadMap('mainMap');
                if (map) {
                    socket.emit('sendMap', map);
                }
            });
            */
            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnect');
                //delete player
                for (const game of this.model.games) {
                    if (game) {
                        for (let i = 0; i < game.players.length; i++) {
                            if (game.players[i].socket == socket) {
                                game.players.splice(i, 1);
                            }
                        }
                    }
                }
            });
            //sync
            socket.on('serverClientSync', (clientDateNow) => {
                socket.emit('serverClientSync', clientDateNow, Date.now());
            });
            //create player
            /*
            socket.on('createPlayer', (name: string, game: number) => {
                if (name && this.model.games[game]) {
                    const id = this.model.games[game].createPlayer(name, socket);
                    socket.emit('createPlayer', id, name);
                }
                else {
                    console.log('Error: createPlayer');
                }
            });
            */
            //'c' === controll player
            socket.on('c', (game, key) => {
                if (this.model.games[game] && key) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.keyController(key);
                            return;
                        }
                    }
                }
                console.log('Error: c (controll player)');
            });
            //change angle
            socket.on('a', (game, angle) => {
                if (this.model.games[game] && angle >= 0) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.changeAngle(angle);
                            return;
                        }
                    }
                }
                console.log('Error: a (controll player)');
            });
            //controll mouse
            socket.on('m', (game, mouse, position) => {
                if (this.model.games[game] && mouse) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.mouseController(mouse, position);
                            return;
                        }
                    }
                }
                console.log('Error: m (controll player)');
            });
            //change
            socket.on('i', (game, inventoryIndex) => {
                if (this.model.games[game] && inventoryIndex > -1) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.changeWeapon(inventoryIndex);
                            return;
                        }
                    }
                }
                console.log('Error: i (controll player)');
            });
            //save level from editor
            socket.on('editorSaveMap', (mapName, mapData) => __awaiter(this, void 0, void 0, function* () {
                if (this.model.isNameOk(mapName)) {
                    const saveDone = yield this.editor.saveMap(mapName, mapData);
                    if (saveDone) {
                        this.io.emit('listOfMaps', this.model.getMapNames());
                    }
                    else {
                        console.log('err: save level');
                    }
                }
            }));
            //openMapInEditor
            socket.on('openMapInEditor', (mapName) => {
                if (typeof mapName == 'string' && mapName.length) {
                    const mapData = this.model.loadMap(mapName);
                    if (mapData) {
                        socket.emit('openMapInEditor', mapData);
                    }
                }
            });
        });
    }
}
exports.default = Controller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsbUNBQTRCO0FBRTVCLHFDQUE4QjtBQUU5QixNQUFxQixVQUFVO0lBSzlCLFlBQVksSUFBUztRQUNwQixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRU8sUUFBUTtRQUNmLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUVwRCxNQUFNLENBQUMsSUFBSSxDQUNWLGlCQUFpQixFQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksRUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUNoRCxDQUFDO1lBRUYsbUJBQW1CO1lBQ25CLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBa0IsRUFBRSxP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