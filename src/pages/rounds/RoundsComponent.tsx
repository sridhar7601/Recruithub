import React from 'react';

interface RoundsComponentProps {
  driveId?: string;
}

const RoundsComponent: React.FC<RoundsComponentProps> = ({ driveId }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Rounds 2-4</h2>
      <p className="text-gray-600">
        This is a placeholder for Rounds 2-4 content. In a real implementation, this would include:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Additional interview rounds</li>
        <li>Technical assessments</li>
        <li>HR rounds</li>
        <li>Final selection process</li>
      </ul>
    </div>
  );
};

export default RoundsComponent;