"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terrain_1 = require("./Terrain");
const Bush_1 = require("./obstacle/Bush");
const Tree_1 = require("./obstacle/Tree");
const Rock_1 = require("./obstacle/Rock");
const ObstacleType_1 = require("./obstacle/ObstacleType");
const Box_1 = require("./obstacle/Box");
const Block_1 = require("./obstacle/Block");
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
            }
            this.rectangleObstacles.push(newObstacle);
        }
    }
}
exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFvQztBQUNwQywwQ0FBbUM7QUFDbkMsMENBQW1DO0FBQ25DLDBDQUFtQztBQUtuQywwREFBdUQ7QUFDdkQsd0NBQWlDO0FBQ2pDLDRDQUFxQztBQU9yQyxNQUFxQixHQUFHO0lBU3ZCLFlBQVksZ0JBQWtDLEVBQUUsT0FBZ0I7UUFSeEQsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUVoQixXQUFNLEdBQWUsRUFBRSxDQUFDO1FBQ3hCLFlBQU8sR0FBYyxFQUFFLENBQUM7UUFDeEIsbUJBQWMsR0FBb0IsRUFBRSxDQUFDO1FBQ3JDLHVCQUFrQixHQUF3QixFQUFFLENBQUM7UUFJckQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxPQUFPO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxZQUFZO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxPQUFPLENBQUMsT0FBZ0I7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDN0MsSUFBSSxVQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRTNCLGdCQUFnQjtRQUNoQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUN6QyxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFB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