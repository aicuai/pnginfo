import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import MetadataDisplay from '../components/MetadataDisplay';

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsLoading(true);
    setError(null);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/getPngInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMetadata(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/png': ['.png']},
    multiple: false
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PNG Metadata Extractor</h1>
      
      <div className="terms-of-service mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Terms of Service</h2>
        <ul className="list-disc pl-5">
          <li>This is an experimental service.</li>
          <li>Results are not guaranteed.</li>
          <li>Uploaded files will be processed on the server side.</li>
          <li>Processing details will be logged and analyzed for a certain period. No personal information is collected.</li>
        </ul>
      </div>

      <div {...getRootProps()} className="dropzone mb-4 p-4 border-2 border-dashed rounded cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PNG file here ...</p>
        ) : (
          <p>Drag 'n' drop a PNG file here, or click to select a file</p>
        )}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {metadata && <MetadataDisplay metadata={metadata} />}
    </div>
  );
}