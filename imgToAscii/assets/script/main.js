"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const dropzone = document.getElementById("dropzone");
dropzone.addEventListener("dragover", (e) => e.preventDefault());
dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFile(e);
});
document.querySelector("input[type=file]").addEventListener("change", (e) => {
    handleFile(e);
});
function handleFile(e) {
    let file = null;
    if (e.type === "drop") {
        const dt = e.dataTransfer;
        if (dt && dt.files.length > 0) {
            file = dt.files[0];
        }
    }
    else if (e.type === "change") {
        const input = e.target;
        if (input.files && input.files.length > 0) {
            file = input.files[0];
        }
    }
    if (file) {
        addFileToList(file);
    }
    return file;
}
function addFileToList(file) {
    const fileStatus = document.querySelector("#fileStatus");
    fileStatus.classList.remove("hidden");
    fileStatus.querySelector("h3").innerHTML = file.name;
    receiveFileContents(file);
}
function receiveFileContents(file) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const fileStatus = document.querySelector("#fileStatus");
        const progressBar = fileStatus.querySelector("div#progress");
        const output = document.querySelector("#output");
        const reader = file.stream().getReader();
        const total = file.size;
        let loaded = 0;
        const chunks = [];
        while (true) {
            const { done, value } = yield reader.read();
            if (done)
                break;
            if (value) {
                chunks.push(value);
                loaded += value.length;
                const percent = (loaded / total) * 100;
                progressBar.style.width = `${percent.toFixed(2)}%`;
            }
        }
        console.log("File fully read.");
        const blob = new Blob(chunks, { type: file.type });
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.src = imageUrl;
        img.alt = file.name;
        output === null || output === void 0 ? void 0 : output.appendChild(img);
        (_a = document
            .getElementById("AsciiOutput")) === null || _a === void 0 ? void 0 : _a.appendChild(yield convImgToAscii(blob));
    });
}
function convImgToAscii(img) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const pre = document.createElement("pre");
        pre.classList.add("overflow-x-auto", "text-sm", "max-h-64", "p-2", "bg-gray-800", "text-white", "rounded", "shadow");
        if (!ctx) {
            throw new Error("Canvas context could not be created.");
        }
        const image = new Image();
        const imageUrl = URL.createObjectURL(img);
        return new Promise((resolve, reject) => {
            image.onload = () => {
                URL.revokeObjectURL(imageUrl);
                const width = 100;
                const aspectRatio = image.height / image.width;
                const height = Math.round(width * aspectRatio);
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                const asciiArt = convertToAscii(imageData);
                pre.textContent = asciiArt;
                resolve(pre);
            };
            image.onerror = (err) => {
                URL.revokeObjectURL(imageUrl);
                reject(err);
            };
            image.src = imageUrl;
        });
    });
}
function convertToAscii(imageData) {
    const grayScaleChars = "@%#*+=-:. ";
    const { data, width, height } = imageData;
    let asciiArt = "";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const gray = Math.round((r + g + b) / 3);
            const charIndex = Math.floor((gray / 255) * (grayScaleChars.length - 1));
            asciiArt += grayScaleChars[charIndex];
        }
        asciiArt += "\n";
    }
    return asciiArt;
}
