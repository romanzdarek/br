import { Terrain, TerrainType } from './Terrain';
import Bush from './Bush';
import Rock from './Rock';
import Tree from './Tree';
import Wall from './Wall';
import Colors from './Colors';
export default class Editor {
    constructor(myHtmlElements, socket) {
        this.active = false;
        this.blockSize = 300;
        this.terrains = [];
        this.bushes = [];
        this.rocks = [];
        this.trees = [];
        this.walls = [];
        this.objects = [];
        this.myHtmlElements = myHtmlElements;
        this.socket = socket;
        this.colors = new Colors();
        this.bush = new Bush(0, 0, 0);
        this.rock = new Rock(0, 0, 0);
        this.tree = new Tree(0, 0, 0);
        this.controller();
    }
    isActive() {
        return this.active;
    }
    close() {
        this.active = false;
    }
    getTerrainType() {
        return this.terrainType;
    }
    getObjectType() {
        return this.objectType;
    }
    getSize() {
        return this.size;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getMapData() {
        const mapData = {
            size: this.size,
            blockSize: this.blockSize,
            terrains: this.terrains,
            rects: this.walls,
            bushes: this.bushes,
            rocks: this.rocks,
            trees: this.trees
        };
        return mapData;
    }
    create() {
        this.cleanMap();
    }
    changeSize(size) {
        this.active = true;
        const el = this.myHtmlElements;
        this.size = size;
        el.editor.screen.width = size * this.blockSize;
        el.editor.screen.height = size * this.blockSize;
        const widthString = (size * this.blockSize).toString();
        el.editor.screen.style.width = widthString;
        const heightString = (size * this.blockSize).toString();
        el.editor.screen.style.width = heightString;
        this.cleanMapAfterChangeSize();
    }
    cleanMap() {
        this.terrains = [];
        this.bushes = [];
        this.rocks = [];
        this.trees = [];
        this.walls = [];
    }
    cleanMapAfterChangeSize() {
        const mapSize = this.size * this.blockSize;
        let arr = this.terrains;
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item.x >= mapSize || item.y >= mapSize) {
                arr.splice(i, 1);
            }
        }
        arr = this.trees;
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item.x >= mapSize || item.y >= mapSize) {
                arr.splice(i, 1);
            }
        }
        arr = this.rocks;
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item.x >= mapSize || item.y >= mapSize) {
                arr.splice(i, 1);
            }
        }
        arr = this.bushes;
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item.x >= mapSize || item.y >= mapSize) {
                arr.splice(i, 1);
            }
        }
        arr = this.walls;
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item.x >= mapSize || item.y >= mapSize) {
                arr.splice(i, 1);
            }
        }
    }
    openMap(mapData) {
        this.create();
        this.changeSize(mapData.size);
        let id = 0;
        for (const item of mapData.rocks) {
            this.rocks.push(new Rock(id++, item.x, item.y));
        }
        for (const item of mapData.trees) {
            this.trees.push(new Tree(id++, item.x, item.y));
        }
        for (const item of mapData.bushes) {
            this.bushes.push(new Bush(id++, item.x, item.y));
        }
        for (const item of mapData.rects) {
            this.walls.push(new Wall(id++, item.x, item.y, item.width, item.height));
        }
        for (const item of mapData.terrains) {
            this.terrains.push(new Terrain(item.type, item.x, item.y, item.size));
        }
        this.cleanMapAfterChangeSize();
    }
    controller() {
        const el = this.myHtmlElements;
        //editorScreen mouse move
        el.editor.screen.addEventListener('mousemove', (e) => {
            const canvasRect = el.editor.screen.getBoundingClientRect();
            this.x = e.clientX + el.editor.screen.scrollLeft - canvasRect.left;
            this.y = e.clientY + el.editor.screen.scrollTop - canvasRect.top;
            el.editor.coordinates.innerText = `x: ${this.x} y: ${this.y}`;
        });
        //choose terrain type
        el.editor.terrainImgs.addEventListener('click', (e) => {
            const terrainImgs = el.editor.terrainImgs.children;
            for (let i = 0; i < terrainImgs.length; i++) {
                terrainImgs[i].style.borderColor = this.colors.blockFrame;
            }
            const objectImgs = el.editor.objectImgs.children;
            for (let i = 0; i < objectImgs.length; i++) {
                objectImgs[i].style.borderColor = this.colors.blockFrame;
            }
            e.target.style.borderColor = this.colors.blockFrameActive;
            this.objectType = null;
            switch (e.target) {
                case el.editor.terrainWater:
                    this.terrainType = TerrainType.Water;
                    break;
                case el.editor.terrainGrass:
                    this.terrainType = TerrainType.Grass;
                    break;
                case el.editor.terrainWaterTriangle1:
                    this.terrainType = TerrainType.WaterTriangle1;
                    break;
                case el.editor.terrainWaterTriangle2:
                    this.terrainType = TerrainType.WaterTriangle2;
                    break;
                case el.editor.terrainWaterTriangle3:
                    this.terrainType = TerrainType.WaterTriangle3;
                    break;
                case el.editor.terrainWaterTriangle4:
                    this.terrainType = TerrainType.WaterTriangle4;
                    break;
            }
        });
        //choose object
        el.editor.objectImgs.addEventListener('click', (e) => {
            const terrainImgs = el.editor.terrainImgs.children;
            for (let i = 0; i < terrainImgs.length; i++) {
                terrainImgs[i].style.borderColor = this.colors.blockFrame;
            }
            const objectImgs = el.editor.objectImgs.children;
            for (let i = 0; i < objectImgs.length; i++) {
                objectImgs[i].style.borderColor = this.colors.blockFrame;
            }
            e.target.style.borderColor = this.colors.blockFrameActive;
            this.terrainType = null;
            switch (e.target) {
                case el.editor.objectBush:
                    this.objectType = 'bush';
                    break;
                case el.editor.objectRock:
                    this.objectType = 'rock';
                    break;
                case el.editor.objectTree:
                    this.objectType = 'tree';
                    break;
                case el.editor.objectRect:
                    this.objectType = 'rect';
                    break;
                case el.editor.objectDelete:
                    this.objectType = 'delete';
                    break;
            }
        });
        //editorScreenClick
        el.editor.screen.addEventListener('click', () => {
            if (this.getTerrainType() != null) {
                const blockX = Math.floor(this.getX() / this.blockSize) * this.blockSize;
                const blockY = Math.floor(this.getY() / this.blockSize) * this.blockSize;
                //find block on this position and delete
                let deletePosition = -1;
                for (let i = 0; i < this.terrains.length; i++) {
                    const terrain = this.terrains[i];
                    if (terrain.x === blockX && terrain.y === blockY) {
                        deletePosition = i;
                        break;
                    }
                }
                if (deletePosition !== -1) {
                    this.terrains.splice(deletePosition, 1);
                }
                if (this.getTerrainType() !== TerrainType.Grass) {
                    this.terrains.push(new Terrain(this.getTerrainType(), blockX, blockY, this.blockSize));
                }
            }
            if (this.getObjectType() != null) {
                switch (this.getObjectType()) {
                    case 'bush':
                        this.bushes.push(new Bush(0, this.x - this.bush.size / 2, this.y - this.bush.size / 2));
                        break;
                    case 'rock':
                        this.rocks.push(new Rock(0, this.x - this.rock.size / 2, this.y - this.rock.size / 2));
                        break;
                    case 'tree':
                        this.trees.push(new Tree(0, this.x - this.tree.size / 2, this.y - this.tree.size / 2));
                        break;
                    case 'rect':
                        this.walls.push(new Wall(0, this.x - this.bush.size / 2, this.y - this.bush.size / 2, this.bush.size, this.bush.size));
                        break;
                    case 'delete':
                        //find delete object
                        let deleteObject;
                        const editor = this;
                        for (const rock of editor.rocks) {
                            const object = rock;
                            if (object.x <= editor.getX() &&
                                object.x + object.size >= editor.getX() &&
                                object.y <= editor.getY() &&
                                object.y + object.size >= editor.getY()) {
                                deleteObject = object;
                            }
                        }
                        for (const wall of editor.walls) {
                            const object = wall;
                            if (object.x <= editor.getX() &&
                                object.x + object.width >= editor.getX() &&
                                object.y <= editor.getY() &&
                                object.y + object.height >= editor.getY()) {
                                deleteObject = object;
                            }
                        }
                        for (const bush of editor.bushes) {
                            const object = bush;
                            if (object.x <= editor.getX() &&
                                object.x + object.size >= editor.getX() &&
                                object.y <= editor.getY() &&
                                object.y + object.size >= editor.getY()) {
                                deleteObject = object;
                            }
                        }
                        for (const tree of editor.trees) {
                            const object = tree;
                            if (object.x <= editor.getX() &&
                                object.x + object.size >= editor.getX() &&
                                object.y <= editor.getY() &&
                                object.y + object.size >= editor.getY()) {
                                deleteObject = object;
                            }
                        }
                        //delete
                        let deleteIndex = -1;
                        for (let i = 0; i < this.rocks.length; i++) {
                            if (deleteObject == this.rocks[i])
                                deleteIndex = i;
                        }
                        if (deleteIndex !== -1) {
                            this.rocks.splice(deleteIndex, 1);
                            deleteIndex = -1;
                        }
                        for (let i = 0; i < this.bushes.length; i++) {
                            if (deleteObject == this.bushes[i])
                                deleteIndex = i;
                        }
                        if (deleteIndex !== -1) {
                            this.bushes.splice(deleteIndex, 1);
                            deleteIndex = -1;
                        }
                        for (let i = 0; i < this.trees.length; i++) {
                            if (deleteObject == this.trees[i])
                                deleteIndex = i;
                        }
                        if (deleteIndex !== -1) {
                            this.trees.splice(deleteIndex, 1);
                            deleteIndex = -1;
                        }
                        for (let i = 0; i < this.walls.length; i++) {
                            if (deleteObject == this.walls[i])
                                deleteIndex = i;
                        }
                        if (deleteIndex !== -1) {
                            this.walls.splice(deleteIndex, 1);
                            deleteIndex = -1;
                        }
                        break;
                }
            }
        });
        //socket openMapInEditor
        this.socket.on('openMapInEditor', (mapData) => {
            this.openMap(mapData);
            el.close(el.openMapMenu.main);
            el.open(el.editor.container);
        });
    }
}
//# sourceMappingURL=Editor.js.map