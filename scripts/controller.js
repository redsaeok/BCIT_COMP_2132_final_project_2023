const root = document.documentElement;
const pGameState = document.getElementById("pGameState");
const pError = document.getElementById("pError");
const txtGuess = document.getElementById("txtGuess");
const btnGuess = document.getElementById("btnGuess");
const btnReset = document.getElementById("btnReset");
const btnMobileReset = document.getElementById("btnMobileReset");
const kbContainer = document.getElementById("kb_container");

// allow only letters to be entered 
// 65 - 90
// where 65 is A and 90 is Z
const KB_LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM";

// This is letter A
MIN_ALLOWED_CHAR_CODE = 65;

// This is letter Z
MAX_ALLOWED_CHAR_CODE = 90;


/* 
*   This sets up the first game.
*
*   This function is called when the page loads.
*   It sets the initial game state, by choosing the first word,
*   initializing the sprite, and updating the word display.
*/
function start()
{
    updateError("");
    newWord = WORD_DICTIONARY.getWord();
    gameState.setWord( newWord.getWord(), newWord.getHint() );

    initializeSprite();

    // Should this be moved to the sprite module?
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("TURN_LEFT_TO_FRONT");
    add_to_animation_queue("SHOW_INSTRUCTIONS");
    manage_animation_queue();

    /* Show something for the mobile version, which doesn't have the Scientist sprite */
    /* It's too cluttered with him there */
    showSpinner();

    /* These are not strictly needed on the first call, but useful on subsequent calls */
    updateWordDisplay();
    updateEliminated();
    updateDefconLevel();
}

/* 
*   Reset the game to the initial state.
*
*   This function is called when the user clicks the reset button.
*   It should reset the game state, the virtual keyboard, the word display,
*   the scientist sprite, and the monitor backgrounds.
*
*   It should also call start() to start a new game.
*/
function reset()
{
    /* Reset the first monitor */
    clearTimeout(monitor1TimeoutHandler);
    monitor1TimeoutHandler = null;
    resetMonitor1Background();

    /* Reset the virtual keyboard */
    gameState.selectedLetters.forEach(letter => {
        let element = document.getElementById(`key_${letter}`);
        element.style.backgroundColor="";   
    })

    // Reset the word display
    deanimateWordDisplay();

    // Reset guess button and guessed letters
    btnGuess.disabled = false;
    txtGuess.value = "";

    /* Reset the scientist sprite */
    /* this should probably all be in the sprite module */
    SCIENTIST.animation_queue = [];
    clearTimeout(SCIENTIST.timeout_handler);
    clearTimeout(SCIENTIST.animation_queue_timeout_handler);
    cancelAnimationFrame(SCIENTIST.animation_handler);
    SCIENTIST.is_animating_now = false;

    /* Reset the game state model */
    gameState.reset();
    start();

}

/*
*   Guess one letter of the code word.
*
*   This function is called when the user clicks the Guess button,
*   or presses a key on the virtual keyboard, or presses a key on the
*   physical keyboard.
*/
function guessLetter()
{
    let error = "";
    let letter = txtGuess.value.toUpperCase();
    let isGoodGuess = null;

    if( MAX_NUMBER_OF_BAD_GUESSES == gameState.numberOfBadGuesses ){
        return;
    }

    try {
        isGoodGuess = gameState.guessLetter(letter);
    } catch (e) {
        error = e;
    }

    if( false == isGoodGuess ){
        flashDefconLevel(MAX_NUMBER_OF_BAD_GUESSES-gameState.numberOfBadGuesses);
    }

    
    updateVirtualKB();
    updateWordDisplay();
    updateEliminated();
    updateDefconLevel();
    updateState();
    updateError(error);
    txtGuess.value = "";

    if( gameState.isGameOver ){
        btnGuess.disabled = true;
    }

    if( gameState.isWon )
    {
        showWinDialog();
    } else if( gameState.isLost )
    {
        showLoseDialog();
    } 


}


/*
*   Virtual keyboard controls
*/

/*
*   Processes keyboard button presses.
*
*   This function is called when the user clicks a key on the virtual keyboard.
*   It should update the virtual keyboard display, and call guessLetter().
*
*   The virtual keyboard upate is handled by guess letter in case it's submitted
*   by the physical keyboard, that way the virtual keyboard is always in sync.
*
*   The keypress is stored in the txtGuess input element.  Originally this was
*   visible, could be selected, had text directly entered into it, and submitted
*   with a button.  Now input is done via the virutual keyboard, or physical
*   keyboard, and the txtGuess input element is hidden.
*/
function submitVirtualKBPress()
{
    txtGuess.value=this.id.split("").slice(-1);
    guessLetter();

    //throw("stop!");
}



/*
*   Bind functions to controls
*/

// I should make this an attribute of the scientist
// the name here is too generic
OVERRIDE_COMMANDS.SHOW_INSTRUCTIONS = showInstructions;

// No longer visible, useful for testing
btnGuess.addEventListener("click", guessLetter);

// Mobile and Desktop Reset
btnReset.addEventListener("click", reset);
btnMobileReset.addEventListener("click", reset);

// Virtual keyboard buttons
KB_LETTERS.split("").forEach(letter => {
    let element = document.getElementById(`key_${letter}`);
    element.addEventListener('click', submitVirtualKBPress )   
});

// Physical keyboard
window.onkeyup = function (e) {    
    // repurposed from my Lunar Lannder mini game from assignment 2
    console.log(e.keyCode);

    if( e.keyCode < MIN_ALLOWED_CHAR_CODE || e.keyCode > MAX_ALLOWED_CHAR_CODE ){
        return;
    }

    txtGuess.value=String.fromCharCode(e.keyCode);
    guessLetter();
};

// Start the game
start();
