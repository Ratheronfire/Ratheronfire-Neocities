const GRID_SUBREGION_SIZE = 4;

enum ComparisonOperation {
    LessThan,
    LessThanEqual,
    Equal,
    NotEqual,
    Equivalent,
    NotEquivalent,
    GreaterThan,
    GreaterThanEqual
}

type VariableTileDataDict = { [id: string]: VariableTileData };
type TileMap = string[];
type SubtileJsonData = { [id: string]: { conditions: string, tiles: string } }

class GameData {
    public test: boolean;
}

class VariableTileData {
    public char: string;
    public name: string;

    public color: string;
    public backgroundColor: string;
}

class SubTileCondition {
    public variable: string;
    public operator: ComparisonOperation;
    public comparison: any;

    constructor(variable: string, operatorStr: string, comparison: string) {
        this.variable = variable;
        this.comparison = eval(comparison); // TODO: Not this way

        switch (operatorStr) {
            case '<':
                this.operator = ComparisonOperation.LessThan;
                break;
            case '<=':
                this.operator = ComparisonOperation.LessThanEqual;
                break;
            case '==':
                this.operator = ComparisonOperation.Equal;
                break;
            case '!=':
                this.operator = ComparisonOperation.NotEqual;
                break;
            case '===':
                this.operator = ComparisonOperation.Equivalent;
                break;
            case '!==':
                this.operator = ComparisonOperation.NotEquivalent;
                break;
            case '>':
                this.operator = ComparisonOperation.GreaterThan;
                break;
            case '>=':
                this.operator = ComparisonOperation.GreaterThanEqual;
                break;
        }
    }

    get isConditionMet(): boolean {
        var value = Game[this.variable];

        switch (this.operator) {
            case ComparisonOperation.LessThan:
                return value < this.comparison;
            case ComparisonOperation.LessThanEqual:
                return value <= this.comparison;
            case ComparisonOperation.Equal:
                return value == this.comparison;
            case ComparisonOperation.NotEqual:
                return value != this.comparison;
            case ComparisonOperation.Equivalent:
                return value === this.comparison;
            case ComparisonOperation.NotEquivalent:
                return value !== this.comparison;
            case ComparisonOperation.GreaterThan:
                return value > this.comparison;
            case ComparisonOperation.GreaterThanEqual:
                return value >= this.comparison;
            default:
                return false;
        }
    }
}

class SubTileData {
    public name: string;
    public conditions: SubTileCondition[];
    public tiles: TileMap;

    constructor(name: string, conditions: SubTileCondition[], tiles: TileMap) {
        this.name = name;
        this.conditions = conditions;
        this.tiles = tiles;
    }
}

class Vector2 {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get toString(): string {
        return `${this.x}_${this.y}`;
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    equals(otherVector: Vector2): boolean {
        return this.x == otherVector.x && this.y == otherVector.y;
    }

    plus(otherVector: Vector2): Vector2 {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    static fromId(id: string): Vector2 {
        var nums = id.split("_");

        return new Vector2(Number(nums[0]), Number(nums[1]));
    }
}

class ScreenData {
    public pos: Vector2;
    public description: string;

    public tiles: TileMap;

    public variableTileData: VariableTileDataDict;
    public subtiles: SubTileData[][];

