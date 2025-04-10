import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CreateDriveDto, CollegeResponseDto, SecondarySpocDto } from '../../types';
import { getColleges } from '../../services/collegeService';

interface ScheduleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (driveData: CreateDriveDto & { members: string[] }) => void;
}

const ScheduleDriveModal: React.FC<ScheduleDriveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [colleges, setColleges] = useState<CollegeResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateDriveDto> & { date: string, members: string[] }>({
    practice: 'Application Development',
    role: 'Associate Engineer',
    name: '',
    collegeId: '',
    collegeName: '',
    date: new Date().toISOString().split('T')[0],
    primarySpocId: '',
    primarySpocEmail: '',
    primarySpocName: '',
    members: []
  });
  
  // Mock members list for demo
  const availableMembers = [
    { id: '1', name: 'Nirmalmahesh Subramani', email: 'nirmalmahesh@example.com' },
    { id: '2', name: 'Menaka Karachiyappakumar', email: 'menaka@example.com' },
    { id: '3', name: 'Sridhar Krishnamoorthy', email: 'sridhar@example.com' },
    { id: '4', name: 'Rajesh Kumar', email: 'rajesh@example.com' },
    { id: '5', name: 'Priya Sharma', email: 'priya@example.com' },
  ];
  
  // Fetch colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await getColleges(1, 100);
        setColleges(response.items);
      } catch (error) {
        console.error('Failed to fetch colleges:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchColleges();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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
    
    // Special handling for members selection
    if (name === 'membersSelect' && e.target.multiple) {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData({
        ...formData,
        members: selectedOptions
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create secondary SPOCs from selected members
    const secondarySpocs: SecondarySpocDto[] = formData.members.map(memberId => {
      const member = availableMembers.find(m => m.id === memberId);
      return {
        spocId: memberId,
        spocName: member?.name || '',
        spocEmail: member?.email || ''
      };
    });
    
    // Mock SPOC data for demo purposes - in a real app, this would come from a selection
    const mockSpoc = {
      primarySpocId: "123e4567-e89b-12d3-a456-426614174000",
      primarySpocEmail: "primary.spoc@example.com",
      primarySpocName: formData.primarySpocName || "Nirmalmahesh Subramani"
    };
    
    const completeFormData: CreateDriveDto & { members: string[] } = {
      ...formData as any,
      ...mockSpoc,
      startDate: new Date(formData.date || '').toISOString(),
      secondarySpocs
    };
    
    onSubmit(completeFormData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <Dialog.Title className="text-lg font-semibold">Schedule new drive</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Add below details and notify panel members. By scheduling, you are choosing to email panel members accordingly.
                </Dialog.Description>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
              </div>
              
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
                <label htmlFor="membersSelect" className="block text-sm font-medium text-gray-700">Members</label>
                <select
                  id="membersSelect"
                  name="membersSelect"
                  multiple
                  value={formData.members}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  style={{ height: '100px' }}
                >
                  {availableMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ScheduleDriveModal;