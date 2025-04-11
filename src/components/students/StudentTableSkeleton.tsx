import React from 'react';

const StudentTableSkeleton: React.FC = () => {
  // Generate rows for the skeleton
  const rows = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="animate-pulse">
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
            {rows.map((row) => (
              <tr key={row} className="bg-white border-b">
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Skeleton Pagination */}
      <div className="flex items-center justify-end p-4">
        <div className="h-8 bg-gray-200 rounded w-16 mr-2"></div>
        <div className="h-8 bg-gray-200 rounded w-8 mx-1"></div>
        <div className="h-8 bg-gray-200 rounded w-8 mx-1"></div>
        <div className="h-8 bg-gray-200 rounded w-8 mx-1"></div>
        <div className="h-8 bg-gray-200 rounded w-16 ml-2"></div>
      </div>
    </div>
  );
};

export default StudentTableSkeleton;