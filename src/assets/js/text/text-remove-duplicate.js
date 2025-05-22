class TextRemoveDuplicate extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }

  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.removeDuplicateLines();
    this.textInput.addEventListener("input", this.inputHandler);
  }

  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }

  removeDuplicateLines() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }

    const lines = inputText.split(/\r?\n/).map(line => line.trim());
    const uniqueLines = Array.from(new Set(lines)).filter(line => line !== "");
    this.textResult.value = uniqueLines.join('\n');
  }
}

customElements.define('text-remove-duplicate', TextRemoveDuplicate);
