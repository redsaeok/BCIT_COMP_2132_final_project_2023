const CLOSE_INSTRUCTIONS = document.getElementById("close_instructions");
const CLOSE_WINNING = document.getElementById("close_winning");
const CLOSE_LOSING = document.getElementById("close_losing");
const WIN_DIALOG = document.getElementById("win-dialog");
const LOSE_DIALOG = document.getElementById("lose-dialog");

const MOBILE_MONITOR = document.getElementById("mobile-monitor");

const GENERIC_DIALOG = document.getElementById("generic-dialog");
const GENERIC_DIALOG_CONTENT = document.getElementById(
    "generic-dialog-content"
);
const CLOSE_GENERIC_DIALOG_TOP = document.getElementById(
    "close-generic-dialog"
);
const CLOSE_GENERIC_DIALOG_BOTTOM = document.getElementById(
    "btnClose-generic-instructions-bottom"
);

const SP_HINT = document.getElementById("spHint");
const SP_ELIMINATED = document.getElementById("spEliminated");

let onGenericDialogClose = null;

const SHOW_HELP_TIMEOUT_MS = 10000;

/* The dialog text should be externalized so that it can be localized, and changed outside of the code. */
/* I could move this to another JSON data file to keep it inline with the course material. */

const INTRO_TEXT = `
    <h1>Greetings Professer Falken.</h1>

    <!--p>It's been a long time.  Would you like to play a game?</p-->

    <p>
    Our WOPR supercomputer has detected a nuclear missile
    launch. The American and Russian nuclear systems have been
    tampered with, setting off a series of events that could
    lead to complete devastation by thermonuclear war.
    </p>

    <p>
    The codes to disarm the nuclear weapons have been jumbled
    up, making it challenging to decipher them. Can you assist
    us with unscrambling them, prevent catastrophe, and save us
    all?
    </p>
    <p>
    To assist with your efforts, we have provided a hint. Each
    incorrect guess decreases the Defcon level. Solve the puzzle
    on or before Defcon 1 to disarm the nuclear missiles.
    </p>

    <p>Close this window, then press a key to begin guessing.</p>

    `;

const HOW_TO_PLAY = `
    <h1>How to Play</h1>

    <p>
        To start playing, press any key on your keyboard.  If it
        is correct, one of the scrambled letters will be revealed
        in the code.  If it is incorrect, the Defcon level will
        decrease by one.  If the Defcon level reaches 1, the
        nuclear missiles will launch, and the game will be over.
    </p>
    <p>
        Hint: You can see the number of letters in the word by
        counting the number of scrambled letters in the code. 
    </p> 
        <img id="how-to-type" src="images/how_to_type.gif" alt="How to Type" />
    </p>`;

const WIN_TEXT = `
    <h1>You Win!</h1>

    <p>
        Congratulations on your outstanding achievement! You have
        successfully completed the game with remarkable skill and
        determination. Your perseverance and strategic thinking
        have paid off, leading you to triumph over the challenges
        presented to you. Your remarkable performance is truly
        commendable, and you should take pride in your
        accomplishment. Well done!
    </p>`;

const LOSE_TEXT = `
    <h1>All is Lost!</h1>

    <p>The word was: ##CODE_WORD##</p>

    <p>
        Your valiant efforts did not result in a successful outcome.
        Despite your best intentions and considerable effort, the
        challenges provided to be too formidable. It is important to
        remember that failure is an opportunity for growth and
        learning. By participating in this game, you have showcased
        your willingness to take on challenges and demonstrated
        resilience in the face of adversity. We encourage you to
        continue your pursuit of excellence and wish you the best in
        future endeavors.
    </p>
    `;

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

function updateEliminated() {
    SP_ELIMINATED.innerHTML = "" + gameState.selectedLetters.join(" ");
    SP_HINT.innerHTML = "" + gameState.hint;
}

/*
 *   Shows whether game is starting, in progress, won, or list.
 *   Was used for initial testing, might still be useful for debugging later.
 *   The field is currently hidden by default.
 */
