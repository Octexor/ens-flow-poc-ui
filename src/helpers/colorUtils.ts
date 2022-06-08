function relativeLuminanceW3C(R8bit: number, G8bit: number, B8bit: number) {

    var RsRGB = R8bit/255;
    var GsRGB = G8bit/255;
    var BsRGB = B8bit/255;

    var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as: 
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}

const hexToRgb = (hex: string) =>{
    let components = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    ,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g);
    return (components || []).map(x => parseInt(x, 16));
}
function limit(v: number, max: number) {
    return Math.min(Math.max(v, 0), max);
}
function toHex(v: number[]) {
    return "#" + v.map(function (c) {
        c = limit(Math.round(c), 255);
        return (c < 16 ? '0' : '') + c.toString(16);
    }).join('');
}
  
function getContrastColor(c: string) {
    let cComponents = hexToRgb(c);
    const l = luminance(cComponents[0], cComponents[1], cComponents[2]);
    return l > 0.17912879 ? '#000000' : '#ffffff';
}

function pickColor(color1: string, color2: string, weight: number) {
    const [c1r, c1g, c1b] = hexToRgb(color1);
    const [c2r, c2g, c2b] = hexToRgb(color1);
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(c1r * w1 + c2r * w2),
        Math.round(c1g * w1 + c2g * w2),
        Math.round(c1b * w1 + c2b * w2)];
    return toHex(rgb);
}

const luminance = relativeLuminanceW3C;
export {
    luminance,
    getContrastColor,
    hexToRgb,
    pickColor
};