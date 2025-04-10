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
      
      // Try to fetch from API
      try {
        const response = await getDrives(1, 100);
        
        // Filter drives based on active tab
        const filteredDrives = response.drives.filter(drive => 
          activeTab === 'active' ? !drive.isCompleted : drive.isCompleted
        );
        
        // Add mock student count and active round for UI display
        const enhancedDrives = filteredDrives.map(drive => ({
          ...drive,
          studentCount: Math.floor(Math.random() * 2000) + 100,
          activeRound: Math.floor(Math.random() * 4) + 1
        }));
        
        setDrives(enhancedDrives);
        setError(null);
      } catch (apiErr) {
        console.error('API error, using mock data:', apiErr);
        
        // Mock data for demonstration
        const mockDrives: DriveDocument[] = [
          {
            driveId: '1',
            name: 'Ethiraj Drive 2025',
            collegeId: '101',
            collegeName: 'Ethiraj College, Chennai',
            role: 'Associate Engineer',
            practice: 'Application Development',
            startDate: new Date().toISOString(),
            primarySpocId: '201',
            primarySpocEmail: 'spoc1@example.com',
            primarySpocName: 'John Doe',
            isPinned: true,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 347,
            activeRound: 2
          },
          {
            driveId: '2',
            name: 'Loyola Drive 2025',
            collegeId: '102',
            collegeName: 'Loyola College',
            role: 'Associate Engineer',
            practice: 'Application Development',
            startDate: new Date().toISOString(),
            primarySpocId: '202',
            primarySpocEmail: 'spoc2@example.com',
            primarySpocName: 'Jane Smith',
            isPinned: true,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 1931,
            activeRound: 2
          },
          {
            driveId: '3',
            name: 'Riverbend Drive 2025',
            collegeId: '103',
            collegeName: 'Riverbend college',
            role: 'Business Analyst',
            practice: 'BaUX',
            startDate: new Date().toISOString(),
            primarySpocId: '203',
            primarySpocEmail: 'spoc3@example.com',
            primarySpocName: 'Robert Johnson',
            isPinned: true,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 491,
            activeRound: 1
          },
          {
            driveId: '4',
            name: 'Northwood Drive 2025',
            collegeId: '104',
            collegeName: 'Northwood College',
            role: 'Associate Engineer',
            practice: 'DevOps',
            startDate: new Date().toISOString(),
            primarySpocId: '204',
            primarySpocEmail: 'spoc4@example.com',
            primarySpocName: 'Sarah Williams',
            isPinned: true,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 212,
            activeRound: 4
          },
          {
            driveId: '5',
            name: 'Brighton Drive 2025',
            collegeId: '105',
            collegeName: 'Brighton College',
            role: 'Business Analyst',
            practice: 'PMO',
            startDate: new Date().toISOString(),
            primarySpocId: '205',
            primarySpocEmail: 'spoc5@example.com',
            primarySpocName: 'Michael Brown',
            isPinned: false,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 382,
            activeRound: 3
          },
          {
            driveId: '6',
            name: 'Loyola Drive 2025',
            collegeId: '106',
            collegeName: 'Loyola College',
            role: 'Associate Engineer',
            practice: 'Application Development',
            startDate: new Date().toISOString(),
            primarySpocId: '206',
            primarySpocEmail: 'spoc6@example.com',
            primarySpocName: 'Lisa Davis',
            isPinned: false,
            isCompleted: false,
            isActive: true,
            createdTimestamp: new Date().toISOString(),
            updatedTimestamp: new Date().toISOString(),
            studentCount: 1931,
            activeRound: 2
          }
        ];
        
        // Filter based on active tab
        const filteredMockDrives = mockDrives.filter(drive => 
          activeTab === 'active' ? !drive.isCompleted : drive.isCompleted
        );
        
        setDrives(filteredMockDrives);
        setError(null);
      }
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
      setDrives([...drives, { ...newDrive, studentCount: 0, activeRound: 1 }]);
      setCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create drive:', err);
    }
  };

  const handleScheduleDrive = async (driveData: CreateDriveDto & { members: string[] }) => {
    try {
      const newDrive = await createDrive(driveData);
      setDrives([...drives, { ...newDrive, studentCount: 0, activeRound: 1 }]);
      setScheduleModalOpen(false);
    } catch (err) {
      console.error('Failed to schedule drive:', err);
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
      
      {/* For testing purposes - buttons to open modals directly */}
      <div className="fixed top-20 right-8 z-50 flex flex-col space-y-2">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          id="test-create-drive-button"
        >
          Open Create Drive Modal
        </button>
        <button
          onClick={() => setScheduleModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
          id="test-schedule-drive-button"
        >
          Open Schedule Drive Modal
        </button>
      </div>
      
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