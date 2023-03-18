"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const RectangleObstacle_1 = require("./obstacle/RectangleObstacle");
const RoundObstacle_1 = require("./obstacle/RoundObstacle");
const Tree_1 = require("./obstacle/Tree");
const ObstacleType_1 = require("./obstacle/ObstacleType");
class LootItem {
    constructor(id, centerX, centerY, type, quantity) {
        this.finalSize = 60;
        this.active = true;
        this.lootTimer = 15;
        this.id = id;
        this.size = 30;
        this.radius = this.finalSize / 2;
        this.x = centerX - this.radius + this.size / 2;
        this.y = centerY - this.radius + this.size / 2;
        this.type = type;
        this.quantity = quantity;
    }
    isPlayerIn(player) {
        const lootAndPlayerRadius = Player_1.Player.radius + this.radius;
        const x = this.getCenterX() - player.getCenterX();
        const y = this.getCenterY() - player.getCenterY();
        const distance = Math.sqrt(x * x + y * y);
        return distance < lootAndPlayerRadius;
    }
    isActive() {
        return this.active;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getCenterX() {
        return this.x + this.radius;
    }
    getCenterY() {
        return this.y + this.radius;
    }
    calcAngle(objectCenterX, objectCenterY) {
        let x = this.getCenterX() - objectCenterX;
        let y = this.getCenterY() - objectCenterY;
        if (x === 0)
            x += 0.1;
        if (y === 0)
            y -= 0.1;
        //atangens
        let angle = Math.abs((Math.atan(x / y) * 180) / Math.PI);
        let finalAngle = 0;
        //1..2..3..4.. Q; 0 - 90, 90 - 180...
        //1
        if (objectCenterX >= this.getCenterX() && objectCenterY < this.getCenterY()) {
            finalAngle = angle;
        }
        else if (objectCenterX >= this.getCenterX() && objectCenterY >= this.getCenterY()) {
            //2
            finalAngle = 180 - angle;
        }
        else if (objectCenterX < this.getCenterX() && objectCenterY >= this.getCenterY()) {
            //3
            finalAngle = 180 + angle;
        }
        else if (objectCenterX < this.getCenterX() && objectCenterY < this.getCenterY()) {
            //4
            finalAngle = 360 - angle;
        }
        finalAngle = Math.round(finalAngle);
        //random change
        const change = Math.floor(Math.random() * 30);
        let direction = 1;
        if (Math.round(Math.random()))
            direction = -1;
        finalAngle = finalAngle + direction * change;
        if (finalAngle > 359)
            finalAngle = finalAngle - 360;
        return finalAngle;
    }
    move(lootItems, map) {
        if (this.lootTimer > 0) {
            this.size += 2;
            this.x--;
            this.y--;
            this.lootTimer--;
        }
        for (const lootItem of lootItems) {
            if (lootItem === this)
                continue;
            if (this.objectIn(lootItem)) {
                const angle = this.calcAngle(lootItem.getCenterX(), lootItem.getCenterY());
                this.shift(angle, map);
            }
        }
        for (const obstacle of map.roundObstacles) {
            if (obstacle.type !== ObstacleType_1.ObstacleType.Rock && obstacle.type !== ObstacleType_1.ObstacleType.Tree)
                continue;
            if (obstacle.isActive() && this.objectIn(obstacle)) {
                const angle = this.calcAngle(obstacle.getCenterX(), obstacle.getCenterY());
                this.shift(angle, map);
            }
        }
        for (const object of map.rectangleObstacles) {
            if (object.isActive() && this.objectIn(object)) {
                const angle = this.calcAngle(object.x + object.width / 2, object.y + object.height / 2);
                this.shift(angle, map);
            }
        }
    }
    shift(angle, map) {
        const shiftZ = 5 * Math.random();
        let shiftX = Math.sin((angle * Math.PI) / 180) * shiftZ;
        let shiftY = Math.cos((angle * Math.PI) / 180) * shiftZ;
        this.x -= shiftX;
        this.y += shiftY;
        //map border
        if (this.x < 0)
            this.x = 0;
        if (this.y < 0)
            this.y = 0;
        if (this.x + this.size > map.getSize())
            this.x = map.getSize() - this.size;
        if (this.y + this.size > map.getSize())
            this.y = map.getSize() - this.size;
    }
    objectIn(object) {
        //triangle
        let objectRadius, objectCenterX, objectCenterY;
        if (object instanceof LootItem || object instanceof RoundObstacle_1.default) {
            objectRadius = object.radius;
            if (object instanceof Tree_1.default)
                objectRadius = object.treeTrankRadius;
            objectCenterX = object.getCenterX();
            objectCenterY = object.getCenterY();
        }
        else if (object instanceof RectangleObstacle_1.default) {
            //rectangle rectangle
            //loot + gap
            const gap = 10;
            //rectangle loot in rectangle wall
            if (this.x - gap <= object.x + object.width &&
                this.x + this.finalSize + gap >= object.x &&
                this.y - gap <= object.y + object.height &&
                this.y + this.finalSize + gap >= object.y) {
                return true;
            }
            else {
                return false;
            }
        }
        const x = this.getCenterX() - objectCenterX;
        const y = this.getCenterY() - objectCenterY;
        const radius = Math.sqrt(x * x + y * y);
        const gap = 20;
        return radius < objectRadius + this.radius + gap;
    }
    take() {
        this.active = false;
    }
}
exports.default = LootItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdEl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9vdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFHbEMsb0VBQTZEO0FBQzdELDREQUFxRDtBQUNyRCwwQ0FBbUM7QUFDbkMsMERBQXVEO0FBRXZELE1BQXFCLFFBQVE7SUFZNUIsWUFBWSxFQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxJQUFjLEVBQUUsUUFBZ0I7UUFSakYsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUloQixXQUFNLEdBQVksSUFBSSxDQUFDO1FBRXZCLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFHdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFFYixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYztRQUN4QixNQUFNLG1CQUFtQixHQUFHLGVBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUs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