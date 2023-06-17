/*
    Author: John Glenn
    Date: June 16, 2023

    Contains the JavaScript code for the world sprite.  This is part of the view.
*/


/*
    To configure, the following CSS variables must be set in the :root element:
    --world-element: The id of the world sprite element
    --world-container: The id of the world sprite container element
*/


/*  Ensures the world is sized correctly when the window is resized. */
function worldResponsiveResize()
{
    // I don't see a way to solve this in CSS
    // So I'm copying what I did for the scientist
    console.log("Resize World sprite now.")
    
    const ROOT = document.documentElement;
    const WORLD_ELEMENT_NAME = getComputedStyle(ROOT).getPropertyValue("--world-element");
    const CONTAINER_ELEMENT_NAME = getComputedStyle(ROOT).getPropertyValue("--world-container");

    

    const WORLD = document.getElementById(WORLD_ELEMENT_NAME);
    const CONTAINER = document.getElementById(CONTAINER_ELEMENT_NAME);
    
    let transform = `scale(1)`;          
    
    const worldHeight = getComputedStyle(WORLD).height;
    const containerHeight = getComputedStyle(CONTAINER).height;
    const scale = 0.9 * parseFloat(containerHeight) / parseFloat(worldHeight);
    
    transform = `scale(${scale})`;
    WORLD.style.transform=transform;

}

// Set the initial size of the world sprite
// This is a hack to get the world sprite to scale
// to the size of the container.
worldResponsiveResize();

// Add a listener to resize the world sprite
// when the window is resized
addEventListener("resize", worldResponsiveResize);