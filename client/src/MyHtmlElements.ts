export default class MyHtmlElements {
	readonly gameScreen: HTMLElement;
	readonly zoneSVG: HTMLElement;
	readonly maskSVG: HTMLElement;
	readonly zoneCircle: HTMLElement;

	readonly editor = {
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

	/*
	<div class="menu" id="mainMenu">
		<h1>Mini battle royale</h1>
		<p id="mainMenuIp">+</p>
		<input id="mainMenuName" type="text" maxlength="20" placeholder="Your name" value="" autocomplete="off" autofocus>
		<h2>Created games</h2>
		<select id="mainMenuGames" disabled></select>
		<button id="mainMenuJoin" disabled>Join the game</button>
		<button id="mainMenuCreate" disabled>Create a new game</button>
		<button id="mainMenuOpenEditor">Map editor</button>
		<button id="mainMenuControls">Game controls</button>
	</div>
	*/

	readonly mainMenu = {
		main: document.getElementById('mainMenu'),
		ip: document.getElementById('mainMenuIp'),
		name: document.getElementById('mainMenuName'),
		games: document.getElementById('mainMenuGames'),
		join: document.getElementById('mainMenuJoin'),
		create: document.getElementById('mainMenuCreate'),
		openEditor: document.getElementById('mainMenuOpenEditor'),
		controls: document.getElementById('mainMenuControls')
	};

	readonly mapSizeMenu = {
		main: document.getElementById('mapSizeMenu')
	};

	/**
	 <div class="menu" id="lobbyMenu">
		<h1 id="lobbyMenuGameName"></h1>
		<ul id="lobbyMenuPlayers"></ul>
		<div id="lobbyMenuForJoinPlayer">
			<p>Waiting for players...</p>
			<button id="lobbyMenuLeave">Leave the game</button>
		</div>
		<div id="lobbyMenuForCreatePlayer">
			<button id="lobbyMenuStart">Launch the game</button>
			<button id="lobbyMenuCancel">Cancel the game</button>
		</div>
	</div>		
	 */
	readonly lobbyMenu = {
		main: document.getElementById('lobbyMenu'),
		gameName: document.getElementById('lobbyMenuGameName'),
		players: document.getElementById('lobbyMenuPlayers'),
		forJoinPlayers: document.getElementById('lobbyMenuForJoinPlayer'),
		leave: document.getElementById('lobbyMenuLeave'),
		forCreatePlayer: document.getElementById('lobbyMenuForCreatePlayer'),
		start: document.getElementById('lobbyMenuStart'),
		cancel: document.getElementById('lobbyMenuCancel'),
	};

	constructor() {
		this.gameScreen = document.getElementById('gameScreen');
		this.zoneSVG = document.getElementById('zoneSVG');
		this.zoneCircle = document.getElementById('zoneCircle');
		this.maskSVG = document.getElementById('maskSVG');
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
