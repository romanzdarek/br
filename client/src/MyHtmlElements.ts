export default class MyHtmlElements {
	readonly gameScreen: HTMLElement;

	readonly editor = {
		mapSizeMenu: document.getElementById('mapSizeMenu'),
		coordinates: document.getElementById('editorCoordinates'),
		container: document.getElementById('editorContainer'),
		screen: document.getElementById('editorScreen'),
		terrainImgs: document.getElementById('editorTerrainImgs'),
		terrainWater: document.getElementById('terrainWater'),
		terrainGrass: document.getElementById('terrainGrass'),
		terrainWaterTriangle1: document.getElementById('terrainWaterTriangle1'),
		terrainWaterTriangle2: document.getElementById('terrainWaterTriangle2'),
		terrainWaterTriangle3: document.getElementById('terrainWaterTriangle3'),
		terrainWaterTriangle4: document.getElementById('terrainWaterTriangle4'),
		objectImgs: document.getElementById('editorObjectImgs'),
		objectBush: document.getElementById('editorObjectBush'),
		objectRock: document.getElementById('editorObjectRock'),
		objectTree: document.getElementById('editorObjectTree'),
		objectRect: document.getElementById('editorObjectRect'),
		objectDelete: document.getElementById('editorObjectDelete'),
		save: document.getElementById('editorSave')
	};

	constructor() {
		this.gameScreen = document.getElementById('gameScreen');
	}

	close(...elements: HTMLElement[]): void {
		for (const element of elements) {
			element.style.display = 'none';
		}
	}

	open(...elements: HTMLElement[]): void {
		for (const element of elements) {
			element.style.display = 'block';
		}
	}
}
