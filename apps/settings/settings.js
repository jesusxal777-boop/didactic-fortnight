function openSettings(){

createWindow(

"Configuración",

`

<h2>Apariencia</h2>

<button onclick="
document.body.classList.toggle('light')
">

Cambiar tema

</button>

`

);

}
