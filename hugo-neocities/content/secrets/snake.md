---
title: "Snake"
date: 2024-10-01T21:43:27-04:00
draft: false
---

{{< rawhtml >}}
<div>Score: <span class="score-display">0</span></div>
<div id="game-over">
    <h1>
        Game over!
        <br />
        <br />
        Final Score: <span class="score-display">0</span>
    </h1>

    <br />
    <br />

    <button onclick="initGrid()">Play Again?</button>
</div>

<table id="game-field"></table>

<div class="center" style="width: 100%">
    <table id="controls">
        <tr>
            <td></td>
            <td>
                <button class="control-button" id="button-up" onclick="movingDirection = Directions.UP">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </button>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <button class="control-button" id="button-left" onclick="movingDirection = Directions.LEFT">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
            </td>
            <td></td>
            <td>
                <button class="control-button" id="button-right" onclick="movingDirection = Directions.RIGHT">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <button class="control-button" id="button-down" onclick="movingDirection = Directions.DOWN">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                </button>
            </td>
            <td></td>
        </tr>
    </table>
</div>

<script>
    const EMPTY_IMG = "/secrets/img/empty.png";
    const SNAKE_IMG = "/secrets/img/snake.png";
    const SNAKE_HEAD_IMG = "/secrets/img/snake_head.png";
    const ITEM_IMG = "/secrets/img/item.png";

    const Directions = Object.freeze({
        STILL: Symbol("still"),
        UP:    Symbol("up"),
        DOWN:  Symbol("down"),
        LEFT:  Symbol("left"),
        RIGHT: Symbol("right"),
    });

    const CellTypes = Object.freeze({
        EMPTY: Symbol("empty"),
        SNAKE: Symbol("snake"),
        SNAKE_HEAD: Symbol("snake_head"),
        ITEM:  Symbol("item"),
    });

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
    }

    class Cell {
        constructor(vector, imageType) {
            this.vector = vector;

            this.cellElement = document.createElement("td");
            this.imgElement = document.createElement("img");

            this.cellElement.appendChild(this.imgElement);

            this.setImage(imageType);
        }

        setImage(imageType) {
            this.imageType = imageType;

            if (imageType == CellTypes.EMPTY) {
                this.imgElement.src = EMPTY_IMG;
            } else if (imageType == CellTypes.SNAKE) {
                this.imgElement.src = SNAKE_IMG;
            } else if (imageType == CellTypes.SNAKE_HEAD) {
                this.imgElement.src = SNAKE_HEAD_IMG;
            } else if (imageType == CellTypes.ITEM) {
                this.imgElement.src = ITEM_IMG;
            }
        }
    }

    var movingDirection = Directions.STILL;
    var headPosition;
    var snakePath = [];

    var itemPosition;

    var score = 0;

    const GAME_FIELD = $("#game-field")[0];

    var gridXSize = 16;
    var gridYSize = 16;

    var buttons = {};

    var lastTick = Date.now();
    var timeSinceTick = 0.25;

    var secondsPerTick = 0.25;
    var tickInterval;

    var gameIsOver = false;

    function getCell(vector) {
        return buttons[vector.toString];
    }

    function setCell(vector, newImg) {
        var cell = getCell(vector);
        img = cell.children[0];

        img.src = newImg;
    }

    function randomCell() {
        return new Vector2(Math.floor(Math.random() * gridXSize), Math.floor(Math.random() * gridYSize));
    }

    function placeCellRandomly(cellType) {
        position = randomCell();
        getCell(position).setImage(cellType);

        return position;
    }

    function gameOver() {
        gameIsOver = true;
        movingDirection = Directions.STILL;
    }

    function drawFrame() {
        $("#button-up").attr("active", movingDirection == Directions.UP);
        $("#button-down").attr("active", movingDirection == Directions.DOWN);
        $("#button-left").attr("active", movingDirection == Directions.LEFT);
        $("#button-right").attr("active", movingDirection == Directions.RIGHT);

        clearImages();

        getCell(itemPosition).setImage(CellTypes.ITEM);

        getCell(headPosition).setImage(CellTypes.SNAKE_HEAD);

        var occupiedTiles = [headPosition.toString];

        var currentSegmentPosition = headPosition.copy();
        for (var pathSegment of snakePath) {
            if (pathSegment == Directions.LEFT) {
                currentSegmentPosition.x += 1;
            } else if (pathSegment == Directions.RIGHT) {
                currentSegmentPosition.x -= 1;
            } else if (pathSegment == Directions.UP) {
                currentSegmentPosition.y += 1;
            } else if (pathSegment == Directions.DOWN) {
                currentSegmentPosition.y -= 1;
            }

            if (occupiedTiles.includes(currentSegmentPosition.toString)) {
                gameOver();
                return;
            }
            occupiedTiles.push(currentSegmentPosition.toString);

            var cell = getCell(currentSegmentPosition);

            cell.setImage(CellTypes.SNAKE);
        }
    }

    function tick() {
        $("#game-over").css("display", gameIsOver ? "initial" : "none");

        if (gameIsOver) {
            drawFrame();
            return;
        }
        
        var now = Date.now();
        var delta = now - lastTick;
        lastTick = now;

        timeSinceTick += delta;

        if (timeSinceTick > secondsPerTick * 1000) {
            timeSinceTick = 0;

            $(".score-display").text(score);
            
            var nextPos = headPosition.copy();

            if (movingDirection == Directions.LEFT) {
                nextPos.x -= 1;
            } else if (movingDirection == Directions.RIGHT) {
                nextPos.x += 1;
            } else if (movingDirection == Directions.UP) {
                nextPos.y -= 1;
            } else if (movingDirection == Directions.DOWN) {
                nextPos.y += 1;
            }

            var nextCell = getCell(nextPos);

            if (nextCell) {
                var hitItem = nextPos.equals(itemPosition);

                headPosition = nextPos;

                if (hitItem) {
                    score += 1;
                    itemPosition = placeCellRandomly(CellTypes.ITEM);

                    secondsPerTick = Math.max(0.1, 0.25 - (score / 100));
                }

                snakePath.unshift(movingDirection);

                if (snakePath.length > score) {
                    snakePath.pop();
                }

                drawFrame();
            } else {
                gameOver();
            }
        }
    }

    function clearImages() {
        for (let y = 0; y < gridYSize; y++) {
            for (let x = 0; x < gridXSize; x++) {
                getCell(new Vector2(x, y)).setImage(CellTypes.EMPTY);
            }
        }
    }

    function initGrid() {
        score = 0;
        gameIsOver = false;
        snakePath = [];

        secondsPerTick = 0.25;

        $("#game-field tr").remove();
        buttons = [];

        movingDirection = Directions.STILL;

        for (let y = 0; y < gridYSize; y++) {
            var row = document.createElement("tr");

            GAME_FIELD.appendChild(row);

            for (let x = 0; x < gridXSize; x++) {
                var vector = new Vector2(x, y);

                var cell = new Cell(vector, CellTypes.EMPTY)

                buttons[vector.toString] = cell;

                row.appendChild(cell.cellElement);
            }
        }

        headPosition = placeCellRandomly(CellTypes.SNAKE);
        itemPosition = placeCellRandomly(CellTypes.ITEM);

        tickInterval = setInterval(tick, 0);
    }

    onkeydown = (event) => {
        //console.log(event);

        if (gameIsOver) {
            return;
        }

        if ([38, 87].includes(event.keyCode)) {
            movingDirection = Directions.UP;
        } else if ([40, 83].includes(event.keyCode)) {
            movingDirection = Directions.DOWN;
        } else if ([37, 65].includes(event.keyCode)) {
            movingDirection = Directions.LEFT;
        } else if ([39, 68].includes(event.keyCode)) {
            movingDirection = Directions.RIGHT;
        }
    };

    initGrid();
</script>

<style>
    #game-over {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        
        width: 97%;
        height: 74%;

        text-align: center;
        align-content: center;
    }

    #controls {
        width: unset !important;
    }

    #controls td {
        width: 125px;
        height: 125px;
    }

    #controls td button {
        width: 125px;
        height: 125px;

        font-size: 100px;
    }

    #controls td button[active=true] {
        background: yellow;
    }
</style>
{{</ rawhtml >}}