const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let uploadedImage = null;
let watermarkImage = new Image();

let watermarkWidth, watermarkHeight, xPosition, yPosition;
let isDragging = false;
let isResizing = false;
let offsetX, offsetY;

const defaultWatermarkSizeRatio = 0.4;
const resizeHandleSize = 10
watermarkImage.src = watermarkBase64;

watermarkImage.onload = () => {
  console.log("Watermark loaded successfully");
};
function isInResizeHandle(x, y) {
  return (
    x >= xPosition + watermarkWidth - resizeHandleSize &&
    x <= xPosition + watermarkWidth &&
    y >= yPosition + watermarkHeight - resizeHandleSize &&
    y <= yPosition + watermarkHeight
  );
}
function isInWatermark(x, y) {
  return x >= xPosition && x <= xPosition + watermarkWidth && y >= yPosition && y <= yPosition + watermarkHeight;
}

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        initializeCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});
function initializeCanvas() {
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;
  canvas.style.display = 'block';

  watermarkWidth = canvas.width * defaultWatermarkSizeRatio;
  watermarkHeight = watermarkImage.height * (watermarkWidth / watermarkImage.width);
  xPosition = (canvas.width - watermarkWidth) / 2;
  yPosition = canvas.height - watermarkHeight - 10;

  drawCanvas();
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(watermarkImage, xPosition, yPosition, watermarkWidth, watermarkHeight);

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    xPosition + watermarkWidth - resizeHandleSize,
    yPosition + watermarkHeight - resizeHandleSize,
    resizeHandleSize,
    resizeHandleSize
  );

  downloadBtn.style.display = 'block';
}
function drawWatermarkedImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(watermarkImage, xPosition, yPosition, watermarkWidth, watermarkHeight);
}
function getPointerPosition(e) {
  let x, y;
  if (e.touches) {
    const touch = e.touches[0];
    x = touch.clientX - canvas.getBoundingClientRect().left;
    y = touch.clientY - canvas.getBoundingClientRect().top;
  } else {
    x = e.offsetX;
    y = e.offsetY;
  }
  return { x, y };
}

canvas.addEventListener('mousedown', (e) => {
  handlePointerDown(e);
});
canvas.addEventListener('touchstart', (e) => {
  handlePointerDown(e);
});

canvas.addEventListener('mousemove', (e) => {
  handlePointerMove(e);
});
canvas.addEventListener('touchmove', (e) => {
  handlePointerMove(e);
});

canvas.addEventListener('mouseup', () => {
  handlePointerUp();
});
canvas.addEventListener('touchend', () => {
  handlePointerUp();
});

function handlePointerDown(e) {
  e.preventDefault()
  const { x, y } = getPointerPosition(e);

  if (isInResizeHandle(x, y)) {
    isResizing = true;
  } else if (isInWatermark(x, y)) {
    isDragging = true;
    offsetX = x - xPosition;
    offsetY = y - yPosition;
  }
}

function handlePointerMove(e) {
  if (!isDragging && !isResizing) return;
  e.preventDefault();
  const { x, y } = getPointerPosition(e);

  if (isDragging) {

    xPosition = x - offsetX;
    yPosition = y - offsetY;
    drawCanvas();
  }

  if (isResizing) {

    watermarkWidth = x - xPosition;
    watermarkHeight = watermarkImage.height * (watermarkWidth / watermarkImage.width);
    drawCanvas();
  }
}

function handlePointerUp() {
  isDragging = false;
  isResizing = false;
}
downloadBtn.addEventListener('click', () => {
  drawWatermarkedImage();

  const link = document.createElement('a');
  link.download = 'watermarked-image.png';
  link.href = canvas.toDataURL();
  link.click();

  drawCanvas();
});
