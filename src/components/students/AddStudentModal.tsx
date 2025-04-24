import React, { useState } from 'react';
import { createStudent } from '../../services/studentService';
import { CreateStudentDto } from '../../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driveId: string;
  driveName: string;
  collegeId: string;
  collegeName: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  driveId,
  driveName,
  collegeId,
  collegeName
}) => {
  const [formData, setFormData] = useState<Partial<CreateStudentDto>>({
    registrationNumber: '',
    emailId: '',
    name: '',
    department: '',
    testBatch: '1',
    driveId,
    driveName,
    collegeId,
    collegeName
  });

  // Prefilled fields
  const prefilledFields = {
    driveId,
    driveName,
    collegeId,
    collegeName
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.registrationNumber || !formData.emailId || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Combine formData with prefilledFields
      const studentData = {
        ...formData,
        ...prefilledFields
      };
      await createStudent(studentData as CreateStudentDto);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating student:', err);
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add Student</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="emailId" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    id="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="B.E - AI & DS">B.E - AI & DS</option>
                    <option value="BE - Computer Science Engineering">BE - Computer Science Engineering</option>
                    <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
                    <option value="B.E - Electronics and Communication Engineering">B.E - Electronics and Communication Engineering</option>
                    <option value="B.E - Mechanical Engineering">B.E - Mechanical Engineering</option>
                    <option value="B.E - Civil Engineering">B.E - Civil Engineering</option>
                    <option value="B.Tech - Biotechnology">B.Tech - Biotechnology</option>
                    <option value="B.Tech - Electrical and Electronics Engineering">B.Tech - Electrical and Electronics Engineering</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="testBatch" className="block text-sm font-medium text-gray-700">
                    Test Batch
                  </label>
                  <select
                    name="testBatch"
                    id="testBatch"
                    value={formData.testBatch}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="1">Batch 1</option>
                    <option value="2">Batch 2</option>
                    <option value="3">Batch 3</option>
                    <option value="4">Batch 4</option>
                  </select>
                </div>

                {/* Prefilled Fields */}
                {Object.entries(prefilledFields).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={key}
                      id={key}
                      value={value}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 sm:text-sm"
                    />
                  </div>
                ))}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
