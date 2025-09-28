import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Simple toast notification component
const SimpleToast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '400px',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease-out'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          color: '#92400e'
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af'
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534'
        };
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={getStyles()}>
        {getIcon()}
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

// Toast manager hook
export const useSimpleToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, 'success');
  const showError = (message) => addToast(message, 'error');
  const showWarning = (message) => addToast(message, 'warning');
  const showInfo = (message) => addToast(message, 'info');

  const ToastContainer = () => (
    <div>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            bottom: `${20 + (index * 80)}px`,
            right: '20px',
            zIndex: 9999
          }}
        >
          <SimpleToast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  };
};

export default SimpleToast;

