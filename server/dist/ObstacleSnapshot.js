"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RectangleObstacle_1 = require("./obstacle/RectangleObstacle");
class ObstacleSnapshot {
    constructor(obstacle) {
        this.id = obstacle.id;
        this.opacity = obstacle.getOpacity();
        this.type = obstacle.type;
        this.x = obstacle.x;
        this.y = obstacle.y;
        if (obstacle instanceof RectangleObstacle_1.default) {
            this.width = obstacle.width;
            this.height = obstacle.height;
        }
        else {
            this.size = obstacle.size;
        }
    }
}
exports.default = ObstacleSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzdGFjbGVTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9PYnN0YWNsZVNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0VBQTZEO0FBRzdELE1BQXFCLGdCQUFnQjtJQVVwQyxZQUFZLFFBQTJDO1FBQ3RELElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFFMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVwQixJQUFJLFFBQVEsWUFBWSwyQkFBaUIsRUFBRTtZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzlCO2FBQU07WUFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDMUI7SUFDRixDQUFDO0NBQ0Q7QUF6QkQsbUNBeUJDIn0=