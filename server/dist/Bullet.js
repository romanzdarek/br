"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Player_1 = require("./Player");
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
        this.hitBushes = [];
        this.id = id;
        this.range = range;
    }
    //constructor
    static createBullet(id, player, gun, map, players, shiftAngle = 0) {
        const bulletRange = Math.floor(Math.random() * 3) + gun.range;
        const instance = new Bullet(id, bulletRange);
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
    static createFragment(id, granade, map, players, shiftAngle) {
        const fragmentRange = Math.floor(Math.random() * granade.fragmentRange) + granade.fragmentRange / 3;
        const instance = new Bullet(id, fragmentRange);
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
                    player.acceptHit(1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0J1bGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUE0QjtBQUM1QixxQ0FBa0M7QUFLbEMsTUFBcUIsTUFBTTtJQWUxQixZQUFvQixFQUFVLEVBQUUsS0FBYTtRQWJwQyxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixXQUFNLEdBQVksSUFBSSxDQUFDO1FBRXZCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUc5QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxhQUFhO0lBQ2IsTUFBTSxDQUFDLFlBQVksQ0FDbEIsRUFBVSxFQUNWLE1BQWMsRUFDZCxHQUFRLEVBQ1IsR0FBUSxFQUNSLE9BQWlCLEVBQ2pCLGFBQXFCLENBQUM7UUFFdEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUM5RCxNQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDbkIsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFD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