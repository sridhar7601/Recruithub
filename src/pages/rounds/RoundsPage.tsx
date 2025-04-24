import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Student, 
  StudentRound, 
  StudentsByRound,
  StudentRoundStatus
} from '../../types';
import { getDriveById } from '../../services/driveService';
import { getStudentsByRound, updateStudentRound } from '../../services/roundService';
import Header from '../../components/layout/Header';
import { 
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Status color mapping
const getStatusColor = (roundNumber: number): string => {
  switch (roundNumber) {
    case 2:
      return 'bg-amber-100 text-amber-800';
    case 3:
      return 'bg-blue-100 text-blue-800';
    case 4:
      return 'bg-purple-100 text-purple-800';
    case -1: // Hired
      return 'bg-green-100 text-green-800';
    case -2: // Rejected
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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

// Round header component
interface RoundHeaderProps {
  roundNumber: number;
  count: number;
  title?: string;
}

const RoundHeader: React.FC<RoundHeaderProps> = ({ roundNumber, count, title }) => {
  let displayTitle = title;
  let bgColor = '';
  
  if (!displayTitle) {
    if (roundNumber === -1) {
      displayTitle = 'Hired';
      bgColor = 'bg-green-100';
    } else if (roundNumber === -2) {
      displayTitle = 'Rejected';
      bgColor = 'bg-red-100';
    } else {
      displayTitle = `Round ${roundNumber}`;
      bgColor = getStatusColor(roundNumber);
    }
  }
  
  return (
    <div className={`flex justify-between items-center px-4 py-2 ${bgColor} rounded-t-md`}>
      <h3 className="font-medium">{displayTitle}</h3>
      <span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
        {count}
      </span>
    </div>
  );
};

// Student card component
interface StudentCardProps {
  student: Student;
  studentRound?: StudentRound;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, studentId: string, currentRound: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, studentRound, onDragStart }) => {
  return (
    <div 
      className="bg-white p-4 border-b last:border-b-0 cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, student.studentId, studentRound?.roundNumber || 1)}
    >
      <div className="mb-2">
        <h4 className="font-medium text-gray-900">{student.name || 'Unnamed Student'}</h4>
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <span>{student.registrationNumber}</span>
          <span>•</span>
          <span>{student.department}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        {student.emailId && (
          <a href={`mailto:${student.emailId}`} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        )}
        
        {student.linkedInProfile && (
          <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
        
        {student.githubProfile && (
          <a href={student.githubProfile} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
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

const RoundsPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  // State
  const [driveName, setDriveName] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [studentsByRound, setStudentsByRound] = useState<StudentsByRound>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMyOnly, setShowMyOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('rounds-2-4');
  const [draggedStudent, setDraggedStudent] = useState<{id: string, currentRound: number} | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // State for drive rounds
  const [driveRounds, setDriveRounds] = useState<any[]>([]);
  
  // Round names for special rounds
  const specialRoundNames = {
    '-1': 'Selected Candidates',
    '-2': 'Rejected Candidates'
  };
  
  // Fetch drive details and rounds
  useEffect(() => {
    const fetchDriveDetails = async () => {
      if (!driveId) return;
      
      try {
        const drive = await getDriveById(driveId);
        setDriveName(drive.name);
        setCollegeName(drive.collegeName);
        
        // Get rounds from the drive
        if (drive.rounds && drive.rounds.length > 0) {
          // Sort rounds by round number
          const sortedRounds = [...drive.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
          setDriveRounds(sortedRounds);
        }
      } catch (error) {
        console.error('Error fetching drive details:', error);
        setError('Failed to load drive details');
      }
    };
    
    fetchDriveDetails();
  }, [driveId]);
  
  // Fetch students by round
  useEffect(() => {
    const fetchStudentsByRound = async () => {
      if (!driveId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getStudentsByRound(driveId);
        setStudentsByRound(data);
      } catch (error) {
        console.error('Error fetching students by round:', error);
        setError('Failed to load students by round');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentsByRound();
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
  
  // Get round counts
  const getRoundCount = (roundNumber: number): number => {
    return studentsByRound[roundNumber]?.length || 0;
  };
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, studentId: string, currentRound: number) => {
    setDraggedStudent({ id: studentId, currentRound });
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  // Handle drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetRound: number) => {
    e.preventDefault();
    
    if (!draggedStudent) return;
    if (draggedStudent.currentRound === targetRound) return;
    
    try {
      setUpdateMessage(null);
      
      // Find the student in the current round
      const student = studentsByRound[draggedStudent.currentRound]?.find(
        s => s.studentId === draggedStudent.id
      );
      
      if (!student) return;
      
      // Update the student's round
      await updateStudentRound(draggedStudent.id, targetRound, {
        status: 'NOT_STARTED'
      });
      
      // Update the UI
      setStudentsByRound(prev => {
        const newState = { ...prev };
        
        // Remove from current round
        newState[draggedStudent.currentRound] = newState[draggedStudent.currentRound].filter(
          s => s.studentId !== draggedStudent.id
        );
        
        // Add to target round
        if (!newState[targetRound]) {
          newState[targetRound] = [];
        }
        
        newState[targetRound] = [...newState[targetRound], {
          ...student,
          currentRound: { ...student.currentRound, roundNumber: targetRound, status: 'NOT_STARTED' }
        }];
        
        return newState;
      });
      
      setUpdateMessage({
        type: 'success',
        text: `Student moved to Round ${targetRound}`
      });
      
    } catch (error) {
      console.error('Error updating student round:', error);
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update student round'
      });
    }
    
    setDraggedStudent(null);
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
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        ) : (
          <>
            {/* Status message */}
            {updateMessage && (
              <div className={`mb-4 p-3 rounded-md ${
                updateMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {updateMessage.text}
              </div>
            )}
          
            <div className="flex space-x-4 overflow-x-auto pb-6">
            {/* Dynamic rounds based on drive configuration */}
            {driveRounds.map((round, index) => {
              // Skip round 1 as requested by the user
              if (round.roundNumber === 1) return null;
              
              // Generate a color based on the index
              const colors = [
                'bg-amber-100 text-amber-800',
                'bg-blue-100 text-blue-800',
                'bg-purple-100 text-purple-800',
                'bg-indigo-100 text-indigo-800',
                'bg-pink-100 text-pink-800'
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div 
                  key={round.roundNumber}
                  className="min-w-[300px] max-w-[350px] flex-shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, round.roundNumber)}
                >
                  <div className={`rounded-t-md px-4 py-2 ${colorClass} flex justify-between items-center`}>
                    <div>
                      <h3 className="font-medium">Round {round.roundNumber}</h3>
                      <p className="text-xs">{round.name}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
                      {getRoundCount(round.roundNumber)}
                    </span>
                  </div>
                  <div 
                    className="bg-white rounded-b-md shadow overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto"
                  >
                    {studentsByRound[round.roundNumber] && studentsByRound[round.roundNumber].length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {filterStudents(studentsByRound[round.roundNumber]).map(student => (
                          <StudentCard 
                            key={student.studentId} 
                            student={student}
                            onDragStart={handleDragStart}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No students in Round {round.roundNumber}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Hired - Always show this column */}
            <div 
              className="min-w-[300px] max-w-[350px] flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, -1)}
            >
              <div className={`rounded-t-md px-4 py-2 bg-green-100 text-green-800 flex justify-between items-center`}>
                <div>
                  <h3 className="font-medium">Hired</h3>
                  <p className="text-xs text-green-700">{specialRoundNames['-1']}</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
                  {getRoundCount(-1)}
                </span>
              </div>
              <div 
                className="bg-white rounded-b-md shadow overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto"
              >
                {studentsByRound[-1] && studentsByRound[-1].length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filterStudents(studentsByRound[-1]).map(student => (
                      <StudentCard 
                        key={student.studentId} 
                        student={student}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No hired students
                  </div>
                )}
              </div>
            </div>
            
            {/* Rejected - Always show this column */}
            <div 
              className="min-w-[300px] max-w-[350px] flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, -2)}
            >
              <div className={`rounded-t-md px-4 py-2 bg-red-100 text-red-800 flex justify-between items-center`}>
                <div>
                  <h3 className="font-medium">Rejected</h3>
                  <p className="text-xs text-red-700">{specialRoundNames['-2']}</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
                  {getRoundCount(-2)}
                </span>
              </div>
              <div 
                className="bg-white rounded-b-md shadow overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto"
              >
                {studentsByRound[-2] && studentsByRound[-2].length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filterStudents(studentsByRound[-2]).map(student => (
                      <StudentCard 
                        key={student.studentId} 
                        student={student}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No rejected students
                  </div>
                )}
              </div>
            </div>
            
              {/* No students in any round */}
              {Object.keys(studentsByRound).length === 0 && (
                <div className="w-full bg-white rounded-md shadow p-6 text-center">
                  <p className="text-gray-500">No students found in rounds 2-4.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RoundsPage;
