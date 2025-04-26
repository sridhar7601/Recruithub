import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Student, 
  StudentRound
} from '../../types';
import { getDriveById } from '../../services/driveService';
import Header from '../../components/layout/Header';
import { 
  ArrowLeftIcon,
  CogIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface RoundConfigItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const RoundsSettingsPage: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  
  // State
  const [driveName, setDriveName] = useState<string>('');
  const [roundConfigs, setRoundConfigs] = useState<RoundConfigItem[]>([
    {
      id: '1',
      name: 'Initial Screening',
      description: 'Basic candidate evaluation',
      isActive: true
    },
    {
      id: '2',
      name: 'Technical Round',
      description: 'In-depth technical assessment',
      isActive: true
    },
    {
      id: '3',
      name: 'HR Interview',
      description: 'Cultural fit and soft skills',
      isActive: true
    }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch drive details
  useEffect(() => {
    const fetchDriveDetails = async () => {
      if (!driveId) return;
      
      try {
        const drive = await getDriveById(driveId);
        setDriveName(drive.name);
      } catch (error) {
        console.error('Error fetching drive details:', error);
        setError('Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriveDetails();
  }, [driveId]);
  
  // Handle round configuration toggle
  const handleRoundToggle = (roundId: string) => {
    setRoundConfigs(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { ...round, isActive: !round.isActive }
          : round
      )
    );
  };
  
  // Handle add new round
  const handleAddRound = () => {
    const newRound: RoundConfigItem = {
      id: `${roundConfigs.length + 1}`,
      name: 'New Round',
      description: 'Custom round configuration',
      isActive: true
    };
    
    setRoundConfigs(prev => [...prev, newRound]);
  };
  
  // Handle remove round
  const handleRemoveRound = (roundId: string) => {
    setRoundConfigs(prev => prev.filter(round => round.id !== roundId));
  };
  
  // Handle round name change
  const handleRoundNameChange = (roundId: string, newName: string) => {
    setRoundConfigs(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { ...round, name: newName }
          : round
      )
    );
  };
  
  // Handle round description change
  const handleRoundDescriptionChange = (roundId: string, newDescription: string) => {
    setRoundConfigs(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { ...round, description: newDescription }
          : round
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Drive context bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/drives')}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Rounds Settings</h1>
              <p className="text-sm text-gray-500">{driveName}</p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="p-4 bg-blue-100 flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-blue-600" />
                Round Configurations
              </h3>
              <button 
                onClick={handleAddRound}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Round
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {roundConfigs.map(round => (
                <div key={round.id} className="p-4 flex items-center justify-between">
                  <div className="flex-grow mr-4">
                    <input 
                      type="text" 
                      value={round.name}
                      onChange={(e) => handleRoundNameChange(round.id, e.target.value)}
                      className="w-full text-lg font-medium text-gray-900 mb-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors"
                    />
                    <textarea 
                      value={round.description}
                      onChange={(e) => handleRoundDescriptionChange(round.id, e.target.value)}
                      className="w-full text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-colors resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={round.isActive}
                        onChange={() => handleRoundToggle(round.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-700">
                        {round.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                    
                    {roundConfigs.length > 1 && (
                      <button 
                        onClick={() => handleRemoveRound(round.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 text-sm text-gray-600">
              <p>
                <strong>Note:</strong> Changes to round configurations will affect future drives. 
                Existing drives will maintain their original round settings.
              </p>
            </div>
          </div>
        )}
        
        {/* Additional settings sections can be added here */}
      </main>
    </div>
  );
};

export default RoundsSettingsPage;
