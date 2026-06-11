function runStudio() {

    const html =
        document.getElementById("htmlCode").value;

    const css =
        document.getElementById("cssCode").value;

    const js =
        document.getElementById("jsCode").value;

    document
        .getElementById("preview")
        .srcdoc = `

        ${html}

        <style>
        ${css}
        </style>

        <script>
        ${js}
        <\/script>

        `;

}

function autoSave(){

localStorage.setItem(
"htmlCode",
document.getElementById("htmlCode").value
);

localStorage.setItem(
"cssCode",
document.getElementById("cssCode").value
);

localStorage.setItem(
"jsCode",
document.getElementById("jsCode").value
);

}
