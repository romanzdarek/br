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
        this.size = 60; //60 default
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdEl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9vdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFHbEMsMkRBQW9EO0FBQ3BELG1EQUE0QztBQUM1QyxpQ0FBMEI7QUFFMUIsTUFBcUIsUUFBUTtJQVU1QixZQUFZLEVBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLElBQWMsRUFBRSxRQUFnQjtRQUhsRixXQUFNLEdBQVksSUFBSSxDQUFDO1FBSTlCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxZQUFZO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYztRQUN4QixNQUFNLG1CQUFtQixHQUFHLGVBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4RCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FB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Q0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxDQUFDLFNBQXFCLEVBQUUsR0FBUTtRQUNuQyxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUNqQyxJQUFJLFFBQVEsS0FBSyxJQUFJO2dCQUFFLFNBQVM7WUFDaEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdkI7U0FDRDtRQUNELEtBQUssTUFBTSxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUMvQixJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdkI7U0FDRDtRQUNELEtBQUssTUFBTSxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUMvQixJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdkI7U0FDRDtRQUNELEtBQUssTUFBTSxNQUFNLElBQUksR0FBRyxDQUFDLGtCQUFrQixFQUFFO1lBQzVDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hGLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0Q7SUFDRixDQUFDO0lBRU8sS0FBSyxDQUFDLEtBQWEsRUFBRSxHQUFRO1FBQ3BDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3hELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUN4RCxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQztRQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQztRQUVqQixZQUFZO1FBQ1osSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzNFLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVFLENBQUM7SUFFTyxRQUFRLENBQUMsTUFBb0Q7UUFDcEUsVUFBVTtRQUNWLElBQUksWUFBWSxFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUM7UUFDL0MsSUFBSSxNQUFNLFlBQVksUUFBUSxJQUFJLE1BQU0sWUFBWSx1QkFBYSxFQUFFO1lBQ2xFLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksTUFBTSxZQUFZLGNBQUk7Z0JBQUUsWUFBWSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDbEUsYUFBYSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQyxhQUFhLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxNQUFNLFlBQVksMkJBQWlCLEVBQUU7WUFDL0MscUJBQXFCO1lBQ3JCLFlBQVk7WUFDWixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDZixrQ0FBa0M7WUFDbEMsSUFDQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLO2dCQUN2QyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNO2dCQUN4QyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQ25DO2dCQUNELE9BQU8sSUFBSSxDQUFDO2FBQ1o7aUJBQU07Z0JBQ04sT0FBTyxLQUFLLENBQUM7YUFDYjtTQUNEO1FBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLGFBQWEsQ0FBQztRQUM1QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsYUFBYSxDQUFDO1FBQzVDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsT0FBTyxNQUFNLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFJO1FBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztDQUNEO0FBcEtELDJCQW9LQyJ9