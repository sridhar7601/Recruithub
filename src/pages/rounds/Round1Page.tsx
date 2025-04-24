import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Student, 
  StudentRound, 
  StudentRoundStatus
} from '../../types';
import { getDriveById } from '../../services/driveService';
import { getStudentsByRound } from '../../services/roundService';
import Header from '../../components/layout/Header';
import { 
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Status badge component
interface StatusBadgeProps {
  status: StudentRoundStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  
  switch (status) {
    case 'NOT_STARTED':
      bgColor = 'bg-pink-100 text-pink-800';
      break;
    case 'IN_PROGRESS':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'COMPLETED':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'PASSED':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'FAILED':
      bgColor = 'bg-red-100 text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  const displayText = status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${bgColor}`}>
      {displayText}
    </span>
  );
};

// Panel badge component
interface PanelBadgeProps {
  panelId: string;
}

const PanelBadge: React.FC<PanelBadgeProps> = ({ panelId }) => {
  // Extract panel number from panel ID (assuming format P-1, P-2, etc.)
  const panelNumber = panelId.split('-')[1] || panelId;
  
  return (
    <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
      P-{panelNumber}
    </span>
  );
};

// Round badge component
interface RoundBadgeProps {
  roundNumber: number;
}

const RoundBadge: React.FC<RoundBadgeProps> = ({ roundNumber }) => {
  return (
    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
      #{roundNumber}
    </span>
  );
};

// Student card component
interface StudentCardProps {
  student: Student;
  studentRound?: StudentRound;
  onSelect: (studentId: string) => void;
  isSelected: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, studentRound, onSelect, isSelected }) => {
  return (
    <div 
      className={`bg-white p-4 border-b last:border-b-0 ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={() => onSelect(student.studentId)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{student.name || 'Unnamed Student'}</h4>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <span>{student.registrationNumber}</span>
            <span>•</span>
            <span>{student.department}</span>
          </div>
        </div>
        
        {isSelected && (
          <CheckCircleIcon className="h-6 w-6 text-blue-500" />
        )}
      </div>
      
      <div className="flex items-center space-x-2 my-2">
        {student.emailId && (
          <a href={`mailto:${student.emailId}`} className="text-gray-500 hover:text-gray-700" onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        )}
        
        {student.linkedInProfile && (
          <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
        
        {student.githubProfile && (
          <a href={student.githubProfile} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {studentRound?.panelId && <PanelBadge panelId={studentRound.panelId} />}
        {studentRound && <RoundBadge roundNumber={studentRound.roundNumber} />}
        {studentRound && <StatusBadge status={studentRound.status} />}
      </div>
    </div>
  );
};

// Panel selection component
interface PanelSelectionProps {
  panels: { id: string; name: string }[];
  selectedPanel: string | null;
  onSelectPanel: (panelId: string) => void;
}

const PanelSelection: React.FC<PanelSelectionProps> = ({ panels, selectedPanel, onSelectPanel }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow mb-6">
      <h3 className="font-medium text-gray-900 mb-4">Assign to Panel</h3>
      <div className="grid grid-cols-2 gap-4">
        {panels.map(panel => (
          <button
            key={panel.id}
            onClick={() => onSelectPanel(panel.id)}
            className={`p-3 rounded-md border ${
              selectedPanel === panel.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{panel.name}</div>
            <div className="text-sm text-gray-500">Panel {panel.id}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const Round1Page: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  // State
  const [driveName, setDriveName] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMyOnly, setShowMyOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('round-1');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  
  // Mock panels data (in a real app, this would come from an API)
  const panels = [
    { id: '1', name: 'Technical Panel 1' },
    { id: '2', name: 'Technical Panel 2' },
    { id: '3', name: 'HR Panel' },
    { id: '4', name: 'Management Panel' }
  ];
  
  // Fetch drive details
  useEffect(() => {
    const fetchDriveDetails = async () => {
      if (!driveId) return;
      
      try {
        const drive = await getDriveById(driveId);
        setDriveName(drive.name);
        setCollegeName(drive.collegeName);
      } catch (error) {
        console.error('Error fetching drive details:', error);
        setError('Failed to load drive details');
      }
    };
    
    fetchDriveDetails();
  }, [driveId]);
  
  // Fetch students for round 1
  useEffect(() => {
    const fetchStudents = async () => {
      if (!driveId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getStudentsByRound(driveId);
        // Get students in round 1
        setStudents(data[1] || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [driveId]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to the appropriate page based on the tab
    if (tab === 'overview') {
      navigate(`/drives/${driveId}/overview`);
    } else if (tab === 'panel-members') {
      navigate(`/drives/${driveId}/panel-members`);
    } else if (tab === 'student-data') {
      navigate(`/drives/${driveId}`);
    } else if (tab === 'pre-screening') {
      navigate(`/drives/${driveId}/pre-screening`);
    } else if (tab === 'round-1') {
      navigate(`/drives/${driveId}/round-1`);
    } else if (tab === 'rounds-2-4') {
      navigate(`/drives/${driveId}/rounds`);
    } else if (tab === 'settings') {
      navigate(`/drives/${driveId}/settings`);
    }
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/drives');
  };
  
  // Filter students by search query
  const filterStudents = (students: Student[]): Student[] => {
    if (!searchQuery) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student => 
      (student.name?.toLowerCase().includes(query)) ||
      student.registrationNumber.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.emailId.toLowerCase().includes(query)
    );
  };
  
  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  // Handle panel selection
  const handlePanelSelect = (panelId: string) => {
    setSelectedPanel(panelId);
  };
  
  // Handle assign to panel
  const handleAssignToPanel = () => {
    if (!selectedPanel || selectedStudents.length === 0) return;
    
    // In a real app, this would make an API call to assign students to the panel
    alert(`Assigned ${selectedStudents.length} students to Panel ${selectedPanel}`);
    
    // Reset selection
    setSelectedStudents([]);
    setSelectedPanel(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Drive context bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleBack}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{driveName}</h1>
              <p className="text-sm text-gray-500">{collegeName}</p>
            </div>
          </div>
          
          <button 
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-500" />
            Export
          </button>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('panel-members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'panel-members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Panel members
            </button>
            <button
              onClick={() => handleTabChange('student-data')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'student-data'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student data
            </button>
            <button
              onClick={() => handleTabChange('pre-screening')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'pre-screening'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pre-screening
            </button>
            <button
              onClick={() => handleTabChange('round-1')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'round-1'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Round 1
            </button>
            <button
              onClick={() => handleTabChange('rounds-2-4')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'rounds-2-4'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rounds 2-4
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filter controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filter
            </button>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">My candidates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showMyOnly} 
                  onChange={() => setShowMyOnly(!showMyOnly)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Selection info and actions */}
        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex justify-between items-center">
            <div className="text-blue-700">
              <span className="font-medium">{selectedStudents.length}</span> students selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedStudents([])}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear selection
              </button>
              <button
                onClick={handleAssignToPanel}
                disabled={!selectedPanel}
                className={`px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white ${
                  selectedPanel ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                Assign to Panel {selectedPanel}
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Panel selection */}
          <div className="md:col-span-1">
            <PanelSelection 
              panels={panels} 
              selectedPanel={selectedPanel} 
              onSelectPanel={handlePanelSelect} 
            />
          </div>
          
          {/* Right column - Student list */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-md shadow">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                {error}
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white rounded-md shadow p-6 text-center">
                <p className="text-gray-500">No students found in Round 1.</p>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="p-4 bg-blue-100 flex justify-between items-center">
                  <h3 className="font-medium">Round 1 Students</h3>
                  <span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
                    {students.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filterStudents(students).map(student => (
                    <StudentCard 
                      key={student.studentId} 
                      student={student}
                      onSelect={handleStudentSelect}
                      isSelected={selectedStudents.includes(student.studentId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Round1Page;
