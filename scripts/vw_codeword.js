/*
    John Glenn
    June 17, 2023

    This file contains the view code for the Code Word display.

    The Code Word display is a single word, with each letter represented by an underscore
    at first, and then a random letter as the game progresses.  The word is animated
    by replacing each letter with a random letter from the alphabet.  
*/

const pWordDisplay = document.getElementById("pWordDisplay");
const CODE_WORD = document.getElementById("dCodeWord");
const CODE_WORD_ANIMATION_UPDATE_INTERVAL_MS = 100;

let codeWordAnimationHandler = null;
let codeWordTimeoutHandler = null;

/*
*   Stops the animation of the code word display.
*
*   This function is called when the game is over.
*/
function deanimateWordDisplay()
{
    cancelAnimationFrame(codeWordAnimationHandler);
    clearTimeout(codeWordTimeoutHandler);
    CODE_WORD.style.display = "block";
}

/*
*   Shows the initial code word display.
*   
*   This function is called when the game starts.
*   It should show the initial code word display, which is a series of underscores.
* 
*/
function updateWordDisplay()
{
    pWordDisplay.innerHTML = gameState.knownLetters.split("").join(" ");
}

/*
*   Animates the code word display.
*
*   This function is called when the game is in progress.
*   It should animate the code word display, replacing each underscore with a random letter.
*   It should stop animating when the game is over.
*   A timer is used to call itself every CODE_WORD_ANIMATION_UPDATE_INTERVAL_MS milliseconds.
*   Until codeWordAnimationHandler and codeWordTimeoutHandler are cleared out.
*/
function animateWordDisplay()
{
    const REPLACEMENT_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*)[]-+;:?<>';
    let letterArray = gameState.knownLetters.split("");

    for( let i = 0; i < letterArray.length; i++ )
    {
        if( "_" == letterArray[i] )
        {
            letterArray[i] = REPLACEMENT_LIST.charAt(Math.random() * REPLACEMENT_LIST.length);
        }
    }

    pWordDisplay.innerHTML = letterArray.join(" ");

    codeWordTimeoutHandler = setTimeout(
        function(){
            codeWordAnimationHandler = requestAnimationFrame( animateWordDisplay );
        }, CODE_WORD_ANIMATION_UPDATE_INTERVAL_MS );

    if( getComputedStyle(CODE_WORD).display=="none" )
    {
        CODE_WORD.style.display = "block";
    }
}
