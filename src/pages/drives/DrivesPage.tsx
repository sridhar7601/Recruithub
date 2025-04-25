import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import DriveCard from '../../components/drives/DriveCard';
import CreateDriveModal from '../../components/drives/CreateDriveModal';
import ScheduleDriveModal from '../../components/drives/ScheduleDriveModal';
import { DriveDocument, CreateDriveDto } from '../../types';
import { getDrives, createDrive, updateDrive } from '../../services/driveService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DrivesPage: React.FC = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<DriveDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDrives();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDrives(1, 100);
      
      if (!response || !response.drives) {
        console.error('Invalid response format:', response);
        setError('Invalid response format from API');
        setDrives([]);
        return;
      }
      
      // Filter drives based on active tab
      const filteredDrives = response.drives.filter(drive => 
        activeTab === 'active' ? !drive.isCompleted : drive.isCompleted
      );
      
      // Add student count and active round for UI display if not present
      const enhancedDrives = filteredDrives.map(drive => {
        const roundCount = drive.rounds && drive.rounds.length > 0 ? drive.rounds.length : 1;
        return {
          ...drive,
          // Use existing values or generate placeholders if not available from API
          studentCount: drive.studentCount !== undefined ? drive.studentCount : Math.floor(Math.random() * 2000) + 100,
          activeRound: drive.activeRound !== undefined ? drive.activeRound : roundCount
        };
      });
      
      setDrives(enhancedDrives);
    } catch (err) {
      console.error('Failed to fetch drives:', err);
      setError('Failed to load drives. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (driveId: string, isPinned: boolean) => {
    try {
      await updateDrive(driveId, { isPinned });
      
      // Update local state
      setDrives(drives.map(drive => 
        drive.driveId === driveId ? { ...drive, isPinned } : drive
      ));
    } catch (err) {
      console.error('Failed to update drive pin status:', err);
    }
  };

  const handleCardClick = (driveId: string) => {
    navigate(`/drives/${driveId}`);
  };

  const handleCreateDrive = async (driveData: CreateDriveDto) => {
    try {
      const newDrive = await createDrive(driveData);
      
      // Add UI display properties
      const roundCount = newDrive.rounds && newDrive.rounds.length > 0 ? newDrive.rounds.length : 1;
      const enhancedDrive: DriveDocument = {
        ...newDrive,
        studentCount: 0,
        activeRound: roundCount
      };
      
      // Add to drives list and sort by creation date (newest first)
      const updatedDrives = [enhancedDrive, ...drives]
        .sort((a, b) => new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime());
      
      setDrives(updatedDrives);
      setCreateModalOpen(false);
      
      // Refresh the drives list to ensure we have the latest data
      fetchDrives();
    } catch (err: any) {
      console.error('Failed to create drive:', err);
      
      // Show more detailed error information if available
      if (err.response && err.response.data) {
        console.error('Error details:', err.response.data);
      }
      
      // Error handling is done in the modal component
      throw err;
    }
  };

  const handleScheduleDrive = async (driveData: CreateDriveDto & { members: string[] }) => {
    try {
      const newDrive = await createDrive(driveData);
      
      // Add UI display properties
      const roundCount = newDrive.rounds && newDrive.rounds.length > 0 ? newDrive.rounds.length : 1;
      const enhancedDrive: DriveDocument = {
        ...newDrive,
        studentCount: 0,
        activeRound: roundCount
      };
      
      // Add to drives list and sort by creation date (newest first)
      const updatedDrives = [enhancedDrive, ...drives]
        .sort((a, b) => new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime());
      
      setDrives(updatedDrives);
      setScheduleModalOpen(false);
      
      // Refresh the drives list to ensure we have the latest data
      fetchDrives();
    } catch (err: any) {
      console.error('Failed to schedule drive:', err);
      
      // Show more detailed error information if available
      if (err.response && err.response.data) {
        console.error('Error details:', err.response.data);
      }
      
      // Error handling is done in the modal component
      throw err;
    }
  };

  const filteredDrives = drives.filter(drive => 
    drive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drive.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Drives</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            <div className="bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeTab === 'completed' 
                    ? 'bg-presidio-light-blue text-presidio-blue' 
                    : 'text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeTab === 'active' 
                    ? 'bg-presidio-light-blue text-presidio-blue' 
                    : 'text-gray-700'
                }`}
              >
                Active
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-presidio-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map(drive => (
              <DriveCard 
                key={drive.driveId}
                drive={drive}
                onTogglePin={handleTogglePin}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Create Drive Modal */}
      <CreateDriveModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateDrive}
      />
      
      {/* Schedule Drive Modal */}
      <ScheduleDriveModal 
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSubmit={handleScheduleDrive}
      />
      
      {/* Floating action button for create/schedule */}
      <div className="fixed bottom-8 right-8">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-presidio-blue text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => {
                      setCreateModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    id="create-drive-dropdown-button"
                  >
                    Create drive
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setScheduleModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    id="schedule-drive-dropdown-button"
                  >
                    Schedule drive
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrivesPage;