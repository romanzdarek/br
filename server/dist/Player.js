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
    acceptHit(power, attacker, weapon) {
        if (this.inventory.vest)
            power /= 2;
        this.health -= power;
        this.health = Math.round(this.health * 10) / 10;
        if (!this.isActive())
            this.die(attacker, weapon);
    }
    isActive() {
        return this.health > 0;
    }
    die(attacker, weapon) {
        this.inventory.throwAllLoot();
        this.x = -10000;
        //this.health = 100;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixxQ0FBOEI7QUFDOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFDNUIscUNBQThCO0FBRTlCLG1DQUE0QjtBQUM1QixpQ0FBMEI7QUFDMUIsbURBQTRDO0FBQzVDLDJEQUFvRDtBQUNwRCx1Q0FBd0M7QUFDeEMscUNBQWtDO0FBSWxDLDJDQUFvQztBQUVwQywrQkFBd0I7QUFFeEIsbUNBQTRCO0FBQzVCLHVDQUFnQztBQUloQyxNQUFhLE1BQU07SUE0Q2xCLFlBQ0MsRUFBVSxFQUNWLElBQVksRUFDWixNQUF1QixFQUN2QixHQUFRLEVBQ1IsZUFBZ0MsRUFDaEMsT0FBaUIsRUFDakIsT0FBaUIsRUFDakIsUUFBMEIsRUFDMUIsSUFBVSxFQUNWLGFBQTRCLEVBQzVCLFlBQXNCO1FBakRkLFVBQUssR0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHO1FBQ3hCLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsVUFBSyxHQUFXLENBQUMsQ0FBQztRQU0xQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBRVgsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ3BDLDBCQUFxQixHQUFXLENBQUMsQ0FBQztRQUNsQyw2QkFBd0IsR0FBVyxFQUFFLENBQUM7UUFDdEMsV0FBTSxHQUFXLEdBQUcsQ0FBQztRQUlyQiwyQkFBc0IsR0FBVyxDQUFDLENBQUM7UUFDbkMsOEJBQXlCLEdBQVcsR0FBRyxDQUFDO1FBRXhDLGFBQVEsR0FBRztZQUNsQixFQUFFLEVBQUUsS0FBSztZQUNULElBQUksRUFBRSxLQUFLO1lBQ1gsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsS0FBSztZQUNaLE1BQU0sRUFBRSxLQUFLO1lBQ2IsTUFBTSxFQUFFLEtBQUs7U0FD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