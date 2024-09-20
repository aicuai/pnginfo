import React from 'react';

export default function MetadataDisplay({ metadata }) {
  return (
    <div className="metadata">
      <h2>PNG Metadata</h2>
      
      <section>
        <h3>File Information</h3>
        <pre>{JSON.stringify(metadata.fileinfo, null, 2)}</pre>
      </section>

      {metadata.prompt && (
        <section>
          <h3>Prompt</h3>
          <pre>{JSON.stringify(metadata.prompt, null, 2)}</pre>
        </section>
      )}

      {metadata.workflow && (
        <section>
          <h3>Workflow</h3>
          <pre>{JSON.stringify(metadata.workflow, null, 2)}</pre>
        </section>
      )}

      <section>
        <h3>Other Metadata</h3>
        <pre>{JSON.stringify(metadata.otherMetadata, null, 2)}</pre>
      </section>

      {metadata.fileinfo.slackUrl && (
        <section>
          <h3>Uploaded Image (Slack)</h3>
          <a href={metadata.fileinfo.slackUrl} target="_blank" rel="noopener noreferrer">View on Slack</a>
        </section>
      )}

      <style jsx>{`
        .metadata {
          margin-top: 20px;
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
        section {
          margin-bottom: 20px;
        }
        h3 {
          margin-bottom: 10px;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 300px;
          overflow-y: auto;
          background-color: #fff;
          padding: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}