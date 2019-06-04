"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Player_1 = require("./Player");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
class Game {
    constructor(waterTerrainData) {
        this.players = [];
        this.map = new Map_1.default(waterTerrainData);
    }
    createPlayer(name, socket) {
        const id = this.makeID();
        for (const player of this.players) {
            //unique ID!
            if (player.id === id) {
                return this.createPlayer(name, socket);
            }
            //unique name
            if (player.name === name) {
                const uniqueName = (num) => {
                    for (const player of this.players) {
                        //unique name
                        if (player.name === name + num) {
                            return uniqueName(num + 1);
                        }
                    }
                    return name + num;
                };
                name = uniqueName(0);
            }
        }
        this.players.push(new Player_1.default(name, id, this.map, socket));
        return id;
    }
    makeID() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 6;
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            id += randomChar;
        }
        return id;
    }
    loop() {
        //move
        for (const player of this.players) {
            player.move();
        }
        const dateNow = Date.now();
        //update for clients
        //players
        for (const player of this.players) {
            const playerSnapshotArr = [];
            //add me
            playerSnapshotArr.push(new PlayerSnapshot_1.default(player));
            //add others
            for (const otherPlayer of this.players) {
                if (otherPlayer != player) {
                    playerSnapshotArr.push(new PlayerSnapshot_1.default(otherPlayer));
                }
            }
            player.socket.emit('u', {
                t: dateNow,
                p: playerSnapshotArr
            });
        }
        //map objects
        for (const wall of this.map.rectangleObstacles) {
            if (wall.getChanged()) {
                wall.nullChanged();
                for (const player of this.players) {
                    player.socket.emit('m', 'w', dateNow, wall.getChangedData());
                }
            }
        }
        for (const round of this.map.impassableRoundObstacles) {
            if (round.getChanged()) {
                round.nullChanged();
                for (const player of this.players) {
                    player.socket.emit('m', 'r', dateNow, round.getChangedData());
                }
            }
        }
        for (const bush of this.map.bushes) {
            if (bush.getChanged()) {
                bush.nullChanged();
                for (const player of this.players) {
                    player.socket.emit('m', 'b', dateNow, bush.getChangedData());
                }
            }
        }
    }
}
exports.default = Game;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLHFDQUE4QjtBQUM5QixxREFBOEM7QUFJOUMsTUFBcUIsSUFBSTtJQUl4QixZQUFZLGdCQUFrQztRQUY5QyxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBR3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVksRUFBRSxNQUF1QjtRQUNqRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2xDLFlBQVk7WUFDWixJQUFJLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNyQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0QsYUFBYTtZQUNiLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3pCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBVyxFQUFVLEVBQUU7b0JBQzFDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDbEMsYUFBYTt3QkFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsRUFBRTs0QkFDL0IsT0FBTyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjtxQkFDRDtvQkFDRCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ25CLENBQUMsQ0FBQztnQkFDRixJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JCO1NBQ0Q7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FB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