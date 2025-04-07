const start = document.getElementById("start") as HTMLInputElement;
const end = document.getElementById("end") as HTMLInputElement;
const increment = document.getElementById("increment") as HTMLInputElement;
const conductance = document.getElementById(
  "conductanceSelect"
) as HTMLSelectElement;

const btnCalc = document.querySelector("#btnCalc");
const btnSave = document.querySelector("#btnSave");
const btnLoad = document.querySelector("#btnLoad");
const msg = document.querySelector("#msg");

interface CalcResult {
  length: number;
  diameter: { [key: number]: number };
}
interface CustomFormData {
  start: number;
  end: number;
  increment: number;
  material: string;
}

let calcResults: CalcResult[] = [];
let formData: CustomFormData;

btnLoad?.addEventListener("click", getFromLocalStorage);
btnSave?.addEventListener("click", () =>
  saveToLocalStorage(calcResults, formData)
);

btnCalc?.addEventListener("click", () => {
  const diameter = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  let startValue = parseInt(start.value);
  let endValue = parseInt(end.value);
  let incrementValue = parseInt(increment.value);

  calcResults = [];

  formData = {
    start: startValue,
    end: endValue,
    increment: incrementValue,
    material: conductance.value,
  };

  //#region
  /*   [
    {
      length: 1.0,
      diameter: {
        0.5: 0,
        0.6: 1,
        0.7: 2,
        0.8: 3,
        0.9: 4,
        1.0: 5,
      },
    },
    {
      length: 2.0,
      diameter: {
        0.5: 0,
        0.6: 1,
        0.7: 2,
        0.8: 3,
        0.9: 4,
        1.0: 5,
      },
    },
  ]; */
  //#endregion

  for (let i = startValue; i <= endValue; i += incrementValue) {
    const diameterObj: { [key: number]: number } = {};

    for (let d of diameter) {
      diameterObj[d] = calculateResistance(
        startValue,
        endValue,
        incrementValue,
        conductance.value,
        d,
        i
      );
    }

    calcResults.push({
      length: i,
      diameter: diameterObj,
    });
  }

  drawTable(calcResults);
});

function calculateResistance(
  start: number,
  end: number,
  increment: number,
  conductance: string,
  diameter: number,
  length: number
): number {
  const k = calculateConductance(conductance);
  const a = (Math.PI * diameter ** 2) / 4;

  return +(length / (k * a)).toFixed(3);
}

function calculateConductance(material: string): number {
  switch (material) {
    case "silver":
      return 60.6;
      break;
    case "copper":
      return 56.8;
      break;
    case "aluminium":
      return 36.0;
      break;
    case "brass":
      return 13.3;
      break;
    default:
      return 0;
  }
}

function drawTable(objToDraw: CalcResult[]): void {
  const res = document.getElementById("result") as HTMLDivElement;
  res.classList.remove("hidden");

  res.innerHTML = `
  <h2 class="text-lg font-bold py-0 my-0 text-indigo-600">Calculation Results:</h2><br />
<table class='table-auto border-collapse border border-gray-300 w-full text-sm text-left text-gray-700 box-border'>
        <thead class='bg-gray-100 text-gray-700 uppercase'>
                <tr>
                        <th class='border border-gray-300 px-4 py-2'>l / d</th>
                        <th class='border border-gray-300 px-4 py-2'>0.5 mm</th>
                        <th class='border border-gray-300 px-4 py-2'>0.6 mm</th>
                        <th class='border border-gray-300 px-4 py-2'>0.7 mm</th>
                        <th class='border border-gray-300 px-4 py-2'>0.8 mm</th>
                        <th class='border border-gray-300 px-4 py-2'>0.9 mm</th>
                        <th class='border border-gray-300 px-4 py-2'>1.0 mm</th>
                </tr>
        </thead>
        <tbody>
                ${objToDraw
                  .map(
                    (o) => `
                        <tr class='hover:bg-gray-50'>
                                <td class='border border-gray-300 px-4 py-2'>${o.length}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[0.5]}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[0.6]}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[0.7]}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[0.8]}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[0.9]}</td>
                                <td class='border border-gray-300 px-4 py-2'>${o.diameter[1.0]}</td>
                        </tr>
                    `
                  )
                  .join("")}
        </tbody>
</table>
`;
}

function saveToLocalStorage(
  obj: CalcResult[],
  formData: { start: number; end: number; increment: number; material: string }
): void {
  try {
    localStorage.setItem("data", JSON.stringify(obj));
    localStorage.setItem(
      "formData",
      JSON.stringify({
        start: formData.start,
        end: formData.end,
        increment: formData.increment,
        material: formData.material,
      })
    );

    if (msg) {
      msg.classList.remove("hidden");
      msg.innerHTML = "Erfolgreich gespeichert";
      setTimeout(() => {
        msg.classList.add("hidden");
      }, 1500);
    }
  } catch (e) {
    console.log(e);
  }
}

function getFromLocalStorage() {
  const data = localStorage.getItem("data");
  const formData = localStorage.getItem("formData");
  try {
    if (data) {
      calcResults = JSON.parse(data) as CalcResult[];
    }
    if (formData) {
      let form = JSON.parse(formData) as CustomFormData;

      start.value = form.start.toString();
      end.value = form.end.toString();
      increment.value = form.increment.toString();
      conductance.value = form.material;
      drawTable(calcResults);
    }
    if (msg) {
      msg.classList.remove("hidden");
      msg.innerHTML = "Erfolgreich geladen";
      setTimeout(() => {
        msg.classList.add("hidden");
      }, 1500);
    }
  } catch (e) {
    console.log(e);
  }
}
