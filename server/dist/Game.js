"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Bullet_1 = require("./Bullet");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
class Game {
    constructor(waterTerrainData, collisionPoints) {
        this.players = [];
        this.bullets = [];
        this.numberOfBullets = 0;
        this.collisionPoints = collisionPoints;
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
        this.players.push(new Player_1.Player(id, name, socket, this.map, this.collisionPoints, this.players));
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
        //move and delete bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.flying()) {
                bullet.move();
                bullet.move();
            }
            else {
                this.bullets.splice(i, 1);
            }
        }
        //player move
        for (const player of this.players) {
            player.move(this.players);
            //hit
            if (player.mouseControll.left) {
                switch (player.getActiveWeapon()) {
                    case Weapon_1.Weapon.Hand:
                        player.hit();
                        break;
                    case Weapon_1.Weapon.Pistol:
                        if (player.pistol.ready()) {
                            this.bullets.push(new Bullet_1.default(++this.numberOfBullets, player, player.pistol, this.map, this.players));
                        }
                        player.mouseControll.left = false;
                        break;
                    case Weapon_1.Weapon.Machinegun:
                        if (player.machinegun.ready()) {
                            this.bullets.push(new Bullet_1.default(++this.numberOfBullets, player, player.machinegun, this.map, this.players));
                        }
                        break;
                    case Weapon_1.Weapon.Shotgun:
                        if (player.shotgun.ready()) {
                            let shotgunSpray = -12;
                            for (let i = 0; i < 7; i++) {
                                shotgunSpray += 3;
                                this.bullets.push(new Bullet_1.default(++this.numberOfBullets, player, player.shotgun, this.map, this.players, shotgunSpray));
                            }
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Rifle:
                        if (player.rifle.ready()) {
                            this.bullets.push(new Bullet_1.default(++this.numberOfBullets, player, player.rifle, this.map, this.players));
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Hammer:
                        if (player.hammer.ready()) {
                            player.hammer.hit();
                            player.mouseControll.left = false;
                        }
                        break;
                }
            }
        }
        this.clientsUpdate();
    }
    clientsUpdate() {
        const dateNow = Date.now();
        //bullets
        const bulletSnapshots = [];
        for (const bullet of this.bullets) {
            bulletSnapshots.push(new BulletSnapshot_1.default(bullet));
        }
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
                p: playerSnapshotArr,
                b: bulletSnapshots
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLHFDQUE4QjtBQUM5QixxQ0FBa0M7QUFDbEMscUNBQWtDO0FBQ2xDLHFEQUE4QztBQUM5QyxxREFBOEM7QUFLOUMsTUFBcUIsSUFBSTtJQU94QixZQUFZLGdCQUFrQyxFQUFFLGVBQWdDO1FBTGhGLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDZixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBSW5DLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVksRUFBRSxNQUF1QjtRQUNqRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2xDLFlBQVk7WUFDWixJQUFJLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNyQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0QsYUFBYTtZQUNiLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3pCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBVyxFQUFVLEVBQUU7b0JBQzFDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDbEMsYUFBYTt3QkFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsRUFBRTs0QkFDL0IsT0FBTyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjtx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