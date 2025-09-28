import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after mount
    setTimeout(() => setIsAnimating(true), 10);

    // Auto-close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionClasses()}
        transition-all duration-300 ease-in-out
        ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <div
        className={`
          ${getBackgroundColor()}
          ${getTextColor()}
          border rounded-lg shadow-lg p-4
          flex items-start space-x-3
        `}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 ml-2 p-1 rounded-md
            hover:bg-black hover:bg-opacity-10
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${type === 'success' ? 'focus:ring-green-500' : ''}
            ${type === 'error' ? 'focus:ring-red-500' : ''}
            ${type === 'warning' ? 'focus:ring-yellow-500' : ''}
            ${type === 'info' ? 'focus:ring-blue-500' : ''}
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast container component to manage multiple toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * -80}px)`
          }}
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={toast.position}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      position: options.position || 'bottom-right'
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, options) => addToast(message, 'success', options);
  const showError = (message, options) => addToast(message, 'error', options);
  const showWarning = (message, options) => addToast(message, 'warning', options);
  const showInfo = (message, options) => addToast(message, 'info', options);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
  };
};

export default ToastNotification;

