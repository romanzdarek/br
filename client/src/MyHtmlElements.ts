export default class MyHtmlElements {
	readonly gameScreen: HTMLElement;
	readonly mapScreen: HTMLElement;
	readonly mapContainer: HTMLElement;
	readonly zoneTimer: HTMLElement;
	readonly helperScreen: HTMLElement;
	readonly zoneSVG: HTMLElement;
	readonly zoneCircle: HTMLElement;
	readonly zoneRect: HTMLElement;
	readonly mapZoneSVG: HTMLElement;
	readonly mapZoneCircle: HTMLElement;
	readonly takeLoot: HTMLElement;
	readonly transparentLayer: HTMLElement;
	readonly activeGunAmmo: HTMLElement;
	readonly alive: HTMLElement;
	readonly messages: HTMLElement;
	readonly spectate: HTMLElement;
	readonly spectateName: HTMLElement;
	readonly hideGame: HTMLElement;
	readonly itNetwork: HTMLElement;

	//<div id="healthBar"><div id="healthBarIn"></div></div>
	readonly healthBar = {
		main: document.getElementById('healthBar'),
		in: document.getElementById('healthBarIn'),
	};

	readonly items = {
		redAmmo: document.getElementById('redAmmo'),
		greenAmmo: document.getElementById('greenAmmo'),
		blueAmmo: document.getElementById('blueAmmo'),
		orangeAmmo: document.getElementById('orangeAmmo'),
		item1: document.getElementById('item1'),
		item2: document.getElementById('item2'),
		item3: document.getElementById('item3'),
		item4: document.getElementById('item4'),
		item5: document.getElementById('item5'),
		item1in: document.getElementById('item1').getElementsByTagName('span')[0],
		item2in: document.getElementById('item2').getElementsByTagName('span')[0],
		item3in: document.getElementById('item3').getElementsByTagName('span')[0],
		item4in: document.getElementById('item4').getElementsByTagName('span')[0],
		item5in: document.getElementById('item5').getElementsByTagName('span')[0],
		item1Ammo: document.getElementById('item1Ammo'),
		item2Ammo: document.getElementById('item2Ammo'),
		scope: document.getElementById('scope'),
		scope2: document.getElementById('scope2'),
		scope4: document.getElementById('scope4'),
		scope6: document.getElementById('scope6'),
		scopeSVG: document.getElementById('scope').getElementsByTagName('img')[0],
		vest: document.getElementById('vest'),
	};

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
		objectHorizontalWall: document.getElementById('editorObjectHorizontalWall'),
		objectVerticalWall: document.getElementById('editorObjectVerticalWall'),
		objectDelete: document.getElementById('editorObjectDelete'),
		openMenu: document.getElementById('editorOpenMenu'),
	};

	/*
	<div class="menu" id="saveMapMenu">
        <h1>Saved</h1>
        <button id="saveMapMenuBack">Back to main menu</button>
	</div>
	*/
	readonly saveMapMenu = {
		main: document.getElementById('saveMapMenu'),
		back: document.getElementById('saveMapMenuBack'),
	};

	/*
	<div class="menu" id="mapEditorMenu">
		<h1>Map editor</h1>
		<input id="mapEditorMenuName" type="text" maxlength="20" placeholder="Map name" value="" autocomplete="off">
		<button id="mapEditorMenuSave">Save</button>
		<button id="mapEditorMenuChangeSize">Change map size</button>
		<button id="mapEditorMenuBack">Back</button>
		<button id="mapEditorMenuClose">Close editor</button>
	</div>
	*/

	/*
	
	<div class="menu" id="gameOverMenu">
		<h1 id="gameOverMenuH1">You win!</h1>
		<div id="gameOverMenuStats">
			
		</div>
		<button id="gameOverMenuspectate">spectate</button>
        <button id="gameOverMenuBack">Main menu</button>
	</div>
	*/

	readonly gameOverMenu = {
		main: document.getElementById('gameOverMenu'),
		back: document.getElementById('gameOverMenuBack'),
		h1: document.getElementById('gameOverMenuH1'),
		stats: document.getElementById('gameOverMenuStats'),
		spectate: document.getElementById('gameOverMenuspectate'),
	};

	readonly mapEditorMenu = {
		main: document.getElementById('mapEditorMenu'),
		name: document.getElementById('mapEditorMenuName'),
		save: document.getElementById('mapEditorMenuSave'),
		changeSize: document.getElementById('mapEditorMenuChangeSize'),
		back: document.getElementById('mapEditorMenuBack'),
		close: document.getElementById('mapEditorMenuClose'),
	};

	/*
	<div class="menu" id="alertMenu">
		<h1>Not allowed character!</h1>
		<p>Please change that name.</p>
		<p>Allowed characters:</p>
		<p><b>abcdefghijklmnopqrstuvwxyz</b><br /><b>ABCDEFGHIJKLMNOPQRSTUVWXYZ</b><br /><b>0123456789</b><br /> and <b>space</b></p>
		<button id="alertMenuOk">OK</button>
	</div>
	*/

	readonly alertMenu = {
		main: document.getElementById('alertMenu'),
		ok: document.getElementById('alertMenuOk'),
	};

	/*<div class="menu" id="openMapMenu">
        <h1>Open map</h1>
        <select id="openMapMenuMaps"></select>
        <button id="openMapMenuOk">OK</button>
        <button id="openMapMenuBack">Back</button>
	</div>*/

	readonly openMapMenu = {
		main: document.getElementById('openMapMenu'),
		maps: document.getElementById('openMapMenuMaps'),
		ok: document.getElementById('openMapMenuOk'),
		back: document.getElementById('openMapMenuBack'),
	};

	/*
	<div class="menu" id="controlsMenu">
        <h1>Game controls</h1>
        <p>Move: <b>A, W, S, D</b>.</p>
        <p>Hit / Shoot: <b>Mouse</b>.</p>
        <button id="controlsMenuBack">Back</button>
	</div>
	*/

	readonly controlsMenu = {
		main: document.getElementById('controlsMenu'),
		back: document.getElementById('controlsMenuBack'),
	};

	/*
	<div class="menu" id="mainMenu">
		<h1>Mini battle royale</h1>
		<!--<p id="mainMenuIp">+</p>-->
		<input id="mainMenuName" type="text" maxlength="20" placeholder="Your name" value="" autocomplete="off" autofocus>
		<div class ="join">
			<h2>Join</h2>
			<select id="mainMenuGames" disabled></select>
			<button id="mainMenuJoin" disabled>Join</button>
		</div>
		<div class ="create">
			<h2>Create</h2>
			<select id="mainMenuMaps"></select>
			<button id="mainMenuCreate" disabled>Create</button>
		</div>
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
		maps: document.getElementById('mainMenuMaps'),
		create: document.getElementById('mainMenuCreate'),
		openEditor: document.getElementById('mainMenuOpenEditor'),
		controls: document.getElementById('mainMenuControls'),
	};
	/*
	<div class="menu" id="gameCanceledMenu">
		<h1>Game canceled</h1>
		<p>Your game has been canceled.</p>
		<button id="gameCanceledMenuBack">Back to main menu</button>
	</div>
	*/
	readonly gameCanceledMenu = {
		main: document.getElementById('cancelLobbyMenu'),
		back: document.getElementById('cancelLobbyMenuBack'),
	};

	/*
	<div class="menu" id="mapSizeMenu">
			<h1>Map size</h1>
			<p>Size [blocks]</p>
			<select id="mapSizeValue">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5" selected>5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
			</select>
			<p>
				<button id="mapSizeOk">OK</button>
				<button id="mapSizeBack">Back</button>
			</p>
	</div>
	*/
	readonly mapSizeMenu = {
		main: document.getElementById('mapSizeMenu'),
		value: document.getElementById('mapSizeValue'),
		ok: document.getElementById('mapSizeOk'),
		back: document.getElementById('mapSizeBack'),
	};

	/*
	<div class="menu" id="mapMenu">
        <h1>Map editor</h1>
        <button id="mapMenuCreate">Create a new map</button>
        <button id="mapMenuOpenMap">Open the created maps</button>
        <button id="mapMenuBack">Back</button>
	</div>
	*/

	readonly mapMenu = {
		main: document.getElementById('mapMenu'),
		create: document.getElementById('mapMenuCreate'),
		open: document.getElementById('mapMenuOpenMap'),
		back: document.getElementById('mapMenuBack'),
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
		mapName: document.getElementById('lobbyMapName'),
		players: document.getElementById('lobbyMenuPlayers'),
		forJoinPlayers: document.getElementById('lobbyMenuForJoinPlayer'),
		leave: document.getElementById('lobbyMenuLeave'),
		forCreatePlayer: document.getElementById('lobbyMenuForCreatePlayer'),
		start: document.getElementById('lobbyMenuStart'),
		cancel: document.getElementById('lobbyMenuCancel'),
	};

	readonly loading = {
		main: document.getElementById('loading'),
		counter: document.getElementById('loadingCounter'),
		circle: document.getElementById('loadingCircle'),
		text: document.getElementById('loadingText'),
	};

	/*
	<div class="menu" id="escFromGame">
		<h1>Leave game?</h1>
		<button id="escFromGameBack">Back to the game</button>
        <button id="escFromGameLeave">Leave the game</button>
	</div>
	*/
	readonly escFromGameMenu = {
		main: document.getElementById('escFromGame'),
		back: document.getElementById('escFromGameBack'),
		leave: document.getElementById('escFromGameLeave'),
	};

	constructor() {
		this.gameScreen = document.getElementById('gameScreen');
		this.mapScreen = document.getElementById('mapScreen');
		this.helperScreen = document.getElementById('helperScreen');
		this.zoneSVG = document.getElementById('zoneSVG');
		this.zoneCircle = document.getElementById('zoneCircle');
		this.zoneRect = document.getElementById('zoneRect');
		this.mapZoneSVG = document.getElementById('mapZoneSVG');
		this.mapZoneCircle = document.getElementById('mapZoneCircle');
		this.takeLoot = document.getElementById('takeLoot');
		this.transparentLayer = document.getElementById('transparentLayer');
		this.activeGunAmmo = document.getElementById('activeGunAmmo');
		this.mapContainer = document.getElementById('mapContainer');
		this.alive = document.getElementById('alive');
		this.messages = document.getElementById('messages');
		this.zoneTimer = document.getElementById('zoneTimer');
		this.spectate = document.getElementById('spectate');
		this.spectateName = document.getElementById('spectateName');
		this.hideGame = document.getElementById('hideGame');
		this.itNetwork = document.getElementById('itnetwork');
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
