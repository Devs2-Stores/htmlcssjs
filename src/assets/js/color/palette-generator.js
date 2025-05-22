class ColorPaletteGenerator extends HTMLElement {
  constructor() {
    super();
    this.input = null;
    this.output = null;
    this.randomButton = null;
    this.exportButton = null;
    this.inputHandler = this.generatePalette.bind(this);
    this.randomHandler = this.generateRandom.bind(this);
    this.exportHandler = this.exportPalette.bind(this);
  }

  connectedCallback() {
    this.input = this.querySelector('#textInput');
    this.output = this.querySelector('#paletteResult');
    this.randomButton = this.querySelector('#buttonRandom');
    this.exportButton = this.querySelector('#buttonExport');

    if (this.input) this.input.addEventListener('input', this.inputHandler);
    if (this.randomButton) this.randomButton.addEventListener('click', this.randomHandler);
    if (this.exportButton) this.exportButton.addEventListener('click', this.exportHandler);

    this.generatePalette(); // initial if value exists
  }

  disconnectedCallback() {
    if (this.input) this.input.removeEventListener('input', this.inputHandler);
    if (this.randomButton) this.randomButton.removeEventListener('click', this.randomHandler);
    if (this.exportButton) this.exportButton.removeEventListener('click', this.exportHandler);
  }

  generateRandomHex() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  }

  hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  rgbToHex({ r, g, b }) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  generateTintsAndShades(baseColor) {
    const { r, g, b } = this.hexToRgb(baseColor);
    const palette = [];

    // Shades (darker)
    for (let i = 0.9; i >= 0.1; i -= 0.2) {
      palette.push(
        this.rgbToHex({
          r: Math.floor(r * i),
          g: Math.floor(g * i),
          b: Math.floor(b * i),
        })
      );
    }

    // Base color
    palette.push(baseColor.toLowerCase());

    // Tints (lighter)
    for (let i = 0.2; i <= 0.8; i += 0.2) {
      palette.push(
        this.rgbToHex({
          r: Math.floor(r + (255 - r) * i),
          g: Math.floor(g + (255 - g) * i),
          b: Math.floor(b + (255 - b) * i),
        })
      );
    }

    return palette;
  }

  generatePalette() {
    const hex = (this.input?.value || '').trim();
    if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) return;

    const colors = this.generateTintsAndShades(hex);
    this.output.innerHTML = colors
      .map(
        (c) =>
          `<div class="color-swatch" style="background:${c}" title="${c}" data-color="${c}">${c}</div>`
      )
      .join('');

    // Copy on click
    this.output.querySelectorAll('.color-swatch').forEach((el) => {
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.color);
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 800);
      });
    });
  }

  generateRandom() {
    const hex = this.generateRandomHex();
    if (this.input) this.input.value = hex;
    this.generatePalette();
  }

  exportPalette() {
    const swatches = this.output.querySelectorAll('.color-swatch');
    const colors = Array.from(swatches).map((el, i) => `--color-${i + 1}: ${el.dataset.color};`);
    const blob = new Blob(
      [`:root {\n${colors.map((line) => '  ' + line).join('\n')}\n}`],
      { type: 'text/css' }
    );

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'palette.css';
    a.click();
  }
}

customElements.define('color-palette-generator', ColorPaletteGenerator);
