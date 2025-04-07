import Flag from "./Flag.js";

/* Type Definition for JSON-Object */
interface flag {
  countryName: string;
  countryColors: string[];
  aspectRatio: string;
  alignment: string;
}

/* Setup some Flags with appropriate AR */
let flags: flag[] = [
  {
    countryName: "Deutschland",
    countryColors: ["000000", "DD0000", "FFCC00"],
    aspectRatio: "3:5",
    alignment: "horizontal",
  },
  {
    countryName: "Bulgarien",
    countryColors: ["FFFFFF", "00966E", "D62612"],
    aspectRatio: "3:5",
    alignment: "horizontal",
  },
  {
    countryName: "Estland",
    countryColors: ["0072CE", "000000", "FFFFFF"],
    aspectRatio: "7:11",
    alignment: "horizontal",
  },
  {
    countryName: "Litauen",
    countryColors: ["FFB81C", "046A38", "BE3A34"],
    aspectRatio: "3:5",
    alignment: "horizontal",
  },
  {
    countryName: "Luxemburg",
    countryColors: ["EA141D", "FFFFFF", "51ADDA"],
    aspectRatio: "3:5",
    alignment: "horizontal",
  },
  {
    countryName: "Niederlande",
    countryColors: ["C8102E", "FFFFFF", "003DA5"],
    aspectRatio: "2:3",
    alignment: "horizontal",
  },
  {
    countryName: "Österreich",
    countryColors: ["EF3340", "FFFFFF", "EF3340"],
    aspectRatio: "2:3",
    alignment: "horizontal",
  },
  {
    countryName: "Ungarn",
    countryColors: ["CE2939", "FFFFFF", "477050"],
    aspectRatio: "1:2",
    alignment: "horizontal",
  },
  {
    countryName: "Belgien",
    countryColors: ["2D2926", "FFCD00", "C8102E"],
    aspectRatio: "13:15",
    alignment: "vertical",
  },
  {
    countryName: "Frankreich",
    countryColors: ["000091", "FFFFFF", "E1000F"],
    aspectRatio: "2:3",
    alignment: "vertical",
  },
  {
    countryName: "Italien",
    countryColors: ["008C45", "F4F9FF", "CD212A"],
    aspectRatio: "2:3",
    alignment: "vertical",
  },
  {
    countryName: "Irland",
    countryColors: ["009A44", "FFFFFF", "FF8200"],
    aspectRatio: "1:2",
    alignment: "vertical",
  },
  {
    countryName: "Rumänien",
    countryColors: ["002B7F", "FCD116", "CE1126"],
    aspectRatio: "2:3",
    alignment: "vertical",
  },
  {
    countryName: "Polen",
    countryColors: ["FFFFFF", "DC143C"],
    aspectRatio: "5:8",
    alignment: "horizontal",
  },
  {
    countryName: "Mauritius",
    countryColors: ["EA2839", "1A206D", "FFD500", "00A551"],
    aspectRatio: "2:3",
    alignment: "horizontal",
  },
];

/* Sort the Flags with localeCompare */
flags.sort((a, b) => a.countryName.localeCompare(b.countryName));

/* Get references for select and canvas */
const flagSelect = document.querySelector("#flagSelect") as HTMLFormElement;
const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

/* Get the first Element tho show when loading the page */
if (flagSelect && flags.length > 0) {
  const selectedFlag = new Flag(
    flags[0].countryName,
    flags[0].countryColors,
    flags[0].aspectRatio,
    flags[0].alignment,
    canvas
  );

  selectedFlag.drawFlag();
}

/* loop through all items and add a option into select */
for (let flag of flags) {
  const option = document.createElement("option");

  if (flagSelect) {
    flagSelect.appendChild(option).innerHTML = flag.countryName;
  }
}

/* add eventlistener to select ; when changed set the selectedObject */
flagSelect.addEventListener("change", (e) => {
  const selected = (e.target as HTMLSelectElement)?.value;
  if (!selected) return;

  const country = flags.find((flag) => flag.countryName === selected);
  if (!country) return;

  const selectedFlag = new Flag(
    country.countryName,
    country.countryColors,
    country.aspectRatio,
    country.alignment,
    canvas
  );

  selectedFlag.drawFlag();
});
