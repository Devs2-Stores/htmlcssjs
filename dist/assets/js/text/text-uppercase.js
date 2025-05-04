class TextUppercase extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }
  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.convertToUppercase();
    this.textInput.addEventListener("input", this.inputHandler);
  }
  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }
  convertToUppercase() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }
    this.textResult.value = inputText.toUpperCase();
  }
}
customElements.define('text-uppercase', TextUppercase);