import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriveById } from '../../services/driveService';
import { DriveDocument } from '../../types';
import Header from '../../components/layout/Header';
import TabNavigation, { TabItem } from '../../components/navigation/TabNavigation';
import TabContentContainer from '../../components/navigation/TabContentContainer';
import StudentDataContent from './tabs/StudentDataContent';
import OverviewContent from './tabs/OverviewContent';
import RoundsContent from './tabs/RoundsContent';
import PreScreeningContent from './tabs/PreScreeningContent';

enum TabIds {
  OVERVIEW = 'overview',
  STUDENT_DATA = 'student_data',
  ROUNDS = 'rounds',
  PRESCREENING = 'prescreening',
  SETTINGS = 'settings'
}

const DriveDetailPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  const [drive, setDrive] = useState<DriveDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TabIds.OVERVIEW);

  useEffect(() => {
    if (!driveId) return;
    
    const fetchDrive = async () => {
      try {
        setLoading(true);
        const driveData = await getDriveById(driveId);
        setDrive(driveData);
        setError(null);
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs: TabItem[] = [
    { id: TabIds.OVERVIEW, label: 'Overview' },
    { id: TabIds.STUDENT_DATA, label: 'Student Data' },
    { id: TabIds.PRESCREENING, label: 'Pre-screening' },
    { id: TabIds.ROUNDS, label: 'Round-1 ', disabled: true },
    { id: TabIds.SETTINGS, label: 'Settings',disabled: true }
  ];

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
            onClick={() => {}} // Handle export functionality
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Export
          </button>
        </div>
        
        {/* Main content area */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="p-4">
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
            />
          </div>
          
          {/* Tab Content */}
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.OVERVIEW}>
            <OverviewContent  />
          </TabContentContainer>
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.STUDENT_DATA}>
            <StudentDataContent driveId={driveId} drive={drive} />
          </TabContentContainer>
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.ROUNDS}>
            <RoundsContent drive={drive} />
          </TabContentContainer>
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.PRESCREENING}>
            <PreScreeningContent driveId={driveId} />
          </TabContentContainer>
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.SETTINGS}>
            <div className="p-6">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-gray-600 mt-2">Drive settings will be available here.</p>
            </div>
          </TabContentContainer>
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
  );
};

export default DriveDetailPage;