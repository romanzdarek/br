"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Bullet_1 = require("./Bullet");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
class Game {
    constructor(waterTerrainData) {
        this.players = [];
        this.bullets = [];
        this.numberOfBullets = 0;
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
        this.players.push(new Player_1.Player(name, id, this.map, socket));
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
                            for (let i = 0; i < 6; i++) {
                                this.bullets.push(new Bullet_1.default(++this.numberOfBullets, player, player.shotgun, this.map, this.players));
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
                }
            }
        }
        const dateNow = Date.now();
        //update for clients
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLHFDQUE4QjtBQUM5QixxQ0FBa0M7QUFDbEMscUNBQWtDO0FBQ2xDLHFEQUE4QztBQUM5QyxxREFBOEM7QUFJOUMsTUFBcUIsSUFBSTtJQU14QixZQUFZLGdCQUFrQztRQUo5QyxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUduQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFZLEVBQUUsTUFBdUI7UUFDakQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxZQUFZO1lBQ1osSUFBSSxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUN2QztZQUNELGFBQWE7WUFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFO29CQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2xDLGFBQWE7d0JBQ2IsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxHQUFHLEVBQUU7NEJBQy9CLE9BQU8sVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDM0I7cUJBQ0Q7b0JBQ0QsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUNuQixDQUFD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