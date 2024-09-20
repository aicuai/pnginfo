export default function MetadataDisplay({ metadata }) {
    return (
      <div className="metadata">
        <h2>PNG Metadata</h2>
        <h3>Basic Information</h3>
        <pre>{JSON.stringify({
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          isProgressive: metadata.isProgressive,
          hasProfile: metadata.hasProfile,
          hasAlpha: metadata.hasAlpha
        }, null, 2)}</pre>
  
        <h3>Prompt</h3>
        <pre>{JSON.stringify(metadata.prompt, null, 2)}</pre>
  
        <h3>Workflow</h3>
        <pre>{JSON.stringify(metadata.workflow, null, 2)}</pre>
  
        <h3>File Info</h3>
        <pre>{JSON.stringify(metadata.fileinfo, null, 2)}</pre>
  
        <h3>Other Metadata</h3>
        <pre>{JSON.stringify(metadata.otherMetadata, null, 2)}</pre>
  
        <style jsx>{`
          .metadata {
            margin-top: 20px;
            padding: 20px;
            background-color: #f0f0f f0;
            border-radius: 4px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 300px;
            overflow-y: auto;
          }
        `}</style>
      </div>
    );
  }