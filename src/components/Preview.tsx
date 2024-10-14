import React from 'react';

interface PreviewProps {
  url: string;
}

const Preview: React.FC<PreviewProps> = ({ url }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Preview</h2>
      <iframe
        src={url}
        title="Project Preview"
        className="w-full h-64 border rounded"
      />
    </div>
  );
};

export default Preview;