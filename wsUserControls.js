/*****
This file uses the following variables from other files:
wordsearch
arrayOfLetters
ctx
fontSize
******/

var clicking = false;
var listHighlighted = [];
// first letter clicked
var start = [null,null];

var wsMouseDown = function(e) {
    clearHighlight(false);  
  clicking = true;
  var col = Math.floor(e.offsetX/fontSize);
  var row = Math.floor(e.offsetY/fontSize);
  highlight(row,col);
  start = [row,col];
}

// Checks if the current highlighted word is a match. 
// If it is indeed a match, makes appropriate changes
var wsMouseUp = function(e) {
  clicking = false;
  var matchNo = checkMatch();
  var wordListElem = '';
  var numSolElem = -1;
  var numSolutions = 0;
  var cheaterCounter = 0;
  // If the word is a match
  if(matchNo != -1) {
    // Highlight in the array
    for (var i = 0, l = listHighlighted.length; i < l; i++) {
      // cheaterCounter is a way to avoid highlighting the same solution
      // multiple times to cross out the word from wordList
      // Possible problem: if all the letters are highlighed from other sources, 
      // the cheaterCounter will prevent the word from being counted
      if(listHighlighted[i].bcolor != 'white') {cheaterCounter++;}
      listHighlighted[i].bcolor = '#dd1';
      // The letter clicked on is a slightly darker shade
      if(i == 0) {listHighlighted[i].bcolor = '#db1';}
    }

    // Only wordList entries that have multiple solutions have numSol_i divs in them
    wordListElem = document.getElementById("word_" + matchNo)
    numSolElem = document.getElementById("numSol_" + matchNo);
    if(numSolElem) {
      // Take the string inside numSolElem, turn it into an INT, and decrement it
      numSolutions = parseInt(numSolElem.innerHTML,10);
      if (cheaterCounter != wordList[matchNo].length) {
        numSolutions--;
    }
      // If there are still solutions, then make it yellow, but don't cross it out
      if(numSolutions != 0) {
        addClass(wordListElem,'changedNum');
      }
      
      // If all the solutions are found, we can make it red and cross it out
      else {
        addClass(wordListElem,'wordListFound');
        removeClass(wordListElem,'changedNum'); 
      }
      numSolElem.innerHTML=numSolutions;
    }
    // If it doesn't have a numSolElem, then there's only 1 solution, and we can 
    // cross it out in red
    else {
      addClass(document.getElementById('word_' + matchNo),'wordListFound')
    }
  }
  // Clear the start array for next mouseDown event
  start = [null,null];
}

var wsMouseMove = function(e) {
  var col = Math.floor(e.offsetX/fontSize,0);
  var row = Math.floor(e.offsetY/fontSize,0);
  if(clicking) {
   
    var origRow = start[0];
    var origCol = start[1];
    clearHighlight(true); 
   
    // move horizontally
    if(Math.abs(row - origRow) < 2 && col != origCol) {
      // right
      if(col > origCol) {
        for(var i = 0 ;i < col - origCol; i++) {
          highlight(origRow,origCol + i+1);
        }
      }
      // left
      else if( col < origCol) {        
        for(var i = 0; i < origCol - col; i++) {
          highlight(origRow,origCol - i - 1);
        }
      }
    }
    // move vertically
    else if(Math.abs(col - origCol) < 2 && row != origRow) {
      // down (row number 0 is at the top)
      if(row > origRow) {
        for (var i = 0; i < row - origRow; i++) {
          highlight(origRow + i + 1, origCol);
        }
      }
      // up (so row numbers decreasing)
      else if (row < origRow) {
        for (var i = 0; i < origRow - row; i++) {
          highlight(origRow - i - 1, origCol);
        }
      }
    }
    // move diagonally
    else if (Math.abs(Math.abs(row - origRow) - Math.abs(col - origCol)) < 5) {
      // right down (both row and col increasing)
      if(row > origRow && col > origCol) {
        for (var i = 0; i < row - origRow; i++) {
          highlight(origRow + i + 1, origCol + i + 1);
        }
      }
      // left down (row is increasing col is decreasing) 
      else if (row > origRow && col <= origCol) {
        for (var i = 0; i < row - origRow; i++) {
          highlight(origRow + i + 1, origCol - i - 1);
        }
      }
      // right up (row is decreasing col is increasing)
      else if (row <= origRow && col > origCol) {
        for (var i = 0; i< origRow - row; i++) {
          highlight(origRow - i - 1, origCol + i + 1);
        }
      }
      // left up (row and col decreasing) 
      else if (row <= origRow && col <= origCol) {
        for (var i = 0; i < origRow - row; i++) {
          highlight(origRow - i - 1, origCol - i - 1);
        }
      }
    }
 }
}

