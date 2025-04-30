 import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Student, 
  StudentFilterParams, 
  DepartmentCount,
  RoundCount
} from '../../types/student';
import debounce from 'lodash/debounce';
import { 
  getStudents, 
  importStudents, 
  getStudentCountByDepartment,
  getStudentCountByRound
} from '../../services/studentService';
import { getDriveById } from '../../services/driveService';
import Header from '../../components/layout/Header';
import AddStudentModal from '../../components/students/AddStudentModal';
import StudentImportModal from '../../components/students/StudentImportModal';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowLeftIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Define available departments
const DEPARTMENTS = [
  'Computer Science Engineering',
  'Information Technology',
  'AI & DS',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Electrical and Electronics Engineering',
  'Biotechnology',
  'Civil Engineering'
];

const StudentDataPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  // State for drive details
  const [driveName, setDriveName] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeId, setCollegeId] = useState<string>('');
  
  // State for students
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  
  // State for pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<StudentFilterParams>({
    sortBy: 'aiRank',
    sortOrder: 'desc',
    departments: [],
    testBatches: []
  });
  
  // State for department and round counts
  const [departmentCounts, setDepartmentCounts] = useState<DepartmentCount[]>([]);
  const [roundCounts, setRoundCounts] = useState<RoundCount[]>([]);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'prescreening' | 'settings'>('students');
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  
  // Fetch drive details
  useEffect(() => {
    const fetchDriveDetails = async () => {
      if (!driveId) return;
      
      try {
        const drive = await getDriveById(driveId);
        setDriveName(drive.name);
        setCollegeName(drive.collegeName);
        setCollegeId(drive.collegeId);
      } catch (error) {
        console.error('Error fetching drive details:', error);
        setError('Failed to load drive details');
      }
    };
    
    fetchDriveDetails();
  }, [driveId]);
  
  // Fetch students function
  const fetchStudents = async () => {
    if (!driveId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Apply search query to filters
      const currentFilters = {
        ...filters,
        search: searchQuery
      };
      
      const response = await getStudents(driveId, page, limit, currentFilters);
      setStudents(response.data);
      setTotalStudents(response.total);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch students with filters
  useEffect(() => {
    fetchStudents();
  }, [driveId, page, limit, filters, searchQuery]);
  
  // Fetch department and round counts
  useEffect(() => {
    const fetchCounts = async () => {
      if (!driveId) return;
      
      try {
        // Fetch department counts
        const deptCounts = await getStudentCountByDepartment(driveId);
        const formattedDeptCounts = Object.entries(deptCounts).map(([department, count]) => ({
          department,
          count
        }));
        setDepartmentCounts(formattedDeptCounts);
        
        // Fetch round counts
        const roundCounts = await getStudentCountByRound(driveId);
        const formattedRoundCounts = Object.entries(roundCounts).map(([roundNumber, count]) => ({
          roundNumber: parseInt(roundNumber),
          count
        }));
        setRoundCounts(formattedRoundCounts);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
  }, [driveId]);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1); // Reset to first page when search query changes
      fetchStudents();
    }, 300),
    [fetchStudents]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    debouncedSearch(query);
  };

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof StudentFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  console.log("hihihihihihihihi");
  // Handle department filter toggle
  const handleDepartmentToggle = (department: string) => {
    setFilters(prev => {
      const departments = prev.departments || [];
      
      if (departments.includes(department)) {
        return {
          ...prev,
          departments: departments.filter(d => d !== department)
        };
      } else {
        return {
          ...prev,
          departments: [...departments, department]
        };
      }
    });
  };
  
  // Handle test batch filter toggle
  const handleTestBatchToggle = (batch: string) => {
    setFilters(prev => {
      const testBatches = prev.testBatches || [];
      
      if (testBatches.includes(batch)) {
        return {
          ...prev,
          testBatches: testBatches.filter(b => b !== batch)
        };
      } else {
        return {
          ...prev,
          testBatches: [...testBatches, batch]
        };
      }
    });
  };
  
  // Handle sort order change
  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortOrder: order
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      sortBy: 'aiRank',
      sortOrder: 'desc',
      departments: [],
      testBatches: []
    });
    setSearchQuery('');
  };
  
  // Handle successful student addition or import
  const handleStudentSuccess = () => {
    // Refresh student list
    fetchStudents();
  };
  
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
  
  // Calculate total pages
  const totalPages = Math.ceil(totalStudents / limit);
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
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
        {/* Empty state */}
        {!loading && students.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No student data yet</h2>
            <p className="text-gray-500 mb-6">Load student data in XLSX format to get started.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Add manually
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Import data
              </button>
            </div>
          </div>
        )}
        
        {/* Student data table */}
        {!loading && students.length > 0 && (
          <>
            {/* Control bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or registration number"
                  value={inputValue}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Add Student
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Import
                </button>
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Filter
                </button>
              </div>
            </div>
            
            {/* Student table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration no
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test batch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LinkedIn
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Github
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI rank
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.registrationNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.testBatch}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.emailId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600 hover:underline">
                          {student.linkedInProfile ? (
                            <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer">
                              {student.linkedInProfile.replace('https://www.linkedin.com/in/', '')}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600 hover:underline">
                          {student.githubProfile ? (
                            <a href={student.githubProfile} target="_blank" rel="noopener noreferrer">
                              {student.githubProfile.replace('https://github.com/', '')}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {student.aiScore?.total || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, totalStudents)}</span> of{' '}
                <span className="font-medium">{totalStudents}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      page === number
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        )}
      </main>
      
      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleStudentSuccess}
        driveId={driveId || ''}
        driveName={driveName}
        collegeId={collegeId}
        collegeName={collegeName}
      />
      
      <StudentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleStudentSuccess}
        driveId={driveId || ''}
      />
      
      {/* Filter panel */}
      {showFilters && (
        <div className="fixed inset-0 overflow-hidden z-50" aria-labelledby="filter-panel">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowFilters(false)}></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Sort and filter</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="ml-3 h-7 w-7 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900">Sort</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="sort-highest"
                            name="sort-order"
                            type="radio"
                            checked={filters.sortOrder === 'desc'}
                            onChange={() => handleSortOrderChange('desc')}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="sort-highest" className="ml-3 text-sm text-gray-700">
                            Highest rank first
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="sort-lowest"
                            name="sort-order"
                            type="radio"
                            checked={filters.sortOrder === 'asc'}
                            onChange={() => handleSortOrderChange('asc')}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="sort-lowest" className="ml-3 text-sm text-gray-700">
                            Lowest rank first
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900">Test batch</h3>
                      <div className="mt-2 space-y-2">
                        {[1, 2, 3, 4].map((batch) => (
                          <div key={batch} className="flex items-center">
                            <input
                              id={`batch-${batch}`}
                              name={`batch-${batch}`}
                              type="checkbox"
                              checked={(filters.testBatches || []).includes(batch.toString())}
                              onChange={() => handleTestBatchToggle(batch.toString())}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`batch-${batch}`} className="ml-3 text-sm text-gray-700">
                              Batch {batch}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900">Departments</h3>
                      <div className="mt-2 space-y-2">
                        {DEPARTMENTS.map((department) => (
                          <div key={department} className="flex items-center">
                            <input
                              id={`dept-${department}`}
                              name={`dept-${department}`}
                              type="checkbox"
                              checked={(filters.departments || []).includes(department)}
                              onChange={() => handleDepartmentToggle(department)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`dept-${department}`} className="ml-3 text-sm text-gray-700">
                              {department}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataPage;
