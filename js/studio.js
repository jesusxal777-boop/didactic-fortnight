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
