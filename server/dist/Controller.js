"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const Model_1 = require("./Model");
const Editor_1 = require("./Editor");
const app_1 = require("./app");
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
            socket.emit('debug', `Server (${app_1.appVariant} variant) connected.`);
            this.model.updateListOpenGames();
            socket.emit('listOfMaps', this.model.getMapNames());
            socket.emit('collisionPoints', this.model.collisionPoints.body, this.model.collisionPoints.hand, 
            /*
            this.model.collisionPoints.maceBlock.getAllPoints(),
            this.model.collisionPoints.swordBlock.getAllPoints(),
            this.model.collisionPoints.halberdBlock.getAllPoints()
            */
            this.model.collisionPoints.mace.getAllPoints(), this.model.collisionPoints.sword.getAllPoints(), this.model.collisionPoints.halberd.getAllPoints());
            //leave game
            socket.on('leaveGame', (gameId) => {
                if (gameId >= 0 && this.model.games[gameId]) {
                    for (const player of this.model.games[gameId].players) {
                        if (player.socket === socket) {
                            player.leaveGame();
                            return;
                        }
                    }
                }
                console.log('Err: leaveGame');
            });
            //spectate
            socket.on('spectate', (gameId) => {
                if (gameId >= 0 && this.model.games[gameId]) {
                    for (const player of this.model.games[gameId].players) {
                        if (player.socket === socket) {
                            player.startSpectate();
                            return;
                        }
                    }
                }
                console.log('Err: spectate');
            });
            //changeSpectate
            socket.on('wheelChangeSpectate', (gameId, direction) => {
                if (gameId >= 0 && this.model.games[gameId]) {
                    for (const player of this.model.games[gameId].players) {
                        if (player.socket === socket) {
                            if (!player.isActive()) {
                                player.changeSpectatePlayer(direction);
                                return;
                            }
                        }
                    }
                }
                console.log('Err: wheelChangeSpectate');
            });
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
                            socket.emit('joinGame', gameIndex, playerUniqueName, this.model.games[gameIndex].mapName);
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
            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnect');
                for (let i = 0; i < this.model.games.length; i++) {
                    if (this.model.games[i]) {
                        const game = this.model.games[i];
                        for (const player of game.players) {
                            if (player.socket == socket) {
                                if (!game.isActive()) {
                                    //cancel lobby
                                    if (player.id === 0)
                                        this.model.cancelGame(i, socket);
                                    //leave lobby
                                    else
                                        game.leaveLobby(socket);
                                }
                                player.leaveGame();
                            }
                        }
                    }
                }
            });
            //sync
            socket.on('serverClientSync', (clientDateNow) => {
                socket.emit('serverClientSync', clientDateNow, Date.now());
            });
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
                console.log('Error: c (controll player)', game, this.model.games[game]);
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
            //move angle
            socket.on('moveAngle', (game, moveState, angle) => {
                if (this.model.games[game]) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            if (moveState) {
                                //player.changeAngle(angle);
                                player.moveAngle(moveState, angle);
                            }
                            else {
                                player.moveAngle(moveState);
                            }
                            return;
                        }
                    }
                }
                console.log('Error: a (controll player)');
            });
            //controll mouse
            socket.on('m', (game, mouse, position, touchendDelay) => {
                if (this.model.games[game] && mouse) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.mouseController(mouse, position, touchendDelay);
                            return;
                        }
                    }
                }
                console.log('Error: m (controll player)');
            });
            //throw item
            socket.on('throwItem', (game, inventoryIndex) => {
                if (this.model.games[game]) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.inventory.throwItemFromInventory(inventoryIndex);
                            return;
                        }
                    }
                }
                console.log('Error: throwItem (controll player)');
            });
            //change item
            socket.on('i', (game, inventoryIndex, reload = false) => {
                if (this.model.games[game] && inventoryIndex > -1) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            if (reload && player.inventory.getActiveItemNumber() === inventoryIndex) {
                                //reload
                                player.keyController('re');
                            }
                            else {
                                player.inventory.changeActiveItem(inventoryIndex);
                            }
                            return;
                        }
                    }
                }
                console.log('Error: i (controll player)');
            });
            //change item
            socket.on('wheelChangeInventory', (game, wheelDirection) => {
                if (this.model.games[game]) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.inventory.changeActiveItemByWheel(wheelDirection);
                            return;
                        }
                    }
                }
                console.log('Error: wheelChangeInventory (controll player)');
            });
            //save map from editor
            socket.on('editorSaveMap', (mapName, mapData) => __awaiter(this, void 0, void 0, function* () {
                if (this.model.isNameOk(mapName) && mapData.size >= 5) {
                    const saveDone = yield this.editor.saveMap(mapName, mapData);
                    if (saveDone) {
                        socket.emit('mapSaved');
                        this.io.emit('listOfMaps', this.model.getMapNames());
                    }
                    else {
                        console.log('err: save level');
                    }
                }
                else {
                    console.log('err: editorSaveMap');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLG1DQUE0QjtBQUU1QixxQ0FBOEI7QUFFOUIsK0JBQW1DO0FBRW5DLE1BQXFCLFVBQVU7SUFLOUIsWUFBWSxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTyxRQUFRO1FBQ2YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBdUIsRUFBRSxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLGdCQUFVLHNCQUFzQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsSUFBSSxDQUNWLGlCQUFpQixFQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUk7WUFFL0I7Ozs7Y0FJRTtZQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxFQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQ2pELENBQUM7WUFFRixZQUFZO1lBQ1osTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM1QyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRTt3QkFDdEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs0QkFDN0IsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUNuQixPQUFPO3lCQUNQO3FCQUNEO2lCQUNEO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILFVBQVU7WUFDVixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzVDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUN0RCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzRCQUM3QixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQ3ZCLE9BQU87eUJBQ1A7cUJBQ0Q7aUJBQ0Q7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztZQUVILGdCQUFnQjtZQUNoQixNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBYyxFQUFFLFNBQWlCLEVBQUUsRUFBRTtnQkFDdEUsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM1QyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRTt3QkFDdEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs0QkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQ0FDdkIsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUN2QyxPQUFPOzZCQUNQO3lCQUNEO3FCQUNEO2lCQUNEO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUVILG1CQUFtQjtZQUNuQixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQWtCLEVBQUUsT0FBZSxFQUFFLEVBQUU7Z0JBQy9ELElBQUksVUFBVSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDN0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDbkQ7cUJBQU07b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUMvQjtZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTTtZQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsVUFBa0IsRUFBRSxTQUFpQixFQUFFLEVBQUU7Z0JBQy9ELElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ25HLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDNUMsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7d0JBQzdCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFOzRCQUN6RCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTTtnQ0FBRSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7eUJBQ3REO3dCQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDdEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzRCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQzFGO3FCQUNEO2lCQUNEO3FCQUFNO29CQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzdCO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCwyQkFBMkI7WUFDM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtnQkFDMUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQy9CO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCw4QkFBOEI7WUFDOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtnQkFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUN0QztxQkFBTTtvQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQ2hDO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxrQkFBa0I7WUFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFpQixFQUFFLEVBQUU7Z0JBQzVDLElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDOUI7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtnQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakMsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOzRCQUNsQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFO2dDQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO29DQUNyQixjQUFjO29DQUNkLElBQUksTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDO3dDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQ0FDdEQsYUFBYTs7d0NBQ1IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQ0FDN0I7Z0NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOzZCQUNuQjt5QkFDRDtxQkFDRDtpQkFDRDtZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTTtZQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7WUFFSCx5QkFBeUI7WUFDekIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFZLEVBQUUsR0FBVyxFQUFFLEVBQUU7Z0JBQzVDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFO29CQUNsQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTt3QkFDcEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs0QkFDN0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDMUIsT0FBTzt5QkFDUDtxQkFDRDtpQkFDRDtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDO1lBRUgsY0FBYztZQUNkLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxFQUFFO2dCQUM5QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7b0JBQ3pDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzRCQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUMxQixPQUFPO3lCQUNQO3FCQUNEO2lCQUNEO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILFlBQVk7WUFDWixNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQVksRUFBRSxTQUFTLEVBQUUsS0FBYyxFQUFFLEVBQUU7Z0JBQ2xFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzRCQUM3QixJQUFJLFNBQVMsRUFBRTtnQ0FDZCw0QkFBNEI7Z0NBQzVCLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOzZCQUNuQztpQ0FBTTtnQ0FDTixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzZCQUM1Qjs0QkFDRCxPQUFPO3lCQUNQO3FCQUNEO2lCQUNEO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILGdCQUFnQjtZQUNoQixNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsUUFBZSxFQUFFLGFBQXFCLEVBQUUsRUFBRTtnQkFDdEYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7b0JBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzRCQUM3QixNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7NEJBQ3ZELE9BQU87eUJBQ1A7cUJBQ0Q7aUJBQ0Q7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWTtZQUNaLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBWSxFQUFFLGNBQXNCLEVBQUUsRUFBRTtnQkFDL0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDM0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7d0JBQ3BELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7NEJBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsY0FBYyxDQUFDLENBQUM7NEJBQ3hELE9BQU87eUJBQ1A7cUJBQ0Q7aUJBQ0Q7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1lBRUgsYUFBYTtZQUNiLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBWSxFQUFFLGNBQXNCLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxFQUFFO2dCQUN2RSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDbEQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7d0JBQ3BELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7NEJBQzdCLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxjQUFjLEVBQUU7Z0NBQ3hFLFFBQVE7Z0NBQ1IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDM0I7aUNBQU07Z0NBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQzs2QkFDbEQ7NEJBRUQsT0FBTzt5QkFDUDtxQkFDRDtpQkFDRDtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxhQUFhO1lBQ2IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLElBQVksRUFBRSxjQUFzQixFQUFFLEVBQUU7Z0JBQzFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO3dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzRCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxDQUFDOzRCQUN6RCxPQUFPO3lCQUNQO3FCQUNEO2lCQUNEO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztZQUVILHNCQUFzQjtZQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFPLE9BQWUsRUFBRSxPQUFnQixFQUFFLEVBQUU7Z0JBQ3RFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7b0JBQ3RELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM3RCxJQUFJLFFBQVEsRUFBRTt3QkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN4QixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO3FCQUNyRDt5QkFBTTt3QkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7cUJBQy9CO2lCQUNEO3FCQUFNO29CQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDbEM7WUFDRixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsaUJBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFlLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtvQkFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVDLElBQUksT0FBTyxFQUFFO3dCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQ3hDO2lCQUNEO1lBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQTVSRCw2QkE0UkMifQ==