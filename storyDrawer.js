const width = 900;
const height = 1600;
const text_left_margin = 60;
const text_font_size = 32;

function drawStory(canvasElement, hexColors) {
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = width;
    canvasElement.height = height;

    ctx.textBaseline = "middle";

    const step = height / hexColors.length;
    for (let i = 0; i < hexColors.length; i++) {
        ctx.fillStyle = hexColors[i];
        ctx.fillRect(0, step * i, width, step * (i + 1));

        ctx.fillStyle = isDark(hexColors[i]) ? "white" : "black";

        ctx.font = `bold ${text_font_size}px AdobeClean`;
        ctx.fillText(hexColors[i].toUpperCase(), text_left_margin, step * i + step / 2);
    }
}
