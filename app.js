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
    const storyCanvas = document.querySelector('#storyCanvas');
    elemets.storyCanvas = storyCanvas;
    const downloadSection = document.querySelector('.download-section');
    elemets.downloadSection = downloadSection;
    const downloadBtn = document.querySelector('#downloadBtn');
    elemets.downloadBtn = downloadBtn;
    const saveStoryBtn = document.querySelector('#saveStoryBtn');
    elemets.saveStoryBtn = saveStoryBtn;
}

function fillMoodSelector() {
    MOODS.forEach(mood => {
        const moodOpt = document.createElement('option');
        moodOpt.value = mood;
        moodOpt.innerText = mood[0] + mood.slice(1).toLowerCase();
        elemets.moodSelector.appendChild(moodOpt);
    })
}

function setOnChangeListeners() {
    elemets.moodSelector.addEventListener('change', imageOrMoodOnChange);
    elemets.imageUpload.addEventListener('change', imageOrMoodOnChange);
}

async function imageOrMoodOnChange() {
    elemets.downloadSection.classList.remove('hidden');
    elemets.imageCanvas.parentElement.classList.remove('hidden');
    try {
        await loadImageAsimageCanvas();
    } catch (e) {
        console.log(e);
        return;
    }
    const hexColors = getColors();
    console.log(hexColors)
    drawPaletteOnCanvas(elemets.imageCanvas, hexColors);
    drawStory(elemets.storyCanvas, hexColors);
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
    console.log(result.finalColor)
    return convertColorsToHex(result.finalColor);
}

function getMood() {
    return elemets.moodSelector.value;
}

function setDownloadBtnOnClick() {
    elemets.downloadBtn.addEventListener('click', downloadWhatIsInCanvas(elemets.imageCanvas));
    elemets.saveStoryBtn.addEventListener('click', downloadWhatIsInCanvas(elemets.storyCanvas));
}

function downloadWhatIsInCanvas(canvasElement) {
    return function () {
        const jpegQuality = 1.0; // max
        const mainFileName = getFileNameWithoutPrefix();
        const fileName = `palette_${mainFileName}.jpg`;
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvasElement.toDataURL("image/jpeg", jpegQuality);
        link.click();
    }
}

function getFileNameWithoutPrefix() {
    let fileName = elemets.imageUpload?.files[0]?.name || '';
    fileName = fileName.split('.');
    fileName.splice(fileName.length - 1, 1);
    fileName = fileName.join('');
    return fileName;
}

documentOnLoad()