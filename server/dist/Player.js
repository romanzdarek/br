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
class Player {
    constructor(id, name, socket, map, collisionPoints, players) {
        this.size = 80;
        this.radius = this.size / 2;
        this.speed = 6;
        this.angle = 0;
        this.hands = [];
        this.slowAroundObstacle = false;
        this.goAroundObstacleCalls = 0;
        this.goAroundObstacleMaxCalls = 10;
        this.loadingTime = 0;
        this.loadingMaxTime = 3 * 60;
        this.lives = 3;
        this.weaponInventory = [
            Weapon_1.Weapon.Empty,
            Weapon_1.Weapon.Hand,
            Weapon_1.Weapon.Pistol,
            Weapon_1.Weapon.Rifle,
            Weapon_1.Weapon.Machinegun,
            Weapon_1.Weapon.Shotgun,
            Weapon_1.Weapon.Hammer,
            Weapon_1.Weapon.Granade,
            Weapon_1.Weapon.Smoke
        ];
        this.activeWeapon = Weapon_1.Weapon.Hand;
        this.controll = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.mouseControll = {
            left: false,
            middle: false,
            right: false,
            x: 0,
            y: 0
        };
        this.activeWeapon = Weapon_1.Weapon.Hand;
        this.socket = socket;
        this.id = id;
        this.name = name;
        this.players = players;
        this.x = 550;
        this.y = 700;
        this.map = map;
        this.collisionPoints = collisionPoints;
        this.hands.push(new Hand_1.default(this, players, map, collisionPoints));
        this.hands.push(new Hand_1.default(this, players, map, collisionPoints));
        this.pistol = new Pistol_1.default(this.radius);
        this.machinegun = new Machinegun_1.default(this.radius);
        this.shotgun = new Shotgun_1.default(this.radius);
        this.rifle = new Rifle_1.default(this.radius);
        this.hammer = new Hammer_1.default(this, players, map, collisionPoints);
    }
    changeWeapon(inventoryIndex) {
        if (inventoryIndex >= 0 && inventoryIndex < this.weaponInventory.length) {
            this.activeWeapon = this.weaponInventory[inventoryIndex];
        }
    }
    isPointIn(point) {
        //triangle
        const x = this.x + this.radius - point.x;
        const y = this.y + this.radius - point.y;
        const radius = Math.sqrt(x * x + y * y);
        if (radius <= this.radius)
            return true;
        return false;
    }
    acceptHit(power) {
        this.lives -= power;
    }
    isActive() {
        return this.lives > 0;
    }
    die() {
        this.x = 0;
        this.y = 0;
        this.lives = 3;
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
                this.mouseControll.x = position.x;
                this.mouseControll.y = position.y;
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
    loading() {
        if (this.loadingTime < this.loadingMaxTime)
            this.loadingTime++;
        return { time: this.loadingTime, max: this.loadingMaxTime };
    }
    getCenterX() {
        return this.x + this.radius;
    }
    getCenterY() {
        return this.y + this.radius;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getAngle() {
        return this.angle;
    }
    getActiveWeapon() {
        return this.activeWeapon;
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
        }
        this.mouseControll.left = false;
    }
    move(players) {
        this.goAroundObstacleCalls = 0;
        /*
        up: boolean, left: boolean, down: boolean, right: boolean, mouseX: number, mouseY: number
        */
        const { up, down, left, right } = this.controll;
        if (up || down || left || right) {
            //standart shift (speed)
            let shift = this.speed;
            //diagonal shift and slow around obstacle
            if ((up && left) || (up && right) || (down && left) || (down && right) || this.slowAroundObstacle) {
                shift = shift / Math.sqrt(2);
                this.slowAroundObstacle = false;
            }
            //shift in water
            for (let i = 0; i < this.map.terrain.length; i++) {
                //terrain block is under my center
                if (this.getCenterX() < this.map.terrain[i].x + this.map.terrain[i].width &&
                    this.getCenterX() >= this.map.terrain[i].x &&
                    this.getCenterY() < this.map.terrain[i].y + this.map.terrain[i].height &&
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
        if (this.activeWeapon === Weapon_1.Weapon.Hammer)
            this.hammer.move();
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
        if (this.x + this.size > this.map.width)
            this.x = this.map.width - this.size;
        if (this.x < 0)
            this.x = 0;
        if (this.y + this.size > this.map.height)
            this.y = this.map.height - this.size;
        if (this.y < 0)
            this.y = 0;
    }
    canIshift(shiftX, shiftY, countShifts) {
        //rectangles
        for (let i = 0; i < this.map.rectangleObstacles.length; i++) {
            const rectangleObstacle = this.map.rectangleObstacles[i];
            if (rectangleObstacle.isActive()) {
                //collision rectangle - rectangle
                if (this.x + shiftX + this.size >= rectangleObstacle.x &&
                    this.x + shiftX <= rectangleObstacle.x + rectangleObstacle.width &&
                    this.y + shiftY <= rectangleObstacle.y + rectangleObstacle.height &&
                    this.y + shiftY + this.size >= rectangleObstacle.y) {
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
                const obstacleAndPlayerRadius = obstacleRadius + this.radius;
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
        const maxObstacleOverlap = this.size * 0.75;
        if (countShifts === 1) {
            if (shiftX !== 0) {
                //up or down?
                //go up
                if (this.getCenterY() <= rectangleObstacle.y + rectangleObstacle.height / 2) {
                    if (this.y + this.size - rectangleObstacle.y < maxObstacleOverlap)
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
                    if (this.x + this.size - rectangleObstacle.x < maxObstacleOverlap)
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
        /*
        //triangular sides
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        let x = centerX - mouseX;
        let y = centerY - mouseY;
        //can not set x and y to 0 because angle
        if (x === 0) x = 0.1;
        //atangens
        let angle = Math.abs(Math.atan(x / y) * 180 / Math.PI);
        //1..2..3..4.. Q; 0 - 90, 90 - 180...
        //1
        if (mouseX >= centerX && mouseY < centerY) {
            this.angle = angle;
        }
        //2
        if (mouseX >= centerX && mouseY >= centerY) {
            this.angle = 90 + 90 - angle;
        }
        //3
        if (mouseX < centerX && mouseY >= centerY) {
            this.angle = 180 + angle;
        }
        //4
        if (mouseX < centerX && mouseY < centerY) {
            this.angle = 270 + 90 - angle;
        }
        */
        this.angle = Math.round(angle);
        if (this.angle === 360)
            this.angle = 0;
    }
}
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixxQ0FBOEI7QUFDOUIsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxtQ0FBNEI7QUFDNUIscUNBQThCO0FBRTlCLG1DQUE0QjtBQUM1QixpQ0FBMEI7QUFHMUIsdUNBQXdDO0FBQ3hDLHFDQUFrQztBQVNsQyxNQUFhLE1BQU07SUFxRGxCLFlBQ0MsRUFBVSxFQUNWLElBQVksRUFDWixNQUF1QixFQUN2QixHQUFRLEVBQ1IsZUFBZ0MsRUFDaEMsT0FBaUI7UUF2RFQsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQixXQUFNLEdBQVcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDL0IsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUduQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRzFCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFNWCx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFDcEMsMEJBQXFCLEdBQVcsQ0FBQyxDQUFDO1FBQ2xDLDZCQUF3QixHQUFXLEVBQUUsQ0FBQztRQUN0QyxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixtQkFBYyxHQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEMsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixvQkFBZSxHQUFhO1lBQ25DLGVBQU0sQ0FBQyxLQUFLO1lBQ1osZUFBTSxDQUFDLElBQUk7WUFDWCxlQUFNLENBQUMsTUFBTTtZQUNiLGVBQU0sQ0FBQyxLQUFLO1lBQ1osZUFBTSxDQUFDLFVBQVU7WUFDakIsZUFBTSxDQUFDLE9BQU87WUFDZCxlQUFNLENBQUMsTUFBTTtZQUNiLGVBQU0sQ0FBQyxPQUFPO1lBQ2QsZUFBTSxDQUFDLEtBQUs7U0FDWixDQUFDO1FBQ00saUJBQVksR0FBVyxlQUFNLENBQUMsSUFBSSxDQUFDO1FBR25DLGFBQVEsR0FBRztZQUNsQixFQUFFLEVBQUUsS0FBSztZQUNULElBQUksRUFBRSxLQUFLO1lBQ1gsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsS0FBSztTQUNaLENBQUM7UUFFRixrQkFBYSxHQUFHO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxNQUFNLEVBQUUsS0FBSztZQUNiLEtBQUssRUFBRSxLQUFLO1lBQ1osQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztTQUNKLENBQUM7UUFVRCxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELFlBQVksQ0FBQyxjQUFzQjtRQUNsQyxJQUFJLGNBQWMsSUFBSSxDQUFDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN6RDtJQUNGLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBWTtRQUNyQixVQUFVO1FBQ1YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhO1FBQ3RCLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsR0FBRztRQUNGLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsYUFBYSxDQUFDLEdBQVc7UUFDeEIsUUFBUSxHQUFHLEVBQUU7WUFDWixLQUFLLEdBQUc7Z0JBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixNQUFNO1lBQ1AsS0FBSyxHQUFHO2dCQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDMUIsTUFBTTtZQUNQLEtBQUssR0FBRztnQkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzFCLE1BQU07WUFDUCxLQUFLLEdBQUc7Z0JBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixNQUFNO1lBQ1AsS0FBSyxJQUFJO2dCQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztnQkFDekIsTUFBTTtZQUNQLEtBQUssSUFBSTtnQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQzNCLE1BQU07WUFDUCxLQUFLLElBQUk7Z0JBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUMzQixNQUFNO1lBQ1AsS0FBSyxJQUFJO2dCQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDNUIsTUFBTTtTQUNQO0lBQ0YsQ0FBQztJQUVELGVBQWUsQ0FBQyxNQUFjLEVBQUUsUUFBZTtRQUM5QyxRQUFRLE1BQU0sRUFBRTtZQUNmLEtBQUssR0FBRztnQkFDUCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU07WUFDUCxLQUFLLEdBQUc7Z0JBQ1AsTUFBTTtZQUNQLEtBQUssR0FBRztnQkFDUCxNQUFNO1lBQ1AsS0FBSyxJQUFJO2dCQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDaEMsTUFBTTtZQUNQLEtBQUssSUFBSTtnQkFDUixNQUFNO1lBQ1AsS0FBSyxJQUFJO2dCQUNSLE1BQU07U0FDUDtJQUNGLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBYTtRQUN4QixJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxPQUFPO1FBQ04sSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjO1lBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9ELE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELFVBQVU7UUFDVCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJO1FBQ0gsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVE7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbkIsQ0FBQztJQUVELGVBQWU7UUFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDMUIsQ0FBQztJQUVELEdBQUc7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUN6RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUs7UUFDSixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQWlCO1FBQ3JCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7UUFFL0I7O1VBRUU7UUFDRixNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVoRCxJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUNoQyx3QkFBd0I7WUFDeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUV2Qix5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ2xHLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQzthQUNoQztZQUVELGdCQUFnQjtZQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxrQ0FBa0M7Z0JBQ2xDLElBQ0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO29CQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO29CQUN0RSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6QztvQkFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBVyxDQUFDLEtBQUssRUFBRTt3QkFDbkQsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtvQkFDRCxJQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBVyxDQUFDLGNBQWM7d0JBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBVyxDQUFDLGNBQWM7d0JBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBVyxDQUFDLGNBQWM7d0JBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBVyxDQUFDLGNBQWMsRUFDdEQ7d0JBQ0QsZUFBZTt3QkFDZixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuRixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuRixJQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ3hCLG9CQUFvQixFQUNwQixvQkFBb0IsQ0FDcEIsRUFDQTs0QkFDRCxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ3RCO3FCQUNEO2lCQUNEO2FBQ0Q7WUFFRCxjQUFjO1lBQ2QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxFQUFFO2dCQUFFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixJQUFJLElBQUk7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUMxQixJQUFJLElBQUk7Z0JBQUUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzNCLElBQUksS0FBSztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDO1lBQzNCLDBCQUEwQjtZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxlQUFNLENBQUMsTUFBTTtZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVPLG1CQUFtQjtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDckQsb0JBQW9CO1FBQ3BCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLE1BQU0sS0FBSyxDQUFDO1lBQUUsV0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxNQUFNLEtBQUssQ0FBQztZQUFFLFdBQVcsRUFBRSxDQUFDO1FBRWhDLFNBQVM7UUFDVCxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQUcsQ0FBQztZQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBYyxFQUFFLFdBQVcsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDO2dCQUN0QyxNQUFNO2FBQ047U0FDRDtRQUVELFNBQVM7UUFDVCxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksTUFBTSxHQUFHLENBQUM7WUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQztnQkFDdEMsTUFBTTthQUNOO1NBQ0Q7UUFFRCx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdFLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQy9FLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVPLFNBQVMsQ0FBQyxNQUFjLEVBQUUsTUFBYyxFQUFFLFdBQW1CO1FBQ3BFLFlBQVk7UUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2pDLGlDQUFpQztnQkFDakMsSUFDQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLENBQUM7b0JBQ2xELElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLO29CQUNoRSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTTtvQkFDakUsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLEVBQ2pEO29CQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzFELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLGlCQUFpQixHQUFHLElBQUksZUFBSyxDQUNsQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQ3BDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FDcEMsQ0FBQzt3QkFDRixrQkFBa0I7d0JBQ2xCLElBQUksaUJBQWlCLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7NEJBQ25ELElBQUksSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtnQ0FDaEUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0NBQzdCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOzZCQUMvRTs0QkFDRCxPQUFPLEtBQUssQ0FBQzt5QkFDYjtxQkFDRDtpQkFDRDthQUNEO1NBQ0Q7UUFFRCxRQUFRO1FBQ1IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzdCLElBQUksY0FBYyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLElBQUksYUFBYSxZQUFZLGNBQUk7b0JBQUUsY0FBYyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xGLE1BQU0sdUJBQXVCLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzdELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNsRSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSxHQUFHLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxRQUFRLEdBQUcsdUJBQXVCLEVBQUU7b0JBQ3ZDLElBQUksSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTt3QkFDaEUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7d0JBQzdCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDdkU7b0JBQ0QsT0FBTyxLQUFLLENBQUM7aUJBQ2I7YUFDRDtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU8seUJBQXlCLENBQ2hDLE1BQWMsRUFDZCxNQUFjLEVBQ2QsV0FBbUIsRUFDbkIsaUJBQW9DO1FBRXBDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFDL0IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUM1QyxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixhQUFhO2dCQUNiLE9BQU87Z0JBQ1AsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzVFLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxrQkFBa0I7d0JBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0Y7cUJBQ0k7b0JBQ0osU0FBUztvQkFDVCxJQUFJLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxrQkFBa0I7d0JBQy9FLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjthQUNEO1lBQ0QsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixnQkFBZ0I7Z0JBQ2hCLFNBQVM7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQzNFLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxrQkFBa0I7d0JBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDL0Y7cUJBQ0k7b0JBQ0osVUFBVTtvQkFDVixJQUFJLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxrQkFBa0I7d0JBQzlFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjthQUNEO1NBQ0Q7UUFDRCxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxXQUFXO1lBQ1gsMEJBQTBCO1lBQzFCLElBQ0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDckUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNyRTtnQkFDRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQ25DLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FDcEUsQ0FBQztnQkFDRixlQUFlO2dCQUNmLElBQUksbUJBQW1CLElBQUksbUJBQW1CLEVBQUU7b0JBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM3QjtxQkFDSTtvQkFDSixZQUFZO29CQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Q7aUJBQ0ksSUFDSixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ3JFO2dCQUNELHlCQUF5QjtnQkFDekIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNuQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQ25FLENBQUM7Z0JBQ0YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNuQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQ3BFLENBQUM7Z0JBQ0YsY0FBYztnQkFDZCxJQUFJLG1CQUFtQixJQUFJLG1CQUFtQixFQUFFO29CQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM5QjtxQkFDSTtvQkFDSixZQUFZO29CQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Q7aUJBQ0ksSUFDSixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ3JFO2dCQUNELDJCQUEyQjtnQkFDM0IsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNuQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQ25FLENBQUM7Z0JBQ0YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUUsY0FBYztnQkFDZCxJQUFJLG1CQUFtQixJQUFJLG1CQUFtQixFQUFFO29CQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM5QjtxQkFDSTtvQkFDSixjQUFjO29CQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QjthQUNEO2lCQUNJLElBQ0osSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDckUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNyRTtnQkFDRCw0QkFBNEI7Z0JBQzVCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLGVBQWU7Z0JBQ2YsSUFBSSxtQkFBbUIsSUFBSSxtQkFBbUIsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzdCO3FCQUNJO29CQUNKLGNBQWM7b0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzdCO2FBQ0Q7U0FDRDtJQUNGLENBQUM7SUFFTyxxQkFBcUIsQ0FDNUIsTUFBYyxFQUNkLE1BQWMsRUFDZCxXQUFtQixFQUNuQixhQUE0QjtRQUU1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksV0FBVyxLQUFLLENBQUMsRUFBRTtZQUN0QixJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLGdCQUFnQjtnQkFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksYUFBYSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUNwRCxTQUFTO29CQUNULElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMzQjtnQkFDRCxnQkFBZ0I7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDbkQsT0FBTztvQkFDUCxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjthQUNEO1lBQ0QsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDcEQsVUFBVTtvQkFDVixJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDM0I7Z0JBQ0QsbUJBQW1CO2dCQUNuQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ25ELFNBQVM7b0JBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7YUFDRDtTQUNEO1FBQ0QsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLG9CQUFvQjtZQUNwQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUMzRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUUzRSxTQUFTO1lBQ1QsSUFBSSxTQUFTLElBQUksU0FBUyxFQUFFO2dCQUMzQixtQkFBbUI7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDcEQsVUFBVTtvQkFDVixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0Qsa0JBQWtCO2dCQUNsQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ25ELFNBQVM7b0JBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDOUI7YUFDRDtpQkFDSTtnQkFDSixTQUFTO2dCQUNULGdCQUFnQjtnQkFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksYUFBYSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUNwRCxTQUFTO29CQUNULElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QjtnQkFDRCxnQkFBZ0I7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDbkQsT0FBTztvQkFDUCxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM5QjthQUNEO1NBQ0Q7SUFDRixDQUFDO0lBRU8sWUFBWSxDQUFDLEtBQWE7UUFDakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQTJCRTtRQUVGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssR0FBRztZQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRDtBQWprQkQsd0JBaWtCQyJ9