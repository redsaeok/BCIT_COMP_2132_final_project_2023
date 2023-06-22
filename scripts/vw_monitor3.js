/*
    John Glenn
    June 17, 2023

    This is a part of the view.  It is responsible for updating the third monitor.
    The third monitor shows a spinning world.

    I'm having some issues with flickering.  This was implemented like Monitor 1, 
    with a series of images, and then it was implemented with a sprite sheet.

    Currently it's implemented as a sprite sheet that's controlled by CSS.  It 
    works great on Linux with Firefox, but it still flickers in Safari on Mac OS X
    sometimes.

    Update 6/22 - Switched from CSS to Sass variables and flicker is gone.  Also
    just commented out everything here since it's been fully replaced by CSS.

*/

/*
const VW_MONITOR_3 = document.getElementById("monitor-3");
const MONITOR_3_PHASE_1_ROWS = 4;
const MONITOR_3_PHASE_1_COLUMNS = 12;

let monitor3Phase = 1;
let monitor3Row = 0;
let monitor3Column = 0;

const MONITOR_3_UPDATE_INTERVAL_MS = 200;

let monitor3TimeoutHandler = null;
let monitor3AnimationHandler = null;
*/


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

// updateMonitor3Background();