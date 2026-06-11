let zIndexCounter = 100;

function createWindow(title, content) {

    const win = document.createElement("div");

    win.className = "window";

    win.style.zIndex = zIndexCounter++;

    win.innerHTML = `
        <div class="window-header">

            <span>${title}</span>

            <div>

                <button class="min-btn">─</button>

                <button class="max-btn">□</button>

                <button class="close-btn">✖</button>

            </div>

        </div>

        <div class="window-content">
            ${content}
        </div>
    `;

    document
        .getElementById("windowContainer")
        .appendChild(win);

    enableDragging(win);

    win.querySelector(".close-btn")
        .onclick = () => win.remove();

    win.querySelector(".min-btn")
        .onclick = () => {

            win.querySelector(".window-content")
                .classList.toggle("hidden");

        };

    win.querySelector(".max-btn")
        .onclick = () => {

            win.classList.toggle("maximized");

        };

    win.addEventListener("mousedown", () => {

        win.style.zIndex = zIndexCounter++;

    });

}

function enableDragging(win) {

    const header =
        win.querySelector(".window-header");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (e) => {

        dragging = true;

        offsetX =
            e.clientX - win.offsetLeft;

        offsetY =
            e.clientY - win.offsetTop;

    });

    document.addEventListener("mousemove", (e) => {

        if (!dragging) return;

        win.style.left =
            (e.clientX - offsetX) + "px";

        win.style.top =
            (e.clientY - offsetY) + "px";

    });

    document.addEventListener("mouseup", () => {

        dragging = false;

    });

}
