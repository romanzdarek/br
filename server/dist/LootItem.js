"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const RectangleObstacle_1 = require("./RectangleObstacle");
const RoundObstacle_1 = require("./RoundObstacle");
const Tree_1 = require("./Tree");
class LootItem {
    constructor(id, centerX, centerY, type, quantity) {
        this.active = true;
        this.id = id;
        this.size = 60;
        this.radius = this.size / 2;
        this.x = centerX - this.radius;
        this.y = centerY - this.radius;
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
        let angle = Math.abs(Math.atan(x / y) * 180 / Math.PI);
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
        for (const lootItem of lootItems) {
            if (lootItem === this)
                continue;
            if (this.objectIn(lootItem)) {
                const angle = this.calcAngle(lootItem.getCenterX(), lootItem.getCenterY());
                this.shift(angle, map);
            }
        }
        for (const object of map.rocks) {
            if (object.isActive() && this.objectIn(object)) {
                const angle = this.calcAngle(object.getCenterX(), object.getCenterY());
                this.shift(angle, map);
            }
        }
        for (const object of map.trees) {
            if (object.isActive() && this.objectIn(object)) {
                const angle = this.calcAngle(object.getCenterX(), object.getCenterY());
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
        let shiftX = Math.sin(angle * Math.PI / 180) * shiftZ;
        let shiftY = Math.cos(angle * Math.PI / 180) * shiftZ;
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
                this.x + this.size + gap >= object.x &&
                this.y - gap <= object.y + object.height &&
                this.y + this.size + gap >= object.y) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdEl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9vdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFHbEMsMkRBQW9EO0FBQ3BELG1EQUE0QztBQUM1QyxpQ0FBMEI7QUFFMUIsTUFBcUIsUUFBUTtJQVU1QixZQUFZLEVBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLElBQWMsRUFBRSxRQUFnQjtRQUhsRixXQUFNLEdBQVksSUFBSSxDQUFDO1FBSTlCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMxQixDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQWM7UUFDeEIsTUFBTSxtQkFBbUIsR0FBRyxlQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDeEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsT0FB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