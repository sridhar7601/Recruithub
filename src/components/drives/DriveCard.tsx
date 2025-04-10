import React from 'react';
import { DriveDocument } from '../../types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface DriveCardProps {
  drive: DriveDocument;
  onTogglePin?: (driveId: string, isPinned: boolean) => void;
  onCardClick?: (driveId: string) => void;
}

const DriveCard: React.FC<DriveCardProps> = ({ drive, onTogglePin, onCardClick }) => {
  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(drive.driveId, !drive.isPinned);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(drive.driveId);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold">{drive.name}</h3>
          <p className="text-sm text-gray-600">{drive.collegeName}</p>
        </div>
        <button onClick={handlePinClick} className="text-gray-400 hover:text-yellow-500">
          {drive.isPinned ? (
            <StarIcon className="h-5 w-5 text-yellow-500" />
          ) : (
            <StarIconOutline className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-blue-600">Students enrolled</span>
          <span className="font-semibold text-blue-600">{drive.studentCount || 0}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-purple-600">Panels</span>
          <span className="font-semibold text-purple-600">6</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-green-600">Active round</span>
          <span className="font-semibold text-green-600">{drive.activeRound || 1}</span>
        </div>
      </div>
    </div>
  );
};

export default DriveCard;