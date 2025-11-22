'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Table from '@/components/shared/Table';
import { documents } from '@/lib/data';

function DocumentUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Uploaded', accessor: 'uploadedAt' },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
      </div>
      <div className="mb-6">
        <DocumentUpload />
      </div>
      <Table columns={columns} data={documents} />
    </div>
  );
}
