
// /components/MetadataForm.js
import { useState } from 'react';

export default function MetadataForm({ onSubmit }) {
  const [operation, setOperation] = useState('addMetadata');
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [metadata, setMetadata] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(operation, { inputPath, outputPath, metadata: JSON.parse(metadata) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={operation} onChange={(e) => setOperation(e.target.value)}>
        <option value="addMetadata">Add Metadata</option>
        <option value="initMetadata">Init Metadata</option>
        <option value="getMetadata">Get Metadata</option>
      </select>
      <input
        type="text"
        value={inputPath}
        onChange={(e) => setInputPath(e.target.value)}
        placeholder="Input Path"
        required
      />
      {operation !== 'getMetadata' && (
        <input
          type="text"
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="Output Path"
          required
        />
      )}
      <textarea
        value={metadata}
        onChange={(e) => setMetadata(e.target.value)}
        placeholder="Metadata (JSON format)"
        required={operation !== 'getMetadata'}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
