const refrance_width = 1080;
const refrance_height = 1346;
const hex_text_font_size = 41;
const hex_text_left_margin = 115;
const hex_text_top_margin = 341;
const color_text_font_size = 87;
const color_text_left_margin = 115;
const color_text_top_margin = 377;

function drawColorPage(ctx, hexColor) {
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    ctx.textBaseline = "hanging";
    ctx.fillStyle = "white";

    ctx.font = `bold ${hex_text_font_size}px AdobeClean`;
    ctx.fillText("HEX", hex_text_left_margin, hex_text_top_margin);

    hexColor = hexColor.replace('#', '')
    ctx.font = `bold ${color_text_font_size}px AdobeClean`;
    ctx.fillText(hexColor, color_text_left_margin, color_text_top_margin);
}