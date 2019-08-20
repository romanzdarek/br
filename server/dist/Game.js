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
const ObstacleSnapshot_1 = require("./ObstacleSnapshot");
class Game {
    constructor(waterTerrainData, collisionPoints, mapData) {
        this.players = [];
        this.bullets = [];
        this.smokeClouds = [];
        this.granades = [];
        this.active = false;
        this.randomPositionAttempts = 0;
        this.maxRandomPositionAttempts = 1000;
        this.killMessages = [];
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
        const newPlayer = this.playerFactory.create(name, socket, this.map, this.collisionPoints, this.players, this.bullets, this.granades, this.loot, this.bulletFactory, this.killMessages);
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
            loot.move(this.loot.lootItems, this.map);
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
                    this.bullets.push(...this.shuffleFragments(fragments));
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
        //loot snapshots copy for optimalization
        const lootSnapshotsOptimalization = [];
        for (const loot of this.loot.lootItems) {
            lootSnapshotsOptimalization.push(new LootSnapshot_1.default(loot));
        }
        //granades & smokes
        const granadeSnapshots = [];
        for (const granade of this.granades) {
            granadeSnapshots.push(new ThrowingObjectSnapshot_1.default(granade));
        }
        //bullets
        const bulletSnapshots = [];
        for (const bullet of this.bullets) {
            bulletSnapshots.push(new BulletSnapshot_1.default(bullet));
        }
        //smoke clouds
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
                        //for deny create beetween snapshot for hands
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
                        if (playerNow.l === playerBefore.l)
                            delete playerNow.l;
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
                !player.hasOwnProperty('rY') &&
                !player.hasOwnProperty('l')) {
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
            //delete empty loot snapshots
            for (let i = lootSnapshotsOptimalization.length - 1; i >= 0; i--) {
                const loot = lootSnapshotsOptimalization[i];
                if (!loot.hasOwnProperty('x') &&
                    !loot.hasOwnProperty('y') &&
                    !loot.hasOwnProperty('size') &&
                    !loot.hasOwnProperty('type') &&
                    !loot.hasOwnProperty('del')) {
                    lootSnapshotsOptimalization.splice(i, 1);
                }
            }
        }
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
        //change obstacles
        const obstacleSnapshots = [];
        //map objects
        for (const obstacle of this.map.rectangleObstacles) {
            if (obstacle.getChanged()) {
                obstacle.nullChanged();
                obstacleSnapshots.push(new ObstacleSnapshot_1.default(obstacle));
            }
        }
        for (const obstacle of this.map.impassableRoundObstacles) {
            if (obstacle.getChanged()) {
                obstacle.nullChanged();
                obstacleSnapshots.push(new ObstacleSnapshot_1.default(obstacle));
            }
        }
        for (const obstacle of this.map.bushes) {
            if (obstacle.getChanged()) {
                obstacle.nullChanged();
                obstacleSnapshots.push(new ObstacleSnapshot_1.default(obstacle));
            }
        }
        //save this snapshot
        this.previousSnapshot = new Snapshot_1.default(dateNow, playerSnapshots, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshot, lootSnapshots, obstacleSnapshots, [...this.killMessages]);
        //emit changes
        for (const player of this.players) {
            const lastMyPlayerSnapshot = new MyPlayerSnapshot_1.default(player);
            //delete same values
            if (this.previousMyPlayerSnapshots) {
                for (const previousMyPlayerSnapshot of this.previousMyPlayerSnapshots) {
                    if (previousMyPlayerSnapshot.id === lastMyPlayerSnapshot.id) {
                        if (previousMyPlayerSnapshot.h === lastMyPlayerSnapshot.h)
                            delete lastMyPlayerSnapshot.h;
                        if (previousMyPlayerSnapshot.i1 === lastMyPlayerSnapshot.i1)
                            delete lastMyPlayerSnapshot.i1;
                        if (previousMyPlayerSnapshot.i2 === lastMyPlayerSnapshot.i2)
                            delete lastMyPlayerSnapshot.i2;
                        if (previousMyPlayerSnapshot.i3 === lastMyPlayerSnapshot.i3)
                            delete lastMyPlayerSnapshot.i3;
                        if (previousMyPlayerSnapshot.i4 === lastMyPlayerSnapshot.i4)
                            delete lastMyPlayerSnapshot.i4;
                        if (previousMyPlayerSnapshot.i5 === lastMyPlayerSnapshot.i5)
                            delete lastMyPlayerSnapshot.i5;
                        if (previousMyPlayerSnapshot.s4 === lastMyPlayerSnapshot.s4)
                            delete lastMyPlayerSnapshot.s4;
                        if (previousMyPlayerSnapshot.s5 === lastMyPlayerSnapshot.s5)
                            delete lastMyPlayerSnapshot.s5;
                        if (previousMyPlayerSnapshot.r === lastMyPlayerSnapshot.r)
                            delete lastMyPlayerSnapshot.r;
                        if (previousMyPlayerSnapshot.g === lastMyPlayerSnapshot.g)
                            delete lastMyPlayerSnapshot.g;
                        if (previousMyPlayerSnapshot.b === lastMyPlayerSnapshot.b)
                            delete lastMyPlayerSnapshot.b;
                        if (previousMyPlayerSnapshot.o === lastMyPlayerSnapshot.o)
                            delete lastMyPlayerSnapshot.o;
                        if (previousMyPlayerSnapshot.a === lastMyPlayerSnapshot.a)
                            delete lastMyPlayerSnapshot.a;
                        if (previousMyPlayerSnapshot.aM === lastMyPlayerSnapshot.aM)
                            delete lastMyPlayerSnapshot.aM;
                        if (previousMyPlayerSnapshot.s === lastMyPlayerSnapshot.s)
                            delete lastMyPlayerSnapshot.s;
                        if (previousMyPlayerSnapshot.v === lastMyPlayerSnapshot.v)
                            delete lastMyPlayerSnapshot.v;
                        if (previousMyPlayerSnapshot.l === lastMyPlayerSnapshot.l)
                            delete lastMyPlayerSnapshot.l;
                        if (previousMyPlayerSnapshot.lE === lastMyPlayerSnapshot.lE)
                            delete lastMyPlayerSnapshot.lE;
                        if (previousMyPlayerSnapshot.lT === lastMyPlayerSnapshot.lT)
                            delete lastMyPlayerSnapshot.lT;
                    }
                }
            }
            delete lastMyPlayerSnapshot.id;
            const snapshot = new Snapshot_1.default(dateNow, playerSnapshotsOptimalization, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshotOptimalization, lootSnapshotsOptimalization, obstacleSnapshots, [...this.killMessages], lastMyPlayerSnapshot);
            player.socket.emit('u', snapshot);
        }
        //clear messages
        this.killMessages.splice(0, this.killMessages.length);
        //save 'previous' myPlayerSnapshot
        this.previousMyPlayerSnapshots = [];
        for (const player of this.players) {
            this.previousMyPlayerSnapshots.push(new MyPlayerSnapshot_1.default(player));
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
    }
}
exports.default = Game;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUV0QyxxQ0FBa0M7QUFDbEMscUNBQWtDO0FBQ2xDLHFEQUE4QztBQUM5QyxxREFBOEM7QUFHOUMscUVBQThEO0FBRTlELDZEQUFzRDtBQUV0RCxpREFBMEM7QUFDMUMsbURBQTRDO0FBQzVDLDJEQUFvRDtBQUdwRCxpREFBMEM7QUFDMUMseUNBQWtDO0FBTWxDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFFbEQsTUFBcUIsSUFBSTtJQW1CeEIsWUFBWSxnQkFBa0MsRUFBRSxlQUFnQyxFQUFFLE9BQWdCO1FBZmxHLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFZixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXZCLGdCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUVoQyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLDJCQUFzQixHQUFXLENBQUMsQ0FBQztRQUNuQyw4QkFBeUIsR0FBVyxJQUFJLENBQUM7UUFJekMsaUJBQVksR0FBYSxFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxFQUFFLENBQUM7UUFD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QUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3FCQUM1RjtpQkFDRDthQUNEO1lBQ0QsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUM1QixPQUFPLEVBQ1AsNkJBQTZCLEVBQzdCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLDBCQUEwQixFQUMxQiwyQkFBMkIsRUFDM0IsaUJBQWlCLEVBQ2pCLENBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFFLEVBQ3hCLG9CQUFvQixDQUNwQixDQUFDO1lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRELGtDQUFrQztRQUNsQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksMEJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNsRTtRQUVELHFCQUFxQjtRQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0Isb0JBQW9CO2dCQUNwQixhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsaUJBQWlCO2dCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUE3aEJELHVCQTZoQkMifQ==