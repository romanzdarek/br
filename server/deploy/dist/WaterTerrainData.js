"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terrain_1 = require("./Terrain");
const triangel1Data_1 = require("./triangel1Data");
const triangel2Data_1 = require("./triangel2Data");
const triangel3Data_1 = require("./triangel3Data");
const triangel4Data_1 = require("./triangel4Data");
class WaterTerrainData {
    constructor() {
        /*
        private waterTriangle1: boolean[][] = [];
        private waterTriangle2: boolean[][] = [];
        private waterTriangle3: boolean[][] = [];
        private waterTriangle4: boolean[][] = [];
        */
        this.waterTriangle1 = triangel1Data_1.triangel1;
        this.waterTriangle2 = triangel2Data_1.triangel2;
        this.waterTriangle3 = triangel3Data_1.triangel3;
        this.waterTriangle4 = triangel4Data_1.triangel4;
    }
    /*
    setData(type: TerrainType, data: boolean[][]): void {
        switch (type) {
            case TerrainType.WaterTriangle1:
                this.waterTriangle1 = data;
                break;
            case TerrainType.WaterTriangle2:
                this.waterTriangle2 = data;
                break;
            case TerrainType.WaterTriangle3:
                this.waterTriangle3 = data;
                break;
            case TerrainType.WaterTriangle4:
                this.waterTriangle4 = data;
                break;
            default:
                throw new Error('Unknown water type');
                break;
        }
    }
*/
    includeWater(type, x, y) {
        let state = false;
        let waterData;
        switch (type) {
            case Terrain_1.TerrainType.WaterTriangle1:
                waterData = this.waterTriangle1;
                break;
            case Terrain_1.TerrainType.WaterTriangle2:
                waterData = this.waterTriangle2;
                break;
            case Terrain_1.TerrainType.WaterTriangle3:
                waterData = this.waterTriangle3;
                break;
            case Terrain_1.TerrainType.WaterTriangle4:
                waterData = this.waterTriangle4;
                break;
            default:
                throw new Error('Unknown water type');
                break;
        }
        if (x < waterData.length && y < waterData[x].length) {
            if (waterData[x][y])
                state = true;
        }
        else {
            //no water data yet
            //no water data == we are in water
            if (waterData.length === 0) {
                state = true;
            }
            else {
                throw new Error('Out of range on water type');
            }
        }
        return state;
    }
}
exports.default = WaterTerrainData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2F0ZXJUZXJyYWluRGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9XYXRlclRlcnJhaW5EYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXdDO0FBQ3hDLG1EQUE0QztBQUM1QyxtREFBNEM7QUFDNUMsbURBQTRDO0FBQzVDLG1EQUE0QztBQUU1QyxNQUFxQixnQkFBZ0I7SUFhcEM7UUFaQTs7Ozs7VUFLRTtRQUVNLG1CQUFjLEdBQWUseUJBQVMsQ0FBQztRQUN2QyxtQkFBYyxHQUFlLHlCQUFTLENBQUM7UUFDdkMsbUJBQWMsR0FBZSx5QkFBUyxDQUFDO1FBQ3ZDLG1CQUFjLEdBQWUseUJBQVMsQ0FBQztJQUVoQyxDQUFDO0lBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQztJQUNELFlBQVksQ0FBQyxJQUFpQixFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ25ELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLFNBQVMsQ0FBQztRQUNkLFFBQVEsSUFBSSxFQUFFO1lBQ2IsS0FBSyxxQkFBVyxDQUFDLGNBQWM7Z0JBQzlCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxNQUFNO1lBQ1AsS0FBSyxxQkFBVyxDQUFDLGNBQWM7Z0JBQzlCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxNQUFNO1lBQ1AsS0FBSyxxQkFBVyxDQUFDLGNBQWM7Z0JBQzlCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxNQUFNO1lBQ1AsS0FBSyxxQkFBVyxDQUFDLGNBQWM7Z0JBQzlCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxNQUFNO1lBQ1A7Z0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNO1NBQ1A7UUFDRCxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3BELElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ2xDO2FBQ0k7WUFDSixtQkFBbUI7WUFDbkIsa0NBQWtDO1lBQ2xDLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLEtBQUssR0FBRyxJQUFJLENBQUM7YUFDYjtpQkFDSTtnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDOUM7U0FDRDtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztDQUNEO0FBdEVELG1DQXNFQyJ9