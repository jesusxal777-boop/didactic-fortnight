function openNotes(){

createWindow(
"DreamByte Notes",

`
<textarea
style="
width:100%;
height:100%;
background:#111;
color:white;
"
oninput="autoSave()"></textarea>
`
);

}

function openStudio(){

createWindow(
"DreamByte Studio",

`
<h2>DreamByte Studio Dev Edition</h2>

<p>
Aquí irá el editor HTML/CSS/JS.
</p>
`
);

}

function openFiles(){

createWindow(
"DreamByte Files",

`
<h2>Explorador de Archivos</h2>
`
);

}
