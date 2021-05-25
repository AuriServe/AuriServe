
/**
 * Represents a HSVA Color.
 * All fields are contain numbers ranging from 0-1.
 */

export type HSVA = { h: number; s: number; v: number; a: number; }


/**
 * Represents a RGBA Color.
 * All fields are contain numbers ranging from 0-1.
 */

export type RGBA = { r: number; g: number; b: number; a: number; }


/**
 * Represents a Hexadecimal color string.
 * Though there is no way to validate this, it should be a 6 (or 8) digit hex string prefixed by a #.
 */

export type Hex = string;


/**
 * Represents any of the above color types.
 */

export type Color = HSVA | RGBA | Hex;


/**
 * Checks if the color provided is a Hexadecimal color.
 */

function isHex(color: Color): color is Hex {
	return typeof color === 'string';
}


/**
 * Checks if the color provided is a RGBA color.
 */

function isRGBA(color: Color): color is RGBA {
	return typeof color !== 'string' && 'r' in color;
}


// /**
//  * Checks if the color provided is a HSVA color.
//  */

// function isHSVA(color: Color): color is HSVA {
// 	return typeof color !== 'string' && 'h' in color;
// }


/**
 * Converts a color from any format to any other format.
 */

export function convert(color: Color) {
	const c: HSVA = (isHex(color) ? HexToHSVA(color) : isRGBA(color) ? RGBAtoHSVA(color) : color) as HSVA;
	
	return {
		toRGBA: () => HSVAtoRGBA(c),
		toHSVA: () => c,
		toHex:  () => HSVAtoHex(c)
	};
}

/**
 * Converts an HSVA Color to RGBA.
 * Source: https://stackoverflow.com/questions/17242144/#comment24984878_17242144
 *
 * @param {HSVA} hsva - The HSVA value to convert.
 * @returns {RGBA} the RGBA representation.
 */

function HSVAtoRGBA(hsva: HSVA = { h: 0, s: 0, v: 0, a: 1 }): RGBA {
	let r: number = 0, g: number = 0, b: number = 0;

	let i = Math.floor(hsva.h * 6);
	let f = hsva.h * 6 - i;
	let p = hsva.v * (1 - hsva.s);
	let q = hsva.v * (1 - f * hsva.s);
	let t = hsva.v * (1 - (1 - f) * hsva.s);

	switch(i % 6) {
	default: break;
	case 0: r = hsva.v; g = t; b = p; break;
	case 1: r = q; g = hsva.v; b = p; break;
	case 2: r = p; g = hsva.v; b = t; break;
	case 3: r = p; g = q; b = hsva.v; break;
	case 4: r = t; g = p; b = hsva.v; break;
	case 5: r = hsva.v; g = p; b = q; break;
	}

	return { r, g, b, a: hsva.a };
}


/**
 * Converts an RGBA Color to HSVA.
 * Source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
 *
 * @param {RGBA} rgba - The RGBA value to convert.
 * @returns {HSVA} the HSVA representation.
 */

function RGBAtoHSVA(rgba: RGBA = { r: 0, g: 0, b: 0, a: 1 }): HSVA {
	let rr, gg, bb, h = 0, s, v: any, diff: any, diffc;
	v = Math.max(rgba.r, rgba.g, rgba.b);
	diff = v - Math.min(rgba.r, rgba.g, rgba.b);
	diffc = (c: any) => (v - c) / 6 / diff + 1 / 2;
	
	if (diff === 0) h = s = 0;
	else {
		s = diff / v;
		rr = diffc(rgba.r);
		gg = diffc(rgba.g);
		bb = diffc(rgba.b);

		if (rgba.r === v) h = bb - gg;
		else if (rgba.g === v) h = (1 / 3) + rr - bb;
		else if (rgba.b === v) h = (2 / 3) + gg - rr;

		if (h < 0) h += 1;
		else if (h > 1) h -= 1;
	}
	
	return { h, s, v, a: rgba.a };
}


/**
 * Converts a numeric value from 0-255
 * to a hexadecimal string from 00-ff.
 */

function componentToHex(c: number) {
	let hex = Math.floor(c * 255).toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}


/**
 * Converts an RGBA Color to a Hex string.
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param {RGB} rgb - The RGBA value to convert.
 * @returns {string} the hexadecimal string representation.
 */

function RGBAtoHex(rgb: RGBA = { r: 0, g: 0, b: 0, a: 1 }): Hex {
	return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b) + componentToHex(rgb.a);
}


/**
 * Converts a Hex string to an RGBA Color.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {RGBA} the RGBA representation.
 */

function HexToRGBA(hex: string): RGBA {
	let r = parseInt('0x' + hex[1] + hex[2], 16);
	let g = parseInt('0x' + hex[3] + hex[4], 16);
	let b = parseInt('0x' + hex[5] + hex[6], 16);
	let a = parseInt('0x' + hex[7] + hex[8], 16);

	return { r, g, b, a };
}


/**
 * Converts an HSVA Color to a Hex string.
 *
 * @param {HSVA} hsv - The HSVA value to convert.
 * @returns {string} the hexadecimal string representation.
 */

function HSVAtoHex(hsv: HSVA = { h: 0, s: 0, v: 0, a: 1 }): Hex {
	return RGBAtoHex(HSVAtoRGBA(hsv));
}


/**
 * Converts a Hex string to an RGBA Color.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {RGBA} the RGBA representation.
 */

function HexToHSVA(hex: string): HSVA {
	return RGBAtoHSVA(HexToRGBA(hex));
}
