import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ type = 'error', message, onClose, className = '' }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border border-red-200 text-red-800',
          icon: 'text-red-600',
          IconComponent: AlertCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          IconComponent: AlertTriangle
        };
      case 'success':
        return {
          container: 'bg-green-50 border border-green-200 text-green-800',
          icon: 'text-green-600',
          IconComponent: CheckCircle
        };
      default:
        return {
          container: 'bg-blue-50 border border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          IconComponent: AlertCircle
        };
    }
  };

  const { container, icon, IconComponent } = getStyles();

  return (
    <div className={`rounded-lg p-4 ${container} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <IconComponent className={`w-5 h-5 ${icon} mr-3 flex-shrink-0`} />
          <span className="text-sm">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${icon} hover:opacity-75 ml-4 flex-shrink-0`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

