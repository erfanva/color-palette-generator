const padding = 13;
const box_height = 160;
const square_size = 160 - padding * 2;
const box_top_margin = 407;
const box_bg_color = "#fff";

async function drawPaletteOnCanvas(ctx, colors) {
    drawPaletteBox(ctx, colors.length);
    drawColors(ctx, colors);
}

function drawPaletteBox(ctx, colors_count) {
    ctx.fillStyle = box_bg_color;
    const box_width = colors_count * square_size + 2 * padding;
    const image_width = ctx.width;
    const box_left_margin = (image_width - box_width) / 2;

    console.log(box_width, image_width, box_left_margin)

    ctx.fillRect(box_left_margin, box_top_margin, box_width, box_height);
}

function drawColors(ctx, colors) {
    const y = box_top_margin + padding;
    const image_width = ctx.width;
    const box_width = colors.length * square_size + 2 * padding;
    const box_left_margin = (image_width - box_width) / 2;
    const initial_x = box_left_margin + padding;

    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        let x = initial_x + i * square_size;
        ctx.fillRect(x, y, square_size, square_size);
    }
}
