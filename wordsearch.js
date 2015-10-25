/*************************************************
Initialize the word search

This file uses the Letter object defined in letter.js
*************************************************/

//problem size
var prbSize = 7;
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
// wordList starts out as a string but is converted to an array
var wordList = "hello name armen";
wordList = wordList.toUpperCase();
wordList = wordList.split(' ');

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


/***********************************************************
Inserts a specific word into the wordsearch
DirectionX can be -1 (left), 0 (vertical) or 1 (right)
DirectionY can be -1 (up), 0 (horizontal) or 1 (down)
DirectionX and DirectionY should not bot be zero
Checks to see if the words fits, returns false if the word doesn't fit
***********************************************************/ 
var insertWord = function(row, col, word, directionY, directionX) {
  // If the word doesn't fit horizontally
  if(directionX * word.length + col > prbSize || directionX * word.length + col + 1 < 0) {
    return false;
  }
  // If the word doesn't fit vertically
  else if(directionY * word.length + row > prbSize || directionY * word.length + row + 1 < 0) {
    return false;
  }

  // If the word fits, insert it
  else {
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
    return true;
  }
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
  for(var i = 0, l = elementsToRemove.length; i < l; i++) {
    firstChar.splice(elementsToRemove[i],1);
  }
}

/*******************************
Looks through each element in firstChar to see if it forms the word in the input
Returns the number of solutions found
*******************************/
var searchForSolutions = function(wordToMatch) {
  var matchExists = 0;
  var first = wordToMatch[0].toUpperCase();
  for(var i = 0, l = firstChar.length; i < l; i++) {
    // If the first letter of this word is found in firstChar
    var currentFirstChar = firstChar[i][0]

    if (first == currentFirstChar.cont) {
      // For each node of the firstChar element
      for(var j = 0, ll = currentFirstChar.nodes.length; j < ll; j++) {
        if(lookAtNode(currentFirstChar, wordToMatch.substring(1), j)) {
          matchExists++;
        }
      }
    }

  }
  return matchExists;
}

/*******************************
Inputs: a letter object
        a word that is being searched
        a direction, as an index of Letter.nodes array
This function will check ONE node of the given letter to see if it matches 
the FIRST letter of wordToMatch. 
If true, it will call itself on the next node (in the same direction) with the 
next letter of wordToWatch

If all letters match, this function returns true
*******************************/ 
var lookAtNode = function(letter, wordToMatch, nodeDirection) {
  // If wordToMatch is empty, this means all the letters already match.
  if(wordToMatch.length == 0) {return true;}

  // If the node in that direction does not match the next letter in the word
  if(letter.nodes[nodeDirection].cont != wordToMatch[0]){
    return false;
  }

  else {
    letter.nodes[nodeDirection].getNodes();
    return lookAtNode(letter.nodes[nodeDirection], wordToMatch.substring(1), nodeDirection);
  }
}