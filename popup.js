document.addEventListener('DOMContentLoaded', () => {
  const mediaSelect = document.getElementById('media');
  const previewImage = document.getElementById('media-preview');
  const convertToSelect = document.getElementById('convert-to');
  const saveOriginalButton = document.getElementById('save-original');
  const saveConvertedButton = document.getElementById('save-converted');

  const MAX_FILENAME_LENGTH = 19;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getImages,
      },
      (results) => {
        const images = results[0].result;
        images.forEach((image) => {
          const fileName = getFileName(image);
          if (fileName) {
            const option = document.createElement('option');
            option.value = image;
            option.text = trimFileName(fileName, MAX_FILENAME_LENGTH);
            mediaSelect.appendChild(option);
          }
        });
      }
    );
  });

  mediaSelect.addEventListener('change', () => {
    previewImage.src = mediaSelect.value;
  });

  saveOriginalButton.addEventListener('click', () => {
    const selectedImage = mediaSelect.value;
    if (selectedImage) {
      chrome.runtime.sendMessage({ image: selectedImage, format: null }, (response) => {
        if (response) {
          if (response.success) {
            console.log('Image saved successfully.');
          } else {
            console.error('Error saving file:', response.error);
          }
        } else {
          console.error('No response received.');
        }
      });
    } else {
      console.error('Please select an image first.');
    }
  });

  saveConvertedButton.addEventListener('click', () => {
    const selectedImage = mediaSelect.value;
    const convertTo = convertToSelect.value;

    if (selectedImage) {
      const currentFormat = selectedImage.split('.').pop().toLowerCase();
      if (currentFormat === convertTo) {
        chrome.runtime.sendMessage({ image: selectedImage, format: null }, (response) => {
          if (response) {
            if (response.success) {
              console.log('Image saved successfully.');
            } else {
              console.error('Error saving file:', response.error);
            }
          } else {
            console.error('No response received.');
          }
        });
      } else {
        chrome.runtime.sendMessage({ image: selectedImage, format: convertTo }, (response) => {
          if (response) {
            if (response.success) {
              console.log('Image converted and saved successfully.');
            } else {
              console.error('Error saving file:', response.error);
            }
          } else {
            console.error('No response received.');
          }
        });
      }
    } else {
      console.error('Please select an image first.');
    }
  });
});

function getImages() {
  return Array.from(document.images).map((img) => img.src);
}

function getFileName(url) {
  if (url.startsWith('data:image/')) {
    const mimeType = url.split(';')[0].split('/')[1];
    return `base64_image.${mimeType}`;
  } else {
    return url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  }
}

function trimFileName(fileName, maxLength) {
  if (fileName.length > maxLength) {
    const extIndex = fileName.lastIndexOf('.');
    const extension = fileName.substring(extIndex);
    const baseName = fileName.substring(0, extIndex);

    const keepStart = 10;
    const keepEnd = 2;

    const actualKeepStart = Math.min(keepStart, baseName.length - keepEnd);
    const actualKeepEnd = Math.min(keepEnd, baseName.length - actualKeepStart);

    const trimmedName = baseName.substring(0, actualKeepStart) + '...' + baseName.substring(baseName.length - actualKeepEnd);
    return trimmedName + extension;
  }
  return fileName;
}
