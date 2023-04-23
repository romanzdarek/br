"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terrain_1 = require("./Terrain");
const Bush_1 = require("./obstacle/Bush");
const Tree_1 = require("./obstacle/Tree");
const Rock_1 = require("./obstacle/Rock");
const ObstacleType_1 = require("./obstacle/ObstacleType");
const Box_1 = require("./obstacle/Box");
const Block_1 = require("./obstacle/Block");
const Camo_1 = require("./obstacle/Camo");
class Map {
    constructor(waterTerrainData, mapData) {
        this.size = 0;
        this.blocks = [];
        this.terrain = [];
        this.roundObstacles = [];
        this.rectangleObstacles = [];
        this.waterTerrainData = waterTerrainData;
        this.blockSize = mapData.blockSize;
        this.openMap(mapData);
    }
    getSize() {
        return this.size;
    }
    getBlockSize() {
        return this.blockSize;
    }
    openMap(mapData) {
        this.size = mapData.size * mapData.blockSize;
        let obstacleId = 0;
        // Create blocks
        for (let yy = 0; yy < mapData.size; yy++) {
            for (let xx = 0; xx < mapData.size; xx++) {
                this.blocks.push({ x: xx * mapData.blockSize, y: yy * mapData.blockSize });
            }
        }
        // Terrain
        for (const terrain of mapData.terrains) {
            this.terrain.push(new Terrain_1.Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
        }
        // Round
        for (const obstacle of mapData.roundObstacles) {
            let newObstacle;
            switch (obstacle.type) {
                case ObstacleType_1.ObstacleType.Rock:
                    newObstacle = new Rock_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.size);
                    break;
                case ObstacleType_1.ObstacleType.Tree:
                    newObstacle = new Tree_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.size, obstacle.angle);
                    break;
                case ObstacleType_1.ObstacleType.Bush:
                    newObstacle = new Bush_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.size, obstacle.angle);
                    break;
            }
            this.roundObstacles.push(newObstacle);
        }
        // Rects
        for (const obstacle of mapData.rectangleObstacles) {
            let newObstacle;
            switch (obstacle.type) {
                case ObstacleType_1.ObstacleType.Box:
                    newObstacle = new Box_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                    break;
                case ObstacleType_1.ObstacleType.Block:
                    newObstacle = new Block_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                    break;
                case ObstacleType_1.ObstacleType.Camo:
                    newObstacle = new Camo_1.default(obstacleId++, obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.angle);
                    break;
            }
            this.rectangleObstacles.push(newObstacle);
        }
    }
}
exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFvQztBQUNwQywwQ0FBbUM7QUFDbkMsMENBQW1DO0FBQ25DLDBDQUFtQztBQUtuQywwREFBdUQ7QUFDdkQsd0NBQWlDO0FBQ2pDLDRDQUFxQztBQUNyQywwQ0FBbUM7QUFPbkMsTUFBcUIsR0FBRztJQVN2QixZQUFZLGdCQUFrQyxFQUFFLE9BQWdCO1FBUnhELFNBQUksR0FBVyxDQUFDLENBQUM7UUFFaEIsV0FBTSxHQUFlLEVBQUUsQ0FBQztRQUN4QixZQUFPLEdBQWMsRUFBRSxDQUFDO1FBQ3hCLG1CQUFjLEdBQW9CLEVBQUUsQ0FBQztRQUNyQyx1QkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBSXJELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsT0FBTztRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixDQUFDO0lBRUQsWUFBWTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN2QixDQUFDO0lBRU8sT0FBTyxDQUFDLE9BQWdCO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzdDLElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztRQUUzQixnQkFBZ0I7UUFDaEIsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDekMsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUs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