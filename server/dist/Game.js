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
class Game {
    constructor(waterTerrainData, collisionPoints, mapData) {
        this.playerId = 0;
        this.players = [];
        this.lastPlayerSnapshots = [];
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
        for (const playerNow of playerSnapshotsOptimalization) {
            for (const playerBefore of this.lastPlayerSnapshots) {
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
        this.lastPlayerSnapshots = playerSnapshots;
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
        console.log('----------');
        console.log(JSON.stringify(playerSnapshotsOptimalization));
        //emit
        for (const player of this.players) {
            player.socket.emit('u', {
                t: dateNow,
                p: playerSnapshotsOptimalization,
                b: bulletSnapshots,
                g: granadeSnapshots,
                s: smokeCloudSnapshots,
                z: zoneSnapshot,
                l: lootSnapshots
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXdCO0FBQ3hCLGlDQUEwQjtBQUMxQix1Q0FBZ0M7QUFDaEMsbUNBQTRCO0FBQzVCLDZDQUFzQztBQUN0QyxxQ0FBOEI7QUFDOUIscUNBQWtDO0FBQ2xDLHFDQUFrQztBQUNsQyxxREFBOEM7QUFDOUMscURBQThDO0FBRzlDLHFFQUE4RDtBQUU5RCw2REFBc0Q7QUFFdEQsaURBQTBDO0FBQzFDLG1EQUE0QztBQUM1QywyREFBb0Q7QUFDcEQsbUNBQTRCO0FBRTVCLGlDQUEwQjtBQUMxQix5Q0FBc0M7QUFDdEMsaURBQTBDO0FBRTFDLE1BQXFCLElBQUk7SUFpQnhCLFlBQVksZ0JBQWtDLEVBQUUsZUFBZ0MsRUFBRSxPQUFnQjtRQWIxRixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDZix3QkFBbUIsR0FBcUIsRUFBRSxDQUFDO1FBQzNDLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFDL0IsYUFBUSxHQUFxQixFQUFFLENBQUM7UUFDaEMsb0JBQWUsR0FBVyxDQUFDLENBQUM7UUFFNUIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QiwyQkFBc0IsR0FBVyxDQUFDLENBQUM7UUFDbkMsOEJBQXlCLEdBQVcsSUFBSSxDQUFDO1FBR2hELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFD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