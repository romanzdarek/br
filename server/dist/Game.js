"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Granade_1 = require("./Granade");
const Bullet_1 = require("./Bullet");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
const ThrowingObjectSnapshot_1 = require("./ThrowingObjectSnapshot");
class Game {
    constructor(waterTerrainData, collisionPoints) {
        this.players = [];
        this.bullets = [];
        this.granades = [];
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
    shuffleFragments(fragments) {
        const shuffleFragments = [];
        while (fragments.length) {
            const randomIndex = Math.floor(Math.random() * fragments.length);
            shuffleFragments.push(fragments[randomIndex]);
            fragments.splice(randomIndex, 1);
        }
        return shuffleFragments;
    }
    loop() {
        //move granades
        for (let i = this.granades.length - 1; i >= 0; i--) {
            const granade = this.granades[i];
            if (!granade.explode()) {
                granade.move();
                granade.tick();
            }
            else {
                const shiftAngle = 360 / granade.fragmentCount;
                const fragments = [];
                for (let i = 0; i < granade.fragmentCount; i++) {
                    const angle = i * shiftAngle;
                    fragments.push(Bullet_1.default.makeFragment(++this.numberOfBullets, granade, this.map, this.players, angle));
                }
                this.bullets = [...this.bullets, ...this.shuffleFragments(fragments)];
                this.granades.splice(i, 1);
            }
        }
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
                            this.bullets.push(Bullet_1.default.makeBullet(++this.numberOfBullets, player, player.pistol, this.map, this.players));
                        }
                        player.mouseControll.left = false;
                        break;
                    case Weapon_1.Weapon.Machinegun:
                        if (player.machinegun.ready()) {
                            this.bullets.push(Bullet_1.default.makeBullet(++this.numberOfBullets, player, player.machinegun, this.map, this.players));
                        }
                        break;
                    case Weapon_1.Weapon.Shotgun:
                        if (player.shotgun.ready()) {
                            let shotgunSpray = -12;
                            for (let i = 0; i < 7; i++) {
                                shotgunSpray += 3;
                                this.bullets.push(Bullet_1.default.makeBullet(++this.numberOfBullets, player, player.shotgun, this.map, this.players, shotgunSpray));
                            }
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Rifle:
                        if (player.rifle.ready()) {
                            this.bullets.push(Bullet_1.default.makeBullet(++this.numberOfBullets, player, player.rifle, this.map, this.players));
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Hammer:
                        if (player.hammer.ready()) {
                            player.hammer.hit();
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Granade:
                        if (true) {
                            this.granades.push(new Granade_1.default(player.hands[1], player.mouseControll.x, player.mouseControll.y));
                            console.log(this.granades);
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
        //granades
        const granadesSnapshots = [];
        for (const granade of this.granades) {
            granadesSnapshots.push(new ThrowingObjectSnapshot_1.default(granade));
        }
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
                b: bulletSnapshots,
                g: granadesSnapshots
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLHVDQUFnQztBQUNoQyxxQ0FBOEI7QUFDOUIscUNBQWtDO0FBQ2xDLHFDQUFrQztBQUNsQyxxREFBOEM7QUFDOUMscURBQThDO0FBRzlDLHFFQUE4RDtBQUc5RCxNQUFxQixJQUFJO0lBUXhCLFlBQVksZ0JBQWtDLEVBQUUsZUFBZ0M7UUFOaEYsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUNmLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFjLEVBQUUsQ0FBQztRQUN6QixvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUluQyxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFZLEVBQUUsTUFBdUI7UUFDakQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxZQUFZO1lBQ1osSUFBSSxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUN2QztZQUNELGFBQWE7WUFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFO29CQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2xDLGFBQWE7d0JBQ2IsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxHQUFHLEVBQUU7NEJB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