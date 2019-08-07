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
        const map = mapData;
        this.size = map.size * map.blockSize;
        let mapObjectId = 0;
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
        for (const rock of map.rocks) {
            const newRock = new Rock_1.default(mapObjectId++, rock.x, rock.y);
            this.rocks.push(newRock);
            this.impassableRoundObstacles.push(newRock);
        }
        //bushes
        for (const bush of map.bushes) {
            this.bushes.push(new Bush_1.default(mapObjectId++, bush.x, bush.y));
        }
        //trees
        for (const tree of map.trees) {
            const newTree = new Tree_1.default(mapObjectId++, tree.x, tree.y);
            this.trees.push(newTree);
            this.impassableRoundObstacles.push(newTree);
        }
        //walls
        for (const wall of map.rects) {
            this.rectangleObstacles.push(new Wall_1.default(mapObjectId++, wall.x, wall.y, wall.width, wall.height));
        }
    }
}
exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQUNqRCxpQ0FBMEI7QUFDMUIsaUNBQTBCO0FBQzFCLGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFXMUIsTUFBcUIsR0FBRztJQVl2QixZQUFZLGdCQUFrQyxFQUFFLE9BQWdCO1FBWHhELFNBQUksR0FBVyxDQUFDLENBQUM7UUFFaEIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQWMsRUFBRSxDQUFDO1FBQ3hCLDZCQUF3QixHQUFvQixFQUFFLENBQUM7UUFDL0MsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsdUJBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUlyRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQU87UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUVELFlBQVk7UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkIsQ0FBQztJQUVPLE9BQU8sQ0FBQyxPQUFZO1FBQzNCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUNyQyxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7UUFDNUIsZUFBZTtRQUNmLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ3JDLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ25FO1NBQ0Q7UUFFRCxVQUFVO1FBQ1YsS0FBSyxNQUFNLE9BQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNqRjtRQUNELE9BQU87UUFDUCxLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QztRQUNELFFBQVE7UUFDUixLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxRDtRQUNELE9BQU87UUFDUCxLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU87UUFDUCxLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRjtJQUNGLENBQUM7Q0FDRDtBQTlERCxzQkE4REMifQ==