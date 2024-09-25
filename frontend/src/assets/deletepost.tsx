import React from 'react';
import { Button } from '@/components/ui/button';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 border-b-[1px] border-gray-300">
          Delete this article?
        </h2>
        <p className="mb-4 ">
          This is a destructive action that cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            className="bg-gray-500 text-white rounded-full hover:bg-gray-500/80"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="bg-red-500 text-white rounded-full hover:bg-red-500/80"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
