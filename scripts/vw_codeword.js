const pWordDisplay = document.getElementById("pWordDisplay");

const CODE_WORD_ANIMATION_UPDATE_INTERVAL_MS = 100;

let codeWordAnimationHanlder = null;
let codeWordTimeoutHanlder = null;

function deanimateWordDisplay()
{
    cancelAnimationFrame(codeWordAnimationHanlder);
    clearTimeout(codeWordTimeoutHandler);
    CODE_WORD.style.display = "block";
}

function updateWordDisplay()
{
    pWordDisplay.innerHTML = gameState.knownLetters.split("").join(" ");
}

function animateWordDisplay()
{
    const REPLACEMENT_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*)[]-+;:?<>'
    letterArray = gameState.knownLetters.split("");

    for( let i = 0; i < letterArray.length; i++ )
    {
        if( "_" == letterArray[i] )
        {
            letterArray[i] = REPLACEMENT_LIST.charAt(Math.random() * REPLACEMENT_LIST.length);
        }
    }

    pWordDisplay.innerHTML = letterArray.join(" ");

    codeWordTimeoutHandler = setTimeout(
        function(){
            codeWordAnimationHandler = requestAnimationFrame( animateWordDisplay );
        }, CODE_WORD_ANIMATION_UPDATE_INTERVAL_MS );

    if( getComputedStyle(CODE_WORD).display=="none" )
    {
        CODE_WORD.style.display = "block";
    }
}
