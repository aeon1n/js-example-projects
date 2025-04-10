"use strict";
const dropzone = document.querySelector("#dropzone");
const filezone = document.querySelector("#filezone");
const progressBar = document.querySelector("#progress-bar");
const progressLabel = document.querySelector("#progress-label");
dropzone.addEventListener("dragenter", () => {
    dropzone.classList.replace("bg-gray-50", "bg-gray-300");
});
dropzone.addEventListener("dragleave", (e) => {
    const related = e.relatedTarget;
    if (!related || !dropzone.contains(related)) {
        dropzone.classList.replace("bg-gray-300", "bg-gray-50");
    }
});
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
});
dropzone.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();
    dropzone.classList.replace("bg-gray-300", "bg-gray-50");
    const dt = e.dataTransfer;
    const files = dt === null || dt === void 0 ? void 0 : dt.files;
    if (files && files[0].type.startsWith("text/")) {
        document.querySelector("#fileTitle").innerHTML =
            files[0].name;
        const reader = new FileReader();
        reader.onloadstart = () => {
            let percent = 0;
            const interval = setInterval(() => {
                if (percent < 95) {
                    percent += 5;
                    progressBar.style.width = `${percent}%`;
                    progressLabel.textContent = `${percent}%`;
                    progressBar.setAttribute("aria-valuenow", percent.toString());
                }
            }, 30);
            reader.onloadend = () => {
                clearInterval(interval);
                progressBar.style.width = `100%`;
                progressLabel.textContent = `100%`;
                progressBar.setAttribute("aria-valuenow", "100");
            };
        };
        reader.onload = () => {
            document.querySelector("#filecontent").classList.remove("hidden");
            if (reader.result) {
                if (typeof reader.result === "string") {
                    document.querySelector("#filecontent > p").innerHTML = reader.result;
                    countLetterFrequency(reader.result);
                }
            }
        };
        reader.onerror = () => {
            console.log("Error reading the file. Please try again.", "error");
        };
        reader.readAsText(files[0]);
    }
    else {
        console.error("filetype not support or smth");
    }
    filezone.classList.remove("hidden");
});
function countLetterFrequency(toCount) {
    const letterCount = {};
    for (let charCode = 97; charCode <= 122; charCode++) {
        const letter = String.fromCharCode(charCode);
        letterCount[letter] = 0;
    }
    for (let char of toCount) {
        if (char >= "a" && char <= "z") {
            letterCount[char]++;
        }
    }
    drawTable(letterCount);
}
function drawTable(letterCount) {
    const res = document.getElementById("freqtable");
    res.innerHTML += `
        <tbody>
          ${Object.entries(letterCount)
        .map(([letter, count]) => `
                <tr class='hover:bg-gray-50'>
                  <td class='border border-gray-300 px-4 py-2'>${letter}</td>
                  <td class='border border-gray-300 px-4 py-2'>${count}</td>
                </tr>
              `)
        .join("")}
        </tbody>
        </table>`;
}
