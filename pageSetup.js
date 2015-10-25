/*************************************************
Handles all the interactions with the HTML page (other than canvas)
// This description is no longer 100% accurate. 

This file uses the following variables from other files:
  listOfWords
  arrayOfLetters
*************************************************/

// Populate the wordList <ul> 
var wordListElem = document.getElementById('wordListElem');
for(var i = 0,l = wordList.length; i < l; i++) {
  wordListElem.innerHTML += "<li id='word_"+i+"'>"+wordList[i]+"</li>";
}

