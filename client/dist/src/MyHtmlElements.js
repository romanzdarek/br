export default class MyHtmlElements {
    constructor() {
        this.editor = {
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
            openMenu: document.getElementById('editorOpenMenu')
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
        this.mapEditorMenu = {
            main: document.getElementById('mapEditorMenu'),
            name: document.getElementById('mapEditorMenuName'),
            save: document.getElementById('mapEditorMenuSave'),
            changeSize: document.getElementById('mapEditorMenuChangeSize'),
            back: document.getElementById('mapEditorMenuBack'),
            close: document.getElementById('mapEditorMenuClose')
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
        this.alertMenu = {
            main: document.getElementById('alertMenu'),
            ok: document.getElementById('alertMenuOk')
        };
        /*<div class="menu" id="openMapMenu">
            <h1>Open map</h1>
            <select id="openMapMenuMaps"></select>
            <button id="openMapMenuOk">OK</button>
            <button id="openMapMenuBack">Back</button>
        </div>*/
        this.openMapMenu = {
            main: document.getElementById('openMapMenu'),
            maps: document.getElementById('openMapMenuMaps'),
            ok: document.getElementById('openMapMenuOk'),
            back: document.getElementById('openMapMenuBack')
        };
        /*
        <div class="menu" id="controlsMenu">
            <h1>Game controls</h1>
            <p>Move: <b>A, W, S, D</b>.</p>
            <p>Hit / Shoot: <b>Mouse</b>.</p>
            <button id="controlsMenuBack">Back</button>
        </div>
        */
        this.controlsMenu = {
            main: document.getElementById('controlsMenu'),
            back: document.getElementById('controlsMenuBack')
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
        this.mainMenu = {
            main: document.getElementById('mainMenu'),
            ip: document.getElementById('mainMenuIp'),
            name: document.getElementById('mainMenuName'),
            games: document.getElementById('mainMenuGames'),
            join: document.getElementById('mainMenuJoin'),
            maps: document.getElementById('mainMenuMaps'),
            create: document.getElementById('mainMenuCreate'),
            openEditor: document.getElementById('mainMenuOpenEditor'),
            controls: document.getElementById('mainMenuControls')
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
        this.mapSizeMenu = {
            main: document.getElementById('mapSizeMenu'),
            value: document.getElementById('mapSizeValue'),
            ok: document.getElementById('mapSizeOk'),
            back: document.getElementById('mapSizeBack')
        };
        /*
        <div class="menu" id="mapMenu">
            <h1>Map editor</h1>
            <button id="mapMenuCreate">Create a new map</button>
            <button id="mapMenuOpenMap">Open the created maps</button>
            <button id="mapMenuBack">Back</button>
        </div>
        */
        this.mapMenu = {
            main: document.getElementById('mapMenu'),
            create: document.getElementById('mapMenuCreate'),
            open: document.getElementById('mapMenuOpenMap'),
            back: document.getElementById('mapMenuBack')
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
        this.lobbyMenu = {
            main: document.getElementById('lobbyMenu'),
            gameName: document.getElementById('lobbyMenuGameName'),
            players: document.getElementById('lobbyMenuPlayers'),
            forJoinPlayers: document.getElementById('lobbyMenuForJoinPlayer'),
            leave: document.getElementById('lobbyMenuLeave'),
            forCreatePlayer: document.getElementById('lobbyMenuForCreatePlayer'),
            start: document.getElementById('lobbyMenuStart'),
            cancel: document.getElementById('lobbyMenuCancel')
        };
        this.gameScreen = document.getElementById('gameScreen');
        this.mapScreen = document.getElementById('mapScreen');
        this.helperScreen = document.getElementById('helperScreen');
        this.zoneSVG = document.getElementById('zoneSVG');
        this.zoneCircle = document.getElementById('zoneCircle');
        this.mapZoneSVG = document.getElementById('mapZoneSVG');
        this.mapZoneCircle = document.getElementById('mapZoneCircle');
    }
    close(...elements) {
        for (const element of elements) {
            element.style.display = 'none';
        }
    }
    open(...elements) {
        for (const element of elements) {
            element.style.display = 'block';
        }
    }
}
//# sourceMappingURL=MyHtmlElements.js.map