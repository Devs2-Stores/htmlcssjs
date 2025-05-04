const imageInput = document.getElementById('imageInput');
const compressBtn = document.getElementById('compressBtn');
const output = document.getElementById('output');
const info = document.getElementById('info');
const downloadLink = document.getElementById('downloadLink');

compressBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxWidth = 2048;
      const scaleSize = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function (blob) {
        const compressedUrl = URL.createObjectURL(blob);
        downloadLink.href = compressedUrl;
        downloadLink.download = "compressed-image.jpg";
        downloadLink.style.display = "inline-block";
        downloadLink.textContent = "Download Compressed Image";

        const originalSize = (file.size / 1024).toFixed(2);
        const compressedSize = (blob.size / 1024).toFixed(2);

        info.textContent = `Original Size: ${originalSize} KB | Compressed Size: ${compressedSize} KB`;
      }, "image/jpeg", 0.9); // 0.7 = compression quality (70%)
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});