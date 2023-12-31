/*
    Author: John Glenn
    Date: June 16, 2023

    This is the word dictionary for the Hangman game. It contains a list of words and hints. 
    It is a part of our data model for the game.  It contains a basic word list that is 
    always available, references a more extensive list in an external data file, and 
    finally, it can fetch even more words from an API endpoint.

    Additional words should be added to the external data file.
*/

const WORD_API_ENDPOINT = "https://www.wordgamedb.com/api/v1/words";
const WORD_DATA_FILE = "../data/word_list.json";



// This is the default word list.  It is used if the external data is not available.
const JSON_WORD_LIST = 
`[
    {
        "word" : "ENGLISH",
        "hint" : "The language you are using right now"
    },
    {
        "word" : "JAVASCRIPT",
        "hint" : "The language you are learning right now"
    },
    {
        "word" : "COMPUTER",
        "hint" : "The machine you are using right now"
    },
    {
        "word" : "KEYBOARD",
        "hint" : "The thing you are typing on right now"
    },
    {
        "word" : "MOUSE",
        "hint" : "The thing you are clicking on right now"
    },
    {
        "word" : "MONITOR",
        "hint" : "The thing you are looking at right now"
    },
    {
        "word" : "DEVELOPER",
        "hint" : "The thing you are becoming right now"
    },
    {
        "word" : "PROGRAMMER",
        "hint" : "The thing you are becoming right now"
    },
    {
        "word" : "CODER",
        "hint" : "The thing you are becoming right now"
    },
    {
        "word" : "MANDARIN",
        "hint" : "A spoken language"
    },
    {
        "word" : "SPANISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "FRENCH",
        "hint" : "A spoken language"
    },
    {
        "word" : "GERMAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "ITALIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "PORTUGUESE",
        "hint" : "A spoken language"
    },
    {
        "word" : "RUSSIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "JAPANESE",
        "hint" : "A spoken language"
    },
    {
        "word" : "KOREAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "ARABIC",
        "hint" : "A spoken language"
    },
    {
        "word" : "HINDI",
        "hint" : "A spoken language"
    },
    {
        "word" : "BENGALI",
        "hint" : "A spoken language"
    },
    {
        "word" : "PUNJABI",
        "hint" : "A spoken language"
    },
    {
        "word" : "TELUGU",
        "hint" : "A spoken language"
    },
    {
        "word" : "MARATHI",
        "hint" : "A spoken language"
    },
    {
        "word" : "TAMIL",
        "hint" : "A spoken language"
    },
    {
        "word" : "URDU",
        "hint" : "A spoken language"
    },
    {
        "word" : "TURKISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "VIETNAMESE",
        "hint" : "A spoken language"
    },
    {
        "word" : "JAVANESE",
        "hint" : "A spoken language"
    },
    {
        "word" : "THAI",
        "hint" : "A spoken language"
    },
    {
        "word" : "GUJARATI",
        "hint" : "A spoken language"
    },
    {
        "word" : "POLISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "UKRAINIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "INDONESIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "DUTCH",
        "hint" : "A spoken language"
    },
    {
        "word" : "KURDISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "SWEDISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "ROMANIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "GREEK",
        "hint" : "A spoken language"
    },
    {
        "word" : "CZECH",
        "hint" : "A spoken language"
    },
    {
        "word" : "HUNGARIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "BELARUSIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "HEBREW",
        "hint" : "A spoken language"
    },
    {
        "word" : "BULGARIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "SERBIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "AZERBAIJANI",
        "hint" : "A spoken language"
    },
    {
        "word" : "PORTUGUESE",
        "hint" : "A spoken language"
    },
    {
        "word" : "PERSIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "ALBANIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "NORWEGIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "ESTONIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "LITHUANIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "LATVIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "SLOVAK",
        "hint" : "A spoken language"
    },
    {
        "word" : "SLOVENIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "CROATIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "FINNISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "DANISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "ICELANDIC",
        "hint" : "A spoken language"
    },
    {
        "word" : "GEORGIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "BOSNIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "ARMENIAN",
        "hint" : "A spoken language"
    },
    {
        "word" : "LUXEMBOURGISH",
        "hint" : "A spoken language"
    },
    {
        "word" : "MALTESE",
        "hint" : "A spoken language"
    }
]`;


