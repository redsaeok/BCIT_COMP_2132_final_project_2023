root = document.documentElement;
pTimer = document.getElementById("pTimer");
pWordDisplay = document.getElementById("pWordDisplay");
pGameState = document.getElementById("pGameState");
pError = document.getElementById("pError");
txtGuess = document.getElementById("txtGuess");
btnGuess = document.getElementById("btnGuess");
btnReset = document.getElementById("btnReset");

function start()
{
    newWord = WORD_DICTIONARY.getWord();
    gameState.setWord( newWord.getWord(), newWord.getHint() );
    initializeSprite();
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("TURN_LEFT_TO_FRONT");
    add_to_animation_queue("SHOW_INSTRUCTIONS");
    manage_animation_queue();
}


function guessLetter()
{
    let error = "";
    let letter = txtGuess.value.toUpperCase();
    let isGoodGuess = null;

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
    updateTimer();
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

function reset()
{
    gameState.selectedLetters.forEach(letter => {
        let element = document.getElementById(`key_${letter}`);
        element.style.backgroundColor="";   
    })

    clearTimeout(SCIENTIST.timeout_handler);
    clearTimeout(SCIENTIST.animation_queue_timeout_handler);
    cancelAnimationFrame(SCIENTIST.animation_handler);
    SCIENTIST.animation_queue = [];
    SCIENTIST.is_animating_now = false;
    gameState.reset();
    start();
    updateWordDisplay();
    updateTimer();
    //updateState();
    updateError("");
    clearTimeout(monitor1TimeoutHandler);
    monitor1TimeoutHandler = null;
    resetMontior1Background();
    btnGuess.disabled = false;
    txtGuess.value = "";
    deanimateWordDisplay();
}

start();
updateWordDisplay();
updateTimer();

btnGuess.addEventListener("click", guessLetter);
btnReset.addEventListener("click", reset);



const KB_LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM";
const kbContainer = document.getElementById("kb_container");

function submitVirtualKBPress()
{
    txtGuess.value=this.id.split("").slice(-1);
    guessLetter();

    //throw("stop!");
}

KB_LETTERS.split("").forEach(letter => {
    let element = document.getElementById(`key_${letter}`);
    element.addEventListener('click', submitVirtualKBPress )   
});


// allow only letters to be entered 
// 65 - 90
// where 65 is A and 90 is Z

MIN_ALLOWED_CHAR_CODE = 65;
MAX_ALLOWED_CHAR_CODE = 90;

window.onkeyup = function (e) {    
    // repurposed from my Lunar Lannder mini game from assignment 2
    console.log(e.keyCode);

    if( e.keyCode < MIN_ALLOWED_CHAR_CODE || e.keyCode > MAX_ALLOWED_CHAR_CODE ){
        return;
    }

    txtGuess.value=String.fromCharCode(e.keyCode);
    guessLetter();
};