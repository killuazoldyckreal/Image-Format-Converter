# Media Editor Chrome Extension

## Overview

The Media Editor Chrome Extension allows users to save and convert photo files in custom formats directly from their browser. With an easy-to-use interface, you can choose media files, preview them, and save them either in their original format or convert them to a variety of image formats.

## Features

- **Save Original Media**: Save selected media files in their original format.
- **Convert Media**: Convert media files to various formats, including JPEG, PNG, GIF, BMP, WebP, and APNG.
- **Preview Media**: View a preview of the selected media file before saving or converting.

## Installation

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click the "Load unpacked" button and select the directory where the extension files are located.

## Usage

1. **Choose Media**:
   - Use the dropdown menu to select the media file you want to work with.

2. **Save Original**:
   - Click the "Save as Original" button to save the selected media in its original format.

3. **Convert Media**:
   - Select the desired format from the "Convert to" dropdown menu.
   - Click the "Save Converted" button to convert and save the media in the chosen format.

4. **Preview**:
   - The selected media file will be displayed in the preview section.

## Files

- `popup.html`: The main HTML file for the extension's popup interface.
- `popup.css`: The CSS file for styling the popup interface.
- `popup.js`: The JavaScript file that handles the extension's functionality.

## Known Issues

- The extension does not support the following formats for conversion: `svg`, `avif`, `ico`, and `tiff`.
- If a user tries to convert a file to the same format, it will be downloaded directly instead of being converted.

## Future Enhancements

- **Additional Formats**: Support for more media formats can be added based on user feedback.
- **Improved UI/UX**: Enhancements to the user interface and user experience are planned for future updates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
