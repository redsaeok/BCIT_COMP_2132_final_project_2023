

/* While I haven't done a lot of searching about spries in JavaScript, I haven't seen a decent way to represent
   the animations.  This is my original attempt.  For this project I want to use a singular sprite, but ideally
   we're working towards somethign that is reusable and general.  */


const OVERRIDE_COMMANDS = 
{
    "SHOW_INSTRUCTIONS": showInstructions
}


const SCIENTIST_ELEMENT = document.getElementById("sprite-scientist")
const JSON_SPRITE_SCIENTIST = 
`{
        "name" : "SCIENTIST",
        "description" : "walk left, turn front and back, transform to walk right",
        "element": "store reference to element here",      
        "container": "store the container here",  
        "animation_queue": [],        
        "current_scale": 1,
        "is_animating_now": false,
        "current_animation": "",
        "current_frame": "",
        "current_spritesheet_row": "",
        "current_dx": 0,
        "current_dy": 0,
        "start_frame": "",
        "end_frame": "",
        "step": "",
        "animation_handler": null,
        "timeout_handler": null,
        "animation_queue_timeout_handler": null,
        "width": 80,
        "height": 170,
        "rows": 4,
        "start_frame_row": 3,
        "start_frame_column": 0, 
        "top": "49%",
        "right": "",
        "bottom": "",
        "left": "100%",
        "start_description": "FACING_FORWARD",
        "file": "images/scientist-spritesheet.png",
        "FRAME_DURATION_INTERVAL_MS": 150,
        "animations": {
            "WALK_LEFT" : 
                { 
                    "name": "WALK_LEFT",
                    "row": 0,
                    "start_frame": 0,
                    "end_frame": 7,
                    "step": 1,    
                    "dx_per_frame": -10,
                    "dy_per_frame": 0
                },
            "TURN_LEFT_TO_FRONT" :
                {
                    "name": "TURN_LEFT_TO_FRONT",
                    "row": 1,
                    "start_frame": 2,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_FRONT_TO_LEFT" :
                {
                    "name": "TURN_FRONT_TO_LEFT",
                    "row": 1,
                    "start_frame": 4,
                    "end_frame": 2,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_LEFT_TO_BACK" :
                {
                    "name": "TURN_LEFT_TO_BACK",
                    "row": 1,
                    "start_frame": 2,
                    "end_frame": 0,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_BACK_TO_LEFT" :
                {
                    "name": "TURN_BACK_TO_LEFT",
                    "row": 1,
                    "start_frame": 0,
                    "end_frame": 2,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "WALK_RIGHT" :
                { 
                    "name": "WALK_RIGHT",
                    "row": 2,
                    "start_frame": 7,
                    "end_frame": 0,
                    "step": -1,    
                    "dx_per_frame": 10,
                    "dy_per_frame": 0
                },
            "TURN_RIGHT_TO_FRONT" : 
                {
                    "name": "TURN_RIGHT_TO_FRONT",
                    "row": 3,
                    "start_frame": 2,
                    "end_frame": 0,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_FRONT_TO_RIGHT" :
                {
                    "name": "TURN_FRONT_TO_RIGHT",
                    "row": 3,
                    "start_frame": 0,
                    "end_frame": 2,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_RIGHT_TO_BACK" :
                {
                    "name": "TURN_RIGHT_TO_BACK",
                    "row": 3,
                    "start_frame": 2,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },
            "TURN_BACK_TO_RIGHT" : 
                {
                    "name": "TURN_BACK_TO_RIGHT",
                    "row": 3,
                    "start_frame": 4,
                    "end_frame": 2,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },            
            "TURN_FRONT_TO_BACK_RIGHT" :
                {
                    "name": "TURN_FRONT_TO_BACK_RIGHT",
                    "row": 3,
                    "start_frame": 0,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },          
            "TURN_FRONT_TO_BACK" :
                {
                    "name": "TURN_FRONT_TO_BACK",
                    "row": 3,
                    "start_frame": 0,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },    
            "TURN_BACK_TO_FRONT_RIGHT" :
                {
                    "name": "TURN_BACK_TO_FRONT_RIGHT",
                    "row": 3,
                    "start_frame": 4,
                    "end_frame": 0,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },      
            "TURN_FRONT_TO_BACK_LEFT" : 
                {
                    "name": "TURN_FRONT_TO_BACK_LEFT",
                    "row": 1,
                    "start_frame": 4,
                    "end_frame": 0,                
                    "step": -1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },          
            "TURN_BACK_TO_FRONT" :
                {
                    "name": "TURN_BACK_TO_BACK_FRONT",
                    "row": 1,
                    "start_frame": 0,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                },          
            "TURN_BACK_TO_FRONT_LEFT" :
                {
                    "name": "TURN_BACK_TO_FRONT_LEFT",
                    "row": 1,
                    "start_frame": 0,
                    "end_frame": 4,                
                    "step": 1,
                    "dx_per_frame": 0,
                    "dy_per_frame": 0  
                }                                   
        }
}
`;

