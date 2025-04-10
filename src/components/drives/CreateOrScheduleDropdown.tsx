import React from 'react';

interface CreateOrScheduleDropdownProps {
  onClose: () => void;
  onCreateDrive?: () => void;
  onScheduleDrive?: () => void;
}

const CreateOrScheduleDropdown: React.FC<CreateOrScheduleDropdownProps> = ({
  onClose,
  onCreateDrive,
  onScheduleDrive
}) => {
  const handleCreateDrive = () => {
    if (onCreateDrive) {
      onCreateDrive();
    }
    onClose();
  };

  const handleScheduleDrive = () => {
    if (onScheduleDrive) {
      onScheduleDrive();
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <ul className="py-1">
        <li>
          <button
            onClick={handleCreateDrive}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            id="create-drive-button"
          >
            Create drive
          </button>
        </li>
        <li>
          <button
            onClick={handleScheduleDrive}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            id="schedule-drive-button"
          >
            Schedule drive
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CreateOrScheduleDropdown;