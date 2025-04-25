import React, { useState, useEffect, useCallback } from 'react';
import { getStudents } from '../services/studentService';
import { Student, StudentFilterParams } from '../types/student';
import { DriveDocument } from '../types';
import { debounce } from 'lodash';
import StudentTableSkeleton from '../components/students/StudentTableSkeleton';

interface RoundStudentTableProps {
  driveId?: string;
  roundNumber?: string;
}

const RoundStudentTable: React.FC<RoundStudentTableProps> = ({
  driveId,
  roundNumber,
}) => {
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [emptyState, setEmptyState] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(0);

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

  // Get unique departments and batches for filtering
  const departments = Array.from(new Set(students.map(student => student.department)));
  const batches = Array.from(new Set(students.map(student => student.testBatch)));

  return (
    <div className="p-4">
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
    </div>
  );
};

export default RoundStudentTable;
