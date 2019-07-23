"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Zone_1 = require("./Zone");
const Granade_1 = require("./Granade");
const Smoke_1 = require("./Smoke");
const SmokeCloud_1 = require("./SmokeCloud");
const Bullet_1 = require("./Bullet");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
const ThrowingObjectSnapshot_1 = require("./ThrowingObjectSnapshot");
const SmokeCloudSnapshot_1 = require("./SmokeCloudSnapshot");
const ZoneSnapshot_1 = require("./ZoneSnapshot");
const RoundObstacle_1 = require("./RoundObstacle");
const RectangleObstacle_1 = require("./RectangleObstacle");
const Point_1 = require("./Point");
const Loot_1 = require("./Loot");
const LootType_1 = require("./LootType");
const LootSnapshot_1 = require("./LootSnapshot");
const Snapshot_1 = require("./Snapshot");
class Game {
    constructor(waterTerrainData, collisionPoints, mapData) {
        this.playerId = 0;
        this.players = [];
        this.bullets = [];
        this.loots = [];
        this.smokeClouds = [];
        this.granades = [];
        this.numberOfBullets = 0;
        this.active = false;
        this.randomPositionAttempts = 0;
        this.maxRandomPositionAttempts = 1000;
        this.collisionPoints = collisionPoints;
        this.mapData = mapData;
        this.map = new Map_1.default(waterTerrainData, mapData);
        this.zone = new Zone_1.default(this.map);
        this.createLoot();
    }
    createLoot() {
        let id = 0;
        for (let i = 0; i < 10; i++) {
            this.loots.push(new Loot_1.default(id++, 300 * i, 300 * i, LootType_1.LootType.Rifle));
        }
    }
    updateListOfPlayers() {
        const list = [];
        for (const player of this.players) {
            list.push(player.name);
        }
        for (const player of this.players) {
            player.socket.emit('listOfPlayers', list);
        }
    }
    isActive() {
        return this.active;
    }
    //player who created this game
    amIGameOwner(socket) {
        return this.players[0].socket === socket;
    }
    cancelGame() {
        for (const player of this.players) {
            player.socket.emit('leaveLobby');
        }
    }
    start(socket) {
        if (this.players.length) {
            //only first player can start game
            if (this.players[0].socket === socket) {
                this.active = true;
                this.zone.start();
                //start clients
                for (const player of this.players) {
                    player.socket.emit('startGame', this.mapData);
                }
            }
        }
    }
    leaveLobby(socket) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            const player = this.players[i];
            if (player.socket === socket) {
                this.players.splice(i, 1);
                this.updateListOfPlayers();
                socket.emit('leaveLobby');
                break;
            }
        }
    }
    createPlayer(name, socket) {
        for (const player of this.players) {
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
                name = uniqueName(2);
            }
        }
        const newPlayer = new Player_1.Player(this.playerId++, name, socket, this.map, this.collisionPoints, this.players);
        this.setRandomPosition(newPlayer);
        this.players.push(newPlayer);
        //send it to the client
        this.updateListOfPlayers();
        //player ID for client
        newPlayer.socket.emit('playerId', newPlayer.id);
        return name;
    }
    /*
    makeID(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 6;
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            id += randomChar;
        }
        return id;
    }
    */
    shuffleFragments(fragments) {
        const shuffleFragments = [];
        while (fragments.length) {
            const randomIndex = Math.floor(Math.random() * fragments.length);
            shuffleFragments.push(fragments[randomIndex]);
            fragments.splice(randomIndex, 1);
        }
        return shuffleFragments;
    }
    setRandomPosition(gameObject) {
        const randomX = Math.floor(Math.random() * (this.map.getSize() - Player_1.Player.size));
        const randomY = Math.floor(Math.random() * (this.map.getSize() - Player_1.Player.size));
        gameObject.setX(randomX);
        gameObject.setY(randomY);
        if (this.randomPositionCollision(gameObject)) {
            this.randomPositionAttempts++;
            if (this.randomPositionAttempts < this.maxRandomPositionAttempts)
                this.setRandomPosition(gameObject);
        }
    }
    randomPositionCollision(gameObject) {
        //walls
        for (const wall of this.map.rectangleObstacles) {
            if (this.isObjectInObject(gameObject, wall))
                return true;
        }
        //rounds
        for (const round of this.map.impassableRoundObstacles) {
            if (this.isObjectInObject(gameObject, round))
                return true;
        }
        //players
        for (const player of this.players) {
            if (this.isObjectInObject(gameObject, player))
                return true;
        }
        return false;
    }
    isObjectInObject(object1, object2) {
        let x1 = 0, y1 = 0, width1 = 0, height1 = 0, x2 = 0, y2 = 0, width2 = 0, height2 = 0;
        //1
        if (object1 instanceof RectangleObstacle_1.default) {
            width1 = object1.width;
            height1 = object1.height;
            x1 = object1.x;
            y1 = object1.y;
        }
        if (object1 instanceof RoundObstacle_1.default) {
            width1 = object1.size;
            height1 = object1.size;
            x1 = object1.x;
            y1 = object1.y;
        }
        if (object1 instanceof Player_1.Player) {
            width1 = Player_1.Player.size;
            height1 = Player_1.Player.size;
            x1 = object1.getX();
            y1 = object1.getY();
        }
        //2
        if (object2 instanceof RectangleObstacle_1.default) {
            width2 = object2.width;
            height2 = object2.height;
            x2 = object2.x;
            y2 = object2.y;
        }
        if (object2 instanceof RoundObstacle_1.default) {
            width2 = object2.size;
            height2 = object2.size;
            x2 = object2.x;
            y2 = object2.y;
        }
        if (object2 instanceof Player_1.Player) {
            width2 = Player_1.Player.size;
            height2 = Player_1.Player.size;
            x2 = object2.getX();
            y2 = object2.getY();
        }
        //object in object
        if (x1 + width1 >= x2 && x1 <= x2 + width2 && y1 + height1 >= y2 && y1 <= y2 + height2) {
            return true;
        }
        else {
            return false;
        }
    }
    loop() {
        //zone move
        this.zone.move();
        //move loot
        for (const loot of this.loots) {
            loot.move();
        }
        //move granades
        for (let i = this.granades.length - 1; i >= 0; i--) {
            const granade = this.granades[i];
            if (!granade.explode()) {
                granade.move();
                granade.tick();
            }
            else {
                //explode
                //create fragments
                if (granade instanceof Granade_1.default) {
                    const shiftAngle = 360 / granade.fragmentCount;
                    const fragments = [];
                    for (let i = 0; i < granade.fragmentCount; i++) {
                        const angle = i * shiftAngle;
                        fragments.push(Bullet_1.default.makeFragment(++this.numberOfBullets, granade, this.map, this.players, angle));
                    }
                    this.bullets = [...this.bullets, ...this.shuffleFragments(fragments)];
                }
                //create smoke clouds
                if (granade instanceof Smoke_1.default) {
                    const shiftAngle = 360 / granade.cloudCount;
                    for (let i = 0; i < granade.cloudCount; i++) {
                        const angle = i * shiftAngle;
                        this.smokeClouds.push(new SmokeCloud_1.default(granade, angle));
                    }
                }
                this.granades.splice(i, 1);
            }
        }
        //move or delete smoke clouds
        for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
            const smokeCloud = this.smokeClouds[i];
            if (smokeCloud.isActive()) {
                smokeCloud.move();
            }
            else {
                this.smokeClouds.splice(i, 1);
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
            player.move();
            //zone damage
            if (!this.zone.isPointIn(new Point_1.default(player.getCenterX(), player.getCenterY()))) {
                player.acceptHit(this.zone.getDamage());
            }
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
                        if (player.hands[1].throwReady()) {
                            player.throw();
                            this.granades.push(new Granade_1.default(player.hands[1], player.mouseControll.x, player.mouseControll.y));
                            player.mouseControll.left = false;
                        }
                        break;
                    case Weapon_1.Weapon.Smoke:
                        if (player.hands[1].throwReady()) {
                            player.throw();
                            this.granades.push(new Smoke_1.default(player.hands[1], player.mouseControll.x, player.mouseControll.y));
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
        //loots
        const lootSnapshots = [];
        for (const loot of this.loots) {
            lootSnapshots.push(new LootSnapshot_1.default(loot));
        }
        //loots  snapshots copy for optimalization
        const lootSnapshotsOptimalization = [];
        for (const loot of this.loots) {
            lootSnapshotsOptimalization.push(new LootSnapshot_1.default(loot));
        }
        //granades
        const granadeSnapshots = [];
        for (const granade of this.granades) {
            granadeSnapshots.push(new ThrowingObjectSnapshot_1.default(granade));
        }
        //bullets
        const bulletSnapshots = [];
        for (const bullet of this.bullets) {
            bulletSnapshots.push(new BulletSnapshot_1.default(bullet));
        }
        //smokes
        const smokeCloudSnapshots = [];
        for (const smokeCloud of this.smokeClouds) {
            smokeCloudSnapshots.push(new SmokeCloudSnapshot_1.default(smokeCloud));
        }
        //zone
        const zoneSnapshot = new ZoneSnapshot_1.default(this.zone);
        const zoneSnapshotOptimalization = new ZoneSnapshot_1.default(this.zone);
        //players snapshots
        const playerSnapshots = [];
        for (const player of this.players) {
            playerSnapshots.push(new PlayerSnapshot_1.default(player));
        }
        //players snapshots copy for optimalization
        let playerSnapshotsOptimalization = [];
        for (const player of this.players) {
            playerSnapshotsOptimalization.push(new PlayerSnapshot_1.default(player));
        }
        //find same values and delete them
        //players
        for (const playerNow of playerSnapshotsOptimalization) {
            if (this.previousSnapshot) {
                for (const playerBefore of this.previousSnapshot.p) {
                    if (playerNow.i === playerBefore.i) {
                        if (playerNow.x === playerBefore.x)
                            delete playerNow.x;
                        if (playerNow.y === playerBefore.y)
                            delete playerNow.y;
                        if (playerNow.a === playerBefore.a)
                            delete playerNow.a;
                        if (playerNow.m === playerBefore.m)
                            delete playerNow.m;
                        if (playerNow.w === playerBefore.w)
                            delete playerNow.w;
                        if (playerNow.size === playerBefore.size)
                            delete playerNow.size;
                        if (playerNow.h[0].size === playerBefore.h[0].size) {
                            delete playerNow.h[0].size;
                            delete playerNow.h[1].size;
                        }
                        if (playerNow.h[0].x === playerBefore.h[0].x &&
                            playerNow.h[0].y === playerBefore.h[0].y &&
                            playerNow.h[1].x === playerBefore.h[1].x &&
                            playerNow.h[1].y === playerBefore.h[1].y) {
                            delete playerNow.h;
                        }
                    }
                }
            }
        }
        //delete empty players snapshots
        for (let i = playerSnapshotsOptimalization.length - 1; i >= 0; i--) {
            const player = playerSnapshotsOptimalization[i];
            if (!player.hasOwnProperty('x') &&
                !player.hasOwnProperty('y') &&
                !player.hasOwnProperty('a') &&
                !player.hasOwnProperty('m') &&
                !player.hasOwnProperty('w') &&
                !player.hasOwnProperty('size') &&
                !player.hasOwnProperty('h')) {
                playerSnapshotsOptimalization.splice(i, 1);
            }
        }
        //loot optimalization
        {
            //find same values and delete them
            for (const lootNow of lootSnapshotsOptimalization) {
                if (this.previousSnapshot) {
                    for (const lootPrevious of this.previousSnapshot.l) {
                        if (lootNow.i === lootPrevious.i) {
                            if (lootNow.x === lootPrevious.x)
                                delete lootNow.x;
                            if (lootNow.y === lootPrevious.y)
                                delete lootNow.y;
                            if (lootNow.type === lootPrevious.type)
                                delete lootNow.type;
                            if (lootNow.size === lootPrevious.size)
                                delete lootNow.size;
                        }
                    }
                }
            }
            //delete empty objects snapshots
            for (let i = lootSnapshotsOptimalization.length - 1; i >= 0; i--) {
                const loot = lootSnapshotsOptimalization[i];
                if (!loot.hasOwnProperty('x') &&
                    !loot.hasOwnProperty('y') &&
                    !loot.hasOwnProperty('size') &&
                    !loot.hasOwnProperty('type')) {
                    lootSnapshotsOptimalization.splice(i, 1);
                }
            }
        }
        //+++++++++++++++++++
        //zone
        if (this.previousSnapshot) {
            if (this.previousSnapshot.z.iR === zoneSnapshot.iR)
                delete zoneSnapshotOptimalization.iR;
            if (this.previousSnapshot.z.iX === zoneSnapshot.iX)
                delete zoneSnapshotOptimalization.iX;
            if (this.previousSnapshot.z.iY === zoneSnapshot.iY)
                delete zoneSnapshotOptimalization.iY;
            if (this.previousSnapshot.z.oR === zoneSnapshot.oR)
                delete zoneSnapshotOptimalization.oR;
            if (this.previousSnapshot.z.oX === zoneSnapshot.oX)
                delete zoneSnapshotOptimalization.oX;
            if (this.previousSnapshot.z.oY === zoneSnapshot.oY)
                delete zoneSnapshotOptimalization.oY;
        }
        //save this snapshot
        this.previousSnapshot = new Snapshot_1.default(dateNow, playerSnapshots, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshot, lootSnapshots);
        //emit
        for (const player of this.players) {
            player.socket.emit('u', new Snapshot_1.default(dateNow, playerSnapshotsOptimalization, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshotOptimalization, lootSnapshotsOptimalization));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUN0QyxxQ0FBOEI7QUFDOUIscUNBQWtDO0FBQ2xDLHFDQUFrQztBQUNsQyxxREFBOEM7QUFDOUMscURBQThDO0FBRzlDLHFFQUE4RDtBQUU5RCw2REFBc0Q7QUFFdEQsaURBQTBDO0FBQzFDLG1EQUE0QztBQUM1QywyREFBb0Q7QUFDcEQsbUNBQTRCO0FBRTVCLGlDQUEwQjtBQUMxQix5Q0FBc0M7QUFDdEMsaURBQTBDO0FBQzFDLHlDQUFrQztBQUVsQyxNQUFxQixJQUFJO0lBaUJ4QixZQUFZLGdCQUFrQyxFQUFFLGVBQWdDLEVBQUUsT0FBZ0I7UUFiMUYsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUM3QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRWYsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLGdCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUNoQyxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQUU1QixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLDJCQUFzQixHQUFXLENBQUMsQ0FBQztRQUNuQyw4QkFBeUIsR0FBVyxJQUFJLENBQUM7UUFHaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJ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S0FBSyxZQUFZLENBQUMsQ0FBQzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELElBQUksU0FBUyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELElBQUksU0FBUyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELElBQUksU0FBUyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsSUFBSTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQ2hFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7NEJBQ25ELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQzNCLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7eUJBQzNCO3dCQUNELElBQ0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDeEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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