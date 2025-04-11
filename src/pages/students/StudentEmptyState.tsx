import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriveById } from '../../services/driveService';
import { DriveDocument } from '../../types';
import Header from '../../components/layout/Header';
import StudentImportModal from '../../components/students/StudentImportModal';
import AddStudentModal from '../../components/students/AddStudentModal';

const StudentEmptyState: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  const [drive, setDrive] = useState<DriveDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!driveId) return;
    
    const fetchDrive = async () => {
      try {
        const driveData = await getDriveById(driveId);
        setDrive(driveData);
      } catch (err) {
        setError('Failed to load drive information');
        console.error('Error fetching drive:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrive();
  }, [driveId]);

  const handleBackClick = () => {
    navigate('/drives');
  };

  const handleAddManually = () => {
    setShowAddModal(true);
  };

  const handleImportData = () => {
    setShowImportModal(true);
  };

  const handleImportSuccess = () => {
    // Refresh the page to show the student data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={handleBackClick}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{drive?.name || 'Drive'}</h1>
              <p className="text-gray-600">{drive?.collegeName || 'College'}</p>
            </div>
          </div>
          <button
            disabled={true}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Export
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-md bg-blue-100 text-blue-700 font-medium`}
            >
              Student data
            </button>
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Settings
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-semibold mb-2">No student data yet</h2>
            <p className="text-gray-500 mb-8">Load student data in XLSX format to get started.</p>
            <div className="flex gap-4">
              <button
                onClick={handleAddManually}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Add manually
              </button>
              <button
                onClick={handleImportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Import data
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <div className="flex">
              <div className="py-1">
                <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && driveId && (
        <StudentImportModal
          driveId={driveId}
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* Add Student Modal */}
      {showAddModal && drive && driveId && (
        <AddStudentModal
          driveId={driveId}
          driveName={drive.name}
          collegeId={drive.collegeId}
          collegeName={drive.collegeName}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};

export default StudentEmptyState;