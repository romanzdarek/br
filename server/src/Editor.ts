import MapData from './MapData';
//node modules
import * as fs from 'fs';
import { config } from './config';

export default class Editor {
	constructor() {}

	saveMap(mapName: string, mapData: MapData): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const map = JSON.stringify(mapData);
			fs.writeFile(config.directory.maps + mapName + '.json', map, (err) => {
				if (err) {
					reject(false);
				} else {
					resolve(true);
				}
			});
		});
	}
}
