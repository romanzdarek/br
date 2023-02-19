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
const WaterCircleSnapshot_1 = require("./WaterCircleSnapshot");
class Game {
    constructor(waterTerrainData, collisionPoints, mapData) {
        this.players = [];
        this.bullets = [];
        this.sounds = [];
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
        this.createTime = Date.now();
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
        if (this.players.length > 1 && activePlayers === 1 && this.endingTimer === -1) {
            lastActivePlayer.win();
            if (lastActivePlayer.socket)
                lastActivePlayer.socket.emit('winner', lastActivePlayer.getStats());
            state = true;
            //end spectacting
            for (const player of this.players) {
                if (player.socket && player.getSpectate()) {
                    player.socket.emit('stopSpectate', lastActivePlayer.getStats(), lastActivePlayer.name);
                }
            }
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
            if (player.socket)
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
            if (player.socket) {
                player.socket.emit('cancelLobby');
            }
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
                const startTime = Date.now();
                for (const player of this.players) {
                    player.setStartTime(startTime);
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
        const newPlayer = this.playerFactory.create(name, socket, this.map, this.collisionPoints, this.players, this.bullets, this.granades, this.loot, this.bulletFactory, this.killMessages, this.sounds);
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
                    //
                    granade.createExplodeSound();
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
                bullet.move();
            }
            else {
                this.bullets.splice(i, 1);
            }
        }
        //player move
        for (const player of this.players) {
            if (player.isActive()) {
                player.loop();
                //zone damage
                if (!this.zone.playertIn(player))
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
        for (const player of playerSnapshots) {
            playerSnapshotsOptimalization.push(Object.assign({}, player));
        }
        //Sounds
        const sounds = [...this.sounds];
        this.sounds.splice(0, this.sounds.length);
        //find same values and delete them
        //players
        for (const playerNow of playerSnapshotsOptimalization) {
            if (this.previousSnapshot) {
                for (const playerBefore of this.previousSnapshot.p) {
                    if (playerNow.i === playerBefore.i) {
                        //for deny create beetween snapshot for hands
                        if ((playerNow.w === Weapon_1.Weapon.Hand || playerNow.w === Weapon_1.Weapon.Smoke || playerNow.w === Weapon_1.Weapon.Granade || playerNow.w === Weapon_1.Weapon.Medkit) &&
                            playerBefore.w !== Weapon_1.Weapon.Hand &&
                            playerBefore.w !== Weapon_1.Weapon.Smoke &&
                            playerBefore.w !== Weapon_1.Weapon.Granade &&
                            playerBefore.w !== Weapon_1.Weapon.Medkit) {
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
                        if (playerNow.v === playerBefore.v)
                            delete playerNow.v;
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
                !player.hasOwnProperty('l') &&
                !player.hasOwnProperty('d') &&
                !player.hasOwnProperty('v')) {
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
                            if (lootNow.quantity === lootPrevious.quantity)
                                delete lootNow.quantity;
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
                    !loot.hasOwnProperty('quantity') &&
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
        //water circles
        const waterCircles = [];
        for (const player of this.players) {
            if (player.isActive() && player.getWaterCircleTimer() >= player.waterCircleTimerMax) {
                player.nullWaterCircleTimer();
                waterCircles.push(new WaterCircleSnapshot_1.default(player.getCenterX(), player.getCenterY()));
            }
        }
        //save this snapshot
        this.previousSnapshot = new Snapshot_1.default(dateNow, playerSnapshots, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshot, lootSnapshots, obstacleSnapshots, [...this.killMessages], waterCircles, sounds);
        //emit changes
        for (const player of this.players) {
            //spectate
            const myPlayerId = player.id;
            let myOrspectatePlayer = player;
            let spectateId = -1;
            let spectateName = '';
            if (player.getSpectate()) {
                spectateId = player.spectatePlayer().id;
                myOrspectatePlayer = player.spectatePlayer();
                spectateName = player.spectatePlayer().name;
            }
            const lastMyPlayerSnapshot = new MyPlayerSnapshot_1.default(myOrspectatePlayer);
            lastMyPlayerSnapshot.spectate = spectateId;
            lastMyPlayerSnapshot.spectateName = spectateName;
            lastMyPlayerSnapshot.id = myPlayerId;
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
                        if (previousMyPlayerSnapshot.ai === lastMyPlayerSnapshot.ai)
                            delete lastMyPlayerSnapshot.ai;
                        if (previousMyPlayerSnapshot.spectateName === lastMyPlayerSnapshot.spectateName)
                            delete lastMyPlayerSnapshot.spectateName;
                        if (previousMyPlayerSnapshot.spectate === lastMyPlayerSnapshot.spectate)
                            delete lastMyPlayerSnapshot.spectate;
                    }
                }
            }
            delete lastMyPlayerSnapshot.id;
            const snapshot = new Snapshot_1.default(dateNow, playerSnapshotsOptimalization, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshotOptimalization, lootSnapshotsOptimalization, obstacleSnapshots, [...this.killMessages], waterCircles, sounds, lastMyPlayerSnapshot);
            if (player.socket)
                player.socket.emit('u', snapshot);
        }
        //clear messages
        this.killMessages.splice(0, this.killMessages.length);
        //save 'previous' myPlayerSnapshot
        this.previousMyPlayerSnapshots = [];
        for (const player of this.players) {
            const myPlayerId = player.id;
            let myOrspectatePlayer = player;
            let spectateId = -1;
            let spectateName = '';
            if (player.getSpectate()) {
                spectateId = player.spectatePlayer().id;
                myOrspectatePlayer = player.spectatePlayer();
                spectateName = player.spectatePlayer().name;
            }
            const myPlayerOrspectateSnapshot = new MyPlayerSnapshot_1.default(myOrspectatePlayer);
            myPlayerOrspectateSnapshot.spectate = spectateId;
            myPlayerOrspectateSnapshot.id = myPlayerId;
            myPlayerOrspectateSnapshot.spectateName = spectateName;
            this.previousMyPlayerSnapshots.push(myPlayerOrspectateSnapshot);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUd0QyxxQ0FBa0M7QUFDbEMscURBQThDO0FBQzlDLHFEQUE4QztBQUc5QyxxRUFBOEQ7QUFFOUQsNkRBQXNEO0FBRXRELGlEQUEwQztBQUUxQyxpREFBMEM7QUFDMUMseUNBQWtDO0FBQ2xDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFDbEQsK0RBQXdEO0FBR3hELE1BQXFCLElBQUk7SUFvQnhCLFlBQVksZ0JBQWtDLEVBQUUsZUFBZ0MsRUFBRSxPQUFnQjtRQWhCbEcsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUVmLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUVyQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFDL0IsYUFBUSxHQUFxQixFQUFFLENBQUM7UUFFaEMsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixnQkFBVyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBSXpCLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBSW5DLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0Is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QUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFF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