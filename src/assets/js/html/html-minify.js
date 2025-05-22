class HTMLMinify extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }
  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.minifyHTML();
    this.textInput.addEventListener("input", this.inputHandler);
  }
  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }
  minifyHTML() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }
    if (typeof inputText !== 'string') return '';
    this.textResult.value = inputText
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\n+/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }
}
customElements.define('html-minify', HTMLMinify);