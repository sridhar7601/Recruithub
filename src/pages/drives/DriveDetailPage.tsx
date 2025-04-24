import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriveById } from '../../services/driveService';
import getProfileEvaluatorJobs from '../../services/api';
import Header from '../../components/layout/Header';
import StudentTableSkeleton from '../../components/students/StudentTableSkeleton';

const DriveDetailPage = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  const [drive, setDrive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('student-data');
  const [preScreeningCompleted, setPreScreeningCompleted] = useState(false);
  
  useEffect(() => {
    const fetchDrive = async () => {
      if (!driveId) return;
      
      try {
        setLoading(true);
        const driveData = await getDriveById(driveId);
        setDrive(driveData);
        
        // Check if pre-screening has been completed
        const jobsResponse = await getProfileEvaluatorJobs(driveId);
        
        if (jobsResponse.data && jobsResponse.data.data && jobsResponse.data.data.length > 0) {
          const completedJobs = jobsResponse.data.data.filter(
            (job: any) => job.status === 'COMPLETED'
          );
          
          if (completedJobs.length > 0) {
            setPreScreeningCompleted(true);
          }
        } else if ((driveData?.studentCount ?? 0) > 0) {
          // If we have students but no pre-screening job, assume it's been completed
          setPreScreeningCompleted(true);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load drive information');
        console.error('Error fetching drive:', err);
        setLoading(false);
      }
    };
    
    fetchDrive();
  }, [driveId]);

  const handleBackClick = () => {
    navigate('/drives');
  };

  const navigateToTab = (tab: string) => {
    // For tabs represented by separate routes
    switch (tab) {
      case 'student-data':
        navigate(`/drives/${driveId}`);
        break;
      case 'pre-screening':
        navigate(`/drives/${driveId}/prescreening`);
        break;
      case 'round-1':
        navigate(`/drives/${driveId}/round-1`);
        break;
      case 'rounds-2-4':
        navigate(`/drives/${driveId}/rounds`);
        break;
      case 'settings':
        navigate(`/drives/${driveId}/settings`);
        break;
      case 'overview':
        navigate(`/drives/${driveId}/overview`);
        break;
      default:
        setActiveTab(tab);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-wrap gap-2 p-4 border-b">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => navigateToTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'student-data' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => navigateToTab('student-data')}
            >
              Student data
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'pre-screening' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => navigateToTab('pre-screening')}
            >
              Pre-screening
            </button>
            
            {/* Only show Round 1 and Rounds 2-4 tabs if pre-screening is completed */}
            {preScreeningCompleted && (
              <>
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'round-1' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => navigateToTab('round-1')}
                >
                  Round 1
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${activeTab === 'rounds-2-4' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => navigateToTab('rounds-2-4')}
                >
                  Rounds 2-4
                </button>
              </>
            )}
            
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => navigateToTab('settings')}
            >
              Settings
            </button>
          </div>
          
          {/* Tab content container */}
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Student Data</h2>
              <p className="text-gray-600 mb-4">
                This page allows you to view and manage student data for this drive.
              </p>
              <p className="text-gray-600">
                Use the tabs above to navigate to different sections of the drive management interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetailPage;