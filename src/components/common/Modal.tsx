import React, { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnClickOutside ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-hidden`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                    {description && (
                      <Dialog.Description className="text-sm text-gray-500 mt-1">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  {showCloseButton && (
                    <button 
                      onClick={onClose} 
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <div className="mt-6">
                  {children}
                </div>
                
                {footer && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    {footer}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export interface ModalFooterProps {
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  isConfirmLoading = false,
  isConfirmDisabled = false,
  className = '',
}) => {
  return (
    <div className={`flex justify-end space-x-3 ${className}`}>
      {onCancel && (
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isConfirmLoading}
        >
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button
          variant="primary"
          onClick={onConfirm}
          isLoading={isConfirmLoading}
          disabled={isConfirmDisabled || isConfirmLoading}
        >
          {confirmText}
        </Button>
      )}
    </div>
  );
};

export default Modal;
