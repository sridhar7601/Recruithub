import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriveById } from '../../services/driveService';
import { DriveDocument } from '../../types/drives';
import Header from '../../components/layout/Header';
import TabNavigation, { TabItem } from '../../components/navigation/TabNavigation';
import TabContentContainer from '../../components/navigation/TabContentContainer';
import StudentDataContent from './tabs/StudentDataContent';
import OverviewContent from './tabs/OverviewContent';
import RoundsContent from './tabs/RoundsContent';
import PreScreeningContent from './tabs/PreScreeningContent';
import Round1SettingsContent from '../settings/Round1SettingsPage';
import { Alert, Button, Card, Spinner } from '../../components/common';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

enum TabIds {
  OVERVIEW = 'overview',
  STUDENT_DATA = 'student_data',
  ROUNDS = 'rounds',
  PRESCREENING = 'prescreening',
  ROUND_1_SETTINGS = 'round_1_settings',
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
    { id: TabIds.ROUNDS, label: 'Rounds', disabled: false },
    { id: TabIds.ROUND_1_SETTINGS, label: 'Round 1 Settings', disabled: false },
    { id: TabIds.SETTINGS, label: 'Settings', disabled: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Spinner 
          fullScreen 
          size="lg" 
          label="Loading drive details..." 
        />
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
            <Button 
              variant="icon"
              onClick={handleBackClick}
              className="mr-4"
              icon={<ArrowLeftIcon className="h-6 w-6" />}
              aria-label="Go back"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{drive?.name || 'Drive'}</h1>
              <p className="text-gray-600">{drive?.collegeName || 'College'}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => {}} // Handle export functionality
          >
            Export
          </Button>
        </div>
        
        {/* Main content area */}
        <Card shadow={true} padding="none">
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
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.ROUND_1_SETTINGS}>
            <Round1SettingsContent />
          </TabContentContainer>
          
          <TabContentContainer activeTabId={activeTab} tabId={TabIds.SETTINGS}>
            <div className="p-6">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-gray-600 mt-2">Drive settings will be available here.</p>
            </div>
          </TabContentContainer>
        </Card>
      </div>
      
      {/* Error notification */}
      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
          position="fixed-bottom-right"
        />
      )}
    </div>
  );
};

export default DriveDetailPage;
