function createWindow(title,content){

const win =
document.createElement("div");

win.className="window";

win.innerHTML=`
<div class="window-header">

<span>${title}</span>

<button onclick="this.closest('.window').remove()">
✖
</button>

</div>

<div class="window-content">
${content}
</div>
`;

document
.getElementById("windowContainer")
.appendChild(win);

}
