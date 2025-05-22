class TextTitleCase extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
  }

  connectedCallback() {
    this.textInput = document.getElementById("textInput");
    this.textResult = document.getElementById("textResult");

    this.inputHandler = () => this.convertToTitleCase();
    this.textInput.addEventListener("input", this.inputHandler);
  }

  disconnectedCallback() {
    this.textInput.removeEventListener("input", this.inputHandler);
  }

  convertToTitleCase() {
    const inputText = this.textInput.value;
    if (!inputText.trim()) {
      this.textResult.value = "";
      return;
    }
    const words = inputText.toLowerCase().split(' ');
    const titleCaseWords = words.map(word => {
      if (word.length === 0) return '';
      return word[0].toUpperCase() + word.slice(1);
    });

    this.textResult.value = titleCaseWords.join(' ');
  }
}

customElements.define('text-titlecase', TextTitleCase);