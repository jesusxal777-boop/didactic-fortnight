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

<div class="studio-layout">

<textarea id="htmlCode"
placeholder="HTML"></textarea>

<textarea id="cssCode"
placeholder="CSS"></textarea>

<textarea id="jsCode"
placeholder="JavaScript"></textarea>

<button onclick="runStudio()">
▶ Ejecutar
</button>

<iframe id="preview"></iframe>

</div>

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
