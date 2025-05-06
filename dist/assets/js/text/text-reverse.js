class TextReverse extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }

  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.reverseText();
    this.textInput.addEventListener("input", this.inputHandler);
  }

  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }

  reverseText() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }

    // Đảo ngược toàn bộ chuỗi
    const reversedText = inputText.split('').reverse().join('');
    this.textResult.value = reversedText;
  }
}

customElements.define('text-reverse', TextReverse);