const SCIENTIST = JSON.parse(JSON_SPRITE_SCIENTIST); 

function showInstructions() {
    console.log("Show Instructions");
    instructions.style.display = "inline-block";
    instructions.style.visibility = "visible";
    instructions.style.opacity = 0.95;
    instructions.style.zIndex = 5;
}

function initializeSprite() 
{
    SCIENTIST["element"] = SCIENTIST_ELEMENT;
    SCIENTIST["container"] = document.getElementById('mission-control-center');


    /* This needs to be cleaned up.  I'm still not clear on how to best manage position and movment such that it
    changes as the viewport size changes.  There's probably some better method, or at least focusing on the origin
    of the sprite.  Right now I'm using the top left of the container, but really I want the feet to stay on the ground,
    and our sprite is moving from the bottom right of the container.  It'd be awesome if there was  good way to 
    generalie this.  Scaling spritesheets is a PITA.  This would probably be easier with individual images, or using 
    a canvas to handle the caching and abstracting scaling further */

    SCIENTIST_ELEMENT.style.width = `${SCIENTIST["width"]}px`;
    SCIENTIST_ELEMENT.style.height = `${SCIENTIST["height"]}px`;
    SCIENTIST.element.style.transformOrigin="top left";
    SCIENTIST_ELEMENT.style.top = SCIENTIST["top"];
    //SCIENTIST_ELEMENT.style.right = SCIENTIST["right"];
    //SCIENTIST_ELEMENT.style.bottom = SCIENTIST["bottom"];
    SCIENTIST_ELEMENT.style.left = SCIENTIST["left"];    
    

    SCIENTIST_ELEMENT.style.backgroundImage = `url('${SCIENTIST["file"]}')`;
    SCIENTIST_ELEMENT.style.backgroundImage = SCIENTIST["file"];
    SCIENTIST_ELEMENT.style.backgroundPositionX = `-${SCIENTIST["start_frame_column"] * SCIENTIST["width"]}px`;
    SCIENTIST_ELEMENT.style.backgroundPositionY = `-${SCIENTIST["start_frame_row"] * SCIENTIST["height"]}px`;

    responsiveResize();
    addEventListener("resize", responsiveResize);
}

