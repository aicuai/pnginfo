// /pages/index.js
import { useState } from 'react';
import MetadataForm from '../components/MetadataForm';

export default function Home() {
  const [result, setResult] = useState('');

  const handleSubmit = async (operation, data) => {
    const response = await fetch(`/api/${operation}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.text();
    setResult(result);
  };

  return (
    <div>
      <h1>PNG Metadata Manager</h1>
      <MetadataForm onSubmit={handleSubmit} />
      <div>
        <h2>Result:</h2>
        <pre>{result}</pre>
      </div>
    </div>
  );
}
