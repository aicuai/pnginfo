# PNG Metadata Extractor

This web application allows users to upload PNG images and extract metadata, including ComfyUI workflow data. It's designed to work with AI-generated images, providing insights into the generation process.

## Features

- Extract metadata from PNG images, including:
  - Basic image information (dimensions, format, etc.)
  - Generation parameters
  - Prompts used for generation
  - Workflow data
  - Other embedded metadata
- Support for JPEG images converted from PNG (with potentially less information)
- User-friendly interface with clear instructions

## Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/aicuai/pnginfo
   cd pnginfo
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Project Structure

- `pages/index.js`: Main page of the application
- `pages/api/getPngInfo.js`: API route for processing uploaded PNG files

## Key Dependencies

- Next.js: React framework for production
- React: UI library
- axios: HTTP client for API requests
- sharp: Image processing
- pngjs: PNG file parsing
- formidable: Form data parsing

For a full list of dependencies, see `package.json`.

## Usage

1. Open the application in your web browser.
2. Upload a PNG or JPEG image using the file selector.
3. The application will process the image and display the extracted metadata.

## Limitations and Known Issues

- Primarily designed for PNG images from AI generation tools (ComfyUI, Stable Diffusion, etc.)
- Large or complex metadata might not display completely
- Not all images will contain all types of metadata
- Results may vary depending on the image source and format

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.