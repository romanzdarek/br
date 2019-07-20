import { Terrain } from './Terrain';
import Bush from './Bush';
import Tree from './Tree';
import Rock from './Rock';
import Wall from './Wall';
export default class Map {
    constructor(waterTerrainData) {
        this.blocks = [];
        this.terrain = [];
        this.impassableRoundObstacles = [];
        this.bushes = [];
        this.trees = [];
        this.rocks = [];
        this.rectangleObstacles = [];
        this.waterTerrainData = waterTerrainData;
    }
    getSize() {
        return this.size;
    }
    getBlockSize() {
        return this.blockSize;
    }
    openMap(map) {
        this.size = map.size * map.blockSize;
        this.blockSize = map.blockSize;
        //Create blocks
        for (let yy = 0; yy < map.size; yy++) {
            for (let xx = 0; xx < map.size; xx++) {
                this.blocks.push({ x: xx * map.blockSize, y: yy * map.blockSize });
            }
        }
        //terrains
        for (const terrain of map.terrains) {
            this.terrain.push(new Terrain(terrain.type, terrain.x, terrain.y, terrain.size));
        }
        //rocks
        let id = 0;
        for (const rock of map.rocks) {
            const newRock = new Rock(id++, rock.x, rock.y);
            this.rocks.push(newRock);
            this.impassableRoundObstacles.push(newRock);
        }
        //bushes
        for (const bush of map.bushes) {
            this.bushes.push(new Bush(id++, bush.x, bush.y));
        }
        //trees
        for (const tree of map.trees) {
            const newTree = new Tree(id++, tree.x, tree.y);
            this.trees.push(newTree);
            this.impassableRoundObstacles.push(newTree);
        }
        //walls
        for (const wall of map.rects) {
            this.rectangleObstacles.push(new Wall(id++, wall.x, wall.y, wall.width, wall.height));
        }
    }
}
//# sourceMappingURL=Map.js.map