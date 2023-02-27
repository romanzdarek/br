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
const Sound_1 = require("./Sound");
class Game {
    constructor(waterTerrainData, collisionPoints, mapData, mapName) {
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
        this.mapName = mapName;
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
                granade.moveFromObstacle(this.map);
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
            for (const player of this.players) {
                smokeCloud.hitPlayer(player);
            }
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
                this.sounds.push(new Sound_1.default(Sound_1.SoundType.Water, player.getCenterX(), player.getCenterY()));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUd0QyxxQ0FBa0M7QUFDbEMscURBQThDO0FBQzlDLHFEQUE4QztBQUc5QyxxRUFBOEQ7QUFFOUQsNkRBQXNEO0FBRXRELGlEQUEwQztBQUUxQyxpREFBMEM7QUFDMUMseUNBQWtDO0FBQ2xDLGlDQUEwQjtBQUMxQix5REFBa0Q7QUFDbEQsbURBQTRDO0FBQzVDLG1EQUE0QztBQUM1Qyx5REFBa0Q7QUFDbEQsK0RBQXdEO0FBQ3hELG1DQUEyQztBQUUzQyxNQUFxQixJQUFJO0lBcUJ4QixZQUFZLGdCQUFrQyxFQUFFLGVBQWdDLEVBQUUsT0FBZ0IsRUFBRSxPQUFlO1FBakJuSCxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRWYsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixXQUFNLEdBQVksRUFBRSxDQUFDO1FBRXJCLGdCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUVoQyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFJekIsaUJBQVksR0FBYSxFQUFFLENBQUM7UUFLbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FB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LENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLElBQUk7NEJBQUUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDO3dCQUNoRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxPQUFPO3dCQUNQLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxZQUFZLENBQUMsS0FBSzs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUM7d0JBQ25FLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUM7cUJBQzFEO2lCQUNEO2FBQ0Q7U0FDRDtRQUNELGdDQUFnQztRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLDZCQUE2QixDQUFD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QUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUV6RixJQUFJLHdCQUF3QixDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUM1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUFFLE9BQU8sb0JBQW9CLENBQUMsRUFBRSxDQUFDO3dCQUU1RixJQUFJLHdCQUF3QixDQUFDLEVBQUUs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