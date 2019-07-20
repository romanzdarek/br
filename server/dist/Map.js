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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQUNqRCxpQ0FBMEI7QUFDMUIsaUNBQTBCO0FBQzFCLGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFXMUIsTUFBcUIsR0FBRztJQVl2QixZQUFZLGdCQUFrQyxFQUFFLE9BQWdCO1FBWHhELFNBQUksR0FBVyxDQUFDLENBQUM7UUFFaEIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQWMsRUFBRSxDQUFDO1FBQ3hCLDZCQUF3QixHQUFvQixFQUFFLENBQUM7UUFDL0MsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsdUJBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUlyRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQU87UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUVELFlBQVk7UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkIsQ0FBQztJQUVPLE9BQU8sQ0FBQyxPQUFZO1FBQzNCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUNyQyxlQUFlO1FBQ2YsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDckMsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDbkU7U0FDRDtRQUVELFVBQVU7UUFDVixLQUFLLE1BQU0sT0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsT0FBTztRQUNQLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsUUFBUTtRQUNSLEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsT0FBTztRQUNQLEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsT0FBTztRQUNQLEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUM3QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3RGO0lBQ0YsQ0FBQztDQUNEO0FBOURELHNCQThEQyJ9