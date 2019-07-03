"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class Bullet {
    constructor(id, range) {
        this.size = 1;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.distance = 0;
        this.active = true;
        this.players = [];
        this.id = id;
        this.range = range;
        /*
        this.id = id;
        this.map = map;
        this.players = players;
        this.x = player.getCenterX();
        this.y = player.getCenterY();
        //spray
        let randomchange = Math.round(Math.random() * gun.spray * 100) / 100;
        let randomDirection = Math.round(Math.random());
        if (!randomDirection) randomDirection = -1;
        this.angle = player.getAngle() + randomchange * randomDirection;
        this.angle += shiftAngle;
        if (this.angle < 0) {
            this.angle = 360 + this.angle;
        }
        if (this.angle >= 360) {
            this.angle = 360 - this.angle;
        }
        this.range = gun.range;
        //triangle
        const bulletSpeed = gun.bulletSpeed;
        this.shiftX = Math.sin(this.angle * Math.PI / 180) * bulletSpeed;
        this.shiftY = Math.cos(this.angle * Math.PI / 180) * bulletSpeed;

        //start shift to edge the of player
        const bulletStartShift = player.radius / gun.bulletSpeed + 0.1;
        this.x += this.shiftX * bulletStartShift;
        this.y -= this.shiftY * bulletStartShift;

        //shift to the edge of gun
        const bulletShiftToTheGunEdge = Math.ceil(gun.length / gun.bulletSpeed);
        for (let i = 0; i < bulletShiftToTheGunEdge; i++) {
            this.move();
        }
        */
    }
    //constructor
    static makeBullet(id, player, gun, map, players, shiftAngle = 0) {
        const instance = new Bullet(id, gun.range);
        instance.map = map;
        instance.players = players;
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
        const bulletStartShift = player.radius / gun.bulletSpeed + 0.1;
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
    static makeFragment(id, granade, map, players, shiftAngle) {
        const instance = new Bullet(id, granade.fragmentRange);
        instance.map = map;
        instance.players = players;
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
                    player.acceptHit(1);
                    if (!player.isActive())
                        player.die();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0J1bGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUs1QixNQUFxQixNQUFNO0lBZTFCLFlBQW9CLEVBQVUsRUFBRSxLQUFhO1FBYnBDLFNBQUksR0FBVyxDQUFDLENBQUM7UUFFbEIsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLFdBQU0sR0FBWSxJQUFJLENBQUM7UUFHdkIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUc5QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBa0NFO0lBQ0gsQ0FBQztJQUVELGFBQWE7SUFDYixNQUFNLENBQUMsVUFBVSxDQUFDLEVBQVUsRUFBRSxNQUFjLEVBQUUsR0FBUSxFQUFFLEdBQVEsRUFBRSxPQUFpQixFQUFFLGFBQXFCLENBQUM7UUFDMUcsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNuQixRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMzQixRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNqQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNqQyxPQUFPO1FBQ1AsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFD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