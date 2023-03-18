"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const Pistol_1 = require("./Pistol");
const Rifle_1 = require("./Rifle");
const Shotgun_1 = require("./Shotgun");
const Machinegun_1 = require("./Machinegun");
const ObstacleType_1 = require("./obstacle/ObstacleType");
class Bullet {
    constructor(id, range, gun) {
        this.size = 1;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.distance = 0;
        this.active = true;
        this.players = [];
        this.hitBushes = [];
        this.id = id;
        this.range = range;
        if (!gun) {
            this.weapon = Weapon_1.Weapon.Granade;
            this.power = 50;
        }
        else {
            if (gun instanceof Pistol_1.default) {
                this.weapon = Weapon_1.Weapon.Pistol;
                this.power = 30; //20
            }
            if (gun instanceof Rifle_1.default) {
                this.weapon = Weapon_1.Weapon.Rifle;
                this.power = 200; //50
            }
            if (gun instanceof Shotgun_1.default) {
                this.weapon = Weapon_1.Weapon.Shotgun;
                this.power = 20;
            }
            if (gun instanceof Machinegun_1.default) {
                this.weapon = Weapon_1.Weapon.Machinegun;
                this.power = 30; //30
            }
        }
    }
    //constructor
    static createBullet(id, player, gun, map, players, shiftAngle = 0) {
        const bulletRange = Math.floor(Math.random() * 3) + gun.range;
        const instance = new Bullet(id, bulletRange, gun);
        instance.map = map;
        instance.players = players;
        instance.player = player;
        instance.x = player.getCenterX();
        instance.y = player.getCenterY();
        // posunutí počáteční pozice kvuli dvou hlavním
        if (gun instanceof Shotgun_1.default) {
            const angle = 90 - player.getAngle();
            const hypotenuse = 6;
            const xShift = Math.sin((angle * Math.PI) / 180) * hypotenuse;
            const yShift = Math.cos((angle * Math.PI) / 180) * hypotenuse;
            if (Shotgun_1.default.lastUsedShotgunBarrel === 0) {
                Shotgun_1.default.lastUsedShotgunBarrel = 1;
                instance.x += xShift;
                instance.y += yShift;
            }
            else {
                Shotgun_1.default.lastUsedShotgunBarrel = 0;
                instance.x -= xShift;
                instance.y -= yShift;
            }
        }
        // Shift bullet from center of player to the end of gun
        // triangel
        const hypotenuse = Player_1.Player.size / 2 + gun.length;
        const xShift = Math.sin((player.getAngle() * Math.PI) / 180) * hypotenuse;
        const yShift = Math.cos((player.getAngle() * Math.PI) / 180) * hypotenuse;
        instance.x += xShift;
        instance.y -= yShift;
        //spray
        let randomchange = Math.round(Math.random() * gun.spray * 100) / 100;
        let randomDirection = Math.round(Math.random());
        if (!randomDirection)
            randomDirection = -1;
        instance.angle = player.getAngle() + randomchange * randomDirection;
        instance.angle += shiftAngle;
        if (instance.angle < 0) {
            instance.angle = 360 + instance.angle;
        }
        else if (instance.angle >= 360) {
            instance.angle = instance.angle - 360;
        }
        //triangle
        const bulletSpeed = gun.bulletSpeed;
        instance.shiftX = Math.sin((instance.angle * Math.PI) / 180) * bulletSpeed;
        instance.shiftY = Math.cos((instance.angle * Math.PI) / 180) * bulletSpeed;
        //start shift to edge the of player
        /*
        const bulletStartShift = Player.radius / gun.bulletSpeed + 0.1;
        instance.x += instance.shiftX * bulletStartShift;
        instance.y -= instance.shiftY * bulletStartShift;
        */
        //shift to the edge of gun
        /*
        const bulletShiftToTheGunEdge = Math.ceil(gun.length / gun.bulletSpeed);
        for (let i = 0; i < bulletShiftToTheGunEdge; i++) {
            instance.move();
        }
        */
        return instance;
    }
    //constructor
    static createFragment(id, player, granade, map, players, shiftAngle) {
        let fragmentRange = Math.floor(Math.random() * (granade.fragmentRange / 2)) + granade.fragmentRange / 2;
        fragmentRange *= 2;
        const instance = new Bullet(id, fragmentRange);
        instance.map = map;
        instance.players = players;
        instance.player = player;
        instance.x = granade.getX();
        instance.y = granade.getY();
        //spray
        let randomchange = Math.round(Math.random() * granade.fragmentSpray * 100) / 100;
        let randomDirection = Math.round(Math.random());
        if (!randomDirection)
            randomDirection = -1;
        instance.angle = randomchange * randomDirection;
        instance.angle += shiftAngle;
        if (instance.angle < 0) {
            instance.angle = 360 + instance.angle;
        }
        if (instance.angle >= 360) {
            instance.angle = 360 - instance.angle;
        }
        //triangle
        const bulletSpeed = granade.fragmentSpeed;
        instance.shiftX = Math.sin((instance.angle * Math.PI) / 180) * bulletSpeed;
        instance.shiftY = Math.cos((instance.angle * Math.PI) / 180) * bulletSpeed;
        return instance;
    }
    move() {
        if (!this.collisions()) {
            this.x += this.shiftX;
            this.y -= this.shiftY;
            if (this.shiftX > 100 || this.shiftY > 100) {
                console.error(this);
                throw 'bullet line error';
            }
        }
    }
    collisions() {
        const bulletPoint = new Point_1.default(this.getCenterX(), this.getCenterY());
        if (!this.active)
            return false;
        // Rounds
        for (const obstacle of this.map.roundObstacles) {
            if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                obstacle.acceptHit(this.power);
                if (obstacle.type === ObstacleType_1.ObstacleType.Rock || obstacle.type === ObstacleType_1.ObstacleType.Tree) {
                    this.active = false;
                    return true;
                }
                else if (obstacle.type === ObstacleType_1.ObstacleType.Bush) {
                    this.hitBushes.push(obstacle);
                }
            }
        }
        // Rects
        for (const obstacle of this.map.rectangleObstacles) {
            if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                obstacle.acceptHit(this.power);
                this.active = false;
                return true;
            }
        }
        //players
        for (const player of this.players) {
            if (player.isPointIn(bulletPoint)) {
                player.acceptHit(this.power, this.player, this.weapon);
                this.active = false;
                return true;
            }
        }
        return false;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getCenterX() {
        return this.x + this.size / 2;
    }
    getCenterY() {
        return this.y + this.size / 2;
    }
    getAngle() {
        return this.angle;
    }
    flying() {
        let state = true;
        this.distance++;
        if (this.distance > this.range)
            state = false;
        if (!this.active)
            state = false;
        return state;
    }
}
exports.default = Bullet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0J1bGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUM1QixxQ0FBa0M7QUFJbEMscUNBQWtDO0FBQ2xDLHFDQUE4QjtBQUM5QixtQ0FBNEI7QUFDNUIsdUNBQWdDO0FBQ2hDLDZDQUFzQztBQUN0QywwREFBdUQ7QUFFdkQsTUFBcUIsTUFBTTtJQWtCMUIsWUFBb0IsRUFBVSxFQUFFLEtBQWEsRUFBRSxHQUFTO1FBaEIvQyxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBSWxCLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixXQUFNLEdBQVksSUFBSSxDQUFDO1FBR3ZCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUc5QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUM7WUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDaEI7YUFBTTtZQUNOLElBQUksR0FBRyxZQUFZLGdCQUFNLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJO2FBQ3JCO1lBQ0QsSUFBSSxHQUFHLFlBQVksZUFBSyxFQUFFO2dCQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLGVB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