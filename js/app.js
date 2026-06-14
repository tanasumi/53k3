let captureTime = null;
let timeOffset = null;
let stream = null;

// カメラ起動
document.getElementById('start-camera-btn').addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } });
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;

    document.getElementById('take-photo-btn').disabled = false;
  } catch (err) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;

    document.getElementById('take-photo-btn').disabled = false;
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
  const deviceDate = document.getElementById('device-date').value;
  const deviceTime = document.getElementById('device-time').value;
  const cameraInput = deviceDate + 'T' + deviceTime;
  if (!captureTime || !cameraInput) {
    alert('撮影日時と対象機器表示時刻を入力してください。');
    return;
  }

  const cameraTime = new Date(cameraInput);
  timeOffset = captureTime - cameraTime; // ミリ秒差
  const seconds = Math.round(timeOffset / 1000);

  document.getElementById('error-result').textContent =
    `誤差: ${seconds} 秒 (${seconds > 0 ? '対象機器の時刻が遅れている' : '対象機器の時刻が進んでいる'})`;
});

// 日時変換
document.getElementById('convert-btn').addEventListener('click', () => {
  const targetDate = document.getElementById('target-date').value;
  const targetTime = document.getElementById('target-time').value;
  const targetInput = targetDate + 'T' + targetTime;
  if (!timeOffset || !targetInput) {
    alert('誤差を計算してから日時を入力してください。');
    return;
  }

  const targetDeviceTime = new Date(targetInput);
  const cameraEquivalent = new Date(targetDeviceTime - timeOffset);

  document.getElementById('converted-time').textContent =
    `対象機器上の時刻: ${cameraEquivalent.toLocaleString()}`;
});
