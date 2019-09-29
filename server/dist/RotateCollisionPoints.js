"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RotateCollisionPoints {
    constructor(points, size) {
        this.rotatePoints = [];
        this.size = size;
        this.points = points;
        this.rotate();
    }
    //zrotujeme body kolem přostředního pixelu
    //je třeba obrázek s lichou delkou stran - musíme vybrat prostřední pixel!
    rotate() {
        const centerX = Math.floor(this.size / 2);
        const centerY = Math.floor(this.size / 2);
        //rotace: http://ottp.fme.vutbr.cz/users/pavelek/optika/1503.htm
        for (let shiftAngle = 0; shiftAngle < 360; shiftAngle++) {
            this.rotatePoints[shiftAngle] = [];
            for (let point = 0; point < this.points.length; point++) {
                let x, y, newX, newY;
                //posun počítany od středu
                //centerX neni width/2 ale prostřední pixel tj. při délce 5 je to 2 (prvni px je na pozici 0)
                x = centerX - this.points[point].x;
                y = centerY - this.points[point].y;
                //posun o úhel
                newX =
                    x * Math.cos((shiftAngle + 180) * Math.PI / 180) - y * Math.sin((shiftAngle + 180) * Math.PI / 180);
                newY =
                    x * Math.sin((shiftAngle + 180) * Math.PI / 180) + y * Math.cos((shiftAngle + 180) * Math.PI / 180);
                //posunutí do původni pozice
                newX = newX + centerX;
                newY = newY + centerY;
                this.rotatePoints[shiftAngle][point] = { x: newX, y: newY };
            }
        }
    }
    getPointsForAngle(angle) {
        return this.rotatePoints[angle];
    }
    getAllPoints() {
        return this.rotatePoints;
    }
}
exports.default = RotateCollisionPoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm90YXRlQ29sbGlzaW9uUG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1JvdGF0ZUNvbGxpc2lvblBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQXFCLHFCQUFxQjtJQUt6QyxZQUFZLE1BQWUsRUFBRSxJQUFZO1FBSGpDLGlCQUFZLEdBQWMsRUFBRSxDQUFDO1FBSXBDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCwwQ0FBMEM7SUFDMUMsMEVBQTBFO0lBQ2xFLE1BQU07UUFDYixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTFDLGdFQUFnRTtRQUNoRSxLQUFLLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFO1lBQ3hELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ3JCLDBCQUEwQjtnQkFDMUIsNkZBQTZGO2dCQUM3RixDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxjQUFjO2dCQUNkLElBQUk7b0JBQ0gsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRyxJQUFJO29CQUNILENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDckcsNEJBQTRCO2dCQUM1QixJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDdEIsSUFBSSxHQUFHLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM1RDtTQUNEO0lBQ0YsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQWE7UUFDOUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxZQUFZO1FBQ1gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzFCLENBQUM7Q0FDRDtBQTlDRCx3Q0E4Q0MifQ==