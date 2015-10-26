/*************************************************
Set up basic information about the wordsearch
*************************************************/
//problem size
var prbSize = 15;
var fontSize = 25; // Need a better name for this variable

// wordList
// List of words to search for, all upper case
// wordList starts out as a string but is converted to an array
var wordList = "hello world foo bar lorem ipsum armen";
wordList = wordList.toUpperCase();
wordList = wordList.split(' ');

// charList
// All the letters that make up the words
var charList = [];
for(var i = 0, l = wordList.length; i < l; i++) {
  for(var j = 0,ll = wordList[i].length; j < ll; j++) {
    if (charList.indexOf(wordList[i][j]) < 0) {
      charList.push(wordList[i][j]);
    }
  }
}

