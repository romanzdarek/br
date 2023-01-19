"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const WaterTerrainData_1 = require("./WaterTerrainData");
const CollisionPoints_1 = require("./CollisionPoints");
//node modules
const fs = require("fs");
const path = require("path");
class Model {
    constructor(io) {
        this.games = [];
        this.io = io;
        this.waterTerrainData = new WaterTerrainData_1.default();
        this.collisionPoints = new CollisionPoints_1.default();
        //game loop
        setInterval(() => {
            this.loop();
        }, 1000 / 60);
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
        //dist/maps/
        const levelNames = fs.readdirSync('dist/maps/');
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
        const fullPath = path.resolve('dist/maps/' + mapName + '.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUVoRCxjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QixNQUFxQixLQUFLO0lBTXpCLFlBQVksRUFBbUI7UUFKdEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUszQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM3QyxXQUFXO1FBQ1gsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2QsYUFBYTtRQUNiLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDZixDQUFDO0lBRU8sVUFBVTtRQUNqQixNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJO2dCQUFFLFNBQVM7WUFD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