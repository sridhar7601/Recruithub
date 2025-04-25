import React, { useState } from 'react';
import { importStudents } from '../../services/studentService';
import { ImportResult } from '../../types';
import { XMarkIcon, DocumentArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driveId: string;
}

const StudentImportModal: React.FC<StudentImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  driveId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an Excel file
      if (!selectedFile.name.endsWith('.xlsx')) {
        setError('Please select an Excel (.xlsx) file');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if file is an Excel file
      if (!droppedFile.name.endsWith('.xlsx')) {
        setError('Please select an Excel (.xlsx) file');
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const result = await importStudents(driveId, file);
      setImportResult(result);
      
      // If successful with no errors
      if (result.totalInserted > 0 && 
          result.skippedEntries.duplicates.count === 0 && 
          result.skippedEntries.invalidData.count === 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error importing students:', err);
      setError(err.response?.data?.message || 'Failed to import students');
    } finally {
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setImportResult(null);
    setError(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Import Students</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4">
              {!importResult ? (
                <>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop your Excel file here, or click to select
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Only .xlsx files are supported
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {file && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Successfully imported {importResult.totalInserted} students
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {importResult.skippedEntries.duplicates.count > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-800">
                            Skipped {importResult.skippedEntries.duplicates.count} duplicate entries
                          </p>
                          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                            {importResult.skippedEntries.duplicates.details.slice(0, 3).map((detail, index) => (
                              <li key={index}>
                                {detail.registrationNumber}: {detail.reason}
                              </li>
                            ))}
                            {importResult.skippedEntries.duplicates.details.length > 3 && (
                              <li>...and {importResult.skippedEntries.duplicates.details.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {importResult.skippedEntries.invalidData.count > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            Skipped {importResult.skippedEntries.invalidData.count} invalid entries
                          </p>
                          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                            {importResult.skippedEntries.invalidData.details.slice(0, 3).map((detail, index) => (
                              <li key={index}>
                                Row {detail.row}: {detail.errors.join(', ')}
                              </li>
                            ))}
                            {importResult.skippedEntries.invalidData.details.length > 3 && (
                              <li>...and {importResult.skippedEntries.invalidData.details.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!importResult ? (
              <>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSuccess}
                  className=" w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  View Students
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Upload Another File
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentImportModal;
