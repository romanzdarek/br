"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./Game");
const WaterTerrainData_1 = require("./WaterTerrainData");
const CollisionPoints_1 = require("./CollisionPoints");
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
    createGame(playerName, socket) {
        const game = new Game_1.default(this.waterTerrainData, this.collisionPoints);
        this.games.push(game);
        const gameIndex = this.games.length - 1;
        //create first player
        const playerUniqueName = this.games[gameIndex].createPlayer(playerName, socket);
        socket.emit('createPlayer', playerUniqueName);
        socket.emit('createGame', gameIndex, playerUniqueName);
        this.updateListOpenGames();
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
    loop() {
        for (const game of this.games) {
            if (game && game.isActive())
                game.loop();
        }
    }
}
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEI7QUFDMUIseURBQWtEO0FBQ2xELHVEQUFnRDtBQUdoRCxNQUFxQixLQUFLO0lBTXpCLFlBQVksRUFBbUI7UUFKdEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUszQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM3Qyx5RUFBeUU7UUFDekUsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUFrQixFQUFFLE1BQXVCO1FBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLHFCQUFxQjtRQUNyQixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYyxFQUFFLE1BQXVCO1FBQ2pELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsRSxXQUFXO1lBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNoQyxhQUFhO1lBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1NBQzNCO0lBQ0YsQ0FBQztJQUVELG1CQUFtQjtRQUNsQixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQy9DLG9CQUFvQjtnQkFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDN0IsTUFBTSxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbkUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDekI7YUFDRDtTQUNEO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLElBQUk7UUFDWCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDOUIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekM7SUFDRixDQUFDO0NBQ0Q7QUF4REQsd0JBd0RDIn0=