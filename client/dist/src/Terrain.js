export var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["Grass"] = 0] = "Grass";
    TerrainType[TerrainType["Water"] = 1] = "Water";
    TerrainType[TerrainType["WaterTriangle1"] = 2] = "WaterTriangle1";
    TerrainType[TerrainType["WaterTriangle2"] = 3] = "WaterTriangle2";
    TerrainType[TerrainType["WaterTriangle3"] = 4] = "WaterTriangle3";
    TerrainType[TerrainType["WaterTriangle4"] = 5] = "WaterTriangle4";
})(TerrainType || (TerrainType = {}));
export class Terrain {
    constructor(type, x, y, size) {
        this.angle = 0;
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        switch (type) {
            case TerrainType.WaterTriangle2:
                this.angle = 90;
                break;
            case TerrainType.WaterTriangle3:
                this.angle = 180;
                break;
            case TerrainType.WaterTriangle4:
                this.angle = 270;
                break;
        }
    }
}
//# sourceMappingURL=Terrain.js.map