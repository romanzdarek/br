"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("./Map");
const Zone_1 = require("./Zone");
const Granade_1 = require("./Granade");
const Smoke_1 = require("./Smoke");
const SmokeCloud_1 = require("./SmokeCloud");
const Weapon_1 = require("./Weapon");
const PlayerSnapshot_1 = require("./PlayerSnapshot");
const BulletSnapshot_1 = require("./BulletSnapshot");
const ThrowingObjectSnapshot_1 = require("./ThrowingObjectSnapshot");
const SmokeCloudSnapshot_1 = require("./SmokeCloudSnapshot");
const ZoneSnapshot_1 = require("./ZoneSnapshot");
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
        this.endingTimer = -1;
        this.killMessages = [];
        this.collisionPoints = collisionPoints;
        this.mapData = mapData;
        this.map = new Map_1.default(waterTerrainData, mapData);
        this.zone = new Zone_1.default(this.map);
        this.loot = new Loot_1.default(this.map);
        this.playerFactory = new PlayerFactory_1.default();
        this.bulletFactory = new BulletFactory_1.default();
    }
    isEnd() {
        return this.endingTimer === 0;
    }
    gameOver() {
        let state = false;
        let activePlayers = 0;
        let lastActivePlayer;
        for (const player of this.players) {
            if (player.isActive()) {
                activePlayers++;
                lastActivePlayer = player;
            }
        }
        //last player win
        if (activePlayers === 1 && this.endingTimer === -1) {
            lastActivePlayer.socket.emit('winner');
            state = true;
        }
        //no one win
        if (activePlayers === 0) {
            state = true;
        }
        //ending
        if (state && this.endingTimer === -1) {
            this.endingTimer = 60 * 3;
        }
        if (this.endingTimer > 0)
            this.endingTimer--;
        return state;
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
                this.loot.createMainLootItems(this.players.length);
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
    loop() {
        //ending
        if (this.gameOver())
            this.endingTimer--;
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
            if (this.previousSnapshot.z.d === zoneSnapshot.d)
                delete zoneSnapshotOptimalization.d;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUd0QyxxQ0FBa0M7QUFDbEMscURBQThDO0FBQzlDLHFEQUE4QztBQUc5QyxxRUFBOEQ7QUFFOUQsNkRBQXNEO0FBRXRELGlEQUEwQztBQUsxQyxpREFBMEM7QUFDMUMseUNBQWtDO0FBTWxDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFFbEQsTUFBcUIsSUFBSTtJQWtCeEIsWUFBWSxnQkFBa0MsRUFBRSxlQUFnQyxFQUFFLE9BQWdCO1FBZGxHLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFZixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXZCLGdCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUVoQyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFJekIsaUJBQVksR0FBYSxFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksdUJBQWEsRUFBRSxDQUFD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QUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3FCQUM1RjtpQkFDRDthQUNEO1lBQ0QsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUM1QixPQUFPLEVBQ1AsNkJBQTZCLEVBQzdCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLDBCQUEwQixFQUMxQiwyQkFBMkIsRUFDM0IsaUJBQWlCLEVBQ2pCLENBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFFLEVBQ3hCLG9CQUFvQixDQUNwQixDQUFDO1lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRELGtDQUFrQztRQUNsQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksMEJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNsRTtRQUVELHFCQUFxQjtRQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0Isb0JBQW9CO2dCQUNwQixhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsaUJBQWlCO2dCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUF2ZUQsdUJBdWVDIn0=