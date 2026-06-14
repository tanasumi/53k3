let captureTime = null;
let timeOffset = null;
let stream = null;

// カメラ起動
document.getElementById('start-camera-btn').addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;

    document.getElementById('take-photo-btn').disabled = false;
  } catch (err) {
    alert('カメラにアクセスできません: ' + err);
  }
});

// 撮影
document.getElementById('take-photo-btn').addEventListener('click', () => {
  const video = document.getElementById('camera-preview');
  const canvas = document.getElementById('photo-canvas');
  const img = document.getElementById('captured-image');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // 撮影画像を表示
  img.src = canvas.toDataURL('image/png');
  img.style.display = 'block';

  // 撮影時刻を記録
  captureTime = new Date();
  captureTime.setMilliseconds(0)
  document.getElementById('capture-time').textContent =
    `撮影日時: ${captureTime.toLocaleString()}`;
});

// 誤差計算
document.getElementById('calc-error-btn').addEventListener('click', () => {
  const cameraInput = document.getElementById('camera-time').value;
  if (!captureTime || !cameraInput) {
    alert('撮影日時とカメラ時刻を入力してください。');
    return;
  }

  const cameraTime = new Date(cameraInput);
  timeOffset = captureTime - cameraTime; // ミリ秒差
  const seconds = Math.round(timeOffset / 1000);

  document.getElementById('error-result').textContent =
    `誤差: ${seconds} 秒 (${seconds > 0 ? 'カメラが遅れている' : 'カメラが進んでいる'})`;
});

// 日時変換
document.getElementById('convert-btn').addEventListener('click', () => {
  const targetInput = document.getElementById('target-time').value;
  if (!timeOffset || !targetInput) {
    alert('誤差を計算してから日時を入力してください。');
    return;
  }

  const targetTime = new Date(targetInput);
  const cameraEquivalent = new Date(targetTime - timeOffset);

  document.getElementById('converted-time').textContent =
    `防犯カメラ上の時刻: ${cameraEquivalent.toLocaleString()}`;
});
