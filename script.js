const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let uploadedImage = null;
let watermarkImage = new Image();

watermarkImage.src = watermarkBase64;

watermarkImage.onload = () => {
  console.log("Watermark loaded successfully");
};

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        drawCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function drawCanvas() {
  if (uploadedImage && watermarkImage.complete) {
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    canvas.style.display = 'block';

    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);


    const watermarkWidth = canvas.width * 0.4;
    const watermarkHeight = watermarkImage.height * (watermarkWidth / watermarkImage.width);

    const xPosition = (canvas.width - watermarkWidth) / 2;
    const yPosition = canvas.height - watermarkHeight - 10;

    ctx.drawImage(watermarkImage, xPosition, yPosition, watermarkWidth, watermarkHeight);

    downloadBtn.style.display = 'block';
  }
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'watermarked-image.png';
  link.href = canvas.toDataURL();
  link.click();
});
