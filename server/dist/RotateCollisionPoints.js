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
                //z nejakeho duvodu dochazelo o posun o 180 stupnu proto k uhlu pridame 180 stupnu
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm90YXRlQ29sbGlzaW9uUG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1JvdGF0ZUNvbGxpc2lvblBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQXFCLHFCQUFxQjtJQUt6QyxZQUFZLE1BQWUsRUFBRSxJQUFZO1FBSGpDLGlCQUFZLEdBQWMsRUFBRSxDQUFDO1FBSXBDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCwwQ0FBMEM7SUFDMUMsMEVBQTBFO0lBQ2xFLE1BQU07UUFDYixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTFDLGdFQUFnRTtRQUNoRSxLQUFLLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFO1lBQ3hELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQ3JCLDBCQUEwQjtnQkFDMUIsNkZBQTZGO2dCQUM3RixDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxjQUFjO2dCQUNkLGtGQUFrRjtnQkFDbEYsSUFBSTtvQkFDSCxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3JHLElBQUk7b0JBQ0gsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRyw0QkFBNEI7Z0JBQzVCLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUN0QixJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzVEO1NBQ0Q7SUFDRixDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBYTtRQUM5QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFlBQVk7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDMUIsQ0FBQztDQUNEO0FBL0NELHdDQStDQyJ9