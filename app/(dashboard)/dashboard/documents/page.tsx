'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Table from '@/components/shared/Table';
import { documents } from '@/lib/data';
import Card from '@/components/shared/Card';
import SearchBar from '@/components/shared/SearchBar';
import { ArrowUpTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

function DocumentUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-500">
        <ArrowUpTrayIcon className="w-12 h-12 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-semibold text-blue-600">Drop the files here ...</p>
        ) : (
          <>
            <p className="text-lg font-semibold">Drag & drop files here, or click to select</p>
            <p className="text-sm">PDF, DOCX, PNG, JPG up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      cell: ({ value }: { value: string }) => (
        <div className="flex items-center">
          <DocumentIcon className="h-6 w-6 text-gray-400 mr-3" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { header: 'Client', accessor: 'clientName' },
    { header: 'Uploaded', accessor: 'uploadedAt' },
    {
      header: '',
      accessor: 'id',
      cell: () => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
          <button className="text-red-600 hover:underline text-sm font-medium">Delete</button>
        </div>
      ),
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">Securely manage and share case documents.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <SearchBar
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-8">
        <DocumentUpload />
      </div>
      <Card className="!p-0">
        <Table columns={columns} data={filteredDocuments} />
      </Card>
    </div>
  );
}
