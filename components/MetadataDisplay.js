// /components/MetadataDisplay.js
export default function MetadataDisplay({ metadata }) {
    return (
      <div className="metadata">
        <h2>PNG Metadata</h2>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
        <style jsx>{`
          .metadata {
            margin-top: 20px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 4px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        `}</style>
      </div>
    );
  }