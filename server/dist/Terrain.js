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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxXQU9YO0FBUEQsV0FBWSxXQUFXO0lBQ3RCLCtDQUFLLENBQUE7SUFDTCwrQ0FBSyxDQUFBO0lBQ0wsaUVBQWMsQ0FBQTtJQUNkLGlFQUFjLENBQUE7SUFDZCxpRUFBYyxDQUFBO0lBQ2QsaUVBQWMsQ0FBQTtBQUNmLENBQUMsRUFQVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQU90QjtBQUVELE1BQWEsT0FBTztJQU9uQixZQUFZLElBQWlCLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZO1FBRnhELFVBQUssR0FBVyxDQUFDLENBQUM7UUFHMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLFFBQVEsSUFBSSxFQUFFO1lBQ2IsS0FBSyxXQUFXLENBQUMsY0FBYztnQkFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLE1BQU07WUFDUCxLQUFLLFdBQVcsQ0FBQyxjQUFjO2dCQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDakIsTUFBTTtZQUNQLEtBQUssV0FBVyxDQUFDLGNBQWM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixNQUFNO1NBQ1A7SUFDRixDQUFDO0NBQ0Q7QUF6QkQsMEJBeUJDIn0=