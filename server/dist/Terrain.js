"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["Water"] = 0] = "Water";
    TerrainType[TerrainType["WaterTriangle1"] = 1] = "WaterTriangle1";
    TerrainType[TerrainType["WaterTriangle2"] = 2] = "WaterTriangle2";
    TerrainType[TerrainType["WaterTriangle3"] = 3] = "WaterTriangle3";
    TerrainType[TerrainType["WaterTriangle4"] = 4] = "WaterTriangle4";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxXQU1YO0FBTkQsV0FBWSxXQUFXO0lBQ3RCLCtDQUFLLENBQUE7SUFDTCxpRUFBYyxDQUFBO0lBQ2QsaUVBQWMsQ0FBQTtJQUNkLGlFQUFjLENBQUE7SUFDZCxpRUFBYyxDQUFBO0FBQ2YsQ0FBQyxFQU5XLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTXRCO0FBRUQsTUFBYSxPQUFPO0lBUW5CLFlBQVksSUFBaUIsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxNQUFjO1FBRnpFLFVBQUssR0FBVyxDQUFDLENBQUM7UUFHMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLFFBQVEsSUFBSSxFQUFFO1lBQ2IsS0FBSyxXQUFXLENBQUMsY0FBYztnQkFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLE1BQU07WUFDUCxLQUFLLFdBQVcsQ0FBQyxjQUFjO2dCQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDakIsTUFBTTtZQUNQLEtBQUssV0FBVyxDQUFDLGNBQWM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixNQUFNO1NBQ1A7SUFDRixDQUFDO0NBQ0Q7QUEzQkQsMEJBMkJDIn0=