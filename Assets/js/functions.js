
function GFG_click() {
    var gfg_down = document.getElementById("alertExample");
    gfg_down.parentNode.removeChild(gfg_down);
}

function IfMovile(){
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i))
    alert("You're using Mobile Device!!")
    else{
        console.debug('Prueba');
    }
}