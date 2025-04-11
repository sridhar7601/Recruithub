import React, { useState, useRef } from 'react';
import { importStudents } from '../../services/studentService';
import { ImportResult } from '../../types/student';

interface StudentImportModalProps {
  driveId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const StudentImportModal: React.FC<StudentImportModalProps> = ({ driveId, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError(`Invalid file type. Please upload a file with one of these extensions: ${validExtensions.join(', ')}`);
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is 5MB.`);
      return;
    }
    
    setFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
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
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error importing students:', err);
      setError(err.response?.data?.message || 'Failed to import student data');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Import student data</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {!loading && !importResult && (
            <>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center ${
                  dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${error ? 'border-red-300' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center py-4">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  
                  {file ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <button 
                        onClick={triggerFileInput}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">XLSX, XLS or CSV (MAX. 5MB)</p>
                      <button 
                        onClick={triggerFileInput}
                        className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Select file
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    !file ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Upload
                </button>
              </div>
            </>
          )}

          {loading && (
            <div className="py-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">Importing student data...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          )}

          {importResult && (
            <div className="py-4">
              <div className="mb-6 flex items-center justify-center">
                {importResult.skippedEntries.duplicates.count === 0 && 
                 importResult.skippedEntries.invalidData.count === 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Import successful</h4>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mb-4">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Import completed with warnings</h4>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">{importResult.totalInserted}</span> students successfully imported
                </p>
                
                {(importResult.skippedEntries.duplicates.count > 0 || importResult.skippedEntries.invalidData.count > 0) && (
                  <div className="mt-3">
                    <p className="text-gray-700">Skipped entries:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {importResult.skippedEntries.duplicates.count > 0 && (
                        <li>
                          {importResult.skippedEntries.duplicates.count} duplicates found
                        </li>
                      )}
                      {importResult.skippedEntries.invalidData.count > 0 && (
                        <li>
                          {importResult.skippedEntries.invalidData.count} entries with invalid data
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentImportModal;