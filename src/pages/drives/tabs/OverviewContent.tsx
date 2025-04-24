import React from 'react';
import { DriveDocument } from '../../../types';

interface OverviewContentProps {
  drive: DriveDocument | null;
}

const OverviewContent: React.FC<OverviewContentProps> = ({ drive }) => {
  if (!drive) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Drive information not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Drive Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Drive Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium">{drive.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Practice:</span>
              <span className="font-medium">{drive.practice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">{new Date(drive.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${drive.isCompleted ? 'text-gray-500' : 'text-green-500'}`}>
                {drive.isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Progress</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-600">Students enrolled</span>
                <span className="text-sm font-medium text-blue-600">{drive.studentCount || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-purple-600">Panels</span>
                <span className="text-sm font-medium text-purple-600">6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-green-600">Active round</span>
                <span className="text-sm font-medium text-green-600">{drive.activeRound || 1}/{drive.rounds?.length || 4}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(drive.activeRound || 1) / (drive.rounds?.length || 4) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SPOC Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Contact Information</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm text-gray-600">Primary SPOC</h5>
              <p className="font-medium">{drive.primarySpocName}</p>
              <p className="text-sm text-blue-600">{drive.primarySpocEmail}</p>
            </div>
            
            {drive.secondarySpocs && drive.secondarySpocs.length > 0 && (
              <div>
                <h5 className="text-sm text-gray-600">Secondary SPOCs</h5>
                {drive.secondarySpocs.map((spoc, index) => (
                  <div key={index} className="mt-1">
                    <p className="font-medium">{spoc.spocName}</p>
                    <p className="text-sm text-blue-600">{spoc.spocEmail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Rounds Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Rounds</h4>
          {drive.rounds && drive.rounds.length > 0 ? (
            <div className="space-y-3">
              {drive.rounds.map((round, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    (drive.activeRound || 1) > round.roundNumber
                      ? 'bg-green-100 text-green-700'
                      : (drive.activeRound || 1) === round.roundNumber
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {round.roundNumber}
                  </div>
                  <div>
                    <p className="font-medium">{round.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(round.startTime).toLocaleDateString()} - {new Date(round.endTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No rounds configured for this drive.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;