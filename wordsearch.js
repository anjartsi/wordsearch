/*************************************************
Initialize the word search

This file uses the Letter object defined in letter.js
*************************************************/

//problem size
var prbSize = 25;
var fontSize = 25; // Need a better name for this variable

var wordsearch = document.getElementById('wordsearch');
wordsearch.height=prbSize*fontSize;
wordsearch.width=prbSize*fontSize;
var ctx = wordsearch.getContext('2d');
ctx.textAlign='center';
ctx.font= fontSize*0.8+'px cambria';
ctx.textBaseline='middle';

// arrayOfLetters is a 2D (square) array, containing Letter objects
var arrayOfLetters = new Array(prbSize);
for(var i=0; i<prbSize; i++) {
  arrayOfLetters[i] = new Array(prbSize);
}

// List of words to search for, all upper case
var wordList = ["hello","world", "bee"];
for(var i = 0, l = wordList.length; i < l; i++) {
  wordList[i]=wordList[i].toUpperCase();
}

// All the letters that make up the words
var charList = [];
for(var i = 0,l = wordList.length; i < l; i++) {
  for(var j=0,ll = wordList[i].length; j<ll; j++) {
    if (charList.indexOf(wordList[i][j]) < 0) {
      charList.push(wordList[i][j]);
    }
  }
}

// Array containing the locations of the first letter of each word in the list
var firstChar = []
// Populate arrayOfLetters with letter objects
for (var i = 0; i < prbSize; i++) {
  for (var j = 0; j < prbSize; j++) {
    // Generate a random letter from the charList
    var randomLetter = charList[rand(0,charList.length-1)];
    arrayOfLetters[i][j] = new Letter(randomLetter,i,j);

   /***********************************************************
    Keep track of the first letter of each word from wordList
    This will be useful to search for solutions..
    firstChar is an array of 3-length arrays
    firstChar[n] = [Letter, [belongsTo]] where Letter is the letter object
    and belongsTo is an array that specifies which indeces of wordList this
    is the first letter of. 
    ***********************************************************/
    var isFirstChar = false;
    var belongsTo = []
    // If a letter is the first letter of any word
    for(var k = 0, l = wordList.length; k < l; k++) {
      if(randomLetter == wordList[k][0]) {
        isFirstChar = true;
        belongsTo.push(k);
      }
    }

    if(isFirstChar) {firstChar.push([arrayOfLetters[i][j],belongsTo]);}
  };
};



// Get nodes of all letters in firstChar
var noderama = function() {
  for(var i = 0, l = firstChar.length; i < l; i++) {
    firstChar[i][0].getNodes();
  }  
}
noderama();

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


// Draw the arrayOfLetters onto the canvas
var printArray = function() {
  for (var i = 0; i < prbSize; i++) {
    for (var j = 0; j < prbSize; j++) {
      ctx.save();
      ctx.translate(fontSize*j,fontSize*i);
      ctx.fillStyle='white';
      ctx.fillRect(0,0,fontSize,fontSize);
      ctx.fillStyle='black';
      ctx.fillText(arrayOfLetters[i][j].cont,fontSize/2,fontSize/2);
      ctx.restore();
    };
  };
}
printArray();

// Inserts a specific word into the wordsearch
// DirectionX can be -1 (left), 0 (vertical) or 1 (right)
// DirectionY can be -1 (up), 0 (horizontal) or 1 (down)
// DirectionX and DirectionY should not bot be zero
// Does NOT check to see if the words fits.... maybe I should add that feature??
var insertWord = function(row, col, word, directionY, directionX) {
  for(var i = 0, l = word.length; i < l; i++) {
    var current = arrayOfLetters[row + i * directionY][col + i * directionX];
    current.cont = word[i].toUpperCase();

    // If any of these letters belong in firstChar, add them there.
    for(var j = 0, ll = wordList.length; j < ll; j++) {
      if(current.cont == wordList[j][0]) {
        firstChar.push([current,j]);
        current.getNodes();
      }
    }
  }
  printArray();
  fixFirstCharArray();
}

// Removes extra elements from firstChar. 
// This is necessary after altering arrayOfLetters
// No need to call this function, it is already called automatically.
var fixFirstCharArray = function() {
  var elementsToRemove = []
  // For each element in firstChar
  for(var i = 0, l = firstChar.length; i < l; i++) {
    var match = false;

    // Look for matches in wordList
    for(var k = 0, ll = wordList.length; k < ll; k++) {
      if (firstChar[i][0].cont == wordList[k][0]) {
        match = true;
      }
    }

    // If no matches were found: 
    if(!match) {
      elementsToRemove.push(i);
    }
  }
  console.log(elementsToRemove);
  for(var i = 0, l = elementsToRemove.length; i < l; i++) {
    firstChar.splice(elementsToRemove[i],1);
  }
}

insertWord(0,0,"hello",0,1);
insertWord(1,0,"world",1,1);
