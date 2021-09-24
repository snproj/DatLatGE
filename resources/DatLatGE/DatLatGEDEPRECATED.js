function movePlayer2DDownByYSpeed(datLat, table, playerObj) {
    //transfer playerObj.name to next location
    let oldPosArray = playerObj.posArray;
    let newPosArray = [playerObj.yPos + playerObj.ySpeed, playerObj.xPos];
    setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

    //change original location to datLat.defaultVal
    setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
}

function movePlayer2DUpByYSpeed(datLat, table, playerObj) {
    //transfer playerObj.name to next location
    let oldPosArray = playerObj.posArray;
    let newPosArray = [playerObj.yPos - playerObj.ySpeed, playerObj.xPos];
    setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

    //change original location to datLat.defaultVal
    setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
}

function movePlayer2DRightByXSpeed(datLat, table, playerObj) {
    //transfer playerObj.name to next location
    let oldPosArray = playerObj.posArray;
    let newPosArray = [playerObj.yPos, playerObj.xPos + playerObj.xSpeed];
    setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

    //change original location to datLat.defaultVal
    setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
}

function movePlayer2DLeftByXSpeed(datLat, table, playerObj) {
    //transfer playerObj.name to next location
    let oldPosArray = playerObj.posArray;
    let newPosArray = [playerObj.yPos, playerObj.xPos - playerObj.xSpeed];
    setAndDisplayPlayer2D(datLat, table, newPosArray, playerObj);

    //change original location to datLat.defaultVal
    setAndDisplay(datLat, table, oldPosArray, datLat.defaultVal);
}

function moveUpBySetDist(dist, origY, origX) {
    datLat1.move([origY[0], origX[0]], [origY[0], origX[0]-dist]);
    updateDisplay(datLat1, test1);

    origX[0] = origX[0]-dist;
}