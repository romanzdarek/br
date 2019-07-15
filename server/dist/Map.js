"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terrain_1 = require("./Terrain");
const Bush_1 = require("./Bush");
const Tree_1 = require("./Tree");
const Rock_1 = require("./Rock");
const Wall_1 = require("./Wall");
class Map {
    constructor(waterTerrainData, mapData) {
        this.size = 0;
        this.blocks = [];
        this.terrain = [];
        this.impassableRoundObstacles = [];
        this.bushes = [];
        this.trees = [];
        this.rocks = [];
        this.rectangleObstacles = [];
        this.waterTerrainData = waterTerrainData;
        this.openMap(mapData);
    }
    getSize() {
        return this.size;
    }
    openMap(mapData) {
        const map = mapData;
        this.size = map.size * map.blockSize;
        //Create blocks
        for (let yy = 0; yy < map.size; yy++) {
            for (let xx = 0; xx < map.size; xx++) {
                this.blocks.push({ x: xx * map.blockSize, y: yy * map.blockSize });
            }
        }
        //terrains
        for (const terrain of map.terrains) {
            this.terrain.push(new Terrain_1.Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
        }
        //rocks
        let id = 0;
        for (const rock of map.rocks) {
            const newRock = new Rock_1.default(id++, rock.x, rock.y);
            this.rocks.push(newRock);
            this.impassableRoundObstacles.push(newRock);
        }
        //bushes
        for (const bush of map.bushes) {
            this.bushes.push(new Bush_1.default(id++, bush.x, bush.y));
        }
        //trees
        for (const tree of map.trees) {
            const newTree = new Tree_1.default(id++, tree.x, tree.y);
            this.trees.push(newTree);
            this.impassableRoundObstacles.push(newTree);
        }
        //walls
        for (const wall of map.rects) {
            this.rectangleObstacles.push(new Wall_1.default(id++, wall.x, wall.y, wall.width, wall.height));
        }
    }
}
exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQUNqRCxpQ0FBMEI7QUFDMUIsaUNBQTBCO0FBQzFCLGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFXMUIsTUFBcUIsR0FBRztJQVd2QixZQUFZLGdCQUFrQyxFQUFFLE9BQWdCO1FBVnhELFNBQUksR0FBVyxDQUFDLENBQUM7UUFDaEIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQWMsRUFBRSxDQUFDO1FBQ3hCLDZCQUF3QixHQUFvQixFQUFFLENBQUM7UUFDL0MsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsdUJBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUlyRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsT0FBTztRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixDQUFDO0lBRU8sT0FBTyxDQUFDLE9BQVk7UUFDM0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ3JDLGVBQWU7UUFDZixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUNyQyxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNuRTtTQUNEO1FBRUQsVUFBVTtRQUNWLEtBQUssTUFBTSxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDakY7UUFDRCxPQUFPO1FBQ1AsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7UUFDRCxRQUFRO1FBQ1IsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakQ7UUFDRCxPQUFPO1FBQ1AsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPO1FBQ1AsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQzdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDdEY7SUFDRixDQUFDO0NBQ0Q7QUF4REQsc0JBd0RDIn0=