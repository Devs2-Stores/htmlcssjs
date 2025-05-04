class TextCounter extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.wordCount = null;
    this.charCount = null;
  }
  connectedCallback() {
    this.textInput = this.querySelector('#textInput');
    this.wordCount = this.querySelector('#wordCount');
    this.charCount = this.querySelector('#charCount');

    this.updateHandler = this.updateCounts.bind(this);
    this.textInput.addEventListener('input', this.updateHandler);
  }
  disconnectedCallback() {
    if (this.textInput && this.updateHandler) {
      this.textInput.removeEventListener('input', this.updateHandler);
    }
  }
  updateCounts() {
    const text = this.textInput.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    this.wordCount.textContent = words.length;
    this.charCount.textContent = text.length;
  }
}
customElements.define('text-counter', TextCounter); 