// change the color of a letter
// also adds the letter to the listHighlighted array
// also changes the isHigh property of the approptiate letter object
var highlight = function(row, col, color) {
  if(arrayOfLetters[row][col] != undefined && !arrayOfLetters[row][col].isHigh) {
    ctx.save();
    ctx.translate(fontSize*col,fontSize*row);
    if(!color) {ctx.fillStyle="#38c";}
    else {ctx.fillStyle=color};
    ctx.fillRect(0,0,fontSize,fontSize);
    ctx.fillStyle='white';
    ctx.fillText(arrayOfLetters[row][col].cont,fontSize/2,fontSize/2)
    ctx.restore();

    arrayOfLetters[row][col].isHigh = true;
    listHighlighted.push(arrayOfLetters[row][col]);
  }
}

// Returns the color of a letter to white
// changes the isHigh property of the letter object
// DOES NOT remove the letter from the listHighlighted array
var unhighlight = function(row, col) {
  ctx.save();
  ctx.translate(fontSize*col,fontSize*row);
  ctx.fillStyle=arrayOfLetters[row][col].bcolor;
  ctx.fillRect(0,0,fontSize,fontSize);
  ctx.fillStyle='black';
  ctx.fillText(arrayOfLetters[row][col].cont,fontSize/2,fontSize/2)
  ctx.restore();

  arrayOfLetters[row][col].isHigh = false;

}

// unhighlights all the letters, and removes them from listHighlighted
var clearHighlight = function(leaveOrig) {
 for(var i=0, l=listHighlighted.length; i<l; i++) {
    var current = listHighlighted[l-i-1]
    //clear entire array
    if (!leaveOrig) {
      unhighlight(current.pos[0],current.pos[1]);
      listHighlighted.pop();      
    }
    //ignore the first term of the array
    else if(l - i > 1) {
      unhighlight(current.pos[0],current.pos[1]);
      listHighlighted.pop();
    }
  }
}

wordsearch.addEventListener('mousedown',wsMouseDown);
wordsearch.addEventListener('mouseup',wsMouseUp);
wordsearch.addEventListener('mousemove',wsMouseMove);

// Takes the letters from listHighlighted, and checks to see if
// It matches any of the words from wordList
// Returns -1 if no match was found, otherwise returns the index of wordList
var checkMatch = function() {
  // Get a string from listHighlighted
  var highlightedWord = "";
  for(var i = 0, l = listHighlighted.length; i < l; i++) {
    highlightedWord+=listHighlighted[i].cont;
  }
  var reverseWord = highlightedWord;
  reverseWord = reverseWord.split('').reverse().join('');
  // Check for matches from wordList
  for(var i = 0, l = wordList.length; i < l; i++) {
    // If a match is found
    if(wordList[i] == highlightedWord || wordList[i] == reverseWord) {return i;} 
  }
  return -1;
}


// This function probably does not need to exist
// Highlights all the instances of the first letter of each word in wordList
// Optional input: wordNum, if you only want to highlight the first letter of a single word
var help = function(wordNum) {
  clearHighlight();
  // for each element in firstChar
  for (var i = 0, l = firstChar.length; i<l; i++) {
    
    // highlight all the firstChar elements
    if(wordNum == null) {
      highlight(firstChar[i].pos[0],firstChar[i].pos[1]);
    }

    // Highligh only specific firstChar elements that belong to the correct word in wordList
    else {
      if (firstChar[i].cont == wordList[wordNum][0]) {
        highlight(firstChar[i].pos[0],firstChar[i].pos[1]);      
      }
    }

  }
}