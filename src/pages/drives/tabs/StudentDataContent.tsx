import React, { useState, useEffect, useCallback } from 'react';
import { getStudents } from '../../../services/studentService';
import { Student, StudentFilterParams } from '../../../types/student';
import { DriveDocument } from '../../../types';
import { debounce } from 'lodash';
import StudentTableSkeleton from '../../../components/students/StudentTableSkeleton';
import StudentImportModal from '../../../components/students/StudentImportModal';
import AddStudentModal from '../../../components/students/AddStudentModal';

interface StudentDataContentProps {
  driveId?: string;
  drive?: DriveDocument | null;
  roundNumber?: string;
}

const StudentDataContent: React.FC<StudentDataContentProps> = ({
  driveId,
  drive,
  roundNumber,
}) => {
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [emptyState, setEmptyState] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<StudentFilterParams>({
    page: 1,
    limit: 10,
    driveId: driveId,
    // sortOrder: 'desc', // Default to highest rank first
    // sortBy: 'rank'
  });

  const [search, setSearch] = useState<string>('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  // Fetch students data
  const fetchStudents = useCallback(async () => {
    if (!driveId) return;

    setLoading(true);
    try {
      // Fixed API call - pass the params object directly instead of stringifying it
      const params: StudentFilterParams = {
        ...filters,
        // driveId,
        // search: search || undefined,
        // department: selectedDepartments.length > 0 ? selectedDepartments : undefined,
        // testBatch: selectedBatches.length > 0 ? selectedBatches : undefined
      };
      console.log(params, " paramskkkkk");
      const response = await getStudents(
        params.driveId || "default-drive-id",
        params.page,
        params.limit,
        {
          search: search !== undefined ? search : "",
          departments:
            selectedDepartments.length > 0 ? selectedDepartments : undefined,
          testBatches:
            selectedBatches.length > 0 ? selectedBatches : undefined,
        }
      );

      // Filter students based on roundNumber
      const filteredStudents = roundNumber
        ? response.data.filter(
            (student: Student) => student.currentRound === parseInt(roundNumber)
          )
        : response.data;

      setStudents(filteredStudents);
      setTotalStudents(response.total);
      setTotalPages(Math.ceil(response.total / filters.limit!));
      setEmptyState(response.total === 0);
      setLoading(false);
    } catch (err) {
      setError("Failed to load students");
      setLoading(false);
      console.error("Error fetching students:", err);
    }
  }, [
    driveId,
    filters,
    search,
    selectedDepartments,
    selectedBatches,
    roundNumber,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 500),
    [setSearch, setPage, setFilters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleSortChange = (sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortOrder, sortBy: 'aiRank' }));
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    setSelectedDepartments(prev => {
      if (checked) {
        return [...prev, department];
      } else {
        return prev.filter(d => d !== department);
      }
    });
  };

  const handleBatchChange = (batch: string, checked: boolean) => {
    setSelectedBatches(prev => {
      if (checked) {
        return [...prev, batch];
      } else {
        return prev.filter(b => b !== batch);
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedDepartments([]);
    setSelectedBatches([]);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilters(prev => ({ 
      ...prev, 
      page: 1,
      department: selectedDepartments.length > 0 ? selectedDepartments : undefined,
      testBatch: selectedBatches.length > 0 ? selectedBatches : undefined
    }));
    setShowFilter(false);
  };

  const handleAddManually = () => {
    setShowAddModal(true);
  };

  const handleImportData = () => {
    setShowImportModal(true);
  };
  
  const handleImportSuccess = () => {
    // Refresh data
    fetchStudents();
  };

  // Get unique departments and batches for filtering
  const departments = Array.from(new Set(students.map(student => student.department)));
  const batches = Array.from(new Set(students.map(student => student.testBatch)));

  // Render empty state
  if (emptyState && !loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">No student data yet</h2>
          <p className="text-gray-500 mb-8">Load student data in XLSX format to get started.</p>
          <div className="flex gap-4">
            <button
              onClick={handleAddManually}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Add manually
            </button>
            <button
              onClick={handleImportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Import data
            </button>
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && driveId && (
          <StudentImportModal
            isOpen={showImportModal}
            driveId={driveId}
            onClose={() => setShowImportModal(false)}
            onSuccess={handleImportSuccess}
          />
        )}

        {/* Add Student Modal */}
        {showAddModal && drive && driveId && (
          <AddStudentModal
            isOpen={showAddModal}
            driveId={driveId}
            driveName={drive.name}
            collegeId={drive.collegeId}
            collegeName={drive.collegeName}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleImportSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search and filter bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search" 
            onChange={handleSearchChange}
          />
          {search && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-4 w-4 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <button 
          onClick={handleFilterToggle}
          className="p-2.5 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 01-4.5 0m4.5 0a2.25 2.25 0 00-4.5 0M1 4h2.25m13.5 8H19m-2.25 0a2.25 2.25 0 01-4.5 0m4.5 0a2.25 2.25 0 00-4.5 0M1 12h10.75"/>
          </svg>
        </button>
        
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleAddManually}
            className="px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
          >
            Add student
          </button>
          <button
            onClick={handleImportData}
            className="px-3 py-2 border border-blue-600 bg-blue-600 text-sm rounded-md text-white hover:bg-blue-700"
          >
            Import data
          </button>
        </div>
      </div>
      
      {/* Student table */}
      {loading ? (
        <StudentTableSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Department</th>
                  <th scope="col" className="px-4 py-3">Registration no</th>
                  <th scope="col" className="px-4 py-3">Test batch</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">LinkedIn</th>
                  <th scope="col" className="px-4 py-3">Github</th>
                  <th scope="col" className="px-4 py-3">AI rank</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{student.name || 'N/A'}</td>
                    <td className="px-4 py-3">{student.department}</td>
                    <td className="px-4 py-3">{student.registrationNumber}</td>
                    <td className="px-4 py-3">{student.testBatch}</td>
                    <td className="px-4 py-3">{student.emailId}</td>
                    <td className="px-4 py-3">
                      {student.linkedInProfile ? (
                        <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {student.linkedInProfile.replace('https://linkedin.com/in/', '')}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {student.githubProfile ? (
                        <a href={student.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {student.githubProfile.replace('https://github.com/', '')}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">{student.aiScore?.total || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md mr-2 ${
                  page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show current page and adjacent pages
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md mx-1 ${
                      page === pageNum ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="mx-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-md mx-1 text-gray-700 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md ml-2 ${
                  page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Sort and filter</h3>
                <button 
                  onClick={handleFilterToggle}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mb-8">
                <h4 className="font-medium mb-3">Sort by</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      // checked={filters.sortOrder === 'asc'}
                      onChange={() => handleSortChange('asc')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Lowest rank first</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      // checked={filters.sortOrder === 'desc'}
                      onChange={() => handleSortChange('desc')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Highest rank first</span>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-medium mb-3">Filters</h4>
                
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Test batch</h5>
                  <div className="space-y-2">
                    {batches.map((batch) => (
                      <label key={batch} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBatches.includes(batch)}
                          onChange={(e) => handleBatchChange(batch, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Batch {batch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Departments</h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {departments.map((department) => (
                      <label key={department} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(department)}
                          onChange={(e) => handleDepartmentChange(department, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{department}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Import Modal */}
      {showImportModal && driveId && (
        <StudentImportModal
          isOpen={showImportModal}
          driveId={driveId}
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* Add Student Modal */}
      {showAddModal && drive && driveId && (
        <AddStudentModal
          isOpen={showAddModal}
          driveId={driveId}
          driveName={drive.name}
          collegeId={drive.collegeId}
          collegeName={drive.collegeName}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};

export default StudentDataContent;
