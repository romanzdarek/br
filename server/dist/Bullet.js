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
        }
        else {
            if (gun instanceof Pistol_1.default)
                this.weapon = Weapon_1.Weapon.Pistol;
            if (gun instanceof Rifle_1.default)
                this.weapon = Weapon_1.Weapon.Rifle;
            if (gun instanceof Shotgun_1.default)
                this.weapon = Weapon_1.Weapon.Shotgun;
            if (gun instanceof Machinegun_1.default)
                this.weapon = Weapon_1.Weapon.Machinegun;
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
        if (instance.angle >= 360) {
            instance.angle = 360 - instance.angle;
        }
        //triangle
        const bulletSpeed = gun.bulletSpeed;
        instance.shiftX = Math.sin(instance.angle * Math.PI / 180) * bulletSpeed;
        instance.shiftY = Math.cos(instance.angle * Math.PI / 180) * bulletSpeed;
        //start shift to edge the of player
        const bulletStartShift = Player_1.Player.radius / gun.bulletSpeed + 0.1;
        instance.x += instance.shiftX * bulletStartShift;
        instance.y -= instance.shiftY * bulletStartShift;
        //shift to the edge of gun
        const bulletShiftToTheGunEdge = Math.ceil(gun.length / gun.bulletSpeed);
        for (let i = 0; i < bulletShiftToTheGunEdge; i++) {
            instance.move();
        }
        return instance;
    }
    //constructor
    static createFragment(id, player, granade, map, players, shiftAngle) {
        const fragmentRange = Math.floor(Math.random() * granade.fragmentRange) + granade.fragmentRange / 3;
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
        instance.shiftX = Math.sin(instance.angle * Math.PI / 180) * bulletSpeed;
        instance.shiftY = Math.cos(instance.angle * Math.PI / 180) * bulletSpeed;
        return instance;
    }
    move() {
        if (!this.collisions()) {
            this.x += this.shiftX;
            this.y -= this.shiftY;
        }
    }
    collisions() {
        const bulletPoint = new Point_1.default(this.getCenterX(), this.getCenterY());
        //rounds
        if (this.active) {
            for (const obstacle of this.map.impassableRoundObstacles) {
                if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit(bulletPoint);
                    this.active = false;
                    return true;
                }
            }
        }
        //bushes
        if (this.active) {
            for (const obstacle of this.map.bushes) {
                if (!this.hitBushes.includes(obstacle) && obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit(bulletPoint);
                    this.hitBushes.push(obstacle);
                }
            }
        }
        //rects
        if (this.active) {
            for (const obstacle of this.map.rectangleObstacles) {
                if (obstacle.isActive() && obstacle.isPointIn(bulletPoint)) {
                    obstacle.acceptHit();
                    this.active = false;
                    return true;
                }
            }
        }
        //players
        if (this.active) {
            for (const player of this.players) {
                if (player.isActive() && player.isPointIn(bulletPoint)) {
                    player.acceptHit(1, this.player, this.weapon);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0J1bGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUM1QixxQ0FBa0M7QUFJbEMscUNBQWtDO0FBQ2xDLHFDQUE4QjtBQUM5QixtQ0FBNEI7QUFDNUIsdUNBQWdDO0FBQ2hDLDZDQUFzQztBQUV0QyxNQUFxQixNQUFNO0lBaUIxQixZQUFvQixFQUFVLEVBQUUsS0FBYSxFQUFFLEdBQVM7UUFmL0MsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUdsQixNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsV0FBTSxHQUFZLElBQUksQ0FBQztRQUd2QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFHOUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDO1NBQzdCO2FBQ0k7WUFDSixJQUFJLEdBQUcsWUFBWSxnQkFBTTtnQkFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUM7WUFDdkQsSUFBSSxHQUFHLFlBQVksZUFBSztnQkFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUM7WUFDckQsSUFBSSxHQUFHLFlBQVksaUJBQU87Z0JBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3pELElBQUksR0FBRyxZQUFZLG9C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