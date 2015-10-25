//Variables
var wordList=['boy','hello'];//An array including all of the words in the wordsearch
var letters=[];//An array of all the letters in the wordsearch
var sideLength=12;//Side length of the wordsearch (square-shaped wordsearch)
var k =0;//dummy index
var wordSearch=new Array(sideLength);//2-D array of letters 
//Make 'wordSearch' a 2-D array
for (var i = 0; i < wordSearch.length; i++) {
	wordSearch[i]=new Array(sideLength);
};

//Random Number Generator with Seed. Don't trust it. 
// When you want to have actual random numbers, replace all instances of random() with Math.random()
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

//Returns a random number between min and max
function randomInt(min,max){
	return min+ parseInt(random()*max);
}




//Get all the letters from all the words in the 'wordList' and store them in the 'letters' array
for(var i =0; i<wordList.length;i++){
	for(var j=0;j<wordList[i].length;j++){
		letters[k]=wordList[i][j].toUpperCase();
		k++;
	}
}

//Remove duplicates from 'letters' array. Maybe I shouldn't do this?
letters.sort();
for (var i = 0; i < letters.length-1; i++) {
	if(letters[i]==letters[i+1]){
		letters.splice(i+1,1);
		i--;
	}
};

//Set each element of the array 'wordSearch' as a random letter from the array 'letters'
//i specifies the rows (top row: i=0) 
// j specifies the columns (left row: j=0)
for (var i = 0; i < sideLength; i++) {
	for(var j = 0; j < sideLength; j++){
		var x = randomInt(0,letters.length);
		wordSearch[i][j] =letters[x];

	};
};


// ***********************************************************
//Input: i-coordinate and j-coordinate of letter to be changed
//Output: none
// Comment: Randomizes the letter in wordSearch that is in position (i,j)
function changeLetter(i,j){
	wordSearch[i][j]=letters[randomInt(0,letters.length)];
}

//Input: i- and j-coordinates of the letter to be set
//Input: What the new letter should be
//Comment: wordSearch[i][j] is now 'letter'
function setLetter(i,j,letter){
	wordSearch[i][j]=letter;
}
setLetter(0,10,'B');
setLetter(0,11,'O');
setLetter(1,0,'Y');
//Input: Word to be inserted into the wordSearch 
// Output: none
// Comment: Takes the input word and inserts it into the wordSearch array in a random location
function insertWord(word){
	var rand =randomInt(0,3);
	var vertPos=randomInt(0,sideLength);
	var horizPos=randomInt(0,sideLength);
	
	switch(rand){
		case 0://Vertical
		while(vertPos+word.length>sideLength){vertPos--};
		for(i=0;i<word.length;i++){
			wordSearch[vertPos+i][horizPos]=word[i];
		}
		break;
		
		case 1://Horizontal
		while(horizPos+word.length>sideLength){horizPos--};
		for(i=0;i<word.length;i++){
			wordSearch[vertPos][horizPos+i]=word[i];
		}
		break;

		case 2://Diagonal1
		while(vertPos+word.length>sideLength){vertPos--};
		while(horizPos+word.length>sideLength){horizPos--};
		for(i=0;i<word.length;i++){
			wordSearch[vertPos+i][vertPos+i]=word[i];
		}
		break;

		case 3://Diagonal2
		while(vertPos-word.length<0){vertPos++};
		while(horizPos+word.length>sideLength){horizPos--};
		for(i=0;i<word.length;i++){
			wordSearch[vertPos-i][horizPos+i]=word[i]
		}
	}
}



//Input: string
//Output: The reverse of the string
function flipWord(word){
	var flippedWord='';
	for(i=0;i<word.length;i++){
		flippedWord+=word[word.length-i-1];
	}
		return flippedWord;
}

// Input: a string of words
// Output: Returns all the indeces in which a word from wordList appears in the string
// Comment: This function is not case-sensitive. And it also works if the word in 'word' is backwards
function findWord(stringOfWords){
	var sameWord=false;
	var position;
	var hasWord;
	var hasFlippedWord;
	var foundIndeces= [];
	stringOfWords= stringOfWords.toUpperCase();

	for(var i =0;i<wordList.length;i++){//For each word in wordList
		listWord=wordList[i].toUpperCase();
		hasWord=stringOfWords.indexOf(listWord);
		hasFlippedWord=stringOfWords.indexOf(flipWord(listWord));
		
		while(hasWord>=0){
			foundIndeces.push(hasWord);
			hasWord = stringOfWords.indexOf(listWord,hasWord+1);

		}
		while(hasFlippedWord>=0){
			foundIndeces.push(hasFlippedWord);
			hasFlippedWord = stringOfWords.indexOf(flipWord(listWord),hasFlippedWord+1);
		}
	}
	return foundIndeces;
}





//Input: an array of letters
//Output: a string of those letters, with the commas removed. 
function removeComas(array){
	var str = array.toString();
	var newstr='';
	for(var i=0;i<str.length;i++){
		if(str[i]!=','){
			newstr+=str[i];
		}		
	}
	
	return newstr;
}


function checkHoriz(){
	var row='';
	var r;
	var c;
	for(i=0;i<sideLength;i++){//Do for each row in the 2-D array
		row+= removeComas(wordSearch[i].toString());
	}
	var wordHere=findWord(row);
	for(var i=0;i<wordHere.length;i++){
		r = parseInt(1 + wordHere[i]/sideLength);
		c = 1 + wordHere[i]%sideLength;
		console.log( 'Row '+r+'\t Column '+c)
	}
	return 'DONE Checking Horizontal';
}


function checkVert(){
	var column='';
	var r;
	var c;

	for(i=0;i<sideLength;i++){
		for(j=0;j<sideLength;j++){
			column+=wordSearch[j][i];
		}
	}
	var wordHere=findWord(column);
	for(var i=0;i<wordHere.length;i++){
		c = parseInt(1 + wordHere[i]/sideLength);
		r = 1 + wordHere[i]%sideLength;
		console.log( 'Row '+r+'\t Column '+c)
	}
	return 'DONE Checking Vertical';
}
console.log(checkHoriz());
console.log(checkVert());



// ***********************************************************
// JQuery
$(document).ready(function() {
	$('.word-list').html('');//emtpy the ul
//Fill thelist with the list of words that are in the wordsearch
	for (var i = 0; i < wordList.length; i++) {
		var x='';
		x+=$('.word-list').html()+'<li>'+wordList[i].toUpperCase()+'</li>';
		$('.word-list').html(x);
	};

//Fill  the html element .word-search with .letter-box elements each containing a single letter
 	var z ='';
	for (var i = 0; i < sideLength; i++) {
		var y = '';
		for (var j = 0; j < sideLength ; j++) {
			y +='<div class="letter-box">'+wordSearch[i][j]+'</div>';
		};
		z+=y+'</br>';
		$('.word-search').html(z);
	};


//Hovering will change the appearance of a letter-box
	$('.letter-box').hover(function() {
		$(this).toggleClass('hovered');
	},function() {
			$(this).toggleClass('hovered');
		});

//Clicking once will change the appearance of a letter-box permenantly 
//Clicking a second time will change it back to normal
	$('.letter-box').click(function() {
		$(this).toggleClass('clicked');
	});
});

