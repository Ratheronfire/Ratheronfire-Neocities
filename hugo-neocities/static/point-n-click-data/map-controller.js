
const GRID_SUBREGION_SIZE = 4;

class GameData {
    test;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get toString() {
        return `${this.x}_${this.y}`;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    equals(otherVector) {
        return this.x == otherVector.x && this.y == otherVector.y;
    }

    plus(otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    static fromId(id) {
        var nums = id.split("_");

        return new Vector2(Number(nums[0]), Number(nums[1]));
    }
}

function initScreen() {
    var minimapText = $.parseHTML(`
    <span class="minimap-line"><code id="minimap-0-0">   </code><code id="minimap-1-0">   </code><code id="minimap-2-0">   </code><code id="minimap-3-0">   </code><code id="minimap-4-0">   </code><code id="minimap-5-0">   </code><code id="minimap-6-0">   </code><code id="minimap-7-0">   </code><code id="minimap-8-0">   </code><code id="minimap-9-0">   </code><code id="minimap-10-0">   </code><code id="minimap-11-0">   </code><code id="minimap-12-0">   </code><code id="minimap-13-0">   </code><code id="minimap-14-0">   </code><code id="minimap-15-0">   </code><code id="minimap-16-0">   </code><code id="minimap-17-0">   </code><code id="minimap-18-0">   </code><code id="minimap-19-0">   </code></span>
    <span class="minimap-line"><code id="minimap-0-1">   </code><code id="minimap-1-1">   </code><code id="minimap-2-1">   </code><code id="minimap-3-1">   </code><code id="minimap-4-1">   </code><code id="minimap-5-1">   </code><code id="minimap-6-1">   </code><code id="minimap-7-1">   </code><code id="minimap-8-1">   </code><code id="minimap-9-1">   </code><code id="minimap-10-1">   </code><code id="minimap-11-1">   </code><code id="minimap-12-1">   </code><code id="minimap-13-1">   </code><code id="minimap-14-1">   </code><code id="minimap-15-1">   </code><code id="minimap-16-1">   </code><code id="minimap-17-1">   </code><code id="minimap-18-1">   </code><code id="minimap-19-1">   </code></span>
    <span class="minimap-line"><code id="minimap-0-2">   </code><code id="minimap-1-2">   </code><code id="minimap-2-2">   </code><code id="minimap-3-2">   </code><code id="minimap-4-2">   </code><code id="minimap-5-2">   </code><code id="minimap-6-2">   </code><code id="minimap-7-2">   </code><code id="minimap-8-2">   </code><code id="minimap-9-2">   </code><code id="minimap-10-2">   </code><code id="minimap-11-2">   </code><code id="minimap-12-2">   </code><code id="minimap-13-2">   </code><code id="minimap-14-2">   </code><code id="minimap-15-2">   </code><code id="minimap-16-2">   </code><code id="minimap-17-2">   </code><code id="minimap-18-2">   </code><code id="minimap-19-2">   </code></span>
    <span class="minimap-line"><code id="minimap-0-3">   </code><code id="minimap-1-3">   </code><code id="minimap-2-3">   </code><code id="minimap-3-3">   </code><code id="minimap-4-3">   </code><code id="minimap-5-3">   </code><code id="minimap-6-3">   </code><code id="minimap-7-3">   </code><code id="minimap-8-3">   </code><code id="minimap-9-3">   </code><code id="minimap-10-3">   </code><code id="minimap-11-3">   </code><code id="minimap-12-3">   </code><code id="minimap-13-3">   </code><code id="minimap-14-3">   </code><code id="minimap-15-3">   </code><code id="minimap-16-3">   </code><code id="minimap-17-3">   </code><code id="minimap-18-3">   </code><code id="minimap-19-3">   </code></span>
    <span class="minimap-line"><code id="minimap-0-4">   </code><code id="minimap-1-4">   </code><code id="minimap-2-4">   </code><code id="minimap-3-4">   </code><code id="minimap-4-4">   </code><code id="minimap-5-4">   </code><code id="minimap-6-4">   </code><code id="minimap-7-4">   </code><code id="minimap-8-4">   </code><code id="minimap-9-4">   </code><code id="minimap-10-4">   </code><code id="minimap-11-4">   </code><code id="minimap-12-4">   </code><code id="minimap-13-4">   </code><code id="minimap-14-4">   </code><code id="minimap-15-4">   </code><code id="minimap-16-4">   </code><code id="minimap-17-4">   </code><code id="minimap-18-4">   </code><code id="minimap-19-4">   </code></span>
    <span class="minimap-line"><code id="minimap-0-5">   </code><code id="minimap-1-5">   </code><code id="minimap-2-5">   </code><code id="minimap-3-5">   </code><code id="minimap-4-5">   </code><code id="minimap-5-5">   </code><code id="minimap-6-5">   </code><code id="minimap-7-5">   </code><code id="minimap-8-5">   </code><code id="minimap-9-5">   </code><code id="minimap-10-5">   </code><code id="minimap-11-5">   </code><code id="minimap-12-5">   </code><code id="minimap-13-5">   </code><code id="minimap-14-5">   </code><code id="minimap-15-5">   </code><code id="minimap-16-5">   </code><code id="minimap-17-5">   </code><code id="minimap-18-5">   </code><code id="minimap-19-5">   </code></span>
    <span class="minimap-line"><code id="minimap-0-6">   </code><code id="minimap-1-6">   </code><code id="minimap-2-6">   </code><code id="minimap-3-6">   </code><code id="minimap-4-6">   </code><code id="minimap-5-6">   </code><code id="minimap-6-6">   </code><code id="minimap-7-6">   </code><code id="minimap-8-6">   </code><code id="minimap-9-6">   </code><code id="minimap-10-6">   </code><code id="minimap-11-6">   </code><code id="minimap-12-6">   </code><code id="minimap-13-6">   </code><code id="minimap-14-6">   </code><code id="minimap-15-6">   </code><code id="minimap-16-6">   </code><code id="minimap-17-6">   </code><code id="minimap-18-6">   </code><code id="minimap-19-6">   </code></span>
    <span class="minimap-line"><code id="minimap-0-7">   </code><code id="minimap-1-7">   </code><code id="minimap-2-7">   </code><code id="minimap-3-7">   </code><code id="minimap-4-7">   </code><code id="minimap-5-7">   </code><code id="minimap-6-7">   </code><code id="minimap-7-7">   </code><code id="minimap-8-7">   </code><code id="minimap-9-7">   </code><code id="minimap-10-7">   </code><code id="minimap-11-7">   </code><code id="minimap-12-7">   </code><code id="minimap-13-7">   </code><code id="minimap-14-7">   </code><code id="minimap-15-7">   </code><code id="minimap-16-7">   </code><code id="minimap-17-7">   </code><code id="minimap-18-7">   </code><code id="minimap-19-7">   </code></span>
    <span class="minimap-line"><code id="minimap-0-8">   </code><code id="minimap-1-8">   </code><code id="minimap-2-8">   </code><code id="minimap-3-8">   </code><code id="minimap-4-8">   </code><code id="minimap-5-8">   </code><code id="minimap-6-8">   </code><code id="minimap-7-8">   </code><code id="minimap-8-8">   </code><code id="minimap-9-8">   </code><code id="minimap-10-8">   </code><code id="minimap-11-8">   </code><code id="minimap-12-8">   </code><code id="minimap-13-8">   </code><code id="minimap-14-8">   </code><code id="minimap-15-8">   </code><code id="minimap-16-8">   </code><code id="minimap-17-8">   </code><code id="minimap-18-8">   </code><code id="minimap-19-8">   </code></span>
    <span class="minimap-line"><code id="minimap-0-9">   </code><code id="minimap-1-9">   </code><code id="minimap-2-9">   </code><code id="minimap-3-9">   </code><code id="minimap-4-9">   </code><code id="minimap-5-9">   </code><code id="minimap-6-9">   </code><code id="minimap-7-9">   </code><code id="minimap-8-9">   </code><code id="minimap-9-9">   </code><code id="minimap-10-9">   </code><code id="minimap-11-9">   </code><code id="minimap-12-9">   </code><code id="minimap-13-9">   </code><code id="minimap-14-9">   </code><code id="minimap-15-9">   </code><code id="minimap-16-9">   </code><code id="minimap-17-9">   </code><code id="minimap-18-9">   </code><code id="minimap-19-9">   </code></span>
    <span class="minimap-line"><code id="minimap-0-10">  </code><code id="minimap-1-10">  </code><code id="minimap-2-10">  </code><code id="minimap-3-10">  </code><code id="minimap-4-10">  </code><code id="minimap-5-10">  </code><code id="minimap-6-10">  </code><code id="minimap-7-10">  </code><code id="minimap-8-10">  </code><code id="minimap-9-10">  </code><code id="minimap-10-10">  </code><code id="minimap-11-10">  </code><code id="minimap-12-10">  </code><code id="minimap-13-10">  </code><code id="minimap-14-10">  </code><code id="minimap-15-10">  </code><code id="minimap-16-10">  </code><code id="minimap-17-10">  </code><code id="minimap-18-10">  </code><code id="minimap-19-10">  </code></span>
    <span class="minimap-line"><code id="minimap-0-11">  </code><code id="minimap-1-11">  </code><code id="minimap-2-11">  </code><code id="minimap-3-11">  </code><code id="minimap-4-11">  </code><code id="minimap-5-11">  </code><code id="minimap-6-11">  </code><code id="minimap-7-11">  </code><code id="minimap-8-11">  </code><code id="minimap-9-11">  </code><code id="minimap-10-11">  </code><code id="minimap-11-11">  </code><code id="minimap-12-11">  </code><code id="minimap-13-11">  </code><code id="minimap-14-11">  </code><code id="minimap-15-11">  </code><code id="minimap-16-11">  </code><code id="minimap-17-11">  </code><code id="minimap-18-11">  </code><code id="minimap-19-11">  </code></span>
    <span class="minimap-line"><code id="minimap-0-12">  </code><code id="minimap-1-12">  </code><code id="minimap-2-12">  </code><code id="minimap-3-12">  </code><code id="minimap-4-12">  </code><code id="minimap-5-12">  </code><code id="minimap-6-12">  </code><code id="minimap-7-12">  </code><code id="minimap-8-12">  </code><code id="minimap-9-12">  </code><code id="minimap-10-12">  </code><code id="minimap-11-12">  </code><code id="minimap-12-12">  </code><code id="minimap-13-12">  </code><code id="minimap-14-12">  </code><code id="minimap-15-12">  </code><code id="minimap-16-12">  </code><code id="minimap-17-12">  </code><code id="minimap-18-12">  </code><code id="minimap-19-12">  </code></span>
    <span class="minimap-line"><code id="minimap-0-13">  </code><code id="minimap-1-13">  </code><code id="minimap-2-13">  </code><code id="minimap-3-13">  </code><code id="minimap-4-13">  </code><code id="minimap-5-13">  </code><code id="minimap-6-13">  </code><code id="minimap-7-13">  </code><code id="minimap-8-13">  </code><code id="minimap-9-13">  </code><code id="minimap-10-13">  </code><code id="minimap-11-13">  </code><code id="minimap-12-13">  </code><code id="minimap-13-13">  </code><code id="minimap-14-13">  </code><code id="minimap-15-13">  </code><code id="minimap-16-13">  </code><code id="minimap-17-13">  </code><code id="minimap-18-13">  </code><code id="minimap-19-13">  </code></span>
    <span class="minimap-line"><code id="minimap-0-14">  </code><code id="minimap-1-14">  </code><code id="minimap-2-14">  </code><code id="minimap-3-14">  </code><code id="minimap-4-14">  </code><code id="minimap-5-14">  </code><code id="minimap-6-14">  </code><code id="minimap-7-14">  </code><code id="minimap-8-14">  </code><code id="minimap-9-14">  </code><code id="minimap-10-14">  </code><code id="minimap-11-14">  </code><code id="minimap-12-14">  </code><code id="minimap-13-14">  </code><code id="minimap-14-14">  </code><code id="minimap-15-14">  </code><code id="minimap-16-14">  </code><code id="minimap-17-14">  </code><code id="minimap-18-14">  </code><code id="minimap-19-14">  </code></span>
    <span class="minimap-line"><code id="minimap-0-15">  </code><code id="minimap-1-15">  </code><code id="minimap-2-15">  </code><code id="minimap-3-15">  </code><code id="minimap-4-15">  </code><code id="minimap-5-15">  </code><code id="minimap-6-15">  </code><code id="minimap-7-15">  </code><code id="minimap-8-15">  </code><code id="minimap-9-15">  </code><code id="minimap-10-15">  </code><code id="minimap-11-15">  </code><code id="minimap-12-15">  </code><code id="minimap-13-15">  </code><code id="minimap-14-15">  </code><code id="minimap-15-15">  </code><code id="minimap-16-15">  </code><code id="minimap-17-15">  </code><code id="minimap-18-15">  </code><code id="minimap-19-15">  </code></span>
    <span class="minimap-line"><code id="minimap-0-16">  </code><code id="minimap-1-16">  </code><code id="minimap-2-16">  </code><code id="minimap-3-16">  </code><code id="minimap-4-16">  </code><code id="minimap-5-16">  </code><code id="minimap-6-16">  </code><code id="minimap-7-16">  </code><code id="minimap-8-16">  </code><code id="minimap-9-16">  </code><code id="minimap-10-16">  </code><code id="minimap-11-16">  </code><code id="minimap-12-16">  </code><code id="minimap-13-16">  </code><code id="minimap-14-16">  </code><code id="minimap-15-16">  </code><code id="minimap-16-16">  </code><code id="minimap-17-16">  </code><code id="minimap-18-16">  </code><code id="minimap-19-16">  </code></span>
    <span class="minimap-line"><code id="minimap-0-17">  </code><code id="minimap-1-17">  </code><code id="minimap-2-17">  </code><code id="minimap-3-17">  </code><code id="minimap-4-17">  </code><code id="minimap-5-17">  </code><code id="minimap-6-17">  </code><code id="minimap-7-17">  </code><code id="minimap-8-17">  </code><code id="minimap-9-17">  </code><code id="minimap-10-17">  </code><code id="minimap-11-17">  </code><code id="minimap-12-17">  </code><code id="minimap-13-17">  </code><code id="minimap-14-17">  </code><code id="minimap-15-17">  </code><code id="minimap-16-17">  </code><code id="minimap-17-17">  </code><code id="minimap-18-17">  </code><code id="minimap-19-17">  </code></span>
    <span class="minimap-line"><code id="minimap-0-18">  </code><code id="minimap-1-18">  </code><code id="minimap-2-18">  </code><code id="minimap-3-18">  </code><code id="minimap-4-18">  </code><code id="minimap-5-18">  </code><code id="minimap-6-18">  </code><code id="minimap-7-18">  </code><code id="minimap-8-18">  </code><code id="minimap-9-18">  </code><code id="minimap-10-18">  </code><code id="minimap-11-18">  </code><code id="minimap-12-18">  </code><code id="minimap-13-18">  </code><code id="minimap-14-18">  </code><code id="minimap-15-18">  </code><code id="minimap-16-18">  </code><code id="minimap-17-18">  </code><code id="minimap-18-18">  </code><code id="minimap-19-18">  </code></span>
    <span class="minimap-line"><code id="minimap-0-19">  </code><code id="minimap-1-19">  </code><code id="minimap-2-19">  </code><code id="minimap-3-19">  </code><code id="minimap-4-19">  </code><code id="minimap-5-19">  </code><code id="minimap-6-19">  </code><code id="minimap-7-19">  </code><code id="minimap-8-19">  </code><code id="minimap-9-19">  </code><code id="minimap-10-19">  </code><code id="minimap-11-19">  </code><code id="minimap-12-19">  </code><code id="minimap-13-19">  </code><code id="minimap-14-19">  </code><code id="minimap-15-19">  </code><code id="minimap-16-19">  </code><code id="minimap-17-19">  </code><code id="minimap-18-19">  </code><code id="minimap-19-19">  </code></span>
   `);

   $("#minimap-text").append(minimapText);

   for (let x = GRID_SUBREGION_SIZE - 1; x < 20; x+= GRID_SUBREGION_SIZE) {
        for (let y = 0; y < 20; y++) {
            $(`#minimap-0-${y}`).addClass("grid-border-left");
            $(`#minimap-${x}-${y}`).addClass("grid-border-right");
        }
    }

    for (let y = GRID_SUBREGION_SIZE - 1; y < 20; y+= GRID_SUBREGION_SIZE) {
         for (let x = 0; x < 20; x++) {
            $(`#minimap-${x}-0`).addClass("grid-border-top");
             $(`#minimap-${x}-${y}`).addClass("grid-border-bottom");
         }
     }
}

function updateTile(x, y, tileObject) {
    var tileElement = $(`#minimap-${x}-${y}`);

    if (tileObject) {
        tileElement.text(tileObject.char + tileObject.char);
        tileElement.css("color", tileObject.color);
        tileElement.css("background-color", tileObject.backgroundColor);
    } else {
        tileElement.text("XX");
        tileElement.css("color", "yellow");
        tileElement.css("background-color", "purple");
    }
}

function loadScreen() {
    var screenData = screens[currentScreen.toString];

    var tileData = {};
    Object.assign(tileData, staticTileData);

    if ("variableTileData" in screenData) {
        Object.assign(tileData, staticTileData, screenData.variableTileData);
    }

    for (var y = 0; y < screenData.tiles.length; y++) {
        for (var x = 0; x < screenData.tiles[0].length; x++) {
            var tileId = screenData.tiles[y][x];

            if (isFinite(parseInt(tileId))) {
                var subtileIndex = parseInt(tileId);

                for (let subtileId in screenData.subTiles[subtileIndex]) {
                    var subtile = screenData.subTiles[subtileIndex][subtileId];

                    for (let condition of subtile.conditions) {
                        var varToTest = Game[condition.varName];

                        var isMet = false;
                        switch (condition.comparison) {
                            case "=":
                                isMet = varToTest == condition.testValue;
                                break;
                        }

                        if (isMet) {
                            for (var ay = 0; ay < subtile.tiles.length; ay++) {
                                for (var ax = 0; ax < subtile.tiles[0].length; ax++) {
                                    var subTileId = subtile.tiles[ay][ax];
                                    var subTileObject = tileData[subTileId];

                                    updateTile(x + ax, y + ay, subTileObject);
                                }
                            }
                        }
                    }
                }
            }
            else if (tileId != ".") {
                var tileObject = tileData[tileId];

                updateTile(x, y, tileObject);
            }
        }
    }

    $("#game-text").text(screenData.description);
    $("#screen-text").text(`Screen (${screenData.x}, ${screenData.y})`);
}

function moveToScreen(offset) {
    var newScreen = currentScreen.plus(offset);

    if (newScreen.toString in screens) {
        currentScreen = newScreen;
        loadScreen();
    }
}

initScreen();

var Game = new GameData();
Game.test = true;

var staticTileData = {};
var screens = {};

var currentScreen = new Vector2(0, 0);

fetch("/point-n-click-data/screens.json")
    .then(response => response.json())
    .then(json => {
        staticTileData = json.staticTileData;
        screens = json.screens;
        
        currentScreen = Vector2.fromId(json.startingScreen);
        loadScreen();
    });