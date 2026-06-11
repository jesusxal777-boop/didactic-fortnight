const startButton =
document.getElementById("startButton");

const startMenu =
document.getElementById("startMenu");

startButton.addEventListener("click",()=>{

startMenu.classList.toggle("hidden");

});

function openWindow(id){

document
.getElementById(id)
.classList.remove("hidden");

}

function closeWindow(id){

document
.getElementById(id)
.classList.add("hidden");

}

document.querySelectorAll(".window")
.forEach(windowElement=>{

const header =
windowElement.querySelector(".window-header");

let dragging = false;

let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown",(e)=>{

dragging = true;

offsetX =
e.clientX -
windowElement.offsetLeft;

offsetY =
e.clientY -
windowElement.offsetTop;

});

document.addEventListener("mousemove",(e)=>{

if(!dragging) return;

windowElement.style.left =
(e.clientX-offsetX)+"px";

windowElement.style.top =
(e.clientY-offsetY)+"px";

});

document.addEventListener("mouseup",()=>{

dragging = false;

});

});