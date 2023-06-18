/*
    John Glenn
    June 17, 2023

    This file contains the view code for the Spinner display.

    The Spinner was created to show the user that the game is loading.
    Really this gives mobile users something to look at when the 
    scientist is being animated on the desktop version.

    It also has the added benefit of preventing the user from clicking
    on the virtual keyboard while the game is loading.
*/



const SPINNER = document.getElementById("spinner-container");

function showSpinner() {
    SPINNER.style.display = "flex";
    SPINNER.style.visibility = "visible";
}

function hideSpinner() {
    SPINNER.style.display = "none";
    SPINNER.style.visibility = "hidden";
}
