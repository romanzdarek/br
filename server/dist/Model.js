"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const WaterTerrainData_1 = require("./WaterTerrainData");
const CollisionPoints_1 = require("./CollisionPoints");
//node modules
const fs = require("fs");
const path = require("path");
const config_1 = require("./config");
const app_1 = require("./app");
class Model {
    constructor(io) {
        this.games = [];
        this.lastLoopTime = Date.now();
        this.io = io;
        this.waterTerrainData = new WaterTerrainData_1.default();
        this.collisionPoints = new CollisionPoints_1.default();
        //game loop
        if (app_1.appVariant === app_1.AppVariant.Production) {
            setInterval(() => {
                this.loop();
            }, 1000 / 60);
        }
        else {
            // because problem with setInterval on windows
            let lastLoopExecutionTime = Date.now();
            const minLoopDelay = 16;
            const loop = () => {
                setImmediate(() => {
                    const now = Date.now();
                    if (now - lastLoopExecutionTime >= minLoopDelay) {
                        //console.log(now - lastLoopExecutionTime);
                        this.loop();
                        lastLoopExecutionTime = now;
                    }
                    loop();
                });
            };
            loop();
        }
        //game closer
        setInterval(() => {
            this.gameCloser();
        }, 1000 * 60);
    }
    gameCloser() {
        const maxOpenLobbyTime = 1000 * 60 * 10;
        const maxActiveGameTime = 1000 * 60 * 10;
        for (let i = this.games.length - 1; i >= 0; i--) {
            const game = this.games[i];
            if (!game)
                continue;
            //lobby
            if (!game.isActive()) {
                //close lobby
                if (Date.now() > game.createTime + maxOpenLobbyTime) {
                    //send info
                    game.cancelGame();
                    //delete game
                    delete this.games[i];
                    this.updateListOpenGames();
                }
            }
            else {
                //active game
                if (Date.now() > game.createTime + maxOpenLobbyTime + maxActiveGameTime) {
                    //send info
                    game.cancelGame();
                    //delete game
                    delete this.games[i];
                }
            }
        }
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
    getMapNames() {
        const levelNames = fs.readdirSync(config_1.config.directory.maps);
        for (let i = 0; i < levelNames.length; i++) {
            const nameLength = levelNames[i].length;
            //cut .json
            levelNames[i] = levelNames[i].substring(0, nameLength - 5);
        }
        return levelNames;
    }
    createGame(playerName, mapName, socket) {
        if (playerName && mapName) {
            const mapData = this.loadMap(mapName);
            if (mapData) {
                const game = new Game_1.default(this.waterTerrainData, this.collisionPoints, mapData, mapName);
                this.games.push(game);
                const gameIndex = this.games.length - 1;
                //create first player
                const playerUniqueName = this.games[gameIndex].createPlayer(playerName, socket);
                socket.emit('createPlayer', playerUniqueName);
                socket.emit('createGame', gameIndex, playerUniqueName, mapName);
                this.updateListOpenGames();
            }
        }
    }
    cancelGame(gameId, socket) {
        console.log('model.cancelGame()', gameId);
        if (this.games[gameId] && this.games[gameId].amIGameOwner(socket)) {
            //send info
            this.games[gameId].cancelGame();
            //delete game
            delete this.games[gameId];
            this.updateListOpenGames();
        }
    }
    updateListOpenGames() {
        const openGames = [];
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i] && !this.games[i].isActive()) {
                //player must exist!
                if (this.games[i].players[0]) {
                    const gameInfo = { index: i, name: this.games[i].players[0].name };
                    openGames.push(gameInfo);
                }
            }
        }
        this.io.emit('updateListOpenGames', openGames);
    }
    loadMap(mapName) {
        const fullPath = path.resolve(config_1.config.directory.maps + mapName + '.json');
        if (fs.existsSync(fullPath)) {
            //je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
            delete require.cache[fullPath];
            const map = require(fullPath);
            return map;
        }
        else {
            console.log('err: loadMap');
            return null;
        }
    }
    loop() {
        const now = Date.now();
        const timeGap = 17;
        const diference = now - this.lastLoopTime;
        if (diference > timeGap) {
            console.error('loop is slow, last time before:', diference);
        }
        this.lastLoopTime = now;
        for (let i = this.games.length - 1; i >= 0; i--) {
            const game = this.games[i];
            if (game && game.isActive()) {
                game.loop();
                //delete game
                if (game.isEnd()) {
                    for (const player of game.players) {
                        if (player.socket) {
                            player.socket.emit('stopGame');
                            player.socket.emit('debug', 'model.loop() stopGame');
                        }
                    }
                    console.log('model.loop() delete game', i);
                    delete this.games[i];
                }
            }
        }
    }
}
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUVoRCxjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBa0M7QUFDbEMsK0JBQStDO0FBRS9DLE1BQXFCLEtBQUs7SUFNekIsWUFBWSxFQUFtQjtRQUp0QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBeUpwQixpQkFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQXBKakMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSwwQkFBZ0IsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDN0MsV0FBVztRQUVYLElBQUksZ0JBQVUsS0FBSyxnQkFBVSxDQUFDLFVBQVUsRUFBRTtZQUN6QyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2Q7YUFBTTtZQUNOLDhDQUE4QztZQUM5QyxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDeEIsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixZQUFZLENBQUMsR0FBRyxFQUFFO29CQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksR0FBRyxHQUFHLHFCQUFxQixJQUFJLFlBQVksRUFBRTt3QkFDaEQsMkNBQTJDO3dCQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1oscUJBQXFCLEdB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