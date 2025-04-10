import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import CreateOrScheduleDropdown from '../drives/CreateOrScheduleDropdown';
import CreateDriveModal from '../drives/CreateDriveModal';
import ScheduleDriveModal from '../drives/ScheduleDriveModal';
import { CreateDriveDto } from '../../types';
import { createDrive } from '../../services/driveService';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = "Nirmalmahesh Subramani", 
  userRole = "Admin" 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  
  const handleCreateDrive = async (driveData: CreateDriveDto) => {
    try {
      const newDrive = await createDrive(driveData);
      console.log('Drive created:', newDrive);
      setCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create drive:', err);
    }
  };
  
  const handleScheduleDrive = async (driveData: CreateDriveDto & { members: string[] }) => {
    try {
      const newDrive = await createDrive(driveData);
      console.log('Drive scheduled:', newDrive);
      setScheduleModalOpen(false);
    } catch (err) {
      console.error('Failed to schedule drive:', err);
    }
  };

  return (
    <header className="bg-presidio-blue text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl">PRESIDIO</div>
          <div className="border-l border-white/30 pl-2 text-lg">RecruitHub</div>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-white/80 flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            Dashboard
          </Link>
          
          <Link to="/drives" className="hover:text-white/80 flex items-center font-medium">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
              </svg>
            </span>
            My Drives
          </Link>
          
          <Link to="/colleges" className="hover:text-white/80 flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </span>
            Colleges
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white/20 hover:bg-white/30 text-white rounded-md px-4 py-2 flex items-center text-sm"
            >
              Create or schedule drive
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </button>
            {dropdownOpen && (
              <CreateOrScheduleDropdown 
                onClose={() => setDropdownOpen(false)} 
                onCreateDrive={() => setCreateModalOpen(true)}
                onScheduleDrive={() => setScheduleModalOpen(true)}
              />
            )}
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

          <button className="text-white hover:text-white/80">
            <BellIcon className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-presidio-blue font-medium">
              {userName.charAt(0)}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs opacity-80">{userRole}</div>
            </div>
            <ChevronDownIcon className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;