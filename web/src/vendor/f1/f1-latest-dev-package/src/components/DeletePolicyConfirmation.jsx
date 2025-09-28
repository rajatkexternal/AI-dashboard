import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { buttonStyles, typography } from '../styles/globalStyles.js';

const DeletePolicyConfirmation = ({ policy, onConfirm, onCancel, assignedDevices = [] }) => {
  const hasAssignedDevices = assignedDevices.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="bg-white rounded-md shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h2 id="delete-dialog-title" style={typography.h3}>
              {hasAssignedDevices ? 'Cannot Delete Policy' : 'Confirm Delete Policy'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {hasAssignedDevices ? (
            <div>
              <p className="text-gray-700 mb-4">
                The policy <strong>"{policy.name}"</strong> cannot be deleted because it is currently assigned to {assignedDevices.length} FIDO device{assignedDevices.length > 1 ? 's' : ''}.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Assigned Devices:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {assignedDevices.slice(0, 5).map((device, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      {device.name || device.id} ({device.type || 'Unknown Type'})
                    </li>
                  ))}
                  {assignedDevices.length > 5 && (
                    <li className="text-gray-600 font-medium">
                      ... and {assignedDevices.length - 5} more device{assignedDevices.length - 5 > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                To delete this policy, first unassign it from all FIDO devices or assign the devices to a different policy.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the policy <strong>"{policy.name}"</strong>?
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-800">
                  <strong>Warning:</strong> This action cannot be undone. The policy will be permanently removed from the system.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            style={buttonStyles.secondary}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {hasAssignedDevices ? 'Close' : 'Cancel'}
          </button>
          
          {!hasAssignedDevices && (
            <button
              onClick={() => onConfirm(policy)}
              style={{
                ...buttonStyles.primary,
                backgroundColor: '#dc2626', // Red background for delete action
                borderColor: '#dc2626'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Policy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletePolicyConfirmation;

