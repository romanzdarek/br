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
            if (player.isActive())
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
        for (const player of playerSnapshots) {
            playerSnapshotsOptimalization.push(Object.assign({}, player));
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
                !player.hasOwnProperty('l') &&
                !player.hasOwnProperty('d')) {
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
        //save this snapshot
        this.previousSnapshot = new Snapshot_1.default(dateNow, playerSnapshots, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshot, lootSnapshots, obstacleSnapshots, [...this.killMessages]);
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
            const snapshot = new Snapshot_1.default(dateNow, playerSnapshotsOptimalization, bulletSnapshots, granadeSnapshots, smokeCloudSnapshots, zoneSnapshotOptimalization, lootSnapshotsOptimalization, obstacleSnapshots, [...this.killMessages], lastMyPlayerSnapshot);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUd0QyxxQ0FBa0M7QUFDbEMscURBQThDO0FBQzlDLHFEQUE4QztBQUc5QyxxRUFBOEQ7QUFFOUQsNkRBQXNEO0FBRXRELGlEQUEwQztBQUsxQyxpREFBMEM7QUFDMUMseUNBQWtDO0FBTWxDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFHbEQsTUFBcUIsSUFBSTtJQWtCeEIsWUFBWSxnQkFBa0MsRUFBRSxlQUFnQyxFQUFFLE9BQWdCO1FBZGxHLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFZixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXZCLGdCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUVoQyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFJekIsaUJBQVksR0FBYSxFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksdUJBQWEsRUFBRSxDQUFD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QUM7d0JBQ3pGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBQzVGLElBQUksd0JBQXdCLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLEVBQUU7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7d0JBRTVGLElBQUksd0JBQXdCLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDLENBQUM7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3pGLElBQUksd0JBQXdCLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDLENBQUM7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3pGLElBQUksd0JBQXdCLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDLENBQUM7NEJBQUUsT0FBTyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3pGLElBQUksd0JBQXdCLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDLENBQUM7NEJBQUUs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