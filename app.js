const MOODS = ["COLORFUL", "BRIGHT", "MUTED", "DEEP", "DARK"];
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

    elemets.colorsContainer = document.querySelector('.colors-container');
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
    try {
        await loadImageAsImageCanvas();
    } catch (e) {
        alert(e);
        console.log(e);
        return;
    }
    const hexColors = getColors();
    console.log(hexColors)

    drawPaletteOnCanvas(elemets.imageCanvas, hexColors);
    drawStory(elemets.storyCanvas, hexColors);
    fillColorsContainer(hexColors);

    elemets.downloadSection.classList.remove('hidden');
    elemets.imageCanvas.parentElement.classList.remove('hidden');
    elemets.colorsContainer.classList.remove('hidden');
}

async function loadImageAsImageCanvas() {
    const file = elemets.imageUpload.files[0];
    if (!file) {
        throw 'No file selected!';
    }

    // Check if the file is a supported image type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    const heicType = 'image/heic';

    // Handle HEIC files
    if (file.type === heicType || file.type === '') {
        const convertedFile = await convertHEICtoImage(file);
        return drawImageToCanvas(convertedFile);
    } else if (!validImageTypes.includes(file.type)) {
        throw 'The selected file is not a valid image!';
    }

    // Handle other valid image types
    return drawImageToCanvas(file);
}

function drawImageToCanvas(file) {
    return new Promise((resolve, reject) => {
        let ctx = elemets.imageCanvas.getContext('2d');
        let img = new Image();

        // Handle load errors
        img.onerror = function () {
            reject('Image file is corrupted or cannot be loaded!');
        };

        img.onload = function () {
            try {
                elemets.imageCanvas.width = img.width;
                elemets.imageCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(img.src);
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        img.src = URL.createObjectURL(file);
    });
}

// HEIC to image conversion
async function convertHEICtoImage(file) {
    // Use the globally available heic2any library
    const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
    return new File([blob], file.name.replace(/\.heic$/, '.jpg'), { type: 'image/jpeg' });
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
    elemets.downloadBtn.addEventListener('click', downloadWhatIsInCanvas(elemets.imageCanvas, "image"));
    elemets.saveStoryBtn.addEventListener('click', downloadWhatIsInCanvas(elemets.storyCanvas, "story"));
}

function downloadWhatIsInCanvas(canvasElement, suffix) {
    return function () {
        const jpegQuality = 1.0; // max
        const mainFileName = getFileNameWithoutPrefix();
        const fileName = `palette_${mainFileName}_${suffix}.jpg`;
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

function fillColorsContainer(hexColors) {
    elemets.colorsContainer.innerHTML = "";
    hexColors.forEach(color => {
        const section = document.createElement("div");
        section.classList.add("color-box");
        if (isDark(color))
            section.classList.add("dark");
        section.style.backgroundColor = color;

        section.addEventListener('click', () => navigator.clipboard.writeText(color));

        const textElem = document.createElement("span");
        textElem.textContent = color.toUpperCase();
        section.appendChild(textElem);

        elemets.colorsContainer.appendChild(section);
    });
}

documentOnLoad()