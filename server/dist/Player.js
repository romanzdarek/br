"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hand_1 = require("./Hand");
const Pistol_1 = require("./Pistol");
const Machinegun_1 = require("./Machinegun");
const Shotgun_1 = require("./Shotgun");
const Rifle_1 = require("./Rifle");
const Hammer_1 = require("./Hammer");
const Point_1 = require("./Point");
const Tree_1 = require("./Tree");
const RoundObstacle_1 = require("./RoundObstacle");
const RectangleObstacle_1 = require("./RectangleObstacle");
const Terrain_1 = require("./Terrain");
const Weapon_1 = require("./Weapon");
const Inventory_1 = require("./Inventory");
const Gun_1 = require("./Gun");
const Smoke_1 = require("./Smoke");
const Granade_1 = require("./Granade");
class Player {
    constructor(id, name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFactory, killMessages) {
        this.spectate = false;
        this.spectateThatPlayer = null;
        this.speed = 10; //6
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.hands = [];
        this.slowAroundObstacle = false;
        this.goAroundObstacleCalls = 0;
        this.goAroundObstacleMaxCalls = 10;
        this.health = 100;
        this.randomPositionAttempts = 0;
        this.maxRandomPositionAttempts = 100;
        this.winner = false;
        this.died = false;
        this.controll = {
            up: false,
            down: false,
            left: false,
            right: false,
            action: false,
            reload: false
        };
        this.mouseControll = {
            left: false,
            middle: false,
            right: false,
            x: 0,
            y: 0
        };
        this.stats = {
            kills: 0,
            damageTaken: 0,
            damageDealt: 0,
            survive: 0
        };
        this.id = id;
        this.socket = socket;
        this.name = name;
        this.players = players;
        this.map = map;
        this.loot = loot;
        this.collisionPoints = collisionPoints;
        this.hands.push(new Hand_1.default(this, players, map, collisionPoints));
        this.hands.push(new Hand_1.default(this, players, map, collisionPoints));
        this.bullets = bullets;
        this.granades = granades;
        const hammer = new Hammer_1.default(this, players, map, collisionPoints);
        this.inventory = new Inventory_1.default(this, loot, hammer);
        this.bulletFactory = bulletFactory;
        this.killMessages = killMessages;
        this.setRandomPosition();
    }
    leaveGame() {
        this.socket = null;
    }
    getStats() {
        return {
            kills: this.stats.kills,
            damageDealt: Math.round(this.stats.damageDealt),
            damageTaken: Math.round(this.stats.damageTaken),
            survive: Math.round(this.stats.survive)
        };
    }
    startSpectate() {
        this.spectate = true;
    }
    getSpectate() {
        return this.spectate;
    }
    setRandomPosition() {
        const randomX = Math.floor(Math.random() * (this.map.getSize() - Player.size));
        const randomY = Math.floor(Math.random() * (this.map.getSize() - Player.size));
        this.setX(randomX);
        this.setY(randomY);
        if (this.randomPositionCollision()) {
            this.randomPositionAttempts++;
            if (this.randomPositionAttempts < this.maxRandomPositionAttempts)
                this.setRandomPosition();
        }
    }
    win() {
        this.winner = true;
        this.stats.survive = Math.round((Date.now() - this.startTime) / 1000);
        this.stats.damageDealt = Math.round(this.stats.damageDealt);
        this.stats.damageTaken = Math.round(this.stats.damageTaken);
    }
    randomPositionCollision() {
        //walls
        for (const wall of this.map.rectangleObstacles) {
            if (this.playerInObstacle(wall))
                return true;
        }
        //rounds
        for (const round of this.map.impassableRoundObstacles) {
            if (this.playerInObstacle(round))
                return true;
        }
        //players
        for (const player of this.players) {
            if (this.playerInObstacle(player))
                return true;
        }
        return false;
    }
    playerInObstacle(object) {
        let x = 0, y = 0, width = 0, height = 0;
        if (object instanceof RectangleObstacle_1.default) {
            width = object.width;
            height = object.height;
            x = object.x;
            y = object.y;
        }
        if (object instanceof RoundObstacle_1.default) {
            width = object.size;
            height = object.size;
            x = object.x;
            y = object.y;
        }
        if (object instanceof Player) {
            width = Player.size;
            height = Player.size;
            x = object.getX();
            y = object.getY();
        }
        //object in object
        if (x + width >= this.x && x <= this.x + Player.size && this.y + Player.size >= y && this.y <= y + height) {
            return true;
        }
        else {
            return false;
        }
    }
    healing(healthPoints) {
        this.health += healthPoints;
        if (this.health > 100)
            this.health = 100;
    }
    isPointIn(point) {
        //triangle
        const x = this.x + Player.radius - point.x;
        const y = this.y + Player.radius - point.y;
        const radius = Math.sqrt(x * x + y * y);
        if (radius <= Player.radius)
            return true;
        return false;
    }
    spectatePlayer() {
        if (this.spectateThatPlayer.isActive()) {
            return this.spectateThatPlayer;
        }
        else {
            let alive = 0;
            for (const player of this.players) {
                if (player.isActive())
                    alive++;
            }
            if (alive)
                this.spectateThatPlayer = this.spectateThatPlayer.spectatePlayer();
            return this.spectateThatPlayer;
        }
    }
    acceptHit(power, attacker, weapon) {
        if (this.inventory.vest)
            power /= 2;
        const healthBefore = this.health;
        this.health -= power;
        this.health = Math.round(this.health * 10) / 10;
        if (this.health < 0)
            this.health = 0;
        const damage = healthBefore - this.health;
        this.stats.damageTaken += damage;
        let playerDied = false;
        if (!this.isActive()) {
            this.stats.survive = (Date.now() - this.startTime) / 1000;
            playerDied = true;
            this.die(attacker, weapon);
            if (attacker) {
                this.spectateThatPlayer = attacker;
            }
            else {
                let activePlayer;
                for (const player of this.players) {
                    if (player.isActive()) {
                        activePlayer = player;
                        break;
                    }
                }
                if (activePlayer)
                    this.spectateThatPlayer = activePlayer;
                else
                    this.spectateThatPlayer = this;
            }
        }
        if (attacker && attacker !== this)
            attacker.stats.damageDealt += damage;
        if (attacker && playerDied)
            attacker.stats.kills++;
    }
    isActive() {
        return this.health > 0;
    }
    die(attacker, weapon) {
        if (this.winner || this.died)
            return;
        this.died = true;
        this.inventory.throwAllLoot();
        let message = 'zona killed ' + this.name;
        if (attacker && weapon) {
            let weaponName = '';
            switch (weapon) {
                case Weapon_1.Weapon.Hammer:
                    weaponName = 'hammer';
                    break;
                case Weapon_1.Weapon.Hand:
                    weaponName = 'hand';
                    break;
                case Weapon_1.Weapon.Pistol:
                    weaponName = 'pistol';
                    break;
                case Weapon_1.Weapon.Rifle:
                    weaponName = 'rifle';
                    break;
                case Weapon_1.Weapon.Shotgun:
                    weaponName = 'shotgun';
                    break;
                case Weapon_1.Weapon.Machinegun:
                    weaponName = 'machinegun';
                    break;
                case Weapon_1.Weapon.Granade:
                    weaponName = 'granade';
                    break;
            }
            message = attacker.name + ' killed ' + this.name + ' with ' + weaponName;
        }
        this.killMessages.push(message);
        if (this.socket)
            this.socket.emit('loser', this.getStats());
    }
    keyController(key) {
        switch (key) {
            case 'u':
                this.controll.up = true;
                break;
            case 'd':
                this.controll.down = true;
                break;
            case 'l':
                this.controll.left = true;
                break;
            case 'r':
                this.controll.right = true;
                break;
            case 'e':
                this.controll.action = true;
                break;
            case 're':
                this.controll.reload = true;
                break;
            case '-u':
                this.controll.up = false;
                break;
            case '-d':
                this.controll.down = false;
                break;
            case '-l':
                this.controll.left = false;
                break;
            case '-r':
                this.controll.right = false;
                break;
        }
    }
    mouseController(button, position) {
        switch (button) {
            case 'l':
                this.mouseControll.left = true;
                if (position) {
                    this.mouseControll.x = position.x;
                    this.mouseControll.y = position.y;
                }
                break;
            case 'm':
                break;
            case 'r':
                break;
            case '-l':
                this.mouseControll.left = false;
                break;
            case '-m':
                break;
            case '-r':
                break;
        }
    }
    changeAngle(angle) {
        if (angle >= 360 || angle < 0)
            angle = 0;
        this.angle = angle;
    }
    getCenterX() {
        return this.x + Player.radius;
    }
    getCenterY() {
        return this.y + Player.radius;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getAngle() {
        return this.angle;
    }
    getHealth() {
        return this.health;
    }
    setStartTime(time) {
        this.startTime = time;
    }
    getStartTime() {
        return this.startTime;
    }
    hit() {
        if (this.hands[0].hitReady() && this.hands[1].hitReady()) {
            let random = Math.round(Math.random());
            this.hands[random].hit();
        }
        this.mouseControll.left = false;
    }
    throw() {
        if (this.hands[1].throwReady()) {
            this.hands[1].throw();
            this.inventory.throwNade();
        }
        this.mouseControll.left = false;
    }
    takeLoot() {
        if (!this.controll.action)
            return;
        if (this.inventory.ready()) {
            for (const loot of this.loot.lootItems) {
                if (!loot.isActive())
                    continue;
                const x = this.getCenterX() - loot.getCenterX();
                const y = this.getCenterY() - loot.getCenterY();
                const distance = Math.sqrt(x * x + y * y);
                const lootAndPlayerRadius = Player.radius + loot.radius;
                if (distance < lootAndPlayerRadius) {
                    loot.take();
                    this.inventory.take(loot);
                    this.controll.action = false;
                    return;
                }
            }
        }
        this.controll.action = false;
    }
    loop() {
        //player move
        this.move();
        this.takeLoot();
        this.reload();
        this.inventory.loading();
        //hammer move
        if (this.inventory.activeItem instanceof Hammer_1.default)
            this.inventory.activeItem.move();
        //left click
        if (this.mouseControll.left) {
            if (this.inventory.activeItem === Weapon_1.Weapon.Hand) {
                this.hit();
            }
            else if ((this.inventory.activeItem instanceof Pistol_1.default ||
                this.inventory.activeItem instanceof Machinegun_1.default ||
                this.inventory.activeItem instanceof Shotgun_1.default ||
                this.inventory.activeItem instanceof Rifle_1.default) &&
                (this.inventory.activeItem.ready() && this.inventory.ready())) {
                if (this.inventory.activeItem instanceof Shotgun_1.default) {
                    let shotgunSpray = -12;
                    for (let i = 0; i < 7; i++) {
                        shotgunSpray += 3;
                        this.bullets.push(this.bulletFactory.createBullet(this, this.inventory.activeItem, this.map, this.players, shotgunSpray));
                    }
                }
                else {
                    this.bullets.push(this.bulletFactory.createBullet(this, this.inventory.activeItem, this.map, this.players));
                }
                this.inventory.activeItem.fire();
                if (!(this.inventory.activeItem instanceof Machinegun_1.default))
                    this.mouseControll.left = false;
            }
            else if (this.inventory.activeItem instanceof Hammer_1.default) {
                if (this.inventory.activeItem.ready()) {
                    this.inventory.activeItem.hit();
                    this.mouseControll.left = false;
                }
            }
            else if (this.inventory.activeItem === Weapon_1.Weapon.Granade) {
                if (this.hands[1].throwReady()) {
                    this.throw();
                    this.granades.push(new Granade_1.default(this, this.hands[1], this.mouseControll.x, this.mouseControll.y));
                    this.mouseControll.left = false;
                }
            }
            else if (this.inventory.activeItem === Weapon_1.Weapon.Smoke) {
                if (this.hands[1].throwReady()) {
                    this.throw();
                    this.granades.push(new Smoke_1.default(this, this.hands[1], this.mouseControll.x, this.mouseControll.y));
                    this.mouseControll.left = false;
                }
            }
            else if (this.inventory.activeItem === Weapon_1.Weapon.Medkit) {
                this.inventory.heal();
                this.mouseControll.left = false;
            }
        }
    }
    move() {
        this.goAroundObstacleCalls = 0;
        const { up, down, left, right } = this.controll;
        if (up || down || left || right) {
            //standart shift (speed)
            let shift = this.speed;
            //reloading & healing speed
            if (!this.inventory.ready())
                shift /= 2;
            //diagonal shift and slow around obstacle
            if ((up && left) || (up && right) || (down && left) || (down && right) || this.slowAroundObstacle) {
                shift = shift / Math.sqrt(2);
                this.slowAroundObstacle = false;
            }
            //shift in water
            for (let i = 0; i < this.map.terrain.length; i++) {
                //terrain block is under my center
                if (this.getCenterX() < this.map.terrain[i].x + this.map.terrain[i].size &&
                    this.getCenterX() >= this.map.terrain[i].x &&
                    this.getCenterY() < this.map.terrain[i].y + this.map.terrain[i].size &&
                    this.getCenterY() >= this.map.terrain[i].y) {
                    if (this.map.terrain[i].type === Terrain_1.TerrainType.Water) {
                        shift = shift / 3 * 2;
                    }
                    if (this.map.terrain[i].type === Terrain_1.TerrainType.WaterTriangle1 ||
                        this.map.terrain[i].type === Terrain_1.TerrainType.WaterTriangle2 ||
                        this.map.terrain[i].type === Terrain_1.TerrainType.WaterTriangle3 ||
                        this.map.terrain[i].type === Terrain_1.TerrainType.WaterTriangle4) {
                        //Math.floor!!!
                        const myXPositionOnTerrain = Math.floor(this.getCenterX() - this.map.terrain[i].x);
                        const myYPositionOnTerrain = Math.floor(this.getCenterY() - this.map.terrain[i].y);
                        if (this.map.waterTerrainData.includeWater(this.map.terrain[i].type, myXPositionOnTerrain, myYPositionOnTerrain)) {
                            shift = shift / 3 * 2;
                        }
                    }
                }
            }
            //player shift
            let shiftX = 0;
            let shiftY = 0;
            if (up)
                shiftY += -shift;
            if (down)
                shiftY += shift;
            if (left)
                shiftX += -shift;
            if (right)
                shiftX += shift;
            //i want to go this way...
            this.shiftOnPosition(shiftX, shiftY);
        }
        this.changeHandsPosition();
    }
    reload() {
        if (!this.controll.reload)
            return;
        this.controll.reload = false;
        if (this.inventory.activeItem instanceof Gun_1.default)
            this.inventory.reload(this.inventory.activeItem);
    }
    changeHandsPosition() {
        this.hands[0].move(-1);
        this.hands[1].move(1);
    }
    shiftOnPosition(shiftX, shiftY) {
        //one or two shifts?
        let countShifts = 0;
        if (shiftX !== 0)
            countShifts++;
        if (shiftY !== 0)
            countShifts++;
        //y shift
        let shiftDirection = 1;
        if (shiftY < 0)
            shiftDirection = -1;
        for (let i = 0; i < Math.abs(shiftY); i++) {
            if (this.canIshift(0, shiftY - i * shiftDirection, countShifts)) {
                this.y += shiftY - i * shiftDirection;
                break;
            }
        }
        //x shift
        shiftDirection = 1;
        if (shiftX < 0)
            shiftDirection = -1;
        for (let i = 0; i < Math.abs(shiftX); i++) {
            if (this.canIshift(shiftX - i * shiftDirection, 0, countShifts)) {
                this.x += shiftX - i * shiftDirection;
                break;
            }
        }
        //move only on map area
        if (this.x + Player.size > this.map.getSize())
            this.x = this.map.getSize() - Player.size;
        if (this.x < 0)
            this.x = 0;
        if (this.y + Player.size > this.map.getSize())
            this.y = this.map.getSize() - Player.size;
        if (this.y < 0)
            this.y = 0;
    }
    canIshift(shiftX, shiftY, countShifts) {
        //rectangles
        for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
            const rectangleObstacle = this.map.rectangleObstacles[i];
            if (rectangleObstacle.isActive()) {
                //collision rectangle - rectangle
                if (this.x + shiftX + Player.size >= rectangleObstacle.x &&
                    this.x + shiftX <= rectangleObstacle.x + rectangleObstacle.width &&
                    this.y + shiftY <= rectangleObstacle.y + rectangleObstacle.height &&
                    this.y + shiftY + Player.size >= rectangleObstacle.y) {
                    for (let j = 0; j < this.collisionPoints.body.length; j++) {
                        const point = this.collisionPoints.body[j];
                        const pointOnMyPosition = new Point_1.default(this.getCenterX() + shiftX + point.x, this.getCenterY() + shiftY + point.y);
                        //point collisions
                        if (rectangleObstacle.isPointIn(pointOnMyPosition)) {
                            if (this.goAroundObstacleCalls <= this.goAroundObstacleMaxCalls) {
                                this.goAroundObstacleCalls++;
                                this.goAroundRectangleObstacle(shiftX, shiftY, countShifts, rectangleObstacle);
                            }
                            return false;
                        }
                    }
                }
            }
        }
        //rounds
        for (let i = 0; i < this.map.impassableRoundObstacles.length; i++) {
            const roundObstacle = this.map.impassableRoundObstacles[i];
            if (roundObstacle.isActive()) {
                let obstacleRadius = roundObstacle.radius;
                if (roundObstacle instanceof Tree_1.default)
                    obstacleRadius = roundObstacle.treeTrankRadius;
                const obstacleAndPlayerRadius = obstacleRadius + Player.radius;
                const x = this.getCenterX() + shiftX - roundObstacle.getCenterX();
                const y = this.getCenterY() + shiftY - roundObstacle.getCenterY();
                const distance = Math.sqrt(x * x + y * y);
                if (distance < obstacleAndPlayerRadius) {
                    if (this.goAroundObstacleCalls <= this.goAroundObstacleMaxCalls) {
                        this.goAroundObstacleCalls++;
                        this.goAroundRoundObstacle(shiftX, shiftY, countShifts, roundObstacle);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    goAroundRectangleObstacle(shiftX, shiftY, countShifts, rectangleObstacle) {
        this.slowAroundObstacle = true;
        const maxObstacleOverlap = Player.size * 0.75;
        if (countShifts === 1) {
            if (shiftX !== 0) {
                //up or down?
                //go up
                if (this.getCenterY() <= rectangleObstacle.y + rectangleObstacle.height / 2) {
                    if (this.y + Player.size - rectangleObstacle.y < maxObstacleOverlap)
                        this.shiftOnPosition(0, -1);
                }
                else {
                    //go down
                    if (rectangleObstacle.y + rectangleObstacle.height - this.y < maxObstacleOverlap)
                        this.shiftOnPosition(0, 1);
                }
            }
            if (shiftY !== 0) {
                //left or right?
                //go left
                if (this.getCenterX() <= rectangleObstacle.x + rectangleObstacle.width / 2) {
                    if (this.x + Player.size - rectangleObstacle.x < maxObstacleOverlap)
                        this.shiftOnPosition(-1, 0);
                }
                else {
                    //go right
                    if (rectangleObstacle.x + rectangleObstacle.width - this.x < maxObstacleOverlap)
                        this.shiftOnPosition(1, 0);
                }
            }
        }
        if (countShifts === 2) {
            this.slowAroundObstacle = false;
            //chose way
            //obstacle is up and right
            if (this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
                this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2) {
                const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
                const yDistanceFromCorner = Math.abs(this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height));
                //x shift right
                if (xDistanceFromCorner <= yDistanceFromCorner) {
                    this.shiftOnPosition(0.1, 0);
                }
                else {
                    //y shift up
                    this.shiftOnPosition(0, -0.1);
                }
            }
            else if (this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
                this.getCenterY() > rectangleObstacle.y + rectangleObstacle.height / 2) {
                //obstacle is up and left
                const xDistanceFromCorner = Math.abs(this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width));
                const yDistanceFromCorner = Math.abs(this.getCenterY() - (rectangleObstacle.y + rectangleObstacle.height));
                //x shift left
                if (xDistanceFromCorner <= yDistanceFromCorner) {
                    this.shiftOnPosition(-0.1, 0);
                }
                else {
                    //y shift up
                    this.shiftOnPosition(0, -0.1);
                }
            }
            else if (this.getCenterX() > rectangleObstacle.x + rectangleObstacle.width / 2 &&
                this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2) {
                //obstacle is down and left
                const xDistanceFromCorner = Math.abs(this.getCenterX() - (rectangleObstacle.x + rectangleObstacle.width));
                const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
                //x shift left
                if (xDistanceFromCorner <= yDistanceFromCorner) {
                    this.shiftOnPosition(-0.1, 0);
                }
                else {
                    //y shift down
                    this.shiftOnPosition(0, 0.1);
                }
            }
            else if (this.getCenterX() < rectangleObstacle.x + rectangleObstacle.width / 2 &&
                this.getCenterY() < rectangleObstacle.y + rectangleObstacle.height / 2) {
                //obstacle is down and right
                const xDistanceFromCorner = Math.abs(this.getCenterX() - rectangleObstacle.x);
                const yDistanceFromCorner = Math.abs(this.getCenterY() - rectangleObstacle.y);
                //x shift right
                if (xDistanceFromCorner <= yDistanceFromCorner) {
                    this.shiftOnPosition(0.1, 0);
                }
                else {
                    //y shift down
                    this.shiftOnPosition(0, 0.1);
                }
            }
        }
    }
    goAroundRoundObstacle(shiftX, shiftY, countShifts, roundObstacle) {
        this.slowAroundObstacle = true;
        if (countShifts === 1) {
            if (shiftX !== 0) {
                //obstacle above
                if (this.getCenterY() >= roundObstacle.getCenterY()) {
                    //go down
                    this.shiftOnPosition(0, 1);
                }
                //obstacle below
                if (this.getCenterY() < roundObstacle.getCenterY()) {
                    //go up
                    this.shiftOnPosition(0, -1);
                }
            }
            if (shiftY !== 0) {
                //obstacle on left
                if (this.getCenterX() >= roundObstacle.getCenterX()) {
                    //go right
                    this.shiftOnPosition(1, 0);
                }
                //obstacle on right
                if (this.getCenterX() < roundObstacle.getCenterX()) {
                    //go left
                    this.shiftOnPosition(-1, 0);
                }
            }
        }
        if (countShifts === 2) {
            //choose shorter way
            const xDistance = Math.abs(this.getCenterX() - roundObstacle.getCenterX());
            const yDistance = Math.abs(this.getCenterY() - roundObstacle.getCenterY());
            //x shift
            if (xDistance <= yDistance) {
                //obstacle on right
                if (this.getCenterX() <= roundObstacle.getCenterX()) {
                    //go right
                    this.shiftOnPosition(0.5, 0);
                }
                //obstacle on left
                if (this.getCenterX() > roundObstacle.getCenterX()) {
                    //go left
                    this.shiftOnPosition(-0.5, 0);
                }
            }
            else {
                //y shift
                //obstacle below
                if (this.getCenterY() <= roundObstacle.getCenterY()) {
                    //go down
                    this.shiftOnPosition(0, 0.5);
                }
                //obstacle above
                if (this.getCenterY() > roundObstacle.getCenterY()) {
                    //go up
                    this.shiftOnPosition(0, -0.5);
                }
            }
        }
    }
    rotatePlayer(angle) {
        this.angle = Math.round(angle);
        if (this.angle === 360)
            this.angle = 0;
    }
}
Player.size = 80;
Player.radius = Player.size / 2;
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixxQ0FBOEI7QUFDOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFDNUIscUNBQThCO0FBRTlCLG1DQUE0QjtBQUM1QixpQ0FBMEI7QUFDMUIsbURBQTRDO0FBQzVDLDJEQUFvRDtBQUNwRCx1Q0FBd0M7QUFDeEMscUNBQWtDO0FBSWxDLDJDQUFvQztBQUVwQywrQkFBd0I7QUFFeEIsbUNBQTRCO0FBQzVCLHVDQUFnQztBQUtoQyxNQUFhLE1BQU07SUF3RGxCLFlBQ0MsRUFBVSxFQUNWLElBQVksRUFDWixNQUF1QixFQUN2QixHQUFRLEVBQ1IsZUFBZ0MsRUFDaEMsT0FBaUIsRUFDakIsT0FBaUIsRUFDakIsUUFBMEIsRUFDMUIsSUFBVSxFQUNWLGFBQTRCLEVBQzVCLFlBQXNCO1FBakVmLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDbEMsdUJBQWtCLEdBQWtCLElBQUksQ0FBQztRQU1oQyxVQUFLLEdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRztRQUN4QixNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLFVBQUssR0FBVyxDQUFDLENBQUM7UUFNMUIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUVYLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQywwQkFBcUIsR0FBVyxDQUFDLENBQUM7UUFDbEMsNkJBQXdCLEdBQVcsRUFBRSxDQUFDO1FBQ3RDLFdBQU0sR0FBVyxHQUFHLENBQUM7UUFJckIsMkJBQXNCLEdBQVcsQ0FBQyxDQUFDO1FBQ25DLDhCQUF5QixHQUFXLEdBQUcsQ0FBQztRQUN4QyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFFdEIsYUFBUSxHQUFHO1lBQ2xCLEVBQUUsRUFBRSxL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