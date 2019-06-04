"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerSnapshot {
    constructor(player) {
        //hands
        this.h = [];
        //1 = zero digit after the comma
        //10 = one digit after the comma
        //100 = two digits after the comma
        const afterComma = 10;
        this.x = Math.round(player.getX() * afterComma) / afterComma;
        this.y = Math.round(player.getY() * afterComma) / afterComma;
        this.a = player.getAngle();
        this.n = player.name;
        for (const hand of player.hands) {
            this.h.push({
                x: Math.round(hand.getX() * afterComma) / afterComma,
                y: Math.round(hand.getY() * afterComma) / afterComma
            });
        }
    }
}
exports.default = PlayerSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGxheWVyU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxNQUFxQixjQUFjO0lBVWxDLFlBQVksTUFBYztRQUwxQixPQUFPO1FBQ0UsTUFBQyxHQUFrQixFQUFFLENBQUM7UUFLOUIsZ0NBQWdDO1FBQ2hDLGdDQUFnQztRQUNoQyxrQ0FBa0M7UUFDbEMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdELElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNyQixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVU7Z0JBQ3BELENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVO2FBQ3BELENBQUMsQ0FBQztTQUNIO0lBQ0YsQ0FBQztDQUNEO0FBMUJELGlDQTBCQyJ9