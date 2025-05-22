class TextRemoveDiacritics extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.textResult = null;
    this.inputHandler = this.removeDiacritics.bind(this);
  }

  connectedCallback() {
    this.textInput = this.querySelector("#textInput");
    this.textResult = this.querySelector("#textResult");

    if (!this.textInput || !this.textResult) {
      console.warn("RemoveDiacritics: Missing input or output element.");
      return;
    }

    this.textInput.addEventListener("input", this.inputHandler);
    this.removeDiacritics(); // chạy ngay nếu đã có sẵn nội dung
  }

  disconnectedCallback() {
    if (this.textInput) {
      this.textInput.removeEventListener("input", this.inputHandler);
    }
  }

  normalizeText(text) {
    if (!text || typeof text !== "string") return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // accents
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, " ") // chuẩn hóa khoảng trắng
      .trim();
  }

  removeDiacritics() {
    const inputText = this.textInput?.value || "";
    const output = this.normalizeText(inputText);
    if (this.textResult) this.textResult.value = output;
  }
}

customElements.define("text-remove-diacritics", TextRemoveDiacritics);
