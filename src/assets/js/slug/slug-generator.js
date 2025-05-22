class SlugGenerator extends HTMLElement {
  constructor() {
    super();
    this.textInput = null;
    this.slugOutput = null;
  }

  connectedCallback() {
    this.textInput = this.querySelector('#textInput');
    this.slugOutput = this.querySelector('#textResult');

    this.updateSlug = this.generateSlug.bind(this);
    this.textInput.addEventListener('input', this.updateSlug);
  }

  disconnectedCallback() {
    this.textInput?.removeEventListener('input', this.updateSlug);
  }

  generateSlug() {
    const text = this.textInput?.value || '';
    const slug = text
      .toLowerCase()
      .replaceAll('\u00A0', ' ')          // Replace non-breaking space
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')    // Remove accents
      .replace(/[^a-z0-9 -]/g, '')        // Remove invalid chars
      .trim()
      .replace(/\s+/g, '-')               // Replace all whitespace (incl. \n, \t, etc.)
      .replace(/-+/g, '-');               // Collapse multiple hyphens


    this.slugOutput.textContent = slug || '...';
  }
}

customElements.define('slug-generator', SlugGenerator);
