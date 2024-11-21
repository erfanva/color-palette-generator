const width = 900;
const height = 1600;

function drawStory(canvasElement, hexColors) {
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    const step = height / hexColors.length;
    for (let i = 0; i < hexColors.length; i++) {
        ctx.fillStyle = hexColors[i];
        ctx.fillRect(0, step * i, width, step * (i + 1));
    }
}