function updateState() {
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
function updateError(message) {
    pError.innerHTML = message;
}

function updateMobileMonitor() {
    MOBILE_MONITOR.style.backgroundImage = `url("images/stage${gameState.numberOfBadGuesses}.gif")`;
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
    animateWordDisplay();
    add_to_animation_queue("TURN_FRONT_TO_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("PACE");
    setTimeout(showHowToPlay, SHOW_HELP_TIMEOUT_MS);
}

function showInstructions() {
    console.log("Show Instructions");
    hideSpinner();
    onGenericDialogClose = hideInstructions;
    showGenericDialog(INTRO_TEXT);
}

function showHowToPlay() {
    // Only show the additional how to play instructions if a guess hasn't been made
    if (0 != gameState.selectedLetters.length) {
        return;
    }

    console.log("Show How to Play");
    showGenericDialog(HOW_TO_PLAY);
}

function hideGenericDialog() {
    GENERIC_DIALOG.style.display = "none";
    GENERIC_DIALOG.style.visibility = "hidden";
    GENERIC_DIALOG.style.opacity = 0;
    GENERIC_DIALOG.style.zIndex = -1;

    /*
     *   See if we queued up any additional actions for when
     *   the dialog is closed.  If there is a callback function,
     *   call it.
     */
    if (null != onGenericDialogClose) {
        onGenericDialogClose();
        onGenericDialogClose = null;
    }
}

function showGenericDialog(content) {
    GENERIC_DIALOG_CONTENT.innerHTML = content;
    GENERIC_DIALOG.style.display = "inline-block";
    GENERIC_DIALOG.style.visibility = "visible";
    GENERIC_DIALOG.style.opacity = 0.95;
    GENERIC_DIALOG.style.zIndex = 5;
}

function showWinDialog() {
    console.log("Show Win Dialog");
    showGenericDialog(WIN_TEXT);
}

function showLoseDialog() {
    console.log("Show Lose Dialog");
    let loseText = LOSE_TEXT;
    loseText = loseText.replace("##CODE_WORD##", gameState.wordToGuess);
    showGenericDialog(loseText);
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

function updateVirtualKB() {
    gameState.selectedLetters.forEach((letter) => {
        let element = document.getElementById(`key_${letter}`);
        element.style.backgroundColor = "var(--inactive-key-color)";
    });
}

/*
 *   Full Screen Defcon Level
 *
 *   This Defcon level appears after a bad guess, and flashes up accross
 *   the entire screen.  It was added because the header on monitor 1
 *   was too small to be noticed, and not visible at all in the mobile view.
 */

function flashDefconLevel(defconLevel) {
    if (defconLevel < 1 || defconLevel > 5) {
        return;
    }

    function removeDefconLevel() {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        DEFCON_LEVEL.classList.toggle("hide_me");
    }

    function hideDefconLevel() {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        DEFCON_LEVEL.style.opacity = 0;

        setTimeout(removeDefconLevel, 500);
    }

    function showDefconLevel(defconLevel) {
        const DEFCON_LEVEL = document.getElementById("defcon-level");
        const DEFCON_LEVEL_TEXT = document.getElementById("defcon-level-text");

        DEFCON_LEVEL_TEXT.style.color = DEFCON_COLOR[defconLevel];

        DEFCON_LEVEL_TEXT.innerHTML = defconLevel;

        DEFCON_LEVEL.classList.toggle("hide_me");
        DEFCON_LEVEL.style.display = "flex";
        DEFCON_LEVEL.style.opacity = 1;

        setTimeout(hideDefconLevel, 500);
    }

    showDefconLevel(defconLevel);
}

// Event listeners for the user dialogs to hide the dialog when closed.
// Should also consider adding a close button at the bottom, my younger
// testers had no problem x'ing out the window, but it was confusing
// for my older testers (respectfully Larry you still do better than
// many of your generation with technology).

CLOSE_GENERIC_DIALOG_BOTTOM.addEventListener("click", hideGenericDialog);
CLOSE_GENERIC_DIALOG_TOP.addEventListener("click", hideGenericDialog);


// Safari is sensitive to how and when audio is loaded and played.
// Doing this during the first interaction seems to work.

document.body.addEventListener(
    "touchstart",
    function () {
        if (audiosWeWantToUnlock) {
            for (let audio of audiosWeWantToUnlock) {
                audio.load();
                //audio.pause();
                //audio.play();
                //audio.pause();
                audio.currentTime = 0;
            }
            audiosWeWantToUnlock = null;
        }
    },
    false
);

document.body.addEventListener(
    "click",
    function () {
        if (audiosWeWantToUnlock) {
            for (let audio of audiosWeWantToUnlock) {
                audio.load();
                //audio.play();
                //audio.pause();
                audio.currentTime = 0;
            }
            audiosWeWantToUnlock = null;
        }
    },
    false
);

// Queue up the audio to be unlocked when the user interacts with the page.
var audiosWeWantToUnlock = [];
audiosWeWantToUnlock.push(new Audio("audio/error.mp3"));
audiosWeWantToUnlock.push(new Audio("audio/click.mp3"));
audiosWeWantToUnlock.push(new Audio("audio/kaboom.wav"));
audiosWeWantToUnlock.push(new Audio("audio/disarmed.mp3"));