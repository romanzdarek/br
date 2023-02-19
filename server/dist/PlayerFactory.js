"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
class PlayerFactory {
    constructor() {
        this.playerId = 0;
    }
    create(name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFacory, killmessages, sounds) {
        return new Player_1.Player(this.playerId++, name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFacory, killmessages, sounds);
    }
}
exports.default = PlayerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyRmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbGF5ZXJGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscUNBQWtDO0FBT2xDLE1BQXFCLGFBQWE7SUFBbEM7UUFDUyxhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBZ0I5QixDQUFDO0lBZkEsTUFBTSxDQUNMLElBQVksRUFDWixNQUF1QixFQUN2QixHQUFRLEVBQ1IsZUFBZ0MsRUFDaEMsT0FBaUIsRUFDakIsT0FBaUIsRUFDakIsUUFBMEIsRUFDMUIsSUFBVSxFQUNWLFlBQTJCLEVBQzNCLFlBQXNCLEVBQ3RCLE1BQWU7UUFFZixPQUFPLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUksQ0FBQztDQUNEO0FBakJELGdDQWlCQyJ9