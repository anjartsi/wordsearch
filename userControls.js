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

var wsMouseUp = function(e) {
  clicking = false;
  start = [null,null];
  checkMatch();
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
  ctx.fillStyle="white";
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
    if(wordList[i] == highlightedWord || wordList[i] == reverseWord) {
      if(document.getElementById("word_"+i).innerHTML.indexOf("&times" == -1)) {
        addClass(document.getElementById('word_'+i),'wordListFound')
      }
    }
  }
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
      highlight(firstChar[i][0].pos[0],firstChar[i][0].pos[1]);
    }

    // Highligh only specific firstChar elements that belong to the correct word in wordList
    else {
      for(var k = 0, ll = firstChar[i][1].length; k < ll; k++) {
        if (firstChar[i][1][k] == wordNum) {
          highlight(firstChar[i][0].pos[0],firstChar[i][0].pos[1]);      
        }
      }
    }

  }
}