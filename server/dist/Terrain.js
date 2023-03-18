"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TerrainType;
(function (TerrainType) {
    TerrainType["Grass"] = "Grass";
    TerrainType["Water"] = "Water";
    TerrainType["WaterTriangle1"] = "WaterTriangle1";
    TerrainType["WaterTriangle2"] = "WaterTriangle2";
    TerrainType["WaterTriangle3"] = "WaterTriangle3";
    TerrainType["WaterTriangle4"] = "WaterTriangle4";
})(TerrainType = exports.TerrainType || (exports.TerrainType = {}));
class Terrain {
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
exports.Terrain = Terrain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxXQU9YO0FBUEQsV0FBWSxXQUFXO0lBQ3RCLDhCQUFlLENBQUE7SUFDZiw4QkFBZSxDQUFBO0lBQ2YsZ0RBQWlDLENBQUE7SUFDakMsZ0RBQWlDLENBQUE7SUFDakMsZ0RBQWlDLENBQUE7SUFDakMsZ0RBQWlDLENBQUE7QUFDbEMsQ0FBQyxFQVBXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBT3RCO0FBRUQsTUFBYSxPQUFPO0lBT25CLFlBQVksSUFBaUIsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVk7UUFGeEQsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUcxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLFdBQVcsQ0FBQyxjQUFjO2dCQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsTUFBTTtZQUNQLEtBQUssV0FBVyxDQUFDLGNBQWM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixNQUFNO1lBQ1AsS0FBSyxXQUFXLENBQUMsY0FBYztnQkFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLE1BQU07U0FDUDtJQUNGLENBQUM7Q0FDRDtBQXpCRCwwQkF5QkMifQ==