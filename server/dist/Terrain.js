"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["Grass"] = 0] = "Grass";
    TerrainType[TerrainType["Water"] = 1] = "Water";
    TerrainType[TerrainType["WaterTriangle1"] = 2] = "WaterTriangle1";
    TerrainType[TerrainType["WaterTriangle2"] = 3] = "WaterTriangle2";
    TerrainType[TerrainType["WaterTriangle3"] = 4] = "WaterTriangle3";
    TerrainType[TerrainType["WaterTriangle4"] = 5] = "WaterTriangle4";
})(TerrainType = exports.TerrainType || (exports.TerrainType = {}));
class Terrain {
    constructor(type, x, y, width, height) {
        this.angle = 0;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxXQU9YO0FBUEQsV0FBWSxXQUFXO0lBQ3RCLCtDQUFLLENBQUE7SUFDTCwrQ0FBSyxDQUFBO0lBQ0wsaUVBQWMsQ0FBQTtJQUNkLGlFQUFjLENBQUE7SUFDZCxpRUFBYyxDQUFBO0lBQ2QsaUVBQWMsQ0FBQTtBQUNmLENBQUMsRUFQVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQU90QjtBQUVELE1BQWEsT0FBTztJQVFuQixZQUFZLElBQWlCLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUZ6RSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixRQUFRLElBQUksRUFBRTtZQUNiLEtBQUssV0FBVyxDQUFDLGNBQWM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixNQUFNO1lBQ1AsS0FBSyxXQUFXLENBQUMsY0FBYztnQkFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLE1BQU07WUFDUCxLQUFLLFdBQVcsQ0FBQyxjQUFjO2dCQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDakIsTUFBTTtTQUNQO0lBQ0YsQ0FBQztDQUNEO0FBM0JELDBCQTJCQyJ9