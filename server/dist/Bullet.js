"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
const Pistol_1 = require("./Pistol");
const Rifle_1 = require("./Rifle");
const Shotgun_1 = require("./Shotgun");
const Machinegun_1 = require("./Machinegun");
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
        //rounds
        if (this.active) {
            for (const obstacle of this.map.impassableRoundObstacles) {
                if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit(this.power);
                    this.active = false;
                    return true;
                }
            }
        }
        //bushes
        if (this.active) {
            for (const obstacle of this.map.bushes) {
                if (!this.hitBushes.includes(obstacle) && obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit(this.power);
                    this.hitBushes.push(obstacle);
                }
            }
        }
        //rects
        if (this.active) {
            for (const obstacle of this.map.rectangleObstacles) {
                if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit(this.power);
                    this.active = false;
                    return true;
                }
            }
        }
        //players
        if (this.active) {
            for (const player of this.players) {
                if (player.isActive() && player.isPointIn(bulletPoint)) {
                    player.acceptHit(this.power, this.player, this.weapon);
                    this.active = false;
                    return true;
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0J1bGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUM1QixxQ0FBa0M7QUFJbEMscUNBQWtDO0FBQ2xDLHFDQUE4QjtBQUM5QixtQ0FBNEI7QUFDNUIsdUNBQWdDO0FBQ2hDLDZDQUFzQztBQUV0QyxNQUFxQixNQUFNO0lBa0IxQixZQUFvQixFQUFVLEVBQUUsS0FBYSxFQUFFLEdBQVM7UUFoQi9DLFNBQUksR0FBVyxDQUFDLENBQUM7UUFJbEIsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLFdBQU0sR0FBWSxJQUFJLENBQUM7UUFHdkIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBRzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE9BQU8sQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNoQjthQUFNO1lBQ04sSUFBSSxHQUFHLFlBQVksZ0JBQU0sRUFBRTtnQkFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUk7YUFDckI7WUFDRCxJQUFJLEdBQUcsWUFBWSxlQUFLLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLEtBQUss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