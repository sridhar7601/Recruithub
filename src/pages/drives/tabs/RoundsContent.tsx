import React, { useState } from 'react';
import { DriveDocument } from '../../../types/drives';
import InlineRoundStudentTable from '../../../components/rounds/InlineRoundStudentTable';
import { Card, Badge, Button } from '../../../components/common';

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

  // Helper function to determine round status
  const getRoundStatus = (roundNumber: number) => {
    const activeRound = drive.activeRound || 1;
    
    if (activeRound > roundNumber) {
      return { text: 'Completed', variant: 'success' as const };
    } else if (activeRound === roundNumber) {
      return { text: 'Active', variant: 'primary' as const };
    } else {
      return { text: 'Upcoming', variant: 'default' as const };
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Rounds</h3>
        <Button
          variant="primary"
          disabled
        >
          Add Round
        </Button>
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
          {rounds.map((round, index) => {
            const status = getRoundStatus(round.roundNumber);
            
            return (
              <Card key={index}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      status.variant === 'success'
                        ? 'bg-green-100 text-green-700'
                        : status.variant === 'primary'
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
                  <Badge
                    variant={status.variant}
                    rounded="full"
                  >
                    {status.text}
                  </Badge>
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
                              <Badge
                                variant="danger"
                                size="sm"
                                className="ml-2"
                              >
                                Required
                              </Badge>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{criteria.description}</p>
                          </div>
                          <Badge
                            variant="default"
                            size="sm"
                          >
                            {criteria.ratingType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled
                  >
                    Edit Round
                  </Button>
                  {(drive.activeRound || 1) === round.roundNumber && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedRound(round.roundNumber)}
                      disabled={(drive.activeRound || 1) !== round.roundNumber}
                    >
                      View Students
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
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
