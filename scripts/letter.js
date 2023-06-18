/*
    John Glenn
    June 17, 2023

    This file contains the Letter class and the Alphabet class.

    The Letter class represents a single letter of the alphabet.  It has two properties:
        letter - the letter itself
        isGuessed - a boolean value indicating whether the letter has been guessed

    The Alphabet class represents the entire alphabet.  It has one property:
        letterDictionary - a dictionary of Letter objects, keyed by the letter itself
    
    May be used to track whether letters have been guessed, and to display the virtual keyboard.
*/
    


const ASCII_A_VALUE = 65;
const ASCII_Z_VALUE = 90;

class Letter{
    constructor( letter ) {
        this.letter = letter;
        this.isGuessed = false;
    }
    
    getLetter() {
        return this.letter;
    }

    guessLetter() {
        this.isGuessed = true;
    }
}

class Alphabet {

    /* Create a dictionary of letter objects */
    constructor(){
        this.letterDictionary = {};
        for( let i = ASCII_A_VALUE; i <= ASCII_Z_VALUE; i++ ){
            this.letterDictionary[String.fromCharCode(i)] = new Letter(String.fromCharCode(i));
        }
    }

    /* Get a letter object from the dictionary */
    getLetter( letter ){
        return this.letterDictionary[letter];
    }
}

// to reset the alphabet, just create a new one
const ALPHABET = new Alphabet();