/*
*   This class represents a word in the game.  It contains the word itself and a hint.
*   We could add some additional attributs like difficulty level, number of syllabels,
*   category, etc.
*/
class Word{
    constructor( newWord, newHint ){
        // should we do some validation on the word?
        // maybe it has to be between i and j characters long?
        // maybe we have to ensure it's a real word?
        // we should check that it's only letters

        this.word = newWord.toUpperCase().trim();
        this.hint = newHint;

        // we could also have a difficulty level
    }

    /*
    *   Checks if the word is valid.  A valid word is one that only contains letters.
    *   This is useful for checking if the word is valid before adding it to the dictionary,
    *   because of the various ways to add words to the dictionary.  We cannot know for sure
    *   that the API will only return words that are valid.
    * 
    *   @return true if the word is valid, false otherwise
    */
    isValidWord() {
    
        let isValid = true;
        let letter = 'a';

        if( this.word in Object.keys(WORD_DICTIONARY) ){
            isValid = false;
            return isValid;
        }

        for( let i = 0; i < this.word.length; i++ )
        {
            letter = this.word[i];
            if( !( letter in ALPHABET.letterDictionary) ) 
            {
                isValid = false;
                return isValid;
            }
        }

        return isValid;
    }

    getWord() {
        return this.word;
    }

    getHint() {
        return this.hint;
    }

    isLetterInWord( letter ) {
        return this.word.includes(letter);
    }
    
}


/* 
*   This class represents the dictionary of words that we will use in the game.
*   It contains a list of words and their hints.
*/
class WordDictionary{
    constructor(){
        this.wordDictionary = {};
    }

    testOne() {
        console.log("testOne");
    }

    addWord( word, hint ) {
        let newWord = new Word( word, hint );

        if( newWord.isValidWord() )
        {
            this.wordDictionary[newWord.getWord()] = newWord;
        }
    }

    getWord() {
        // get a random word from the dictionary
        // we could also have a difficulty level
        // and get a word based on that
        let keys = Object.keys(this.wordDictionary);
        let randomIndex = Math.floor(Math.random() * keys.length);
        return this.wordDictionary[keys[randomIndex]];
    }

    loadDictionaryFromAPI() {
        
        fetch(WORD_API_ENDPOINT)
            .then(function(response){
                if(!response.ok){
                    throw Error("Response was not OK!");
                }
                return response.json();
            })
            .then(function(data){
                console.log(data);
                
                for( let i = 0; i < data.length; i++ ){
                    WORD_DICTIONARY.addWord( data[i].word.toUpperCase(), data[i].category );
                }

            })
            .catch(function(error){
                console.log(error);
            });
    }

    loadDictionaryFromFile() {
        fetch(WORD_DATA_FILE)
            .then(function(response){
                if(!response.ok){
                    throw Error("Response was not OK!");
                }
                return response.json();
            })
            .then(function(data){
                console.log(data);
                
                for( let i = 0; i < data.length; i++ ){
                    WORD_DICTIONARY.addWord( data[i].word.toUpperCase(), data[i].hint );
                }
            })
            .catch(function(error){
                console.log(error);
            });
    }

    loadDictionary() {
        const WORD_LIST_OBJECT = JSON.parse(JSON_WORD_LIST); 

        // doing this to add the methods to the class
        // maybe there's a better way
        for( let i = 0; i < WORD_LIST_OBJECT.length; i++ ){
            this.addWord( WORD_LIST_OBJECT[i].word, WORD_LIST_OBJECT[i].hint );
        }

    }
}

// Instantiate and load the dictionary
const WORD_DICTIONARY = new WordDictionary();

// start with a guaranteed win so we have some words in our dictionary no matter what
WORD_DICTIONARY.loadDictionary();

// we'll try loading some words from two different sources
// the data file should be pretty safe since we control it
try {
    WORD_DICTIONARY.loadDictionaryFromFile();
} catch (error) {
    console.log(error);
}

// the API will be less safe, as the server may go down, or it may
// return unexpected results
try {
    WORD_DICTIONARY.loadDictionaryFromAPI();
} catch (error) {
    console.log(error);
}

// What I'd really like to do is try to tie this into the OpenAI learning 
// models and have them generate words for us.  That would be cool.
// It's also how I generated the word list both here and in the data file.
// No, I didn't type out all those words.  I'm not that crazy.  I'm crazy, but not that crazy.