/*
    John Glenn
    June 17, 2023

    This is a part of the view.  It is responsible for updating the first monitor.
    The first monitor shows the defcon level.  It is updated every 1.5 seconds.

    The animation technique here is to use a single image with 16 different backgrounds,
    and to update the background image every 1.5 seconds.  This gives the illusion of
    an animated monitor.

    This is the same technique we used in class to animate the rotating bike.  The
    rest of the animations were done using different methods.
*/

const root = document.documentElement;
const VW_MONITOR_1 = document.getElementById("monitor-1");
const MONITOR_1_IMAGE_COUNT = 16;
const MONITOR_1_BACKGROUND_PREFIX = "../";

/* The timer/counter view shows the defcon level */
const pTimer = document.getElementById("pTimer");

// Update Monitor 1 Every 1.5 seconds
const MONITOR_1_UPDATE_INTERVAL_MS = 1500;

let monitor1ImageIndex = 1;
let monitor1TimeoutHandler = null;

/*
*   Reset the first monitor to the initial state.
*/
function resetMonitor1Background()
{
    monitor1ImageIndex = 1;
    VW_MONITOR_1.style.backgroundImage = `url("images/mon1-${monitor1ImageIndex}.png")`;
}

/*
*   Update the first monitor to the next image in the sequence.
*/
function updateMonitor1Background()
{
    monitor1ImageIndex = Math.max( 1, ( monitor1ImageIndex + 1 ) % MONITOR_1_IMAGE_COUNT );
    VW_MONITOR_1.style.backgroundImage = `url("images/mon1-${monitor1ImageIndex}.png")`;
    monitor1TimeoutHandler = setTimeout(updateMonitor1Background, MONITOR_1_UPDATE_INTERVAL_MS);
}

/*
*   Update the defcon level on the first monitor.
*   This is called after every guess.
*/
function updateDefconLevel()
{
    /* 
    *   Should I call this from another function, or should I just set it up
    *   to run on a timer?
    */

    /*
    *   The defcon level is roughly the number of guesses remaining.  To keep 
    *   with the theme however I'm limiting it to 5 levels, so the game starts
    *   not showing a defcon level, then descends to 5, and rather than drop
    *   to zero the game ends with a wrong guess on 1.  This gives us the same
    *   number of incorrect guesses as a tradtional hangman game, but with a
    *   little more drama.
    */

    let defconLevel = (MAX_NUMBER_OF_BAD_GUESSES - gameState.numberOfBadGuesses);

    // Animate monitor 1 only after the first bad guess
    // This hides the fact that we have six guesses and only 5 defcon levels
    if( null == monitor1TimeoutHandler && 1 == gameState.numberOfBadGuesses){
        monitor1TimeoutHandler = setTimeout(updateMonitor1Background, MONITOR_1_UPDATE_INTERVAL_MS);
    }

    // Never let the defcon level get below 1;
    if( defconLevel < 1 )
    {
        defconLevel =1;
    }

    /* The guess indicator is a counter, or timer, so the HTML element is labelled as such */
    pTimer.innerHTML = "";
    if( gameState.numberOfBadGuesses == 0 )
    {
        return;
    } 
    
    /* Set the timer roughly to the number of guesses remaining */
    pTimer.innerHTML = "" + (MAX_NUMBER_OF_BAD_GUESSES - gameState.numberOfBadGuesses);
    root.style.setProperty("--defcon-color", DEFCON_COLOR[defconLevel]);
    console.log(`Setting defcon ${defconLevel} color ${DEFCON_COLOR[defconLevel]}` );
    
}
