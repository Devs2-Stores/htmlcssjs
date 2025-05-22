class QRCodeGenerator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.qrInput = this.querySelector('#qrInput');
    this.generateBtn = this.querySelector('#generateBtn');
    this.qrResult = this.querySelector('#qrResult');
    this.downloadBtn = this.querySelector('#downloadBtn');

    this.generateBtn.addEventListener('click', () => {
      const text = this.qrInput.value.trim();
      this.qrResult.innerHTML = "";
      if (text.length === 0) {
        this.qrResult.innerHTML = "<p>Please enter text or a URL.</p>";
        return;
      }else{
        const canvas = document.createElement('canvas');
        this.qrResult.appendChild(canvas);
        QRCode.toCanvas(canvas, text, { width: 200 }, (error) => {
          if (error) {
            console.error(error);
            this.qrResult.innerHTML = "<p>Failed to generate QR code.</p>";
            this.downloadBtn.setAttribute('hidden', true);
          } else {
            this.downloadBtn.removeAttribute('hidden');
          }
        });
      }
    });

    this.downloadBtn.addEventListener('click', () => {
      const canvas = this.qrResult.querySelector('canvas');
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'qrcode.png';
      link.click();
    });
  }
}
customElements.define('qr-code-generator', QRCodeGenerator);