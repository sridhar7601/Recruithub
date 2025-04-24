import React from 'react';

interface RoundOneComponentProps {
  driveId?: string;
}

const RoundOneComponent: React.FC<RoundOneComponentProps> = ({ driveId }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Round 1</h2>
      <p className="text-gray-600">
        This is a placeholder for Round 1 content. In a real implementation, this would include:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Student assignments to panels</li>
        <li>Interview scheduling</li>
        <li>Evaluation forms</li>
        <li>Status tracking</li>
      </ul>
    </div>
  );
};

export default RoundOneComponent;