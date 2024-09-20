// /pages/index.js
import { useState } from 'react';
import Layout from '../components/Layout';
import DropZone from '../components/DropZone';
import MetadataDisplay from '../components/MetadataDisplay';

export default function Home() {
  const [metadata, setMetadata] = useState(null);

  const handleFileDrop = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/getPngInfo', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setMetadata(data);
    } else {
      console.error('Error fetching metadata');
      setMetadata(null);
    }
  };

  return (
    <Layout>
      <h1>PNG Metadata Viewer</h1>
      <DropZone onFileDrop={handleFileDrop} />
      {metadata && <MetadataDisplay metadata={metadata} />}
    </Layout>
  );
}