    constructor(x: number, y: number, description: string, tiles: TileMap, variableTileData: VariableTileDataDict = {}, subtileJsons: SubtileJsonData[] = []) {
        this.pos = new Vector2(x, y);
        this.description = description;

        this.tiles = tiles;

        this.variableTileData = variableTileData;

        this.subtiles = [];

        for (let subtileDataSet of subtileJsons) {
            var subtileSet: SubTileData[] = [];

            for (let subtileId in subtileDataSet) {
                var subtileJson = subtileDataSet[subtileId];

                if (!('conditions' in subtileJson)) {
                    continue;
                }
                
                var conditions: SubTileCondition[] = [];
    
                for (let condition of subtileJson['conditions'].split(/\r?\n/)) {
                    var sections = condition.split(' ');
                    conditions.push(new SubTileCondition(sections[0], sections[1], sections[2]));
                }
    
                subtileSet.push(new SubTileData(
                    subtileId, conditions, subtileJson['tiles'].split(/\r?\n/)
                ));
            }

            this.subtiles.push(subtileSet);
        }
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

    for (let x = GRID_SUBREGION_SIZE - 1; x < 20; x += GRID_SUBREGION_SIZE) {
        for (let y = 0; y < 20; y++) {
            $(`#minimap-0-${y}`).addClass("grid-border-left");
            $(`#minimap-${x}-${y}`).addClass("grid-border-right");
        }
    }

    for (let y = GRID_SUBREGION_SIZE - 1; y < 20; y += GRID_SUBREGION_SIZE) {
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

async function fetchGameData() {
    await loadJson("/point-n-click-data/screens.json")
        .then(json => {
            staticTileData = json.staticTileData;

            loadScreen(json.startingScreen);
        });
}

async function fetchScreen(screenID): Promise<ScreenData | null> {
    var screenJson = {};
    var tiles: TileMap = [];

    await loadJson(`/point-n-click-data/screens/${screenID}/data.json`)
        .then(async function(json) {
            screenJson = json;

            if ("subtileIDs" in json) {
                json['subtiles'] = [];

                for (var i in json.subtileIDs) {
                    json['subtiles'][i] = {};

                    for (var subtileID of json.subtileIDs[i]) {
                        json['subtiles'][i][subtileID] = {};
                        var subtileFolder = `/point-n-click-data/screens/${screenID}/subtiles/${i}/${subtileID}`;

                        await loadText(`${subtileFolder}/tiles.txt`)
                            .then(subtileText => {
                                json['subtiles'][i][subtileID]['tiles'] = subtileText;
                            });

                        await loadText(`${subtileFolder}/conditions.txt`)
                            .then(conditionsText => {
                                json['subtiles'][i][subtileID]['conditions'] = conditionsText;
                            });
                    }
                }
            }
        })
        .catch(_ => {
            return null;
        });

    await loadText(`/point-n-click-data/screens/${screenID}/tiles.txt`)
        .then(text => {
            tiles = text.split(/\r?\n/);
        });

    if (screenJson['description'] == undefined) {
        return null;
    }

    return new ScreenData(
        screenJson['x'],
        screenJson['y'],
        screenJson['description'],
        tiles,
        screenJson['variableTileData'] ?? {},
        screenJson['subtiles'] ?? []
    );
}

async function loadScreen(newScreenID) {
    if (newScreenID in screens) {
        currentScreen = screens[newScreenID];
    }
    else {
        var screenData = await fetchScreen(newScreenID);
        screens[newScreenID] = screenData;

        if (screenData != null) {
            currentScreen = screenData;
        } else {
            return;
        }
    }

    var tileData = {};
    Object.assign(tileData, staticTileData);

    if ("variableTileData" in currentScreen) {
        Object.assign(tileData, staticTileData, currentScreen.variableTileData);
    }

    for (var y = 0; y < currentScreen.tiles.length; y++) {
        for (var x = 0; x < currentScreen.tiles[0].length; x++) {
            var tileId = currentScreen.tiles[y][x];

            if (isFinite(parseInt(tileId))) {
                var subtileIndex = parseInt(tileId);

                for (let subtileId in currentScreen.subtiles[subtileIndex]) {
                    var subtile = currentScreen.subtiles[subtileIndex][subtileId];

                    for (let condition of subtile.conditions) {
                        if (condition.isConditionMet) {
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

    $("#game-text").text(currentScreen.description);
    $("#screen-text").text(`Screen (${currentScreen.pos.x}, ${currentScreen.pos.y})`);
}

export function moveToScreen(offset) {
    var newScreen = currentScreen.pos.plus(offset);

    loadScreen(newScreen.toString);
}

async function loadJson(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

async function loadText(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
}

document.getElementById("nav-up")?.addEventListener("click", _ => moveToScreen(new Vector2(0, 1)));
document.getElementById("nav-down")?.addEventListener("click", _ => moveToScreen(new Vector2(0, -1)));
document.getElementById("nav-left")?.addEventListener("click", _ => moveToScreen(new Vector2(-1, 0)));
document.getElementById("nav-right")?.addEventListener("click", _ => moveToScreen(new Vector2(1, 0)));

initScreen();

var Game = new GameData();
Game.test = true;

var staticTileData = {};
var screens = {};

var currentScreen: ScreenData;

fetchGameData();