import React, { useState } from 'react';
import { DriveDocument } from '../../../types';
import InlineRoundStudentTable from '../../../components/InlineRoundStudentTable';

interface RoundsContentProps {
  drive: DriveDocument | null;
}

const RoundsContent: React.FC<RoundsContentProps> = ({ drive }) => {
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  if (!drive) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Drive information not available.</p>
      </div>
    );
  }

  const rounds = drive.rounds || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Rounds</h3>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled
        >
          Add Round
        </button>
      </div>

      {rounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-lg font-medium mb-2">No rounds configured</h3>
          <p className="text-gray-500 mb-4">
            Configure rounds to organize your recruitment process.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {rounds.map((round, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    (drive.activeRound || 1) > round.roundNumber
                      ? 'bg-green-100 text-green-700'
                      : (drive.activeRound || 1) === round.roundNumber
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {round.roundNumber}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{round.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(round.startTime).toLocaleDateString()} - {new Date(round.endTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  (drive.activeRound || 1) > round.roundNumber
                    ? 'bg-green-100 text-green-700'
                    : (drive.activeRound || 1) === round.roundNumber
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {(drive.activeRound || 1) > round.roundNumber
                    ? 'Completed'
                    : (drive.activeRound || 1) === round.roundNumber
                    ? 'Active'
                    : 'Upcoming'}
                </span>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Evaluation Criteria</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {round.evaluationCriteria && round.evaluationCriteria.map((criteria, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{criteria.name}</span>
                          {criteria.isRequired && (
                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{criteria.description}</p>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {criteria.ratingType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Edit Round
                </button>
                {(drive.activeRound || 1) === round.roundNumber && (
                  <button
                    // onClick={() => {
                    //   setSelectedRound(round.roundNumber);
                    // }}
                    className="px-3 py-1.5 text-sm bg-blue-600 border border-blue-600 rounded text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={(drive.activeRound || 1) !== round.roundNumber}
                  >
                    View Students
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRound && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">
            Students in Round {selectedRound}
          </h4>
          <InlineRoundStudentTable
            driveId={drive.driveId}
            roundNumber={selectedRound.toString()}
          />
        </div>
      )}
    </div>
  );
};

export default RoundsContent;
