"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Zone_1 = require("./Zone");
const Granade_1 = require("./Granade");
const Smoke_1 = require("./Smoke");
const SmokeCloud_1 = require("./SmokeCloud");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
const ThrowingObjectSnapshot_1 = require("./ThrowingObjectSnapshot");
const SmokeCloudSnapshot_1 = require("./SmokeCloudSnapshot");
const ZoneSnapshot_1 = require("./ZoneSnapshot");
const RoundObstacle_1 = require("./RoundObstacle");
const RectangleObstacle_1 = require("./RectangleObstacle");
const LootSnapshot_1 = require("./LootSnapshot");
const Snapshot_1 = require("./Snapshot");
const Loot_1 = require("./Loot");
const MyPlayerSnapshot_1 = require("./MyPlayerSnapshot");
const PlayerFactory_1 = require("./PlayerFactory");
const BulletFactory_1 = require("./BulletFactory");
class Game {
    constructor(waterTerrainData, collisionPoints, mapData) {
        this.players = [];
        this.bullets = [];
        this.smokeClouds = [];
        this.granades = [];
        this.active = false;
        this.randomPositionAttempts = 0;
        this.maxRandomPositionAttempts = 1000;
        this.collisionPoints = collisionPoints;
        this.mapData = mapData;
        this.map = new Map_1.default(waterTerrainData, mapData);
        this.zone = new Zone_1.default(this.map);
        this.loot = new Loot_1.default();
        this.loot.createMainLootItems();
        this.playerFactory = new PlayerFactory_1.default();
        this.bulletFactory = new BulletFactory_1.default();
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
        const newPlayer = this.playerFactory.create(name, socket, this.map, this.collisionPoints, this.players, this.bullets, this.granades, this.loot, this.bulletFactory);
        this.setRandomPosition(newPlayer);
        this.players.push(newPlayer);
        //send it to the client
        this.updateListOfPlayers();
        //player ID for client
        newPlayer.socket.emit('playerId', newPlayer.id);
        return name;
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
        for (const loot of this.loot.lootItems) {
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
                        fragments.push(this.bulletFactory.createFragment(granade, this.map, this.players, angle));
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
            player.loop();
            //zone damage
            if (!this.zone.playertIn(player)) {
                player.acceptHit(this.zone.getDamage());
            }
        }
        this.clientsUpdate();
    }
    clientsUpdate() {
        const dateNow = Date.now();
        //loots
        const lootSnapshots = [];
        for (const loot of this.loot.lootItems) {
            lootSnapshots.push(new LootSnapshot_1.default(loot));
        }
        //loots  snapshots copy for optimalization
        const lootSnapshotsOptimalization = [];
        for (const loot of this.loot.lootItems) {
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
                        //for deny hands beetween snapshot
                        if ((playerNow.w === Weapon_1.Weapon.Hand ||
                            playerNow.w === Weapon_1.Weapon.Smoke ||
                            playerNow.w === Weapon_1.Weapon.Granade ||
                            playerNow.w === Weapon_1.Weapon.Medkit) &&
                            (playerBefore.w !== Weapon_1.Weapon.Hand &&
                                playerBefore.w !== Weapon_1.Weapon.Smoke &&
                                playerBefore.w !== Weapon_1.Weapon.Granade &&
                                playerBefore.w !== Weapon_1.Weapon.Medkit)) {
                            playerNow.h = 1;
                        }
                        //player
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
                        //hands
                        if (playerNow.hSize === playerBefore.hSize)
                            delete playerNow.hSize;
                        if (playerNow.lX === playerBefore.lX)
                            delete playerNow.lX;
                        if (playerNow.lY === playerBefore.lY)
                            delete playerNow.lY;
                        if (playerNow.rX === playerBefore.rX)
                            delete playerNow.rX;
                        if (playerNow.rY === playerBefore.rY)
                            delete playerNow.rY;
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
                !player.hasOwnProperty('hSize') &&
                !player.hasOwnProperty('lX') &&
                !player.hasOwnProperty('lY') &&
                !player.hasOwnProperty('rX') &&
                !player.hasOwnProperty('rY')) {
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
            const myPlayerSnapshot = new MyPlayerSnapshot_1.default(player);
            const snapshot = new Snapshot_1.default(dateNow, playerSnapshotsOptimalization, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshotOptimalization, lootSnapshotsOptimalization);
            snapshot.i = myPlayerSnapshot;
            player.socket.emit('u', snapshot);
        }
        //delete !active loot
        for (let i = lootSnapshots.length - 1; i >= 0; i--) {
            const loot = lootSnapshots[i];
            if (loot.hasOwnProperty('del')) {
                //from last snapshot
                lootSnapshots.splice(i, 1);
                //from this.loots
                this.loot.lootItems.splice(i, 1);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUV0QyxxQ0FBa0M7QUFDbEMscUNBQWtDO0FBQ2xDLHFEQUE4QztBQUM5QyxxREFBOEM7QUFHOUMscUVBQThEO0FBRTlELDZEQUFzRDtBQUV0RCxpREFBMEM7QUFDMUMsbURBQTRDO0FBQzVDLDJEQUFvRDtBQUdwRCxpREFBMEM7QUFDMUMseUNBQWtDO0FBTWxDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUU1QyxNQUFxQixJQUFJO0lBaUJ4QixZQUFZLGdCQUFrQyxFQUFFLGVBQWdDLEVBQUUsT0FBZ0I7UUFibEcsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUVmLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFdkIsZ0JBQVcsR0FBaUIsRUFBRSxDQUFDO1FBQy9CLGFBQVEsR0FBcUIsRUFBRSxDQUFDO1FBRWhDLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsMkJBQXNCLEdBQVcsQ0FBQyxDQUFDO1FBQ25DLDhCQUF5QixHQUFXLElBQUksQ0FBQztRQUtoRCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHVCQUFhLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksdUJBQWEsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFTyxtQkFBbUI7UUFDMUIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtRQUNELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDMUM7SUFDRixDQUFDO0lBRUQsUUFBUTtRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNwQixDQUFDO0lBRUQsOEJBQThCO0lBQzlCLFlBQVksQ0FBQyxNQUF1QjtRQUNuQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsVUFBVTtRQUNULEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBdUI7UUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUN4QixrQ0FBa0M7WUFDbEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNsQixlQUFlO2dCQUNmLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDOUM7YUFDRDtTQUNEO0lBQ0YsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUF1QjtRQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUIsTUFBTTthQUNOO1NBQ0Q7SUFDRixDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVksRUFBRSxNQUF1QjtRQUNqRCxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbEMsYUFBYTtZQUNiLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3pCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBVyxFQUFVLEVBQUU7b0JBQzFDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDbEMsYUFBYTt3QkFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsRUFBRTs0QkFDL0IsT0FBTyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjtxQkFDRDtvQkFDRCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ25CLENBQUMsQ0FBQztnQkFDRixJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JCO1NBQ0Q7UUFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FDMUMsSUFBSSxFQUNKLE1BQU0sRUFDTixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FDbEIsQ0FBQztRQUNGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3Qix1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0Isc0JBQXNCO1FBQ3RCLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU8sZ0JBQWdCLENBQUMsU0FBbUI7UUFDM0MsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsT0FBTyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ3hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDakM7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQ3pCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxVQUFrQjtRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9FLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QixJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMseUJBQXlCO2dCQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyRztJQUNGLENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxVQUFrQjtRQUNqRCxPQUFPO1FBQ1AsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFO1lBQy9DLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7U0FDekQ7UUFFRCxRQUFRO1FBQ1IsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFO1lBQ3RELElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7U0FDMUQ7UUFFRCxTQUFTO1FBQ1QsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2xDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7U0FDM0Q7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFTyxnQkFBZ0IsQ0FDdkIsT0FBbUQsRUFDbkQsT0FBbUQ7UUFFbkQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUNULEVBQUUsR0FBRyxDQUFDLEVBQ04sTUFBTSxHQUFHLENBQUMsRUFDVixPQUFPLEdBQUcsQ0FBQyxFQUNYLEVBQUUsR0FBRyxDQUFDLEVBQ04sRUFBRSxHQUFHLENBQUMsRUFDTixNQUFNLEdBQUcsQ0FBQyxFQUNWLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDYixHQUFHO1FBQ0gsSUFBSSxPQUFPLFlBQVksMkJBQWlCLEVBQUU7WUFDekMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDdkIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDekIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNmO1FBQ0QsSUFBSSxPQUFPLFlBQVksdUJBQWEsRUFBRTtZQUNyQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN0QixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN2QixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLE9BQU8sWUFBWSxlQUFNLEVBQUU7WUFDOUIsTUFBTSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7WUFDckIsT0FBTyxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7WUFDdEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsR0FBRztRQUNILElBQUksT0FBTyxZQUFZLDJCQUFpQixFQUFFO1lBQ3pDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3pCLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDZjtRQUNELElBQUksT0FBTyxZQUFZLHVCQUFhLEVBQUU7WUFDckMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdkIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNmO1FBQ0QsSUFBSSxPQUFPLFlBQVksZUFBTSxFQUFFO1lBQzlCLE1BQU0sR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3JCLE9BQU8sR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3RCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNwQjtRQUNELGtCQUFrQjtRQUNsQixJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLEVBQUUsR0FBRyxPQUFPLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxFQUFFO1lBQ3ZGLE9BQU8sSUFBSSxDQUFDO1NBQ1o7YUFDSTtZQUNKLE9BQU8sS0FBSyxDQUFDO1NBQ2I7SUFDRixDQUFDO0lBRUQsSUFBSTtRQUNILFdBQVc7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWpCLFdBQVc7UUFDWCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO1FBRUQsZUFBZTtRQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUN2QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2Y7aUJBQ0k7Z0JBQ0osU0FBUztnQkFDVCxrQkFBa0I7Z0JBQ2xCLElBQUksT0FBTyxZQUFZLGlCQUFPLEVBQUU7b0JBQy9CLE1BQU0sVUFBVSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMvQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMvQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO3dCQUM3QixTQUFTLENBQUMsSUFBSSxDQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQ3pFLENBQUM7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBRSxDQUFDO2lCQUN4RTtnQkFDRCxxQkFBcUI7Z0JBQ3JCLElBQUksT0FBTyxZQUFZLGVBQUssRUFBRTtvQkFDN0IsTUFBTSxVQUFVLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO3dCQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3REO2lCQUNEO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMzQjtTQUNEO1FBRUQsNkJBQTZCO1FBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDMUIsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2xCO2lCQUNJO2dCQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM5QjtTQUNEO1FBRUQseUJBQXlCO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDcEIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNkO2lCQUNJO2dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxQjtTQUNEO1FBRUQsYUFBYTtRQUNiLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxhQUFhO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUN4QztTQUNEO1FBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxhQUFhO1FBQ3BCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzQixPQUFPO1FBQ1AsTUFBTSxhQUFhLEdBQW1CLEVBQUUsQ0FBQztRQUN6QyxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3ZDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFDRCwwQ0FBMEM7UUFDMUMsTUFBTSwyQkFBMkIsR0FBbUIsRUFBRSxDQUFDO1FBQ3ZELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdkMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsVUFBVTtRQUNWLE1BQU0sZ0JBQWdCLEdBQTZCLEVBQUUsQ0FBQztRQUN0RCxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDcEMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksZ0NBQXNCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMzRDtRQUVELFNBQVM7UUFDVCxNQUFNLGVBQWUsR0FBcUIsRUFBRSxDQUFDO1FBQzdDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsUUFBUTtRQUNSLE1BQU0sbUJBQW1CLEdBQXlCLEVBQUUsQ0FBQztRQUNyRCxLQUFLLE1BQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDMUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksNEJBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM3RDtRQUVELE1BQU07UUFDTixNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvRCxtQkFBbUI7UUFDbkIsTUFBTSxlQUFlLEdBQXFCLEVBQUUsQ0FBQztRQUM3QyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbEMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNqRDtRQUNELDJDQUEyQztRQUMzQyxJQUFJLDZCQUE2QixHQUFxQixFQUFFLENBQUM7UUFDekQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2xDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxJQUFJLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUVELGtDQUFrQztRQUNsQyxTQUFTO1FBQ1QsS0FBSyxNQUFNLFNBQVMsSUFBSSw2QkFBNkIsRUFBRTtZQUN0RCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDMUIsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFO29CQUNuRCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsRUFBRTt3QkFDbkMsa0NBQWtDO3dCQUNsQyxJQUNDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxlQUFNLENBQUMsSUFBSTs0QkFDM0IsU0FBUyxDQUFDLENBQUMsS0FBSyxlQUFNLENBQUMsS0FBSzs0QkFDNUIsU0FBUyxDQUFDLENBQUMsS0FBSyxlQUFNLENBQUMsT0FBTzs0QkFDOUIsU0FBUyxDQUFDLENBQUMsS0FBSyxlQUFNLENBQUMsTUFBTSxDQUFDOzRCQUMvQixDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssZUFBTSxDQUFDLElBQUk7Z0NBQzlCLFlBQVksQ0FBQyxDQUFDLEtBQUssZUFBTSxDQUFDLEtBQUs7Z0NBQy9CLFlBQVksQ0FBQyxDQUFDLEtBQUssZUFBTSxDQUFDLE9BQU87Z0NBQ2pDLFlBQVksQ0FBQyxDQUFDLEtBQUssZUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUNqQzs0QkFDRCxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDaEI7d0JBRUQsUUFBUTt3QkFDUixJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLElBQUk7NEJBQUUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDO3dCQUNoRSxPQUFPO3dCQUNQLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxZQUFZLENBQUMsS0FBSzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUM7d0JBQ25FLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7cUJBQzFEO2lCQUNEO2FBQ0Q7U0FDRDtRQUNELGdDQUFnQztRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLDZCQUE2QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuRSxNQUFNLE1BQU0sR0FBRyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUNDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFDM0I7Z0JBQ0QsNkJBQTZCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMzQztTQUNEO1FBRUQscUJBQXFCO1FBQ3JCO1lBQ0Msa0NBQWtDO1lBQ2xDLEtBQUssTUFBTSxPQUFPLElBQUksMkJBQTJCLEVBQUU7Z0JBQ2xELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUMxQixLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7d0JBQ25ELElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQyxFQUFFOzRCQUNqQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7Z0NBQUUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNuRCxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7Z0NBQUUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNuRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLElBQUk7Z0NBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDOzRCQUM1RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLElBQUk7Z0NBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDO3lCQUM1RDtxQkFDRDtpQkFDRDthQUNEO1lBQ0QsZ0NBQWdDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsMkJBQTJCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRSxNQUFNLElBQUksR0FBRywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFDQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO29CQUN6QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO29CQUN6QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO29CQUM1QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQzNCO29CQUNELDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3pDO2FBQ0Q7U0FDRDtRQUNELHFCQUFxQjtRQUVyQixNQUFNO1FBQ04sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTtnQkFBRSxPQUFPLDBCQUEwQixDQUFDLEVBQUUsQ0FBQztZQUN6RixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFlBQVksQ0FBQyxFQUFFO2dCQUFFLE9BQU8sMEJBQTBCLENBQUMsRUFBRSxDQUFDO1lBQ3pGLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLEVBQUU7Z0JBQUUsT0FBTywwQkFBMEIsQ0FBQyxFQUFFLENBQUM7WUFDekYsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTtnQkFBRSxPQUFPLDBCQUEwQixDQUFDLEVBQUUsQ0FBQztZQUN6RixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFlBQVksQ0FBQyxFQUFFO2dCQUFFLE9BQU8sMEJBQTBCLENBQUMsRUFBRSxDQUFDO1lBQ3pGLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLEVBQUU7Z0JBQUUsT0FBTywwQkFBMEIsQ0FBQyxFQUFFLENBQUM7U0FDekY7UUFFRCxvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsQ0FDbkMsT0FBTyxFQUNQLGVBQWUsRUFDZixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLG1CQUFtQixFQUNuQixZQUFZLEVBQ1osYUFBYSxDQUNiLENBQUM7UUFFRixNQUFNO1FBQ04sS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2xDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSwwQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RCxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQzVCLE9BQU8sRUFDUCw2QkFBNkIsRUFDN0IsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixtQkFBbUIsRUFDbkIsMEJBQTBCLEVBQzFCLDJCQUEyQixDQUMzQixDQUFDO1lBQ0YsUUFBUSxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEM7UUFFRCxxQkFBcUI7UUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25ELE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQy9CLG9CQUFvQjtnQkFDcEIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLGlCQUFpQjtnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqQztTQUNEO1FBRUQsYUFBYTtRQUNiLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtZQUMvQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RDthQUNEO1NBQ0Q7UUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUU7WUFDdEQsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3ZCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztpQkFDOUQ7YUFDRDtTQUNEO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RDthQUNEO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUFoZkQsdUJBZ2ZDIn0=