/******************************************************************
 * THIS IS AN ADDON LIBRARY WHICH REQUIRES DatLat.js TO FUNCTION
 * 
 * 
 * 
 ******************************************************************/

function displayDatLat(datLat, table) {
    for(let i = 0; i < datLat.dimLengthArray[0]; i++) {
        var row = document.createElement("TR");
        row.setAttribute("id","row" + i);
        row.setAttribute("class", "gameRow");
        table.appendChild(row);
    
        for(let j = 0; j < datLat.dimLengthArray[1]; j++) {
            var column = document.createElement("TD");
            column.setAttribute("id","column" + i + "and" + j);
            column.setAttribute("class", "gameColumn");
            var currentRow = document.getElementById('row' + i);
    
            column.innerHTML = datLat.getElem([i, j]);
    
            currentRow.appendChild(column);
        }
    }
}

function updateDisplay(datLat, table) {
    table.innerHTML = "";
    displayDatLat(datLat, table);
}

function Player2D(_name, _posArray, _speedArray) {
    this._name = _name;
    this._posArray = _posArray;
    this._yPos = this._posArray[0];
    this._xPos = this._posArray[1];

    this._speedArray = _speedArray;
    this._ySpeed = this._speedArray[0];
    this._xSpeed = this._speedArray[1];

    return this;
}

Player2D.prototype = {
    get name() {return this._name;},
    set name(newName) {this._name = newName;},

    get posArray() {return this._posArray;},
    set posArray(newPosArray) {
        this._posArray = newPosArray;
        this.yPos = newPosArray[0];
        this.xPos = newPosArray[1];
    },
    get yPos() {return this._yPos;},
    set yPos(newYPos) {this._yPos = newYPos;},
    get xPos() {return this._xPos;},
    set xPos(newXPos) {this._xPos = newXPos;},

    get speedArray() {return this.speedArray;},
    set speedArray(newSpeedArray) {
        this._speedArray = newSpeedArray;
        this.ySpeed = newSpeedArray[0];
        this.xSpeed = newSpeedArray[1];
    },
    get ySpeed() {return this._ySpeed;},
    set ySpeed(newYSpeed) {this._ySpeed = newYSpeed},
    get xSpeed() {return this._xSpeed;},
    set xSpeed(newXSpeed) {this._xSpeed = newXSpeed}
}

function setAndDisplay(datLat, table, posArray, setValue) {
    datLat.setElem(posArray, setValue);
    updateDisplay(datLat, table);
}

function setAndDisplayPlayer2D(datLat, table, posArray, playerObj) {
    datLat.setElem(posArray, playerObj.name);
    playerObj.posArray = posArray;
    updateDisplay(datLat, table);
}

function movePlayer2DBySpeed(datLat, table, playerObj, direction) {
    let oldPosArray = playerObj.posArray;
    let newPosArray = [];
    switch(direction) {
        case "UP":
            newPosArray = [playerObj.yPos - playerObj.ySpeed, playerObj.xPos];
            break;
        case "DOWN":
            newPosArray = [playerObj.yPos + playerObj.ySpeed, playerObj.xPos];
            break;
        case "LEFT":
            newPosArray = [playerObj.yPos, playerObj.xPos - playerObj.xSpeed];
            break;
        case "RIGHT":
            newPosArray = [playerObj.yPos, playerObj.xPos + playerObj.xSpeed];
            break;
        default:
            console.log("-------------- ERROR IN movePlayer2DBySpeed! --------------");
    }
    setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

    //change original location to datLat.defaultVal
    setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
}

function setLine(datLat, start, endNotIncl, index, setValue, orientation) {
    if(orientation == "VERTICAL") {
        for(let i = start; i < endNotIncl; i++) {
            datLat.setElem([i, index], setValue);
        }
    } else if (orientation == "HORIZONTAL") {
        for(let i = start; i < endNotIncl; i++) {
            datLat.setElem([index, i], setValue);
        }
    }
}

function setLineAndDisplay(datLat, table, start, endNotIncl, index, setValue, orientation) {
    setLine(datLat, start, endNotIncl, index, setValue, orientation);
    updateDisplay(datLat, table);
}

function getIntermediateSteps(oldPosArray, newPosArray) {
    let yDiff = Math.abs(newPosArray[0] - oldPosArray[0]);
    let xDiff = Math.abs(newPosArray[1] - oldPosArray[1]);
    let i = 0;
    let j = 0;
    let stepsArray = [];

    if((newPosArray[0] - oldPosArray[0]) >= 0) { // if moving down or zero
        if((newPosArray[1] - oldPosArray[1]) >= 0) { // if moving right or zero
            for(; i < yDiff; i++) {
                stepsArray.push([oldPosArray[0]+i, oldPosArray[1]]);
            }
            for(; j <= xDiff; j++) {
                    
                stepsArray.push([oldPosArray[0]+i, oldPosArray[1] + j]);
            }
        } else { // if moving left
            for(; i < yDiff; i++) {
                stepsArray.push([oldPosArray[0]+i, oldPosArray[1]]);
            }
            for(; j <= xDiff; j++) {
                    
                stepsArray.push([oldPosArray[0]+i, oldPosArray[1] - j]);
            }
        }
    } else { 
        if((newPosArray[1] - oldPosArray[1]) >= 0) {
            for(; i <= yDiff; i++) {
                stepsArray.push([oldPosArray[0]-i, oldPosArray[1]]);
            }
            for(; j < xDiff; j++) {
                    
                stepsArray.push([oldPosArray[0]-i, oldPosArray[1] + j]);
            }
        } else {
            for(; i <= yDiff; i++) {
                stepsArray.push([oldPosArray[0]-i, oldPosArray[1]]);
            }
            for(; j < xDiff; j++) {
                    
                stepsArray.push([oldPosArray[0]-i, oldPosArray[1] - j]);
            }
        }
    }

    return stepsArray;
}

