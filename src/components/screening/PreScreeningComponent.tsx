import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Header from '../../components/layout/Header';

// Component states
const PRE_SCREENING_STATES = {
  SELECT_TESTS: 'SELECT_TESTS',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

const PreScreeningPage = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  const [screeningState, setScreeningState] = useState(PRE_SCREENING_STATES.SELECT_TESTS);
  const [wecpTests, setWecpTests] = useState<{id: string, name: string}[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [drive, setDrive] = useState<any>(null);

  // Fetch drive data
  useEffect(() => {
    const fetchDrive = async () => {
      if (!driveId) return;
      
      try {
        const response = await api.get(`/drives/${driveId}`);
        setDrive(response.data);
      } catch (error) {
        console.error('Error fetching drive:', error);
      }
    };
    
    fetchDrive();
  }, [driveId]);

  // Fetch available WeCP tests - in a real implementation, this would come from the API
  useEffect(() => {
    // Mock data for tests - in production this would be fetched from your backend
    const mockTests = [
      { id: '1', name: 'Maple Valley University 2025 Campus Drive | Batch 3' },
      { id: '2', name: 'Riverbend College 2025 Campus Drive | Batch 1' },
      { id: '3', name: 'Greenfield Polytechnic 2025 Campus Drive | Batch 3' },
      { id: '4', name: 'Harborview College 2025 Campus Drive | Batch 4' },
      { id: '5', name: 'Summit Hill Institute 2025 Campus Drive | Batch 2' },
      { id: '6', name: 'Brighton Arts College 2025 Campus Drive | Batch 1' }
    ];
    setWecpTests(mockTests);
  }, []);

  // Check if pre-screening has already been done for this drive
  useEffect(() => {
    console.log('Checking pre-screening status...',screeningState);

    const checkPreScreeningStatus = async () => {
      if (!driveId) return;
      
      try {
        // First check if there's an existing job for this drive
        const jobsResponse = await api.get(`/profile-evaluator/jobs?driveId=${driveId}`);
        
        if (jobsResponse.data.data && jobsResponse.data.data.length > 0) {
          const latestJob = jobsResponse.data.data[0]; // Assuming sorted by most recent
          setJob(latestJob);
          setJobId(latestJob.jobId);
          
          if (latestJob.status === 'COMPLETED') {
            setScreeningState(PRE_SCREENING_STATES.COMPLETED);
          } else if (latestJob.status === 'IN_PROGRESS') {
            setScreeningState(PRE_SCREENING_STATES.IN_PROGRESS);
            setProgress(latestJob.progress.overall.percentage || 0);
            setProgressStatus(latestJob.progress.overall.status || 'Processing...');
          }
        } else {
          // As a fallback, check if there are students with AI scores
          const studentsResponse = await api.get(`/students?driveId=${driveId}&page=1&limit=1`);
          if (studentsResponse.data.total > 0 && studentsResponse.data.data[0].aiScore?.total > 0) {
            setScreeningState(PRE_SCREENING_STATES.COMPLETED);
          }
        }
        
        // Load initial student data if screening is completed
        if (screeningState === PRE_SCREENING_STATES.COMPLETED) {
          fetchStudents();
        }
      } catch (error) {
        console.error('Error checking pre-screening status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPreScreeningStatus();
  }, [driveId]);

  // Poll for job status when in progress
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | undefined;
    
    if (screeningState === PRE_SCREENING_STATES.IN_PROGRESS && jobId) {
      pollInterval = setInterval(async () => {
        try {
          const response = await api.get(`/profile-evaluator/jobs/${jobId}`);
          const jobData = response.data;
          setJob(jobData);
          
          // Update progress
          setProgress(jobData.progress.overall.percentage || 0);
          setProgressStatus(jobData.progress.overall.status || 'Processing...');
          
          // Check if job is completed
          if (jobData.status === 'COMPLETED') {
            setScreeningState(PRE_SCREENING_STATES.COMPLETED);
            clearInterval(pollInterval);
            fetchStudents(); // Load student data once completed
          }
        } catch (error) {
          console.error('Error polling job status:', error);
          setError('Failed to get screening status. Please try again.');
          clearInterval(pollInterval);
        }
      }, 5000); // Poll every 5 seconds
    }
    
    // Cleanup function
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [screeningState, jobId]);

  const fetchStudents = useCallback(async () => {
    if (!driveId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/students?driveId=${driveId}&page=${page}&limit=10&search=${search}`);
      setStudents(response.data.data);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, [driveId, page, search]);

  useEffect(() => {
    if (screeningState === PRE_SCREENING_STATES.COMPLETED) {
      fetchStudents();
    }
  }, [screeningState, fetchStudents]);

  const handleBackClick = () => {
    navigate(`/drives/${driveId}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleTestSelection = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const resetSelection = () => {
    setSelectedTests([]);
  };

  const confirmSelection = () => {
    setDropdownOpen(false);
  };

  const startPreScreening = async () => {
    if (!driveId) return;
    
    try {
      setError(null);
      
      // Start the pre-screening process with the selected tests
      // In a real implementation, you would pass the selected test IDs
      const response = await api.post(`/profile-evaluator/drives/${driveId}/submit-evaluation`, {
        evaluationType: 'PreScreening',
        wecpTestIds: selectedTests // This would be passed to the backend in a real implementation
      });
      
      setJobId(response.data.jobId);
      setScreeningState(PRE_SCREENING_STATES.IN_PROGRESS);
      
      // Set initial progress
      setProgress(0);
      setProgressStatus('Initializing...');
    } catch (error: any) {
      console.error('Error starting pre-screening:', error);
      setError('Failed to start pre-screening. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Different state renderers
  const renderSelectTestsState = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <h2 className="text-2xl font-semibold mb-4">Select WeCP tests</h2>
      <p className="text-gray-600 mb-8">Select all the tests under this drive.</p>
      
      <div className="w-full max-w-md mb-6">
        <div className="relative">
          <button
            className="w-full text-left px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center"
            onClick={toggleDropdown}
          >
            <span>{selectedTests.length > 0 ? `${selectedTests.length} tests selected` : 'Select tests'}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-2 max-h-60 overflow-y-auto">
                {wecpTests.map(test => (
                  <div key={test.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                    <input
                      type="checkbox"
                      id={`test-${test.id}`}
                      checked={selectedTests.includes(test.id)}
                      onChange={() => handleTestSelection(test.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`test-${test.id}`} className="text-sm">{test.name}</label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end p-2 border-t">
                <button
                  onClick={resetSelection}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mr-2"
                >
                  Reset
                </button>
                <button
                  onClick={confirmSelection}
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={startPreScreening}
          disabled={selectedTests.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedTests.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Start Pre-screening
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );

  const renderInProgressState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-2xl font-semibold mb-4">Pre-screening in progress</h2>
      <p className="text-gray-600 mb-8">Filtering students... This may take a moment.</p>
      
      <div className="w-full max-w-md mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progressStatus}</p>
        
        {job && (
          <div className="mt-4 text-sm text-gray-600">
            <p>GitHub: {job.progress.github.completed}/{job.progress.github.total} evaluated</p>
            <p>Resume: {job.progress.resume.completed}/{job.progress.resume.total} evaluated</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompletedState = () => (
    <div className="w-full">
      <div className="mb-4 flex">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-md"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <button className="ml-2 p-2 border border-gray-300 rounded-md">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Registration no</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Test batch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">LinkedIn</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Github</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">AI rank</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{student.name || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{student.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{student.registrationNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{student.testBatch}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{student.emailId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {student.linkedInProfile ? (
                        <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {student.linkedInProfile.replace('https://www.linkedin.com/in/', '')}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {student.githubProfile ? student.githubProfile.split('/').pop() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{student.aiScore?.total || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 mx-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 mx-1 rounded ${pageNum === page ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 mx-1 rounded ${totalPages === page ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 mx-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render different states
  const renderContent = () => {
    switch (screeningState) {
      case PRE_SCREENING_STATES.SELECT_TESTS:
        return renderSelectTestsState();
      case PRE_SCREENING_STATES.IN_PROGRESS:
        return renderInProgressState();
      case PRE_SCREENING_STATES.COMPLETED:
        return renderCompletedState();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        {/* Drive header with back button */}
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
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Export
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PreScreeningPage;