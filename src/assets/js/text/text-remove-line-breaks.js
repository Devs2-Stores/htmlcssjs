class TextRemoveLineBreaks extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }
  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.removeLineBreaks();
    this.textInput.addEventListener("input", this.inputHandler);
  }
  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }
  removeLineBreaks() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }
    this.textResult.value = inputText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
customElements.define('text-remove-line-breaks', TextRemoveLineBreaks);
