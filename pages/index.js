export default function Home() {
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    const onDrop = useCallback(async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
  
      setIsLoading(true);
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post('/api/getPngInfo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMetadata(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    const dropzoneProps = isClient ? Dropzone({
      onDrop,
      accept: {'image/png': ['.png']},
      multiple: false
    }) : {};
  
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
  
        {isClient && (
          <div 
            {...dropzoneProps.getRootProps()} 
            className={`dropzone mb-4 p-8 border-4 border-dashed rounded-lg cursor-pointer text-center transition-colors ${
              dropzoneProps.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100 hover:border-gray-400'
            }`}
            style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <input {...dropzoneProps.getInputProps()} />
            <p className={`text-xl ${dropzoneProps.isDragActive ? 'text-blue-500' : 'text-gray-700'}`}>
              {dropzoneProps.isDragActive ? 'Drop the PNG file here ...' : 'Drag \'n\' drop a PNG file here, or click to select a file'}
            </p>
          </div>
        )}
  
        {isLoading && <p className="text-center">Processing...</p>}
        
        {metadata && <MetadataDisplay metadata={metadata} />}
      </div>
    );
  }