import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Student, 
  StudentRound
} from '../../types';
import { getDriveById } from '../../services/driveService';
import { getStudentsByRound } from '../../services/roundService';
import { 
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Extend Student type to include onlineCodingPlatformUrls
interface ExtendedStudent extends Student {
  onlineCodingPlatformUrls?: string;
}

type SortableKey = 'name' | 'registrationNumber';

const Round1SettingsPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  
  // State
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: SortableKey, direction: 'asc' | 'desc'}>({
    key: 'name',
    direction: 'asc'
  });
  
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
  
  // Handle link again action
  const handleLinkAgain = () => {
    alert(`Linking ${selectedStudents.length} students again`);
  };
  
  // Handle move to round 2 action
  const handleMoveToRound2 = () => {
    alert(`Moving ${selectedStudents.length} students to Round 2`);
  };
  
  // Filter students by search query
  const filterStudents = (students: ExtendedStudent[]): ExtendedStudent[] => {
    if (!searchQuery) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student => 
      (student.name?.toLowerCase().includes(query)) ||
      student.registrationNumber.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.emailId.toLowerCase().includes(query)
    );
  };
  
  // Sorting function
  const sortedStudents = React.useMemo(() => {
    let sortableStudents = [...filterStudents(students)];
    
    const sortFunctions: Record<SortableKey, (a: ExtendedStudent, b: ExtendedStudent) => number> = {
      name: (a, b) => (a.name || '').localeCompare(b.name || ''),
      registrationNumber: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber)
    };

    sortableStudents.sort((a, b) => {
      const sortResult = sortFunctions[sortConfig.key](a, b);
      return sortConfig.direction === 'asc' ? sortResult : -sortResult;
    });

    return sortableStudents;
  }, [students, sortConfig, searchQuery]);
  
  // Handle sorting
  const handleSort = (key: SortableKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="search" 
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleLinkAgain}
            disabled={selectedStudents.length === 0}
            className="px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Link Again
          </button>
          <button
            onClick={handleMoveToRound2}
            disabled={selectedStudents.length === 0}
            className="px-3 py-2 border border-blue-600 bg-blue-600 text-sm rounded-md text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Move to Round 2
          </button>
        </div>
      </div>
      
      {/* Student table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  onChange={() => {
                    if (selectedStudents.length === students.length) {
                      setSelectedStudents([]);
                    } else {
                      setSelectedStudents(students.map(student => student.studentId));
                    }
                  }}
                  checked={selectedStudents.length === students.length}
                />
              </th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Department</th>
              <th scope="col" className="px-4 py-3">Registration no</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Phone</th>
              <th scope="col" className="px-4 py-3">LinkedIn</th>
              <th scope="col" className="px-4 py-3">Github</th>
              <th scope="col" className="px-4 py-3">Resume</th>
              <th scope="col" className="px-4 py-3">Coding Platform</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr 
                key={student.studentId} 
                className="bg-white border-b hover:bg-gray-50"
                onClick={() => handleStudentSelect(student.studentId)}
              >
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedStudents.includes(student.studentId)}
                    onChange={() => handleStudentSelect(student.studentId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{student.name || 'N/A'}</td>
                <td className="px-4 py-3">{student.department}</td>
                <td className="px-4 py-3">{student.registrationNumber}</td>
                <td className="px-4 py-3">{student.emailId}</td>
                <td className="px-4 py-3">{student.phoneNumber}</td>
                <td className="px-4 py-3">
                  {student.linkedInProfile ? (
                    <a 
                      href={student.linkedInProfile} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {student.githubProfile ? (
                    <a 
                      href={student.githubProfile} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {student.resumeUrl ? (
                    <a 
                      href={student.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {student.onlineCodingPlatformUrls ? (
                    <a 
                      href={student.onlineCodingPlatformUrls} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open
                    </a>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Round1SettingsPage;
