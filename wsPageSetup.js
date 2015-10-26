/*************************************************
Sets up the problem, and does some initial checks

This file uses the following variables from other files:
  listOfWords
  arrayOfLetters
  wordList
  ctx
*************************************************/

// Populate the wordList <ul> 
var wordListElem = document.getElementById('wordListElem');
for(var i = 0,l = wordList.length; i < l; i++) {
  wordListElem.innerHTML += "<li id='word_"+i+"'>"+wordList[i]+"</li>";
}

// Draw the arrayOfLetters onto the canvas
var printArray = function() {
  for (var i = 0; i < prbSize; i++) {
    for (var j = 0; j < prbSize; j++) {
      ctx.save();
      ctx.translate(fontSize*j,fontSize*i);
      ctx.fillStyle=arrayOfLetters[i][j].bcolor;
      ctx.fillRect(0,0,fontSize,fontSize);
      ctx.fillStyle='black';
      ctx.fillText(arrayOfLetters[i][j].cont,fontSize/2,fontSize/2);
      ctx.restore();
    };
  };
}
printArray();

// Will randomly insert the input into arrayOfLetters
// If word doesn't fit, will try again
var insertRandom = function(word) {
  var row = rand(0,prbSize - 1);
  var col = rand(0,prbSize - 1);
  var dirX = rand(-1, 1);
  var dirY = rand(-1, 1);
  
  // dirX and dirY can't both be negative
  if(dirX == 0 && dirY ==0) {
    insertRandom(word);
  }

  // If these random numbers don't work, try again
  var ins = insertWord(row, col, word, dirX, dirY);
  if(!ins) {
    insertRandom(word);
    removeDuplicatesFromFirstChar();
  }
}

// Makes sure the game is fair by forcing at least one of each
// solution in the array. 
// Calls itself again afterwards to double-check in case it 
// overwrites one solution with another.
var fairGame = function() {
  var anyChanges = false;
  for (var i = 0, l = wordList.length; i < l; i++) {
    // If no solutions are found, make a random one
    if(searchForSolutions(wordList[i],false) == 0) {
      insertRandom(wordList[i]);
      anyChanges = true;
    }
  }

  if(anyChanges) {
    fairGame();
  }
  else {

  }
}
fairGame();
var multiples = function() {
  removeDuplicatesFromFirstChar();
  var numSols = 0;
  for (var i = 0, l = wordList.length; i < l; i++) {
    numSols = searchForSolutions(wordList[i],false)
    if(numSols > 1) {
      document.getElementById('word_'+i).innerHTML+="(&times<div id='numSol_"+i+"'>"+numSols+"</div>)"
    }
  }
}    
multiples();