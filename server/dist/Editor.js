"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//node modules
const fs = require("fs");
const config_1 = require("./config");
class Editor {
    constructor() { }
    saveMap(mapName, mapData) {
        return new Promise((resolve, reject) => {
            const map = JSON.stringify(mapData);
            fs.writeFile(config_1.config.directory.maps + mapName + '.json', map, (err) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0VkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGNBQWM7QUFDZCx5QkFBeUI7QUFDekIscUNBQWtDO0FBRWxDLE1BQXFCLE1BQU07SUFDMUIsZ0JBQWUsQ0FBQztJQUVoQixPQUFPLENBQUMsT0FBZSxFQUFFLE9BQWdCO1FBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsU0FBUyxDQUFDLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3BFLElBQUksR0FBRyxFQUFFO29CQUNSLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDZDtxQkFBTTtvQkFDTixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2Q7WUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBZkQseUJBZUMifQ==