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
                const game = new Game_1.default(this.waterTerrainData, this.collisionPoints, mapData);
                this.games.push(game);
                const gameIndex = this.games.length - 1;
                //create first player
                const playerUniqueName = this.games[gameIndex].createPlayer(playerName, socket);
                socket.emit('createPlayer', playerUniqueName);
                socket.emit('createGame', gameIndex, playerUniqueName);
                this.updateListOpenGames();
            }
        }
    }
    cancelGame(gameId, socket) {
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
        for (let i = this.games.length - 1; i >= 0; i--) {
            const game = this.games[i];
            if (game && game.isActive()) {
                game.loop();
                //delete game
                if (game.isEnd()) {
                    for (const player of game.players) {
                        if (player.socket) {
                            player.socket.emit('stopGame');
                        }
                    }
                    delete this.games[i];
                }
            }
        }
    }
}
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUVoRCxjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBa0M7QUFDbEMsK0JBQStDO0FBRS9DLE1BQXFCLEtBQUs7SUFNekIsWUFBWSxFQUFtQjtRQUp0QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBSzNCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMEJBQWdCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzdDLFdBQVc7UUFFWCxJQUFJLGdCQUFVLEtBQUssZ0JBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDekMsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2IsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNkO2FBQU07WUFDTiw4Q0FBOEM7WUFDOUMsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtnQkFDakIsWUFBWSxDQUFDLEdBQUcsRUFBRTtvQkFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUN2QixJQUFJLEdBQUcsR0FBRyxxQkFBcUIsSUFBSSxZQUFZLEVBQUU7d0JBQ2hELDJDQUEyQzt3QkFDM0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNaLHFCQUFxQixHQUFHLEdBQUcsQ0FBQztxQkFDNUI7b0JBQ0QsSUFBSSxFQUFFLENBQUM7Z0JB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