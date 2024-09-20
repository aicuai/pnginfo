import React from 'react';

export default function MetadataDisplay({ metadata }) {
  return (
    <div className="metadata">
      <h2 className="text-xl font-bold mb-4">PNG Metadata</h2>
      
      <section className="mb-4">
        <h3 className="font-bold">File Information</h3>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(metadata.fileinfo, null, 2)}</pre>
      </section>

      {metadata.exif && (
        <section className="mb-4">
          <h3 className="font-bold">EXIF Data</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{JSON.stringify(metadata.exif, null, 2)}</pre>
        </section>
      )}

      {metadata.parameters && (
        <section className="mb-4">
          <h3 className="font-bold">Parameters</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{metadata.parameters}</pre>
        </section>
      )}

      {metadata.prompt && (
        <section className="mb-4">
          <h3 className="font-bold">Prompt</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{JSON.stringify(metadata.prompt, null, 2)}</pre>
        </section>
      )}

      {metadata.workflow && (
        <section className="mb-4">
          <h3 className="font-bold">ComfyUI Workflow</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{JSON.stringify(metadata.workflow, null, 2)}</pre>
        </section>
      )}

      {Object.keys(metadata.otherMetadata || {}).length > 0 && (
        <section className="mb-4">
          <h3 className="font-bold">Other Metadata</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96">{JSON.stringify(metadata.otherMetadata, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}