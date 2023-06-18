

const SPINNER = document.getElementById("spinner-container");

function showSpinner() {
    SPINNER.style.display = "flex";
    SPINNER.style.visibility = "visible";
}

function hideSpinner() {
    SPINNER.style.display = "none";
    SPINNER.style.visibility = "hidden";
}
