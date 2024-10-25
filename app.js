const MOODS = ["COLORFUL", "BRIGHT", "MUTED", "DEEP", "DARK", "CUSTOM"];
const SWATCH_COUNT = 5;

let elemets = {};

function documentOnLoad() {
    setElements();
    fillMoodSelector();
    setOnChangeListeners();
    setDownloadBtnOnClick();
}

function setElements() {
    const moodSelector = document.querySelector('#moodSelector');
    elemets.moodSelector = moodSelector;
    const imageUpload = document.querySelector('#imageUpload');
    elemets.imageUpload = imageUpload;
    const imageCanvas = document.querySelector('#imageCanvas');
    elemets.imageCanvas = imageCanvas;
    const downloadBtn = document.querySelector('#downloadBtn');
    elemets.downloadBtn = downloadBtn;
}

function fillMoodSelector() {
    MOODS.forEach(mood => {
        const moodOpt = document.createElement('option');
        moodOpt.value = mood;
        moodOpt.innerText = mood.toLowerCase();
        elemets.moodSelector.appendChild(moodOpt);
    })
}

function setOnChangeListeners() {
    elemets.moodSelector.addEventListener('change', imageOrMoodOnChange);
    elemets.imageUpload.addEventListener('change', imageOrMoodOnChange);
}

async function imageOrMoodOnChange() {
    try {
        await loadImageAsimageCanvas();
    } catch (e) {
        console.log(e);
        return;
    }
    const hexColors = getColors();

    let ctx = elemets.imageCanvas.getContext('2d');
    ctx.width = elemets.imageCanvas.width;
    ctx.height = elemets.imageCanvas.height;
    drawPaletteOnCanvas(ctx, hexColors);
}

function loadImageAsimageCanvas() {
    const file = elemets.imageUpload.files[0];
    if (!file) throw 'No file selected!';
    return new Promise((resolve) => {
        let ctx = elemets.imageCanvas.getContext('2d');
        let img = new Image;
        img.onload = function () {
            elemets.imageCanvas.width = img.width;
            elemets.imageCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(img.src);
            resolve();
        }
        img.src = URL.createObjectURL(file);
    });
}

function getColors() {
    const width = elemets.imageCanvas.width;
    const height = elemets.imageCanvas.height;
    const imageData = elemets.imageCanvas.getContext("2d").getImageData(0, 0, width, height);
    const colorMood = getMood();

    const result = extractColorFromImage(imageData, width, height, SWATCH_COUNT, colorMood);
    return convertColorsToHex(result.finalColor);
}

function getMood() {
    return elemets.moodSelector.value;
}

function convertColorsToHex(finalColors) {
    let hexColors = [];
    for (let i = 0; i < finalColors.length; i++) {
        const hex = rgbToHex(finalColors[i].rgb);
        hexColors.push(hex);
    }
    return hexColors;
}

function rgbToHex(rgb) {
    let res = 0;
    res |= Math.round(255 * rgb.r) << 16;
    res |= Math.round(255 * rgb.g) << 8;
    res |= Math.round(255 * rgb.b);
    return '#' + res.toString(16);
}

function setDownloadBtnOnClick() {
    const jpegQuality = 1.0; // max
    const mainFileName = elemets.imageUpload.files[0].name;
    const fileName = `palette_${mainFileName}.jpg`;

    elemets.downloadBtn.addEventListener('click', () => {
        const canvas = elemets.imageCanvas;
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL("image/jpeg", jpegQuality);
        link.click();
    });
}

documentOnLoad()