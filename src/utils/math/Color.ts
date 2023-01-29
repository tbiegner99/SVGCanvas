export interface HSLValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

export interface HSBValue {
  hue: number;
  saturation: number;
  brightness: number;
  alpha: number;
}
export interface RGBValue {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
export default class Color {
  private constructor(
    private _hue: number,
    private _saturation: number,
    private _lightness: number,
    private _brightness: number,
    private _red: number,
    private _green: number,
    private _blue: number,
    private _hex: string
  ) {}

  get hex(): string {
    return this._hex;
  }

  get rgb(): RGBValue {
    return {
      red: this._red,
      green: this._green,
      blue: this._blue,
      alpha: 1,
    };
  }

  get hsb(): HSBValue {
    return {
      hue: this._hue,
      saturation: this._saturation,
      brightness: this._brightness,
      alpha: 1,
    };
  }

  get hsl(): HSLValue {
    return {
      hue: this._hue,
      saturation: this._saturation,
      lightness: this._lightness,
      alpha: 1,
    };
  }
  private static create(hsl: HSLValue, hsb: HSBValue, rgb: RGBValue): Color {
    return new Color(
      hsl.hue,
      hsl.saturation,
      hsl.lightness,
      hsb.brightness,
      rgb.red,
      rgb.green,
      rgb.blue,
      Color.rgbToHexString(rgb)
    );
  }
  static createFromHSL(hsl: HSLValue): Color {
    const hsb = Color.hslToHsb(hsl);
    const rgb = Color.hslToRgb(hsl);
    return Color.create(hsl, hsb, rgb);
  }

  static createFromHSB(hsb: HSBValue): Color {
    const hsl = Color.hsbToHsl(hsb);
    const rgb = Color.hslToRgb(hsl);
    return Color.create(hsl, hsb, rgb);
  }

  static createFromRGB(rgb: RGBValue): Color {
    const hsl = Color.rgbToHsl(rgb);
    const hsb = Color.hslToHsb(hsl);

    return Color.create(hsl, hsb, rgb);
  }

  static createFromHex(hex: string): Color {
    return Color.parseColor(hex);
  }
  // COLOR CONVERSIONS
  // http://codeitdown.com/hsl-hsb-hsv-color/
  static hslToHsb(hsl: HSLValue): HSBValue {
    const brightness =
      (2 * hsl.lightness + hsl.saturation * (1 - Math.abs(2 * hsl.lightness - 1))) / 2;
    return {
      hue: hsl.hue,
      saturation: brightness === 0 ? 0 : (2 * (brightness - hsl.lightness)) / brightness,
      brightness,
      alpha: typeof hsl.alpha === 'number' ? hsl.alpha : 1,
    };
  }

  // http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
  static hslToRgb(hsl: HSLValue): RGBValue {
    let { hue: h, saturation: s, lightness: l, alpha } = hsl;
    h %= 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r;
    if (h >= 0 && h < 60) {
      r = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      r = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      r = [0, c, x];
    } else if (h >= 180 && h < 240) {
      r = [0, c, x];
    } else if (h >= 240 && h < 300) {
      r = [x, 0, c];
    } else {
      //if (h >= 300 && h < 360) {
      r = [c, 0, x];
    }
    return {
      red: (r[0] + m) * 255,
      green: (r[1] + m) * 255,
      blue: (r[2] + m) * 255,
      alpha,
    };
  }

  static hsbToRgb(hsb: HSBValue): RGBValue {
    return Color.hslToRgb(Color.hsbToHsl(hsb));
  }

  static hsbToHsl(hsb: HSBValue): HSLValue {
    const lightness = 0.5 * hsb.brightness * (2 - hsb.saturation);
    const denom = 1 - Math.abs(2 * lightness - 1);
    return {
      hue: hsb.hue,
      lightness,
      saturation: denom === 0 ? 0 : (hsb.brightness * hsb.saturation) / denom,
      alpha: typeof hsb.alpha === 'number' ? hsb.alpha : 1,
    };
  }

  static rgbToHsl(rgb: RGBValue): HSLValue {
    return Color.hsbToHsl(Color.rgbToHsb(rgb));
  }

  static rgbToHsb(rgb: RGBValue): HSBValue {
    let { red, green, blue } = rgb;
    red /= 255;
    green /= 255;
    blue /= 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const diff = max - min;
    let hue, saturation, brightness;
    if (diff == 0) {
      hue = 0;
    } else if (max == red) {
      hue = (60 * (((green - blue) / diff) % 6) + 360) % 360;
    } else if (max == blue) {
      hue = (60 * ((blue - red) / diff + 2) + 360) % 360;
    } else {
      //if (max == green) {
      hue = (60 * ((red - green) / diff + 4) + 360) % 360;
    }
    brightness = max;
    saturation = max === 0 ? 0 : diff / max;
    return { hue, saturation, brightness, alpha: typeof rgb.alpha === 'number' ? rgb.alpha : 1 };
  }

  private static normalizeHexString(color: string): string {
    if (color.startsWith('#')) {
      color = color.substring(1);
    }
    color = color.toUpperCase();
    if (color.length == 3 || color.length == 4) {
      let newColor = '';
      for (let i = 0; i < color.length; i++) {
        newColor += color.charAt(i) + color.charAt(i);
      }
      color = newColor;
    } else if (color.length !== 6 && color.length !== 8) {
      throw new Error();
    }
    if (color.length === 6) {
      color += 'FF';
    }

    return color;
  }

  static rgbToHexString(color: RGBValue) {
    const normalize = (str: string) => (str.length === 1 ? `0${str}` : str);
    const red = normalize(Math.floor(color.red).toString(16));
    const green = normalize(Math.floor(color.green).toString(16));
    const blue = normalize(Math.floor(color.blue).toString(16));

    return `#${red}${green}${blue}`;
  }

  static parseHexString(color: string): RGBValue {
    color = Color.normalizeHexString(color);
    const ret = {
      red: parseInt(color.substr(0, 2), 16),
      green: parseInt(color.substr(2, 2), 16),
      blue: parseInt(color.substr(4, 2), 16),
      alpha: 1,
    };
    if (isNaN(ret.red) || isNaN(ret.green) || isNaN(ret.blue)) {
      throw new Error(`Invalid Hex String: ${color}`);
    }
    return ret;
  }

  static parseColor(color: string): Color {
    if (/#?[0-9a-fA-F]{6}/.test(color)) {
      const result = Color.parseHexString(color);
      return Color.createFromRGB(result);
    }
    if (color.startsWith('rgb') || color.startsWith('hsl')) {
      const startParen = color.indexOf('(') + 1;
      const endParen = color.indexOf(')');
      const colors = color.substring(startParen, endParen);
      if (color.startsWith('rgb')) {
        const components = colors.split(',').map((component) => parseFloat(component.trim()));
        const [red, green, blue, alpha = 1] = components;
        const result = { red, green, blue, alpha };
        return Color.createFromRGB(result);
      } else {
        const components = colors
          .split(',')
          .map((str) => {
            str = str.trim();
            const lastChar = str.indexOf('%');
            if (lastChar >= 0) {
              return str.substring(0, lastChar);
            }
            return str;
          })
          .map((str) => parseFloat(str));
        let [hue, saturation, lightness, alpha = 1] = components;
        saturation /= 100;
        lightness /= 100;
        const result = { hue, saturation, lightness, alpha };
        return Color.createFromHSL(result);
      }
    }
    throw new Error('Only rgb or hsl values supported');
  }
}
