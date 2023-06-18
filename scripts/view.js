const CLOSE_INSTRUCTIONS = document.getElementById("close_instructions");
const CLOSE_WINNING = document.getElementById("close_winning");
const CLOSE_LOSING = document.getElementById("close_losing");
const WIN_DIALOG = document.getElementById("win-dialog");
const LOSE_DIALOG = document.getElementById("lose-dialog");

const SP_HINT = document.getElementById("spHint");
const SP_ELIMINATED = document.getElementById("spEliminated");


/* 
*   Monitor 2.
*   This is the monitor that shows the guess text box (when troubleshooting),
*   the guess button, and the letters that have been eliminated.
*
*   The guess button is disabled when the game is over.
*
*   It is essential for the desktop view, where the virtual keyboard is not
*   visible, so that users know which letters have been eliminated.
*/

function updateEliminated()
{
    SP_ELIMINATED.innerHTML = "" + gameState.selectedLetters.join(" ");
    SP_HINT.innerHTML = "" + gameState.hint;
}


/*
*   Shows whether game is starting, in progress, won, or list.
*   Was used for initial testing, might still be useful for debugging later.
*   The field is currently hidden by default.
*/
function updateState()
{
    return;
    pGameState.innerHTML = gameState.state;
}

/*
*   Shows the user any errors that are thrown during the game.
*
*   On the plus side, there are no serious errors, and ones that were
*   first possible, are no longer possible.  Most of these had to do
*   with giving the guess bad input, like multiple letters, a lowercase
*   letter, punctuation, etc.  After input was limited to the keyboard
*   or virtual keyboard they were no longer possible.  It still shows
*   when you try the same letter twice, but that's also covered by 
*   the virtual keyboard which greys out previously tried letters, or
*   the second monitor on the desktop view which shows the eliminated
*   letters.
*/
function updateError(message)
{
    pError.innerHTML = message;
}



/*
*   User Dialogs
*
*   These are the dialogs that pop up when the game is started, won, 
*   or lost.  They are hidden by default, and shown when the game is
*   started, won, or lost.  
*
*   In theory they could just be a single dialog, that would reduce
*   our CSS/HTML a bit, but increase JavaScript.  If I need to add
*   another dialog (probably not at this point), I'll probably
*   switch it.
*/

function hideInstructions() {
    instructions.style.display = "none";
    instructions.style.visibility = "hidden";
    instructions.style.opacity = 0;
    instructions.style.zIndex = -1;
    animateWordDisplay();
    add_to_animation_queue("TURN_FRONT_TO_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("PACE")
}

function hideWinDialog() {
    WIN_DIALOG.style.display = "none";
    WIN_DIALOG.style.visibility = "hidden";
    WIN_DIALOG.style.opacity = 0;
    WIN_DIALOG.style.zIndex = -1;
}

function hideLoseDialog() {    
    LOSE_DIALOG.style.display = "none";
    LOSE_DIALOG.style.visibility = "hidden";
    LOSE_DIALOG.style.opacity = 0;
    LOSE_DIALOG.style.zIndex = -1;
}

function showWinDialog() {
    console.log("Show Instructions");
    WIN_DIALOG.style.display = "inline-block";
    WIN_DIALOG.style.visibility = "visible";
    WIN_DIALOG.style.opacity = 0.95;
    WIN_DIALOG.style.zIndex = 5;
}

function showLoseDialog() {
    console.log("Show Instructions");
    LOSE_DIALOG.style.display = "inline-block";
    LOSE_DIALOG.style.visibility = "visible";
    LOSE_DIALOG.style.opacity = 0.95;
    LOSE_DIALOG.style.zIndex = 5;
}



/*
*   Virtual Keyboard
*
*   This is the virtual keyboard that is shown on mobile devices.
*   It is hidden by default, and shown when the screen size is reduced.
*
*   This function is called after every guess to indicate which
*   letters have been selected.
*/


function updateVirtualKB()
{
    gameState.selectedLetters.forEach(letter => {
        let element = document.getElementById(`key_${letter}`);
        element.style.backgroundColor="var(--inactive-key-color)";   
    })
}


/*
*   Full Screen Defcon Level 
*
*   This Defcon level appears after a bad guess, and flashes up accross
*   the entire screen.  It was added because the header on monitor 1
*   was too small to be noticed, and not visible at all in the mobile view.
*/


function flashDefconLevel(defconLevel) 
{
    if ( defconLevel < 1 || defconLevel > 5 )
    {
        return;
    }

    function removeDefconLevel() {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        DEFCON_LEVEL.classList.toggle("hide_me")
    }
    
    function hideDefconLevel() {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        DEFCON_LEVEL.style.opacity=0
    
        setTimeout(removeDefconLevel, 500);
    }
    
    function showDefconLevel(defconLevel) {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        const DEFCON_LEVEL_TEXT = document.getElementById("defcon-level-text");
    
        DEFCON_LEVEL_TEXT.style.color = DEFCON_COLOR[defconLevel];

        DEFCON_LEVEL_TEXT.innerHTML = defconLevel;
    
        DEFCON_LEVEL.classList.toggle("hide_me");
        DEFCON_LEVEL.style.display="flex";    
        DEFCON_LEVEL.style.opacity=1; 
    
        setTimeout(hideDefconLevel, 500);
    }
    
    showDefconLevel(defconLevel);
}

// Event listeners for the user dialogs to hide the dialog when closed.
// Should also consider adding a close button at the bottom, my younger
// testers had no problem x'ing out the window, but it was confusing
// for my older testers (respectfully Larry you still do better than 
// many of your generation with technology).

CLOSE_INSTRUCTIONS.addEventListener("click", hideInstructions);
CLOSE_LOSING.addEventListener("click", hideLoseDialog);
CLOSE_WINNING.addEventListener("click", hideWinDialog);


