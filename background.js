chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { image, format } = message;

  if (format === null || format === image.split('.').pop().toLowerCase()) {
    downloadImage(image);
    sendResponse({ success: true });
  } else if (['jpeg', 'png', 'webp', 'gif', 'apng', 'bmp'].includes(format)) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId },
            function: convertImageInPage,
            args: [image, format],
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error('Script execution failed:', chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ success: true });
            }
          }
        );
      } else {
        sendResponse({ success: false, error: 'No active tab found.' });
      }
    });
  }

  return true;
});

function convertImageInPage(imageUrl, format) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(`image/${format}`);

      const originalFilename = new URL(imageUrl).pathname.split('/').pop();
      const fileExtension = format;
      const filename = originalFilename.replace(/\.[^/.]+$/, "") + `.${fileExtension}`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.click();

      resolve();
    };

    img.onerror = (error) => {
      reject(new Error('Image failed to load: ' + error.message));
    };
  });
}

function downloadImage(imageUrl) {
  const originalFilename = new URL(imageUrl).pathname.split('/').pop();
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = originalFilename;
  link.click();
}
