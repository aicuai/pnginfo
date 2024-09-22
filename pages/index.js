import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/getPngInfo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMetadata(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.error || 'An error occurred while processing the file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PNG Metadata Extractor</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <input
          type="file"
          accept="image/png"
          onChange={handleFileUpload}
          className="mb-2"
        />
      </div>

      {isLoading && <p>Processing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {metadata && (
        <div className="metadata">
          <h2 className="text-xl font-bold mb-2">Extracted Metadata</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}