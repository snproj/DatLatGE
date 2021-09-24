function DatLat (appendedDimensions, dimLengthArray, defaultVal = 0, indexArray = [],) {
    this.appendedDimensions = appendedDimensions;
    this.dimLengthArray = dimLengthArray;
    this.defaultVal = defaultVal
    this.indexArray = indexArray;
    this.carry = [];

    for (let x = 0; x < this.dimLengthArray[0]; x++) {
        this.carry.push([]);
    }

    //console.log(this.carry);

    let passingDimLengthArray = this.dimLengthArray.slice();
    passingDimLengthArray.shift();

    let passingAppendedDimensions = this.appendedDimensions - 1;


    if (this.appendedDimensions > 0) {
        let newIndexValue = 0;
        
        for(let y in this.carry) {
            //console.log(this.appendedDimensions + " STARTING GENERATION");
            let passingIndexArray = this.indexArray.slice();
            passingIndexArray.push(newIndexValue);
            var newDatLat = new DatLat(passingAppendedDimensions, passingDimLengthArray, defaultVal, passingIndexArray);
            this.carry[y] = newDatLat;
            newIndexValue++;
        }
    } else {
        for(let y in this.carry) {
            //console.log(this.appendedDimensions + " FILLING WITH " + defaultVal + "!!!!!!!!!! DEAD END.");
            this.carry[y] = defaultVal;
        }
    }

    //console.log(this.appendedDimensions + " COMPLETE");

    return this;
}

DatLat.prototype.getElem = function(coordArray) {
    gottenValue = "ERROR!";
    if (this.appendedDimensions == 0) {
        //console.log("GETELEM BY " + appendedDimensions + " ENDING AT " + coordArray);
        //console.log(this.carry[coordArray]);
        return this.carry[coordArray];
    } else {
        let passingCoordArray = coordArray.slice();
        passingCoordArray.shift();
        //console.log("GETELEM BY " + appendedDimensions + " LOOKING DOWN " + passingCoordArray);
        gottenValue = (this.carry[coordArray[0]]).getElem(passingCoordArray);
        if (gottenValue != "ERROR!") {
            return gottenValue;
        }
    }

    return gottenValue;
};

DatLat.prototype.setElem = function(coordArray, newValue) {
    if (this.appendedDimensions == 0) {
        //console.log("SETELEM BY " + appendedDimensions + " ENDING AT " + coordArray + " WITH VALUE OF " + newValue);
        if(this.carry[coordArray] == undefined) {
            //console.log("WARNING! AN OUT OF BOUNDS INDEX HAS BEEN SET!")
        }
        this.carry[coordArray] = newValue;
        //console.log(this.carry[coordArray])
    } else {
        let passingCoordArray = coordArray.slice();
        passingCoordArray.shift(); 
        //console.log("SETELEM BY " + appendedDimensions + " LOOKING DOWN " + passingCoordArray);
        (this.carry[coordArray[0]]).setElem(passingCoordArray, newValue);
    }
};

DatLat.prototype.linearSearch = function(searchValue) {
    let isFound = false;
    //let foundArray = [];
    if(this.appendedDimensions == 0) {
        //console.log("ENDING IN " + this.indexArray);
        for(let z in this.carry) {
            if(this.carry[z] == searchValue) {
                //console.log("----- FOUND! -----");
                let finalCoord = this.indexArray.slice();
                finalCoord.push(Number(z));
                //foundArray.push(finalCoord);
                //return foundArray;
                return finalCoord;
            }
            console.log("ENDING BRANCH");
        }
    } else {
        //console.log("SEARCHING IN " + this.indexArray);
        for(let i in this.carry) {
            isFound = ((this.carry[i]).linearSearch(searchValue));
            //let val = ((this.carry[i]).linearSearch(searchValue));
            //if(val != false) {
            //    return val;
            //}
            
            if(isFound != false) {
                return isFound;
            }
        }
    }

    //console.log("NOT FOUND!");
    //return foundArray;
    return isFound;
};

DatLat.prototype.linearSearchAll = function(searchValue) {
    let foundArray = [];
    if(this.appendedDimensions == 0) {
        //console.log("ENDING IN " + this.indexArray);
        for(let z in this.carry) {
            if(this.carry[z] == searchValue) {
                //console.log("----- FOUND! -----");
                let finalCoord = this.indexArray.slice();
                finalCoord.push(Number(z));
                //return finalCoord;
                foundArray.push(finalCoord);
                //console.log(foundArray);
                
            }
            //console.log("ENDING BRANCH");
        }
    } else {
        //console.log("SEARCHING IN " + this.indexArray);
        for(let i in this.carry) {
            let val = ((this.carry[i]).linearSearchAll(searchValue));
            if(val != false) {
                //foundArray.push(val);
                for(let j in val) {
                    foundArray.push(val[j]);
                }
            }
        }
    }

    //console.log("NOT FOUND!");
    return foundArray;
};

DatLat.prototype.findAndReplace = function(find, replace) {
    let foundArray = this.linearSearchAll(find);
    let x = 0;

    for(x in foundArray) {
        this.setElem(foundArray[x], replace);
    }
}

DatLat.prototype.move = function(coordArray1, coordArray2, replace = this.defaultVal) {
    let valueToMove = this.getElem(coordArray1);
    this.setElem(coordArray2, valueToMove);
    this.setElem(coordArray1, replace);
}