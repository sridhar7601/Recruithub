import React, { useState } from 'react';
import { createStudent } from '../../services/studentService';
import { CreateStudentDto } from '../../types/student';

interface AddStudentModalProps {
  driveId: string;
  driveName: string;
  collegeId: string;
  collegeName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ 
  driveId, 
  driveName, 
  collegeId, 
  collegeName, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<CreateStudentDto>({
    registrationNumber: '',
    emailId: '',
    name: '',
    department: '',
    testBatch: '1',
    collegeId,
    collegeName,
    driveId,
    driveName
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.registrationNumber) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    
    if (!formData.emailId) {
      newErrors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = 'Email is invalid';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await createStudent(formData);
      onSuccess();
    } catch (err: any) {
      console.error('Error creating student:', err);
      
      // Handle validation errors from API
      if (err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        
        Object.entries(err.response.data.errors).forEach(([key, messages]: [string, any]) => {
          apiErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        
        setErrors(apiErrors);
      } else {
        setErrors({
          form: err.response?.data?.message || 'An error occurred while creating the student'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add student</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="text-sm">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration number*
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.registrationNumber ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address*
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.emailId ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.emailId && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailId}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department*
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select department</option>
                  <option value="B.E - AI & DS">B.E - AI & DS</option>
                  <option value="BE - Computer Science Engineering">BE - Computer Science Engineering</option>
                  <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
                  <option value="B.E - Electronics and Communication Engineering">B.E - Electronics and Communication Engineering</option>
                  <option value="B.E - Mechanical Engineering">B.E - Mechanical Engineering</option>
                  <option value="B.E - Civil Engineering">B.E - Civil Engineering</option>
                  <option value="B.Tech - Biotechnology">B.Tech - Biotechnology</option>
                  <option value="B.Tech - Electrical and Electronics Engineering">B.Tech - Electrical and Electronics Engineering</option>
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              <div>
                <label htmlFor="testBatch" className="block text-sm font-medium text-gray-700 mb-1">
                  Test batch*
                </label>
                <select
                  id="testBatch"
                  name="testBatch"
                  value={formData.testBatch}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((batch) => (
                    <option key={batch} value={String(batch)}>
                      Batch {batch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub profile URL
                </label>
                <input
                  type="text"
                  id="githubProfile"
                  name="githubProfile"
                  value={formData.githubProfile || ''}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="linkedInProfile" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn profile URL
                </label>
                <input
                  type="text"
                  id="linkedInProfile"
                  name="linkedInProfile"
                  value={formData.linkedInProfile || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;