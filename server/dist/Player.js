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
const Terrain_1 = require("./Terrain");
const Weapon_1 = require("./Weapon");
const Inventory_1 = require("./Inventory");
const Gun_1 = require("./Gun");
const Smoke_1 = require("./Smoke");
const Granade_1 = require("./Granade");
class Player {
    constructor(id, name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFactory) {
        this.speed = 6;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.hands = [];
        this.slowAroundObstacle = false;
        this.goAroundObstacleCalls = 0;
        this.goAroundObstacleMaxCalls = 10;
        this.health = 100;
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
    acceptHit(power) {
        if (this.inventory.vest)
            power /= 2;
        this.health -= power;
        this.health = Math.round(this.health * 10) / 10;
        if (!this.isActive())
            this.die();
    }
    isActive() {
        return this.health > 0;
    }
    die() {
        this.x = 0;
        this.y = 0;
        this.health = 100;
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
                    this.granades.push(new Granade_1.default(this.hands[1], this.mouseControll.x, this.mouseControll.y));
                    this.mouseControll.left = false;
                }
            }
            else if (this.inventory.activeItem === Weapon_1.Weapon.Smoke) {
                if (this.hands[1].throwReady()) {
                    this.throw();
                    this.granades.push(new Smoke_1.default(this.hands[1], this.mouseControll.x, this.mouseControll.y));
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
        if (this.inventory.activeItem === Weapon_1.Weapon.Hand ||
            this.inventory.activeItem === Weapon_1.Weapon.Granade ||
            this.inventory.activeItem === Weapon_1.Weapon.Smoke ||
            this.inventory.activeItem === Weapon_1.Weapon.Medkit) {
            this.changeHandsPosition();
        }
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
Player.numberOfplayers = 0;
Player.size = 80;
Player.radius = Player.size / 2;
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixxQ0FBOEI7QUFDOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFDNUIscUNBQThCO0FBRTlCLG1DQUE0QjtBQUM1QixpQ0FBMEI7QUFHMUIsdUNBQXdDO0FBQ3hDLHFDQUFrQztBQUlsQywyQ0FBb0M7QUFFcEMsK0JBQXdCO0FBRXhCLG1DQUE0QjtBQUM1Qix1Q0FBZ0M7QUFJaEMsTUFBYSxNQUFNO0lBMENsQixZQUNDLEVBQVUsRUFDVixJQUFZLEVBQ1osTUFBdUIsRUFDdkIsR0FBUSxFQUNSLGVBQWdDLEVBQ2hDLE9BQWlCLEVBQ2pCLE9BQWlCLEVBQ2pCLFFBQTBCLEVBQzFCLElBQVUsRUFDVixhQUE0QjtRQTdDcEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNuQixNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLFVBQUssR0FBVyxDQUFDLENBQUM7UUFNMUIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUVYLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQywwQkFBcUIsR0FBVyxDQUFDLENBQUM7UUFDbEMsNkJBQXdCLEdBQVcsRUFBRSxDQUFDO1FBQ3RDLFdBQU0sR0FBVyxHQUFHLENBQUM7UUFJckIsYUFBUSxHQUFHO1lBQ2xCLEVBQUUsRUFBRSxLQUFLO1lBQ1QsSUFBSSxFQUFFLEtBQUs7WUFDWCxJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztTQUNiLENBQUM7UUFFTSxrQkFBYSxHQUFHO1lBQ3ZCLElBQUksRUFBRSxLQUFLO1lBQ1gsTUFBTSxFQUFFLEtBQUs7WUFDYixLQUFLLEVBQUUsS0FBSztZQUNaLENBQUMsRUFBRSxDQUFD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