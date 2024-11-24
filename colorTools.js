const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(rgbColor) {
    const a = [rgbColor.r, rgbColor.g, rgbColor.b].map((v) => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function contrast(rgb1, rgb2) {
    const lum1 = luminance(rgb1);
    const lum2 = luminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function isDark(hexColor) {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    const rgbColor = hexToRgb(hexColor);
    const whiteTextHasMoreContrast = contrast(white, rgbColor) > contrast(black, rgbColor);
    return whiteTextHasMoreContrast;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
    let res = 0;
    res |= Math.round(255 * rgb.r) << 16;
    res |= Math.round(255 * rgb.g) << 8;
    res |= Math.round(255 * rgb.b);
    return '#' + (0x1000000 + res).toString(16).slice(1);
}

function convertColorsToHex(finalColors) {
    let hexColors = [];
    for (let i = 0; i < finalColors.length; i++) {
        const hex = rgbToHex(finalColors[i].rgb);
        hexColors.push(hex);
    }
    return hexColors;
}