function checkCollision(datLat, stepsArray, self) {
    for(let i = 1; i < stepsArray.length; i++) { // i starts at 1 to prevent self-collision, since stepsArray also includes own position at the start
        console.log(stepsArray[i]);
        if(datLat.getElem(stepsArray[i]) != datLat.defaultVal && datLat.getElem(stepsArray[i]) != self) {
            console.log("COLLISION DETECTED AT: " + stepsArray[i] + " WITH: " + datLat.getElem(stepsArray[i]));
            return collisionDirectory(self, datLat.getElem(stepsArray[i]));
        };
    }
    return true;
}

function collisionDirectory(self, other) {
    switch(other) {
        case "BOX":
            return true;
        default:
            return false;
    }
}

function moveWithCollision(datLat, table, playerObj, direction) {
    let oldPosArray = playerObj.posArray;
    let newPosArray = [];
    switch(direction) {
        case "UP":
            newPosArray = [playerObj.yPos - playerObj.ySpeed, playerObj.xPos];
            break;
        case "DOWN":
            newPosArray = [playerObj.yPos + playerObj.ySpeed, playerObj.xPos];
            break;
        case "LEFT":
            newPosArray = [playerObj.yPos, playerObj.xPos - playerObj.xSpeed];
            break;
        case "RIGHT":
            newPosArray = [playerObj.yPos, playerObj.xPos + playerObj.xSpeed];
            break;
        default:
            console.log("-------------- ERROR IN moveWithColision! --------------");
    }

    let stepsArray = getIntermediateSteps(oldPosArray, newPosArray);
    
    if(checkCollision(datLat, stepsArray, playerObj.name)) {
        setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

        //change original location to datLat.defaultVal
        setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
    }
}

function surroundingBorder(up, down, left, right, borderVal, posArray) {
    if(left == true) {
        setLineAndDisplay(datLat1, gameMap, 0, posArray[0], 0, borderVal, "VERTICAL");
    }
    if(right == true) {
        setLineAndDisplay(datLat1, gameMap, 0, posArray[0], posArray[1]-1, borderVal, "VERTICAL");
    }
    if(up == true) {
        setLineAndDisplay(datLat1, gameMap, 0, posArray[1], 0, borderVal, "HORIZONTAL");
    }
    if(down == true) {
        setLineAndDisplay(datLat1, gameMap, 0, posArray[1], posArray[0]-1, borderVal, "HORIZONTAL");
    }
}

function createBox(up, down, left, right, borderVal, startPosArray, lengthAndHeightArray) {
    if(left == true) {
        setLineAndDisplay(datLat1, gameMap, startPosArray[0], startPosArray[0]+lengthAndHeightArray[0], startPosArray[1], borderVal, "VERTICAL");
    }
    if(right == true) {
        setLineAndDisplay(datLat1, gameMap, startPosArray[0], startPosArray[0]+lengthAndHeightArray[0], startPosArray[1]+lengthAndHeightArray[1], borderVal, "VERTICAL");
    }
    if(up == true) {
        setLineAndDisplay(datLat1, gameMap, startPosArray[1], startPosArray[1]+lengthAndHeightArray[1]+1, startPosArray[0], borderVal, "HORIZONTAL");
    }
    if(down == true) {
        setLineAndDisplay(datLat1, gameMap, startPosArray[1], startPosArray[1]+lengthAndHeightArray[1]+1, startPosArray[0]+lengthAndHeightArray[0], borderVal, "HORIZONTAL");
    }
}

///////////////////////////// LIBRARY ABOVE, TESTING BELOW /////////////////////////////

var gameMap = document.getElementById('gameMap');
var datLat1 = new DatLat(1, [20, 20], "\\|/");

setLine(datLat1, 0, 6, 4, "[][][][]", "HORIZONTAL");

console.log(datLat1.carry); // Full DatLat view for debugging

displayDatLat(datLat1, gameMap);

var player1 = new Player2D("\\(OwO)/", [2, 2], [1, 1]);

//var player2 = new Player2D("Jack", [7, 7], [1, 1]);

//setAndDisplay(datLat1, gameMap, [10, 10], "John");

setAndDisplayPlayer2D(datLat1, gameMap, [10, 10], player1);
//setAndDisplayPlayer2D(datLat1, gameMap, [14, 9], player2);

console.log(player1); // Full player1 view for debugging

var upButton = document.getElementById('upButton');
upButton.onclick = function(){moveWithCollision(datLat1, gameMap, player1, "UP");};
//upButton.onclick = function(){moveWithCollision(datLat1, gameMap, player2, "UP");};

var leftButton = document.getElementById('leftButton');
leftButton.onclick = function(){moveWithCollision(datLat1, gameMap, player1, "LEFT");};
//leftButton.onclick = function(){moveWithCollision(datLat1, gameMap, player2, "LEFT");};


var downButton = document.getElementById('downButton');
downButton.onclick = function(){moveWithCollision(datLat1, gameMap, player1, "DOWN");};
//downButton.onclick = function(){moveWithCollision(datLat1, gameMap, player2, "DOWN");};

var rightButton = document.getElementById('rightButton');
rightButton.onclick = function(){moveWithCollision(datLat1, gameMap, player1, "RIGHT");};
//rightButton.onclick = function(){moveWithCollision(datLat1, gameMap, player2, "RIGHT");};



surroundingBorder(true, true, true, true, "_______", [20, 20]);

createBox(true, false, true, true, "[][][][]", [7, 3], [4, 9]);