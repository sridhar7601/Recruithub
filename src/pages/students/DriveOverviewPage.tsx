import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentCountByDepartment, getStudentCountByRound } from '../../services/studentService';
import { DepartmentCount, RoundCount } from '../../services/driveService';
import { getDriveById } from '../../services/driveService';
import Header from '../../components/layout/Header';
import { 
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  ServerIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

// Department icons mapping
const departmentIcons: Record<string, React.ReactNode> = {
  'BE - Computer Science Engineering': <ComputerDesktopIcon className="h-8 w-8 text-blue-500" />,
  'B.Tech - Information Technology': <ServerIcon className="h-8 w-8 text-green-500" />,
  'B.E - AI & DS': <CodeBracketIcon className="h-8 w-8 text-purple-500" />,
  'B.E - Electronics and Communication Engineering': <CpuChipIcon className="h-8 w-8 text-red-500" />,
  'B.E - Mechanical Engineering': <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-500" />,
  'B.Tech - Electrical and Electronics Engineering': <CpuChipIcon className="h-8 w-8 text-orange-500" />,
  'B.Tech - Biotechnology': <BeakerIcon className="h-8 w-8 text-pink-500" />,
  'B.E - Civil Engineering': <BuildingOfficeIcon className="h-8 w-8 text-indigo-500" />,
  'default': <AcademicCapIcon className="h-8 w-8 text-gray-500" />
};

const DriveOverviewPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  // State for drive details
  const [driveName, setDriveName] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  
  // State for student counts
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [departmentCounts, setDepartmentCounts] = useState<DepartmentCount[]>([]);
  const [roundCounts, setRoundCounts] = useState<RoundCount[]>([]);
  
  // State for loading and error
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'prescreening' | 'settings'>('overview');
  
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
  
  // Fetch student counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!driveId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch department counts
        const deptCounts = await getStudentCountByDepartment(driveId);
        const formattedDeptCounts = Object.entries(deptCounts).map(([department, count]) => ({
          department,
          count: typeof count === 'number' ? count : parseInt(count)
        }));
        
        // Sort by count in descending order
        formattedDeptCounts.sort((a, b) => b.count - a.count);
        setDepartmentCounts(formattedDeptCounts);
        
        // Calculate total students
        const total = formattedDeptCounts.reduce((sum, item) => sum + item.count, 0);
        setTotalStudents(total);
        
        // Fetch round counts
        const roundCounts = await getStudentCountByRound(driveId);
        const formattedRoundCounts = Object.entries(roundCounts).map(([roundNumber, count]) => ({
          roundNumber: parseInt(roundNumber),
          count: typeof count === 'number' ? count : parseInt(count)
        }));
        setRoundCounts(formattedRoundCounts);
      } catch (error) {
        console.error('Error fetching counts:', error);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, [driveId]);
  
  // Handle tab change
  const handleTabChange = (tab: 'overview' | 'students' | 'prescreening' | 'settings') => {
    setActiveTab(tab);
    
    // Navigate to the appropriate page based on the tab
    if (tab === 'overview') {
      navigate(`/drives/${driveId}/overview`);
    } else if (tab === 'students') {
      navigate(`/drives/${driveId}`);
    } else if (tab === 'prescreening') {
      navigate(`/drives/${driveId}/prescreening`);
    } else if (tab === 'settings') {
      navigate(`/drives/${driveId}/settings`);
    }
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/drives');
  };
  
  // Get icon for department
  const getDepartmentIcon = (department: string) => {
    return departmentIcons[department] || departmentIcons['default'];
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
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student data
            </button>
            <button
              onClick={() => handleTabChange('prescreening')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prescreening'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pre-screening
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
            {/* Student strength - In rounds */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student strength - In rounds</h2>
              <div className="bg-white rounded-lg shadow p-6 inline-block">
                <div className="flex items-center">
                  <div className="bg-pink-100 rounded-full p-3 mr-4">
                    <UserGroupIcon className="h-8 w-8 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
                    <div className="text-sm text-gray-500">Student data</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Student strength - Department wise */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student strength - Department wise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {departmentCounts.map((dept) => (
                  <div key={dept.department} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-3 mr-4">
                        {getDepartmentIcon(dept.department)}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">{dept.count}</div>
                        <div className="text-sm text-gray-500">{dept.department}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DriveOverviewPage;
