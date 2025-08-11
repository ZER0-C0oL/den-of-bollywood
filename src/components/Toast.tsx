import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Duration in milliseconds
  type?: 'info' | 'success' | 'warning' | 'error';
}

const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
  type = 'info'
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        // Wait for animation to complete before calling onClose
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`
          px-4 py-3 rounded-lg border shadow-lg max-w-sm
          transform transition-all duration-300 ease-in-out
          ${isShowing ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          ${getToastStyles()}
        `}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={() => {
              setIsShowing(false);
              setTimeout(onClose, 300);
            }}
            className="ml-3 text-lg leading-none hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
