const refrence_width = 1440;
const refrence_height = 1795;
const config = {
    padding: 13,
    box_height: 160,
    square_size: 160 - 13 * 2,
    box_top_margin: 407,
    box_bg_color: "#fff",
}
let padding, box_height, square_size, box_top_margin;

function updateParams(ctx) {
    let ratioToRefrence = ctx.width / refrence_width;
    if (ctx.width > ctx.height) {
        ratioToRefrence = ratioToRefrence / 2.4;
    }
    padding = Math.floor(config.padding * ratioToRefrence);
    box_height = Math.floor(config.box_height * ratioToRefrence);
    square_size = Math.floor(config.square_size * ratioToRefrence);
    box_top_margin = Math.floor(config.box_top_margin * ctx.height / refrence_height);
}

async function drawPaletteOnCanvas(ctx, colors) {
    updateParams(ctx);
    drawPaletteBox(ctx, colors.length);
    drawColors(ctx, colors);
}

function drawPaletteBox(ctx, colors_count) {
    ctx.fillStyle = config.box_bg_color;
    const box_width = colors_count * square_size + 2 * padding;
    const image_width = ctx.width;
    const box_left_margin = (image_width - box_width) / 2;

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
