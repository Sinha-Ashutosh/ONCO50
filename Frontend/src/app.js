const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const submitBtn = document.getElementById('submit-btn');
const message = document.getElementById('message');
const downloadSampleBtn = document.getElementById('download-sample');
const dropzone = document.getElementById('dropzone');
const chooseFileBtn = document.getElementById('choose-file');
const uploadBtn = document.getElementById('upload-btn');

function setMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'error' : '';
}

downloadSampleBtn.addEventListener('click', () => {
  const sample = `feature_a,feature_b,categorical_x\n1.2,3.4,A\n5.6,7.8,B`;
  const blob = new Blob([sample], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_input.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Open file dialog from buttons
chooseFileBtn?.addEventListener('click', () => fileInput?.click());
uploadBtn?.addEventListener('click', () => fileInput?.click());

// Drag & drop behavior
if (dropzone) {
  ;['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('dragover');
  }));
  ;['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('dragover');
  }));
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (!dt) return;
    const files = dt.files;
    if (files && files.length) {
      // Only first file
      fileInput.files = files;
      setMessage(`${files[0].name} selected.`);
    }
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!fileInput.files || fileInput.files.length === 0) {
    setMessage('Please select a CSV file first.', true);
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  submitBtn.disabled = true;
  setMessage('Running prediction...');

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
    });

    const disposition = response.headers.get('Content-Disposition') || '';
    const isCSV = response.headers.get('Content-Type')?.includes('text/csv');

    if (!response.ok) {
      const errText = await response.text();
      try {
        const errJson = JSON.parse(errText);
        setMessage(errJson.error || 'Request failed.', true);
      } catch (_) {
        setMessage(errText || 'Request failed.', true);
      }
      return;
    }

    if (isCSV) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fname = /filename="?([^";]+)"?/i.exec(disposition)?.[1] || 'predictions.csv';
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Downloaded predictions.');
    } else {
      const text = await response.text();
      setMessage(text);
    }
  } catch (err) {
    setMessage(`Network error: ${err}`, true);
  } finally {
    submitBtn.disabled = false;
  }
});
