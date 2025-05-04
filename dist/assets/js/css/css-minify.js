class CSSMinify extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }
  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.minifyCSS();
    this.textInput.addEventListener("input", this.inputHandler);
  }
  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }
  minifyCSS() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }
    if (typeof inputText !== 'string') return '';
    this.textResult.value = inputText
      .replace(/\/\*[\s\S]*?\*\//g, '')        // Remove CSS comments
      .replace(/\s*{\s*/g, '{')                // Remove space around {
      .replace(/\s*}\s*/g, '}')                // Remove space around }
      .replace(/\s*:\s*/g, ':')                // Remove space around :
      .replace(/\s*;\s*/g, ';')                // Remove space around ;
      .replace(/\s*,\s*/g, ',')                // Remove space around ,
      .replace(/\s+/g, ' ')                    // Collapse multiple spaces
      .replace(/;\}/g, '}')                    // Remove ; before }
      .trim();
  }
}
customElements.define('css-minify', CSSMinify);
