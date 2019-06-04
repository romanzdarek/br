"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerPackage {
    constructor(player) {
        //hands
        this.h = [];
        this.x = player.getX();
        this.y = player.getY();
        this.a = player.getAngle();
        this.n = player.name;
        for (const hand of player.hands) {
            this.h.push({ x: hand.getX(), y: hand.getY() });
        }
    }
}
exports.default = PlayerPackage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyUGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbGF5ZXJQYWNrYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsTUFBcUIsYUFBYTtJQVVqQyxZQUFZLE1BQWM7UUFMMUIsT0FBTztRQUNFLE1BQUMsR0FBa0IsRUFBRSxDQUFDO1FBSzlCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNyQixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0YsQ0FBQztDQUNEO0FBbkJELGdDQW1CQyJ9