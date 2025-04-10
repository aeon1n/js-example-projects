const dropzone = document.querySelector("#dropzone") as HTMLDivElement;
const filezone = document.querySelector("#filezone") as HTMLDivElement;

const progressBar = document.querySelector("#progress-bar") as HTMLDivElement;
const progressLabel = document.querySelector(
  "#progress-label"
) as HTMLSpanElement;

/* set bg color to darker gray when dragging a file into container */
dropzone.addEventListener("dragenter", () => {
  dropzone.classList.replace("bg-gray-50", "bg-gray-300");
});

/* revert color when container is left */
dropzone.addEventListener("dragleave", (e) => {
  const related = e.relatedTarget as Node | null;
  if (!related || !dropzone.contains(related)) {
    dropzone.classList.replace("bg-gray-300", "bg-gray-50");
  }
});

/* dragover prevend default */
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();

  dropzone.classList.replace("bg-gray-300", "bg-gray-50");

  const dt = e.dataTransfer;
  const files = dt?.files;

  if (files && files[0].type.startsWith("text/")) {
    (document.querySelector("#fileTitle") as HTMLHeadingElement).innerHTML =
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
      (
        document.querySelector("#filecontent") as HTMLDivElement
      ).classList.remove("hidden");
      if (reader.result) {
        if (typeof reader.result === "string") {
          (
            document.querySelector("#filecontent > p") as HTMLParagraphElement
          ).innerHTML = reader.result;

          countLetterFrequency(reader.result);
        }
      }
    };
    reader.onerror = () => {
      console.log("Error reading the file. Please try again.", "error");
    };

    reader.readAsText(files[0]);
  } else {
    console.error("filetype not support or smth");
  }

  filezone.classList.remove("hidden");
});

/* Helper functions */

function countLetterFrequency(toCount: string) {
  const letterCount: { [key: string]: number } = {};

  for (let charCode = 97; charCode <= 122; charCode++) {
    const letter = String.fromCharCode(charCode);
    letterCount[letter] = 0;
  }

  toCount = toCount.toLocaleLowerCase();

  for (let char of toCount) {
    if (char >= "a" && char <= "z") {
      letterCount[char]++;
    }
  }

  drawTable(letterCount);
}

function drawTable(letterCount: { [key: string]: number }): void {
  const res = document.getElementById("freqtable") as HTMLTableElement;

  res.innerHTML += `
        <tbody>
          ${Object.entries(letterCount)
            .map(
              ([letter, count]) => `
                <tr class='hover:bg-gray-50'>
                  <td class='border border-gray-300 px-4 py-2'>${letter}</td>
                  <td class='border border-gray-300 px-4 py-2'>${count}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
        </table>`;
}
