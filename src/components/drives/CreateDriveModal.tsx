import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CreateDriveDto, CollegeResponseDto } from '../../types';
import { getColleges } from '../../services/collegeService';
import { getAvailableSpocs, SpocDto } from '../../services/panelService';

interface CreateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (driveData: CreateDriveDto) => void;
}

const CreateDriveModal: React.FC<CreateDriveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [colleges, setColleges] = useState<CollegeResponseDto[]>([]);
  const [spocs, setSpocs] = useState<SpocDto[]>([]);
  const [loading, setLoading] = useState({
    colleges: false,
    spocs: false,
    submit: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<Partial<CreateDriveDto>>({
    practice: 'Application Development',
    role: 'Associate Engineer',
    name: '',
    collegeId: '',
    collegeName: '',
    startDate: new Date().toISOString(),
    primarySpocId: '',
    primarySpocEmail: '',
    primarySpocName: '',
  });
  
  // Fetch colleges and SPOCs on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      
      // Fetch colleges
      try {
        setLoading(prev => ({ ...prev, colleges: true }));
        const response = await getColleges(1, 100);
        setColleges(response.items);
      } catch (error) {
        console.error('Failed to fetch colleges:', error);
      } finally {
        setLoading(prev => ({ ...prev, colleges: false }));
      }
      
      // Fetch SPOCs
      try {
        setLoading(prev => ({ ...prev, spocs: true }));
        const availableSpocs = await getAvailableSpocs();
        setSpocs(availableSpocs);
      } catch (error) {
        console.error('Failed to fetch SPOCs:', error);
      } finally {
        setLoading(prev => ({ ...prev, spocs: false }));
      }
    };
    
    fetchData();
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name) {
      newErrors.name = 'Drive name is required';
    }
    
    if (!formData.collegeId) {
      newErrors.collegeId = 'College selection is required';
    }
    
    if (!formData.primarySpocId) {
      newErrors.primarySpocId = 'SPOC selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Special handling for college selection
    if (name === 'collegeSelect' && value) {
      const selectedCollege = colleges.find(college => college.collegeId === value);
      if (selectedCollege) {
        setFormData({
          ...formData,
          collegeId: selectedCollege.collegeId,
          collegeName: selectedCollege.name
        });
      }
      return;
    }
    
    // Special handling for SPOC selection
    if (name === 'spocSelect' && value) {
      const selectedSpoc = spocs.find(spoc => spoc.employeeId === value);
      if (selectedSpoc) {
        setFormData({
          ...formData,
          primarySpocId: selectedSpoc.uuid, // Use UUID instead of employeeId
          primarySpocEmail: selectedSpoc.emailId,
          primarySpocName: selectedSpoc.name
        });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      
      const completeFormData: CreateDriveDto = {
        ...formData as any,
        startDate:"2025-06-15T09:00:00Z", // Example date, replace with actual date
      };
      
      await onSubmit(completeFormData);
    } catch (error) {
      console.error('Failed to create drive:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create drive. Please try again.'
      }));
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-lg font-semibold">Create new drive</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Enter a drive name and select a college to begin.
                </Dialog.Description>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="practice" className="block text-sm font-medium text-gray-700">Practice</label>
                <select
                  id="practice"
                  name="practice"
                  value={formData.practice}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="Application Development">AppDev</option>
                  <option value="DevOps">DevOps</option>
                  <option value="PMO">PMO</option>
                  <option value="BaUX">BaUX</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="Associate Engineer">Associate engineer</option>
                  <option value="Business Analyst">Business Analyst</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Drive name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Stella Maris Drive 2025"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="collegeSelect" className="block text-sm font-medium text-gray-700">College name</label>
                <select
                  id="collegeSelect"
                  name="collegeSelect"
                  value={formData.collegeId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="">Select a college</option>
                  {colleges.map(college => (
                    <option key={college.collegeId} value={college.collegeId}>
                      {college.name}
                    </option>
                  ))}
                </select>
                {loading && <p className="text-sm text-gray-500 mt-1">Loading colleges...</p>}
              </div>
              
              <div>
                <label htmlFor="spocSelect" className="block text-sm font-medium text-gray-700">SPOC</label>
                <div className="relative">
                  <select
                    id="spocSelect"
                    name="spocSelect"
                    value={formData.primarySpocId || ''}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.primarySpocId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none sm:text-sm`}
                  >
                    <option value="">Select a SPOC</option>
                    {spocs.map(spoc => (
                      <option key={spoc.employeeId} value={spoc.employeeId}>
                        {spoc.name} | {spoc.emailId}
                      </option>
                    ))}
                  </select>
                  {errors.primarySpocId && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {loading.spocs && <p className="text-sm text-gray-500 mt-1">Loading SPOCs...</p>}
                {errors.primarySpocId && <p className="mt-2 text-sm text-red-600">{errors.primarySpocId}</p>}
              </div>
              
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading.submit}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.submit}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading.submit ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateDriveModal;
