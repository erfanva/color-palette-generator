const MOODS = ["COLORFUL", "BRIGHT", "MUTED", "DEEP", "DARK"];
const SWATCH_COUNT = 5;
const MAX_WIDTH = 1920; // Maximum width for resized images
const MAX_HEIGHT = 1080; // Maximum height for resized images
const TOO_BIG_MSG = 'Your file is too big and it will be resized. Please wait...';
const RENDERING_MSG = 'Rendering...';

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

    elemets.loading = document.querySelector('#loading');
    elemets.loadingText = document.querySelector('#loading span');
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
    showLoading(RENDERING_MSG);
    try {
        await loadImageAsCanvas();
    } catch (e) {
        alert(e);
        hideLoading();
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
    hideLoading();
}

async function loadImageAsCanvas() {
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
        return readFileAndDrawToCanvas(convertedFile);
    } else if (!validImageTypes.includes(file.type)) {
        throw 'The selected file is not a valid image!';
    }

    // Handle other valid image types
    return readFileAndDrawToCanvas(file);
}

function readFileAndDrawToCanvas(file) {
    return new Promise((resolve, reject) => {
        let img = new Image();

        // Handle load errors
        img.onerror = function () {
            reject('Image file is corrupted or cannot be loaded!');
        };

        img.onload = function () {
            try {
                drawLoadedImageToCanvas(img);
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        img.src = URL.createObjectURL(file);
    });
}

function drawLoadedImageToCanvas(img) {
    let width = img.width;
    let height = img.height;

    // Resize logic
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        alert(TOO_BIG_MSG);
        const aspectRatio = width / height;
        if (width > height) {
            width = MAX_WIDTH;
            height = Math.round(MAX_WIDTH / aspectRatio);
        } else {
            height = MAX_HEIGHT;
            width = Math.round(MAX_HEIGHT * aspectRatio);
        }
    }

    // Update canvas dimensions
    elemets.imageCanvas.width = width;
    elemets.imageCanvas.height = height;
    const ctx = elemets.imageCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);
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

function showLoading(text) {
    elemets.loading.classList.remove('hidden');
    elemets.loadingText.innerHTML = text || '';
}

function hideLoading() {
    elemets.loading.classList.add('hidden');
    elemets.loadingText.innerHTML = '';
}

documentOnLoad()