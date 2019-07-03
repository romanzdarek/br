"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const Model_1 = require("./Model");
//node modules
const fs = require("fs");
const path = require("path");
class Controller {
    constructor(http) {
        this.io = SocketIO(http);
        this.model = new Model_1.default(this.io);
        this.controll();
    }
    controll() {
        this.io.on('connection', (socket) => {
            console.log(socket.id, 'connect');
            socket.emit('collisionPoints', this.model.collisionPoints.body, this.model.collisionPoints.hand, this.model.collisionPoints.hammer.getAllPoints());
            socket.on('sendMap', () => {
                const fullPath = path.resolve('./dist/maps/mainMap.json');
                if (fs.existsSync(fullPath)) {
                    //je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
                    delete require.cache[fullPath];
                    const map = require(fullPath);
                    socket.emit('sendMap', map);
                }
            });
            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnect');
                //delete player
                for (const game of this.model.games) {
                    for (let i = 0; i < game.players.length; i++) {
                        if (game.players[i].socket == socket) {
                            game.players.splice(i, 1);
                        }
                    }
                }
            });
            //sync
            socket.on('serverClientSync', (clientDateNow) => {
                socket.emit('serverClientSync', clientDateNow, Date.now());
            });
            //create player
            socket.on('createPlayer', (name, game) => {
                if (name && this.model.games[game]) {
                    const id = this.model.games[game].createPlayer(name, socket);
                    socket.emit('createPlayer', id, name);
                }
                else {
                    console.log('Error: createPlayer');
                }
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
            socket.on('editorSaveMap', (data) => {
                console.log(data);
                let map = JSON.stringify(data);
                fs.writeFile('./dist/maps/' + 'mainMap' + '.json', map, (err) => {
                    if (!err) {
                        console.log('level saved');
                    }
                    else {
                        console.log('err: sendLevel:  fs.writeFile', err);
                    }
                });
            });
        });
    }
}
exports.default = Controller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLG1DQUE0QjtBQUU1QixjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QixNQUFxQixVQUFVO0lBSTlCLFlBQVksSUFBUztRQUNwQixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVPLFFBQVE7UUFDZixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUF1QixFQUFFLEVBQUU7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxJQUFJLENBQ1YsaUJBQWlCLEVBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksRUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQ2hELENBQUM7WUFFRixNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM1QiwrSEFBK0g7b0JBQy9ILE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFD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