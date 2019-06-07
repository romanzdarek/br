"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terrain_1 = require("./Terrain");
const Bush_1 = require("./Bush");
const Tree_1 = require("./Tree");
const Rock_1 = require("./Rock");
const Wall_1 = require("./Wall");
//node modules
const fs = require("fs");
const path = require("path");
class Map {
    constructor(waterTerrainData) {
        this.width = 0;
        this.height = 0;
        this.blocks = [];
        this.terrain = [];
        this.impassableRoundObstacles = [];
        this.bushes = [];
        this.trees = [];
        this.rocks = [];
        this.rectangleObstacles = [];
        this.waterTerrainData = waterTerrainData;
        this.openMap();
        /*
        const blockSize = 300;
        this.width = 5 * blockSize;
        this.height = 5 * blockSize;
        //Create blocks
        for (let yy = 0; yy < this.height / blockSize; yy++) {
            for (let xx = 0; xx < this.width / blockSize; xx++) {
                this.blocks.push({ x: xx * blockSize, y: yy * blockSize });
            }
        }

        //terrain
        this.terrain.push(new Terrain(TerrainType.Water, 0, 0, this.width, blockSize));
        this.terrain.push(new Terrain(TerrainType.Water, 0, this.height - blockSize, this.width, blockSize));
        this.terrain.push(new Terrain(TerrainType.Water, 0, blockSize, blockSize, this.height - 2 * blockSize));
        this.terrain.push(
            new Terrain(TerrainType.Water, this.width - blockSize, blockSize, blockSize, this.height - 2 * blockSize)
        );

        //water trangle
        this.terrain.push(new Terrain(TerrainType.WaterTriangle1, blockSize, blockSize, blockSize, blockSize));
        this.terrain.push(new Terrain(TerrainType.WaterTriangle2, 3 * blockSize, blockSize, blockSize, blockSize));
        this.terrain.push(new Terrain(TerrainType.WaterTriangle3, 3 * blockSize, 3 * blockSize, blockSize, blockSize));
        this.terrain.push(new Terrain(TerrainType.WaterTriangle4, blockSize, 3 * blockSize, blockSize, blockSize));

        let id = 0;
        //bushes
        this.bushes.push(new Bush(++id, 600, 600));
        this.bushes.push(new Bush(++id, 300, 400));

        //rocks
        const rock = new Rock(++id, 100, 100);
        this.rocks.push(rock);
        this.impassableRoundObstacles.push(rock);

        const rock2 = new Rock(++id, 550, 550);
        this.rocks.push(rock2);
        this.impassableRoundObstacles.push(rock2);

        const rock3 = new Rock(++id, 700, 550);
        this.rocks.push(rock3);
        this.impassableRoundObstacles.push(rock3);

        //this.rocks[0].isPointIn(new Point(120, 120));

        //trees
        const tree = new Tree(++id, 800, 800);
        this.trees.push(tree);
        this.impassableRoundObstacles.push(tree);

        const tree2 = new Tree(++id, 0, 0);
        this.trees.push(tree2);
        this.impassableRoundObstacles.push(tree2);

        //walls
        this.rectangleObstacles.push(new Wall(++id, 600, 800, 20, 200));
        this.rectangleObstacles.push(new Wall(++id, 500, 900, 200, 20));
        this.rectangleObstacles.push(new Wall(++id, 500, 350, 300, 100));
        */
    }
    openMap() {
        const fullPath = path.resolve('./dist/maps/mainMap.json');
        if (fs.existsSync(fullPath)) {
            //je třeba smazat keš jinak by se vracela první verze souboru z doby spuštění aplikace pokud aplikace soubor již jednou načetla
            delete require.cache[fullPath];
            const map = require(fullPath);
            this.width = map.width * map.blockSize;
            this.height = map.height * map.blockSize;
            //Create blocks
            for (let yy = 0; yy < map.height; yy++) {
                for (let xx = 0; xx < map.width; xx++) {
                    this.blocks.push({ x: xx * map.blockSize, y: yy * map.blockSize });
                }
            }
            //terrains
            for (const terrain of map.terrains) {
                this.terrain.push(new Terrain_1.Terrain(terrain.type, terrain.x, terrain.y, terrain.width, terrain.height));
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
        else {
            console.log('Error open map');
        }
    }
}
exports.default = Map;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFpRDtBQUNqRCxpQ0FBMEI7QUFDMUIsaUNBQTBCO0FBQzFCLGlDQUEwQjtBQUMxQixpQ0FBMEI7QUFJMUIsY0FBYztBQUNkLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFPN0IsTUFBcUIsR0FBRztJQVl2QixZQUFZLGdCQUFrQztRQVg5QyxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDVixXQUFNLEdBQVksRUFBRSxDQUFDO1FBQ3JCLFlBQU8sR0FBYyxFQUFFLENBQUM7UUFDeEIsNkJBQXdCLEdBQW9CLEVBQUUsQ0FBQztRQUMvQyxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQix1QkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBSXJELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQTBERTtJQUNILENBQUM7SUFFRCxPQUFPO1FBQ04sTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQzFELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM1QiwrSEFBK0g7WUFDL0gsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUc5QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMs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