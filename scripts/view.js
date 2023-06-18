const CLOSE_INSTRUCTIONS = document.getElementById("close_instructions");
const CLOSE_WINNING = document.getElementById("close_winning");
const CLOSE_LOSING = document.getElementById("close_losing");
const CODE_WORD = document.getElementById("dCodeWord");
const WIN_DIALOG = document.getElementById("win-dialog");
const LOSE_DIALOG = document.getElementById("lose-dialog");

const VW_MONITOR_1 = document.getElementById("monitor-1");
const MONITOR_1_IMAGE_COUNT = 16;
const MONITOR_1_BACKGROUND_PREFIX = "../";

const VW_MONITOR_3 = document.getElementById("monitor-3");
const MONITOR_3_PHASE_1_ROWS = 4;
const MONITOR_3_PHASE_1_COLUMNS = 12;
let monitor3Phase = 1;
let monitor3Row = 0;
let monitor3Column = 0;

const SP_HINT = document.getElementById("spHint");
const SP_ELIMINATED = document.getElementById("spEliminated");

// Update Monitor 1 Every 1.5 seconds
const MONITOR_1_UPDATE_INTERVAL_MS = 1500;
const MONITOR_3_UPDATE_INTERVAL_MS = 200;
let monitor1ImageIndex = 1;
let monitor1TimeoutHandler = null;
let monitor3TimeoutHandler = null;
let monitor3AnimationHanlder = null;


DEFCON_COLOR = {
    "6": "blue", 
    "5": "blue",
    "4": "green",
    "3": "yellow",
    "2": "red",
    "1": "white",
    "0": "white"
}

function resetMonitor1Background()
{
    monitor1ImageIndex = 1;
    VW_MONITOR_1.style.backgroundImage = `url("images/mon1-${monitor1ImageIndex}.png")`;
}

function updateMonitor1Background()
{
    monitor1ImageIndex = Math.max( 1, ( monitor1ImageIndex + 1 ) % MONITOR_1_IMAGE_COUNT );
    VW_MONITOR_1.style.backgroundImage = `url("images/mon1-${monitor1ImageIndex}.png")`;
    monitor1TimeoutHandler = setTimeout(updateMonitor1Background, MONITOR_1_UPDATE_INTERVAL_MS);
}

/*
function updateMonitor3Background()
{ 

    VW_MONITOR_3.style.backgroundImage = `url("images/slice_${monitor3Row}_${monitor3Column}.gif")`;
    
    monitor3Column = ( monitor3Column + 1 );
    if( MONITOR_3_PHASE_1_COLUMNS == monitor3Column )
    {
        monitor3Column = 0;
        monitor3Row = ( monitor3Row + 1 ) % MONITOR_3_PHASE_1_ROWS;
    }    

    monitor3TimeoutHandler = setTimeout(function() {
        monitor3AnimationHandler = requestAnimationFrame(updateMonitor3Background)
    }, MONITOR_3_UPDATE_INTERVAL_MS);
}
*/



function updateDefconLevel()
{
    let defconLevel = (MAX_NUMBER_OF_BAD_GUESSES - gameState.numberOfBadGuesses);

    if( null == monitor1TimeoutHandler && 1 == gameState.numberOfBadGuesses){
        monitor1TimeoutHandler = setTimeout(updateMonitor1Background, MONITOR_1_UPDATE_INTERVAL_MS);
    }

    // Never let the defcon level get below 1;
    if( defconLevel < 1 )
    {
        defconLevel =1;
    }

    pTimer.innerHTML = "";
    if( gameState.numberOfBadGuesses == 0 )
    {
        return;
    } 
    
    pTimer.innerHTML = "" + (MAX_NUMBER_OF_BAD_GUESSES - gameState.numberOfBadGuesses);
    root.style.setProperty("--defcon-color", DEFCON_COLOR[defconLevel]);
    console.log(`Setting defcon ${defconLevel} color ${DEFCON_COLOR[defconLevel]}` );
    
}


function updateEliminated()
{
    SP_ELIMINATED.innerHTML = "" + gameState.selectedLetters.join(" ");
    SP_HINT.innerHTML = "" + gameState.hint;
}


function updateState()
{
    return;
    pGameState.innerHTML = gameState.state;
}

function updateError(message)
{
    pError.innerHTML = message;
}

// updateMonitor3Background();

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


function updateVirtualKB()
{
    gameState.selectedLetters.forEach(letter => {
        let element = document.getElementById(`key_${letter}`);
        element.style.backgroundColor="var(--inactive-key-color)";   
    })
}



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

CLOSE_INSTRUCTIONS.addEventListener("click", hideInstructions);
CLOSE_LOSING.addEventListener("click", hideLoseDialog);
CLOSE_WINNING.addEventListener("click", hideWinDialog);


