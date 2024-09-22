# PNG Metadata Extractor

This project is a web application that allows users to upload PNG images and extract metadata, including ComfyUI workflow data.

## Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pnginfo.git
   cd pnginfo
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the application

To run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `pages/index.js`: The main page of the application
- `pages/api/getPngInfo.js`: API route for processing uploaded PNG files
- `components/MetadataDisplay.js`: Component for displaying extracted metadata

## Dependencies

This project uses the following main dependencies:

- Next.js
- React
- axios
- sharp
- pngjs
- formidable

For a full list of dependencies, see `package.json`.

## Usage

1. Open the application in your web browser.
2. Click the "Choose File" button to select a PNG image.
3. The application will automatically upload and process the image.
4. The extracted metadata, including any ComfyUI workflow data, will be displayed on the page.

## Note

This is an experimental service. The extracted metadata may vary depending on the input PNG file and its embedded information.

## License

[MIT License](https://opensource.org/licenses/MIT)