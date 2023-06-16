const MAX_NUMBER_OF_BAD_GUESSES = 6;

const gameState = {
    wordToGuess: "",
    hint: "",
    knownLetters: "",
    state: "In Progress", // "In Progress", "Won", "Lost
    numberOfBadGuesses: 0,
    isGameOver: false,
    isWon: false,
    isLost: false,
    selectedLetters: [],

    setWord: function( newWord, newHint ) {
        this.wordToGuess = newWord;
        this.hint = newHint;
        this.knownLetters = "_".repeat(newWord.length);
    },

    reset: function() {
        this.wordToGuess = "";
        this.hint = "";
        this.knownLetters = "";
        this.state = "In Progress";
        this.numberOfBadGuesses = 0;
        this.isGameOver = false;
        this.isWon = false;
        this.isLost = false;
        this.selectedLetters = [];
    },

    // Compare the collection of selected letters to the word to guess.
    // If the word is a subset of the selected letters, then we have won.
    isWordGuessed: function() {
        let regexPattern = "^[" + this.selectedLetters.join("") + "]+$";
        return RegExp(regexPattern).test(this.wordToGuess);
    },

    updateKnownLetters: function() {
        this.knownLetters = "";

        for( let i = 0; i < this.wordToGuess.length; i++ ){
            if( this.selectedLetters.includes(this.wordToGuess[i]) ){
                this.knownLetters += this.wordToGuess[i];
            } else {
                this.knownLetters += "_";
            }
        }

        return this.knownLetters;
    },

    guessLetter: function( letter ) {

        // test if letter is a string
        // test if letter is between A and Z (uppercase)

        letter = letter.toUpperCase();
        let isGoodGuess = false;

        if( this.isWon || this.isLost ){
            throw( "The game is over. You cannot guess any more letters");
        }

        // do we have any guesses left?
        if( this.numberOfBadGuesses >= MAX_NUMBER_OF_BAD_GUESSES ) {
            throw( "You have no more guesses left")
        }

        if( letter.length != 1 ){
            throw("You must guess one and only one letter.");
        }

        if( !( letter in ALPHABET.letterDictionary) ) 
        {
            throw("You must guess a letter between A and Z");
        }

        // check if the letter has already been guessed
        if( this.selectedLetters.includes(letter) ){
            throw("You have already guessed that letter before");
        }

        this.selectedLetters.push(letter);
        if( !this.wordToGuess.includes(letter) ){
            this.numberOfBadGuesses++;
        } else {
            this.updateKnownLetters();
            isGoodGuess = true;
        }

        if( this.isWordGuessed() ){
            this.isWon = true;
            this.state = "Won";
            this.isGameOver = true;
        }   

        if( this.numberOfBadGuesses >= MAX_NUMBER_OF_BAD_GUESSES) {
            this.isLost = true;
            this.state = "Lost";
            this.isGameOver = true;
        }

        return isGoodGuess;

    }
}


