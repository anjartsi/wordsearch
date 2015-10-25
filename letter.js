/*****
This file uses the following variables from other files:
wordsearch
ctx
arrayOfLetters
listOfWords
fontSize
*****/

var Letter = function(character,row,col) {
  this.cont = character[0];
  this.pos = [row,col];
  this.nodes = new Array(8);
  this.htmlId= (100*i+j);
  this.isHigh = false;
  /******* this.nodes ***********
  this.nodes is an array containing the surrounding letters of each 
  letter object. the placement looks like the following:
    0   1   2   
    3   *   4
    5   6   7
  For example: this.nodes[3] will be the letter to the left of the object
  *******************************/
}

// Saves all the nodes of a letter
Letter.prototype.getNodes = function() {
  var row = this.pos[0];
  var col = this.pos[1];
  // Topmost row has no nodes 0,1,2 
  if(row == 0) {
    this.nodes[0] = -1;
    this.nodes[1] = -1;
    this.nodes[2] = -1;
  }
  // Bottom-most row has no nodes 5,6,7
  if (row == prbSize - 1) {
    this.nodes[5] = -1;
    this.nodes[6] = -1;
    this.nodes[7] = -1;
  }
  // Leftmost column has no nodes 0,3,5
  if(col == 0) {
    this.nodes[0] = -1;
    this.nodes[3] = -1;
    this.nodes[5] = -1;
  }
  // Rightmost column has no nodes 2,4,7
  if (col == prbSize - 1) {
    this.nodes[2] = -1;
    this.nodes[4] = -1;
    this.nodes[7] = -1;    
  }
  // Set all the nodes, unless they have been disabled already
  if(this.nodes[0] != -1) {this.nodes[0] = arrayOfLetters[row - 1][col - 1]};
  if(this.nodes[1] != -1) {this.nodes[1] = arrayOfLetters[row - 1][col]};
  if(this.nodes[2] != -1) {this.nodes[2] = arrayOfLetters[row - 1][col + 1]};

  if(this.nodes[3] != -1) {this.nodes[3] = arrayOfLetters[row][col - 1]};
  if(this.nodes[4] != -1) {this.nodes[4] = arrayOfLetters[row][col + 1]};

  if(this.nodes[5] != -1) {this.nodes[5] = arrayOfLetters[row + 1][col - 1]};
  if(this.nodes[6] != -1) {this.nodes[6] = arrayOfLetters[row + 1][col]};
  if(this.nodes[7] != -1) {this.nodes[7] = arrayOfLetters[row + 1][col + 1]};
}
