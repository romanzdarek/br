"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//node modules
const fs = require("fs");
class Editor {
    constructor() { }
    saveMap(mapName, mapData) {
        return new Promise((resolve, reject) => {
            const map = JSON.stringify(mapData);
            fs.writeFile('dist/maps/' + mapName + '.json', map, (err) => {
                if (err) {
                    reject(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
exports.default = Editor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0VkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGNBQWM7QUFDZCx5QkFBeUI7QUFFekIsTUFBcUIsTUFBTTtJQUMxQixnQkFBZSxDQUFDO0lBRWhCLE9BQU8sQ0FBQyxPQUFlLEVBQUUsT0FBZ0I7UUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLE9BQU8sR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQzNELElBQUksR0FBRyxFQUFFO29CQUNSLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDZDtxQkFDSTtvQkFDSixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2Q7WUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBaEJELHlCQWdCQyJ9