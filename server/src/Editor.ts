import MapData from './MapData';
//node modules
import * as fs from 'fs';
import * as path from 'path';

export default class Editor {
	constructor() {}

	saveMap(mapName: string, mapData: MapData): Promise<boolean> {
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
