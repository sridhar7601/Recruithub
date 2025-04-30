import React, { useState, useEffect, useCallback } from 'react';
import { getStudents } from '../../services/studentService';
import { Student, StudentFilterParams } from '../../types/student';
import { DriveDocument } from '../../types/drives';
import { debounce } from 'lodash';
import StudentTableSkeleton from '../../components/students/StudentTableSkeleton';
import { Table, TableColumn, Pagination } from '../../components/common';

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
  });

  const [search, setSearch] = useState<string>('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  // Fetch students data
  const fetchStudents = useCallback(async () => {
    if (!driveId) return;

    setLoading(true);
    try {
      const params: StudentFilterParams = {
        ...filters,
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

  // Define table columns
  const columns: TableColumn<Student>[] = [
    {
      header: 'Name',
      accessor: (student) => (
        <span className="font-medium text-gray-900">{student.name || 'N/A'}</span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Registration no',
      accessor: 'registrationNumber',
    },
    {
      header: 'Test batch',
      accessor: 'testBatch',
    },
    {
      header: 'Email',
      accessor: 'emailId',
    },
    {
      header: 'LinkedIn',
      accessor: (student) => (
        student.linkedInProfile ? (
          <a href={student.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {student.linkedInProfile.replace('https://linkedin.com/in/', '')}
          </a>
        ) : 'N/A'
      ),
    },
    {
      header: 'Github',
      accessor: (student) => (
        student.githubProfile ? (
          <a href={student.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {student.githubProfile.replace('https://github.com/', '')}
          </a>
        ) : 'N/A'
      ),
    },
    {
      header: 'AI rank',
      accessor: (student) => student.aiScore?.total || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      {loading ? (
        <StudentTableSkeleton />
      ) : (
        <>
          <Table
            columns={columns}
            data={students}
            keyExtractor={(student) => student.studentId}
            isLoading={loading}
            emptyMessage="No students found"
          />
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoundStudentTable;
