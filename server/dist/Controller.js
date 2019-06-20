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
            /**
             *
             * let mapPath = './dist/maps/' + 'mainMap' + '.json';
        if (fs.existsSync(mapPath)) {
            //je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
            const fullPath = path.resolve(mapPath);
            delete require.cache[fullPath];
            const map = require(mapPath);
             */
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
            socket.on('m', (game, mouse) => {
                if (this.model.games[game] && mouse) {
                    for (const player of this.model.games[game].players) {
                        if (player.socket === socket) {
                            player.mouseController(mouse);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLG1DQUE0QjtBQUM1QixjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QixNQUFxQixVQUFVO0lBSTlCLFlBQVksSUFBUztRQUNwQixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVPLFFBQVE7UUFDZixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUF1QixFQUFFLEVBQUU7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRWxDOzs7Ozs7OztlQVFHO1lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUN6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQzFELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDNUIsK0hBQStIO29CQUMvSCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9CLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzVCO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFHLEVB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