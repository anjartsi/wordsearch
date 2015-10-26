/*************************************************
Initialize the word search

This file uses the Letter object defined in letter.js
*************************************************/

// canvas stuff
var wordsearch = document.getElementById('wordsearch');
wordsearch.height = prbSize * fontSize;
wordsearch.width = prbSize * fontSize;
var ctx = wordsearch.getContext('2d');
ctx.textAlign = 'center';
ctx.font = fontSize * 0.8 + 'px cambria';
ctx.textBaseline = 'middle';

// arrayOfLetters is a 2D (square) array, containing Letter objects
var arrayOfLetters = new Array(prbSize);
for(var i = 0; i < prbSize; i++) {
  arrayOfLetters[i] = new Array(prbSize);
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
    // If a letter is the first letter of any word
    for(var k = 0, l = wordList.length; k < l; k++) {
      if(randomLetter == wordList[k][0]) {
        isFirstChar = true;
      }
    }

    if(isFirstChar) {firstChar.push(arrayOfLetters[i][j]);}
  };
};



// Get nodes of all letters in firstChar
var noderama = function() {
  for(var i = 0, l = firstChar.length; i < l; i++) {
    firstChar[i].getNodes();
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
          firstChar.push(current);
          // The above line is creating duplicates in firstChar
          current.getNodes();
        }
      }
    }
    printArray();
    return true;
  }
}

// Removes extra elements from firstChar. 
// This is necessary after altering arrayOfLetters
// No need to call this function, it is already called automatically.
var removeExtrasFromFirstChar = function() {
  var elementsToRemove = [];
  // For each element in firstChar
  for(var i = 0, l = firstChar.length; i < l; i++) {
    var match = false;

    // Look for matches in wordList
    for(var k = 0, ll = wordList.length; k < ll; k++) {
      if (firstChar[i].cont == wordList[k][0]) {
        match = true;
      }
    }
    // If no matches were found: 
    if(!match) {
      elementsToRemove.push(i);
    }
  }

  // Remove all the elements that had no matches
  for(var i = 0, l = elementsToRemove.length; i < l; i++) {
    firstChar.splice(elementsToRemove[l-i-1],1);
  }
}

var removeDuplicatesFromFirstChar = function() {
  // List containing all the duplicate elements of firstChar
  // This list itself has each set of duplicates twice
  var listOfDups = []
  // Element that may or may not get spliced
  var hotChair;
  // Element being compared to hotChair
  var comp;
  for (var i = 0, l = firstChar.length; i < l; i++) {
    for(var j = 0; j < firstChar.length; j++) {
      hotChair = firstChar[i];
      comp = firstChar[j];
      // If the two elements have the same rwo and col, and the same cont
      if(i != j && hotChair.pos[0] == comp.pos[0] && hotChair.pos[1] == comp.pos[1]) {
        if(hotChair.cont == comp.cont) {
          // Save the two indeces
          listOfDups.push([i,j].sort());
        }
      }
    }
  }
  // At this point list of dups has all the repeat instances... TIMES TWO
  for(var i = 0, l = listOfDups.length; i < l; i++) {
    listOfDups[i].splice(0,1);
    // Only keep the 2nd instance of the repeat
  }
  // Merge listOfDups from arrays of length 1 into 1 array
  listOfDups = listOfDups.reduce(function(a,b) {
    return a.concat(b)
  });

  listOfDups.sort();
  
  // Remove any duplicates from listOfDups
  for(var i = 1, l = listOfDups.length; i < l; i++) {
    if(listOfDups[i]==listOfDups[i-1]) {
      listOfDups.splice(i, 1);
    } 
  }

  // Splice all the repeat offenders, beginning from the back
  listOfDups.reverse();
  for (var i = 0; i< listOfDups.length; i++) {
    firstChar.splice(listOfDups[i],1);
  }
}

/*******************************
Looks through each element in firstChar to see if it forms the word in the input
Returns the number of solutions found
*******************************/
var searchForSolutions = function(wordToMatch, locationBool) {
  wordToMatch = wordToMatch.toUpperCase();
  var locations = [];
  var countMatches = 0;
  var first = wordToMatch[0];
  // For each element in firstChar
  for(var i = 0, l = firstChar.length; i < l; i++) {
    // If the first letter of this word is found in firstChar
    if (first == firstChar[i].cont) {
      // For each node of the firstChar element
      for(var j = 0, ll = firstChar[i].nodes.length; j < ll; j++) {
        // Look at node j of the firstChar element
        // and match it with the remaining parts of wordToMatch
        if(lookAtNode(firstChar[i], wordToMatch.substring(1), j)) {
          countMatches++;
          if(locationBool) {locations.push([firstChar[i].pos[0],firstChar[i].pos[1]]);}
        }
      }
    }

  }
  if(locationBool) {return locations}
  else {
    return countMatches;
  }
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