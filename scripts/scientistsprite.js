/*
    John Glenn
    June 17, 2023

    This is part of the view.  It is responsible for updating the scientist sprite.

    The scientist sprite is a single image, with a series of animations.  The animations
    are controlled by Javascript which changes the background position of the image, or
    exposes a controlled view to the underlying image.

    This is still very rough as most of the ideas are my own - though in fairness I did
    read a book or two on games and sprites about 20 years ago, and did a bit of searching
    on how to implement them in JavaScript.

    If I were going to do this again, I would probably create a more general object, and
    keep the focus on initialization, queueing actions, and tieing animated queues back 
    to stored functions from the controller.  There would be a lot less exposed code.
*/

/* This was meant to hold a dictionary of commands that could be preset, and then 
   called from the controller.  For example here we're presetting the command to
   show the mobile instructions.  I'd rather this were done by the controller so 
   that the sprite didn't have to explicitly know anything about the rest of the 
   view.
*/

const OVERRIDE_COMMANDS = {
    SHOW_INSTRUCTIONS: null
};

const SCIENTIST_ELEMENT = document.getElementById("sprite-scientist");

/* The meat and potatoes of how my sprite works.  This includes the metadata
   properties to handle addressing it by name, a link to the DOM, a link to
   the container for it in the DOM, a queue of animations to execute, scaling,
   positioning, animation state, timer references, size, sprite sheet
   details, timing, and a dictionary of animation sequences on the sprite
   sheet.

   I love the idea of storing these in JSON, and also the idea of a generic
   object that can be sued for multiple sprites.  
   
   I'm not even going to attempt to get to my ideal next steps in this project.
   This is a huge step up from animating a sprite that had no controls or 
   movement from a week ago, and it has it's own set of outstanding
   challenges.
*/
const JSON_SPRITE_SCIENTIST = `{
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

// Store the JSON in an object
// This makes me happy
const SCIENTIST = JSON.parse(JSON_SPRITE_SCIENTIST);

/* 
    The scientist has the responsibility of showing the user the instructions
    for the game.

    I don't like that this is here.  I should instead set a pointer to
    a function form the view.js file, where this function originally resided.
    There's no good reason to keep this here.

    It's not a huge priority for me, and I'm probably not going to fix it,
    but it's worth noting, uggo, and worth fixing if/when I create a generic
    sprite object.


function showInstructions() {
    console.log("Show Instructions");
    instructions.style.display = "inline-block";
    instructions.style.visibility = "visible";
    instructions.style.opacity = 0.95;
    instructions.style.zIndex = 5;
}
*/


/*
    Setup the sprite object.
    This should be part of a sprite constructor.
    This should be parameterized, and not hard coded.
    I'll do this when I create a generic sprite object.
*/
function initializeSprite() {
    SCIENTIST["element"] = SCIENTIST_ELEMENT;
    SCIENTIST["container"] = document.getElementById("mission-control-center");

    /* This needs to be cleaned up.  I'm still not clear on how to best 
    manage position and movement such that it changes as the viewport size 
    changes.  There's probably some better method, or at least focusing on the 
    origin of the sprite.  Right now I'm using the top left of the container, 
    but really I want the feet to stay on the ground, and our sprite is moving 
    from the bottom right of the container.  It'd be awesome if there was  
    good way to generalize this.  Scaling sprite sheets is a PITA.  This would 
    probably be easier with individual images, or using a canvas to handle the 
    caching and abstracting scaling further */

    SCIENTIST_ELEMENT.style.width = `${SCIENTIST["width"]}px`;
    SCIENTIST_ELEMENT.style.height = `${SCIENTIST["height"]}px`;
    SCIENTIST.element.style.transformOrigin = "top left";
    SCIENTIST_ELEMENT.style.top = SCIENTIST["top"];
    //SCIENTIST_ELEMENT.style.right = SCIENTIST["right"];
    //SCIENTIST_ELEMENT.style.bottom = SCIENTIST["bottom"];
    SCIENTIST_ELEMENT.style.left = SCIENTIST["left"];

    SCIENTIST_ELEMENT.style.backgroundImage = `url('${SCIENTIST["file"]}')`;
    SCIENTIST_ELEMENT.style.backgroundImage = SCIENTIST["file"];
    SCIENTIST_ELEMENT.style.backgroundPositionX = `-${
        SCIENTIST["start_frame_column"] * SCIENTIST["width"]
    }px`;
    SCIENTIST_ELEMENT.style.backgroundPositionY = `-${
        SCIENTIST["start_frame_row"] * SCIENTIST["height"]
    }px`;

    responsiveResize();
    addEventListener("resize", responsiveResize);
}

/*
    Don't call this directly.  I built it as I was creating this, and I use it,
    but queuing animations is much better than calling this directly.

    On the plus side, it does allow us to call individual animations.

    This uses a timer to execute the animation.
*/
function animateSprite(animation) {
    /* Responsive sizing works, until I animate the sprite.  I suspect it has to do with the fact that 
    I'm calculating the position in pixels here, where upto here I have been using percentages.

    Responsiveness was fixed, and I did have to have animations use relative
    dimensions.  Leaving this here as a reminder.
    */

    // don't animate if we're already animating
    if (SCIENTIST.is_animating_now) {
        return false;
    }

    /* Handle special command instructions */
    /* These should be set by the controller */
    if (animation == "SHOW_INSTRUCTIONS") {        
        OVERRIDE_COMMANDS.SHOW_INSTRUCTIONS();
        return;
    }

    if (animation == "PACE") {
        pace();
        return;
    }

    /* Validate that the animation we're calling actually exists */
    if (!(animation in SCIENTIST.animations)) {
        return false;
    }

    /* Called by the code following this */
    function _animateSprite() {
        /* nested because I want this controlled by the containing function */
        /* It would probably be better to use CSS transforms to do this */

        /* duplicated this here in case the viewport changes while animating */
        /* might still expect some strange results */
        SCIENTIST.current_dx =
            SCIENTIST.animations[SCIENTIST.current_animation].dx_per_frame *
            SCIENTIST.scale;
        SCIENTIST.current_dy =
            SCIENTIST.animations[SCIENTIST.current_animation].dy_per_frame *
            SCIENTIST.scale;

        dxPct =
            (SCIENTIST.current_dx /
                parseFloat(getComputedStyle(SCIENTIST.container).width)) *
            100.0;
        dyPct =
            (SCIENTIST.current_dy /
                parseFloat(getComputedStyle(SCIENTIST.container).height)) *
            100.0;

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
        SCIENTIST_ELEMENT.style.backgroundPositionX = `-${
            SCIENTIST["current_frame"] * SCIENTIST["width"]
        }px`;
        SCIENTIST_ELEMENT.style.backgroundPositionY = `-${
            SCIENTIST["current_spritesheet_row"] * SCIENTIST["height"]
        }px`;

        // No need to key up the next frame if we're on the last one
        if (SCIENTIST.current_frame == SCIENTIST.end_frame) {
            SCIENTIST.is_animating_now = false;
            return;
        }

        /* key up the next frame */
        SCIENTIST.current_frame += SCIENTIST.step;
        SCIENTIST.timeout_handler = setTimeout(function () {
            SCIENTIST.animation_handler = requestAnimationFrame(_animateSprite);
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
    SCIENTIST.current_dx =
        SCIENTIST.animations[SCIENTIST.current_animation].dx_per_frame *
        SCIENTIST.scale;
    SCIENTIST.current_dy =
        SCIENTIST.animations[SCIENTIST.current_animation].dy_per_frame *
        SCIENTIST.scale;

    /* Start the animation */
    SCIENTIST.animation_handler = requestAnimationFrame(
        _animateSprite,
        SCIENTIST.FRAME_DURATION_INTERVAL_MS
    );
}

/* If the scientist is hidden, show him */
function show() {
    SCIENTIST.element.style.display = "block";
}

/* If the scientist is visible, hide him */
function hide() {
    SCIENTIST.element.style.display = "none";
}

/* Resize the Scientist when the screen size changes 
    This is a bit of a hack, but it works.
    I was hoping to find another way to do this, but it
    seems like it can only be done with JavaScript, as 
    CSS scaling doe snot have an option to scale relative
    to the container.
*/
function responsiveResize() {
    console.log("Resize sprite now.");

    const viewportWidth = window.innerWidth;
    let transform = `scale(1)`;

    // transform so the scale is relative in pixel sizes
    // default 80x170px

    // ideally we want to be 20vw
    // and 11.4vw

    newHeight = 0.2 * window.innerWidth;
    SCIENTIST.scale = newHeight / SCIENTIST.height;

    transform = `scale(${SCIENTIST.scale})`;
    SCIENTIST.element.style.transform = transform;
}

// How do I keep the sprite at the right scale when the screen is resized?

/* This is the main animation loop.  It checks to see what
   animation commands have been queued and then executes them one
   at a time. 

   This is my most favorite bit of code in the whole project because it 
   takes the complexity of animation and reduces it to a simple queue.

   Once you call it for the first time you're golden, the sprite will
   just keep on animating if there's something to do.

   For example, I issue a pace command, which queues up a series of 
   walks, and turns, and then another pace command, so the scientist
   keeps moving forever until he is reset.
*/
function manage_animation_queue() {
    if (!SCIENTIST.is_animating_now && 0 != SCIENTIST.animation_queue.length) {
        animation = SCIENTIST.animation_queue.shift();
        animateSprite(animation);
    }

    SCIENTIST.timeout_handler = setTimeout(manage_animation_queue, 100);
}


/* Add an animation to the queue */
function add_to_animation_queue(animation) {
    SCIENTIST.animation_queue.push(animation);
}

/* The pace command queues up a series, of 
   turns and walks, and then another pace command.
   It keeps the scientist constantly moving.
*/
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
