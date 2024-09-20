// /components/DropZone.js
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropZone({ onFileDrop }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles[0]);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false,
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PNG file here ...</p>
      ) : (
        <p>Drag 'n' drop a PNG file here, or click to select a file</p>
      )}
      <style jsx>{`
        .dropzone {
          border: 2px dashed #cccccc;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
        .dropzone.active {
          border-color: #2196f3;
        }
      `}</style>
    </div>
  );
}