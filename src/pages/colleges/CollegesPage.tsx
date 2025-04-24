import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // or /solid

import { getColleges, getCollegeStats, createCollege } from '../../services/collegeService';
import { CollegeResponseDto } from '../../types';
// import Navbar from '../../components/common/Navbar';
import Header from '../../components/layout/Header';

// Sample college images for demonstration
const collegeImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2000&auto=format&fit=crop'
];

interface CollegeWithStats extends CollegeResponseDto {
  completedDrives: number;
  studentsHired: number;
  activeStatus: 'Active' | 'Inactive';
  imageUrl: string;
}

const CollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<CollegeWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCollegeName, setNewCollegeName] = useState<string>('');
  const [newCollegeLocation, setNewCollegeLocation] = useState<string>('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await getColleges(1, 100); // Get up to 100 colleges
      
      // Fetch stats for each college and add image URLs
      const collegesWithStats = await Promise.all(
        response.items.map(async (college, index) => {
          const stats = await getCollegeStats(college.collegeId);
          return {
            ...college,
            ...stats,
            imageUrl: collegeImages[index % collegeImages.length]
          };
        })
      );
      
      setColleges(collegesWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setLoading(false);
    }
  };

  const handleAddCollege = async () => {
    if (!newCollegeName || !newCollegeLocation) return;
    
    try {
      await createCollege(newCollegeName, newCollegeLocation);
      setShowAddModal(false);
      setNewCollegeName('');
      setNewCollegeLocation('');
      fetchColleges(); // Refresh the list
    } catch (error) {
      console.error('Error creating college:', error);
    }
  };

  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All colleges</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md shadow-sm"
              onClick={() => setShowAddModal(true)}
            >
              Add college
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredColleges.map((college) => (
              <div key={college.collegeId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={college.imageUrl} 
                    alt={college.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{college.name}</h3>
                  <p className="text-gray-600 mb-4">{college.city}</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Completed drives</p>
                      <p className="font-bold text-lg">{college.completedDrives}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Students hired</p>
                      <p className="font-bold text-lg">{college.studentsHired}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Drive</p>
                      <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                        college.activeStatus === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {college.activeStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add a college</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              
              <p className="mb-4">Enter college name and location.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College name
                </label>
                <input
                  type="text"
                  placeholder="SRM Institute of Science and Technology"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCollegeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCollegeName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College location
                </label>
                <input
                  type="text"
                  placeholder="Mylapore, Chennai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCollegeLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCollegeLocation(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCollege}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegesPage;
