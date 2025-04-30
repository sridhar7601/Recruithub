import React from 'react';
import RoundStudentTable from './RoundStudentTable';

interface InlineRoundStudentTableProps {
  driveId?: string;
  roundNumber?: string;
}

const InlineRoundStudentTable: React.FC<InlineRoundStudentTableProps> = ({
  driveId,
  roundNumber,
}) => {
  return (
    <div>
      <RoundStudentTable driveId={driveId} roundNumber={roundNumber} />
    </div>
  );
};

export default InlineRoundStudentTable;
