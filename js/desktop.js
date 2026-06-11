const startBtn =
document.getElementById("startBtn");

const startMenu =
document.getElementById("startMenu");

startBtn.onclick=()=>{

startMenu.classList.toggle("show");

};

document
.querySelectorAll(".app-launch")
.forEach(btn=>{

btn.onclick=()=>{

const app =
btn.dataset.app;

if(app==="notes")
openNotes();

if(app==="studio")
openStudio();

if(app==="files")
openFiles();

};

});

document
.querySelectorAll(".desktop-icon")
.forEach(icon=>{

icon.onclick=()=>{

const app =
icon.dataset.app;

if(app==="notes")
openNotes();

if(app==="studio")
openStudio();

if(app==="files")
openFiles();

};

});