function animateSprite(animation)
{
    /* Responsive sizing works, until I animate the sprite.  I suspect it has to do with the fact that 
    I'm calculating the position in pixels here, where upto here I have been using percentages */


    if( SCIENTIST.is_animating_now ){
        return false;
    }

    if( animation == "SHOW_INSTRUCTIONS" ){
        hideSpinner();
        showInstructions();
        return;
    } 

    if( animation == "PACE"){
        pace();
        return;
    }


    if( !( animation in SCIENTIST.animations )){
        return false;
    }

    /* Called by the code following this */
    function _animateSprite(){
        /* nested because I want this controlled by the containing function */
        /* It would probably be better to use CSS transforms to do this */     
        
        /* duplicated this here in case the viewport changes while animating */
        /* might still expect some strange results */
        SCIENTIST.current_dx = SCIENTIST.animations[SCIENTIST.current_animation].dx_per_frame * SCIENTIST.scale;
        SCIENTIST.current_dy = SCIENTIST.animations[SCIENTIST.current_animation].dy_per_frame * SCIENTIST.scale;

        dxPct = SCIENTIST.current_dx / parseFloat(getComputedStyle(SCIENTIST.container).width) * 100.0;
        dyPct = SCIENTIST.current_dy / parseFloat(getComputedStyle(SCIENTIST.container).height) * 100.0;

        /* Using getComputedStyle returned values in Pixels, which broke the responsive design.
           The element properties are already set as percentages by now so we can use those and
           our sprite will stay where it's expected (hopefully).
        */

        let topPct = parseFloat(SCIENTIST.element.style.top);
        let leftPct = parseFloat(SCIENTIST.element.style.left);

        topPct += dyPct;
        leftPct += dxPct;

        /* draw the frame */         
        SCIENTIST.element.style.top = `${topPct}%`;    
        SCIENTIST.element.style.left = `${leftPct}%`;   
        SCIENTIST_ELEMENT.style.backgroundPositionX = `-${SCIENTIST["current_frame"] * SCIENTIST["width"]}px`;
        SCIENTIST_ELEMENT.style.backgroundPositionY = `-${SCIENTIST["current_spritesheet_row"] * SCIENTIST["height"]}px`;

        if( SCIENTIST.current_frame == SCIENTIST.end_frame )
        {
            SCIENTIST.is_animating_now = false;
            return;
        } 

        /* key up the next frame */
        SCIENTIST.current_frame += SCIENTIST.step;
        SCIENTIST.timeout_handler = setTimeout(function(){
            SCIENTIST.animation_handler = requestAnimationFrame( _animateSprite );
        }, SCIENTIST.FRAME_DURATION_INTERVAL_MS);
    }

    /* We probably don't need to duplicate all of these and could get away with just tracking which
       animation we're in and where in the animation cycle we're at 
    */

    /* Setup the animation parameters */
    SCIENTIST.current_animation = animation;
    SCIENTIST.is_animating_now = true;
    SCIENTIST.current_frame = SCIENTIST.animations[animation].start_frame;
    SCIENTIST.start_frame = SCIENTIST.animations[animation].start_frame;
    SCIENTIST.end_frame = SCIENTIST.animations[animation].end_frame;
    SCIENTIST.step = SCIENTIST.animations[animation].step;
    SCIENTIST.current_spritesheet_row = SCIENTIST.animations[animation].row;
    SCIENTIST.current_dx = SCIENTIST.animations[SCIENTIST.current_animation].dx_per_frame * SCIENTIST.scale;
    SCIENTIST.current_dy = SCIENTIST.animations[SCIENTIST.current_animation].dy_per_frame * SCIENTIST.scale;
    
    SCIENTIST.animation_handler = requestAnimationFrame( _animateSprite, SCIENTIST.FRAME_DURATION_INTERVAL_MS );
    
    
}



function show()
{
    SCIENTIST.element.style.display = 'block';
}

    
function hide()
{
    SCIENTIST.element.style.display = "none";
}


function responsiveResize()
{
    console.log("Resize sprite now.")
    

    const viewportWidth = window.innerWidth;
    let transform = `scale(1)`;

    
    // transform so the scale is relative in pixel sizes
    // default 80x170px

    // ideally we want to be 20vw
    // and 11.4vw

    newHeight = 0.2 * window.innerWidth;
    SCIENTIST.scale = newHeight / SCIENTIST.height;
    
    transform = `scale(${SCIENTIST.scale})`;
    SCIENTIST.element.style.transform=transform;

}

// How do I keep the sprite at the right scale when the screen is resized?

function manage_animation_queue() {
    if( ( !SCIENTIST.is_animating_now )  && 
        ( 0 != SCIENTIST.animation_queue.length ) )
    {
        animation = SCIENTIST.animation_queue.shift()
        animateSprite(animation)
    }

    SCIENTIST.timeout_handler = setTimeout(manage_animation_queue, 100);
}

function add_to_animation_queue(animation) {
    SCIENTIST.animation_queue.push(animation)
}

function pace() {
    add_to_animation_queue("TURN_LEFT_TO_BACK");
    add_to_animation_queue("TURN_BACK_TO_RIGHT");
    add_to_animation_queue("WALK_RIGHT");
    add_to_animation_queue("WALK_RIGHT");
    add_to_animation_queue("TURN_RIGHT_TO_FRONT");
    add_to_animation_queue("TURN_FRONT_TO_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("WALK_LEFT");
    add_to_animation_queue("PACE");
}