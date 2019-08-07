"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
class PlayerFactory {
    constructor() {
        this.playerId = 0;
    }
    create(name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFacory) {
        return new Player_1.Player(this.playerId++, name, socket, map, collisionPoints, players, bullets, granades, loot, bulletFacory);
    }
}
exports.default = PlayerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyRmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbGF5ZXJGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscUNBQWtDO0FBTWxDLE1BQXFCLGFBQWE7SUFBbEM7UUFDUyxhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBeUI5QixDQUFDO0lBeEJBLE1BQU0sQ0FDTCxJQUFZLEVBQ1osTUFBdUIsRUFDdkIsR0FBUSxFQUNSLGVBQWdDLEVBQ2hDLE9BQWlCLEVBQ2pCLE9BQWlCLEVBQ2pCLFFBQTBCLEVBQzFCLElBQVUsRUFDVixZQUEyQjtRQUUzQixPQUFPLElBQUksZUFBTSxDQUNoQixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQ2YsSUFBSSxFQUNKLE1BQU0sRUFDTixHQUFHLEVBQ0gsZUFBZSxFQUNmLE9BQU8sRUFDUCxPQUFPLEVBQ1AsUUFBUSxFQUNSLElBQUksRUFDSixZQUFZLENBQ1osQ0FBQztJQUNILENBQUM7Q0FDRDtBQTFCRCxnQ0EwQkMifQ==