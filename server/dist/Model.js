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
        //this.games.push(new Game(this.waterTerrainData, this.collisionPoints));
        setInterval(() => {
            this.loop();
        }, 1000 / 60);
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
        for (const game of this.games) {
            if (game && game.isActive())
                game.loop();
        }
    }
}
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUVoRCxjQUFjO0FBQ2QseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUc3QixNQUFxQixLQUFLO0lBTXpCLFlBQVksRUFBbUI7UUFKdEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUszQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM3Qyx5RUFBeUU7UUFDekUsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ3BCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNsQixNQUFNLGlCQUFpQixHQUFXLGlFQUFpRSxDQUFDO1FBQ3BHLE1BQU0sYUFBYSxHQUFXLEVBQUUsQ0FBQztRQUNqQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksYUFBYSxFQUFFO2dCQUNwRCwyQkFBMkI7Z0JBQzNCLElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDO2dCQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMsSUFBSSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFD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