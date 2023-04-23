"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LootItem_1 = require("./LootItem");
const LootType_1 = require("./LootType");
const RoundObstacle_1 = require("./obstacle/RoundObstacle");
const RectangleObstacle_1 = require("./obstacle/RectangleObstacle");
const app_1 = require("./app");
class Loot {
    constructor(map) {
        this.lootId = 0;
        this.lootItems = [];
        this.randomPositionAttempts = 0;
        this.maxRandomPositionAttempts = 1000;
        this.map = map;
    }
    createRandomLootItem(centerX, centerY) {
        const createRandomLoot = (lootNumber) => {
            switch (lootNumber) {
                case 1:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Pistol, 10, true);
                    break;
                case 2:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Pistol, 10, true);
                    break;
                case 3:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Rifle, 1, true);
                    break;
                case 4:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Shotgun, 2, true);
                    break;
                case 5:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Machinegun, 30, true);
                    break;
                case 6:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Hammer);
                    break;
                case 7:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Vest);
                    break;
                case 8:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Scope2);
                    break;
                case 9:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Scope4);
                    break;
                case 10:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Scope6);
                    break;
                case 11:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Granade, 3);
                    break;
                case 12:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Smoke, 3);
                    break;
                case 13:
                    this.createLootItem(centerX, centerY, LootType_1.LootType.Medkit);
            }
        };
        const randomLootNumber = Math.floor(Math.random() * 13);
        createRandomLoot(randomLootNumber);
        const extraRandomLootNumber = Math.floor(Math.random() * 13 * 2);
        const extra2RandomLootNumber = Math.floor(Math.random() * 13 * 4);
        createRandomLoot(extraRandomLootNumber);
        createRandomLoot(extra2RandomLootNumber);
    }
    createLootItem(centerX, centerY, type, quantity = 1, includeAmmo = false) {
        const loot = new LootItem_1.default(this.lootId++, centerX, centerY, type, quantity);
        if (centerX === 0 && centerY === 0)
            this.setRandomPosition(loot);
        this.lootItems.push(loot);
        // Add ammo
        if (includeAmmo) {
            const lootItemGap = loot.size;
            if (loot.type === LootType_1.LootType.Pistol) {
                let directionX = 1;
                let directionY = 1;
                if (Math.random() > 0.5)
                    directionX = -1;
                if (Math.random() > 0.5)
                    directionY = -1;
                //+ammo
                this.lootItems.push(new LootItem_1.default(this.lootId++, loot.getCenterX() + lootItemGap * directionX, loot.getCenterY() + lootItemGap * directionY, LootType_1.LootType.OrangeAmmo, 20));
            }
            else if (loot.type === LootType_1.LootType.Rifle) {
                let directionX = 1;
                let directionY = 1;
                if (Math.random() > 0.5)
                    directionX = -1;
                if (Math.random() > 0.5)
                    directionY = -1;
                //+ammo
                this.lootItems.push(new LootItem_1.default(this.lootId++, loot.getCenterX() + lootItemGap * directionX, loot.getCenterY() + lootItemGap * directionY, LootType_1.LootType.GreenAmmo, 5));
            }
            else if (loot.type === LootType_1.LootType.Shotgun) {
                //+ammo
                let directionX = 1;
                let directionY = 1;
                if (Math.random() > 0.5)
                    directionX = -1;
                if (Math.random() > 0.5)
                    directionY = -1;
                this.lootItems.push(new LootItem_1.default(this.lootId++, loot.getCenterX() + lootItemGap * directionX, loot.getCenterY() + lootItemGap * directionY, LootType_1.LootType.RedAmmo, 4));
            }
            else if (loot.type === LootType_1.LootType.Machinegun) {
                //+ammo
                let directionX = 1;
                let directionY = 1;
                if (Math.random() > 0.5)
                    directionX = -1;
                if (Math.random() > 0.5)
                    directionY = -1;
                this.lootItems.push(new LootItem_1.default(this.lootId++, loot.getCenterX() + lootItemGap * directionX, loot.getCenterY() + lootItemGap * directionY, LootType_1.LootType.BlueAmmo, 30));
            }
        }
    }
    setRandomPosition(loot) {
        this.randomPositionAttempts++;
        if (this.randomPositionAttempts > this.maxRandomPositionAttempts)
            console.log('err: maxRandomPositionAttempts');
        const lootSize = loot.size * 3;
        const randomX = Math.floor(Math.random() * (this.map.getSize() - lootSize * 2)) + lootSize;
        const randomY = Math.floor(Math.random() * (this.map.getSize() - lootSize * 2)) + lootSize;
        loot.setX(randomX);
        loot.setY(randomY);
        //repeat
        if (this.randomPositionCollision(loot) && this.randomPositionAttempts < this.maxRandomPositionAttempts) {
            this.setRandomPosition(loot);
        }
    }
    randomPositionCollision(loot) {
        for (const obstacle of this.map.rectangleObstacles) {
            if (this.lootInObstacle(loot, obstacle))
                return true;
        }
        for (const obstacle of this.map.roundObstacles) {
            if (this.lootInObstacle(loot, obstacle))
                return true;
        }
        for (const obstacle of this.lootItems) {
            if (this.lootInObstacle(loot, obstacle))
                return true;
        }
        return false;
    }
    lootInObstacle(loot, obstacle) {
        let x = 0, y = 0, width = 0, height = 0;
        if (obstacle instanceof RectangleObstacle_1.default) {
            width = obstacle.width;
            height = obstacle.height;
            x = obstacle.x;
            y = obstacle.y;
        }
        if (obstacle instanceof RoundObstacle_1.default) {
            width = obstacle.size;
            height = obstacle.size;
            x = obstacle.x;
            y = obstacle.y;
        }
        if (obstacle instanceof LootItem_1.default) {
            width = obstacle.size;
            height = obstacle.size;
            x = obstacle.getX();
            y = obstacle.getY();
        }
        //bigger loot size
        const gap = 2 * loot.size;
        const lootSize = loot.size + gap;
        if (x <= loot.getX() + lootSize && x + width >= loot.getX() && y <= loot.getY() + lootSize && y + height >= loot.getY()) {
            return true;
        }
        else {
            return false;
        }
    }
    //loot balancer
    createMainLootItems(players) {
        if (app_1.appVariant == app_1.AppVariant.Localhost) {
            // TODO
            players = 5;
        }
        for (let i = 0; i < players; i++) {
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Pistol, 10, true);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Pistol, 10, true);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Rifle, 1, true);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Shotgun, 2, true);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Machinegun, 30, true);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Hammer);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Vest);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Scope2);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Scope4);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Scope6);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Granade, 3);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Smoke, 3);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Granade, 3);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Smoke, 3);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Medkit);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.Medkit);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.RedAmmo, 4);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.GreenAmmo, 5);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.BlueAmmo, 30);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.OrangeAmmo, 20);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.RedAmmo, 4);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.GreenAmmo, 5);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.BlueAmmo, 30);
            if (Math.random() > 0.5)
                this.createLootItem(0, 0, LootType_1.LootType.OrangeAmmo, 20);
        }
    }
}
exports.default = Loot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9vdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb290LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQWtDO0FBQ2xDLHlDQUFzQztBQUV0Qyw0REFBcUQ7QUFDckQsb0VBQTZEO0FBQzdELCtCQUErQztBQUUvQyxNQUFxQixJQUFJO0lBT3hCLFlBQVksR0FBUTtRQUxaLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDM0IsY0FBUyxHQUFlLEVBQUUsQ0FBQztRQUNuQiwyQkFBc0IsR0FBVyxDQUFDLENBQUM7UUFDbkMsOEJBQXlCLEdBQVcsSUFBSSxDQUFDO1FBR2hELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxPQUFlLEVBQUUsT0FBZTtRQUNwRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsVUFBa0IsRUFBRSxFQUFFO1lBQy9DLFFBQVEsVUFBVSxFQUFFO2dCQUNuQixLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDakUsTUFBTTtnQkFDUCxLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDakUsTUFBTTtnQkFDUCxLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDL0QsTUFBTTtnQkFDUCxLQUFLLENBQUM7b0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsRUFB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QUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRztnQkFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbEYsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRztnQkFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRztnQkFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRztnQkFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVwRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU1RSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHO2dCQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM1RTtJQUNGLENBQUM7Q0FTRDtBQTVPRCx1QkE0T0MifQ==