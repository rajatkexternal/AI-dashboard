import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, Key, Settings, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { colors, typography, spacing, buttonStyles, inputStyles } from '../styles/globalStyles.js';

const PolicyCreation = ({ onBack, selectedPolicy, onSave }) => {
  const [policyType, setPolicyType] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  
  // User PIN field
  const [userPin, setUserPin] = useState('');
  
  // Admin features (only reset management remains)
  const [enableResetManagement, setEnableResetManagement] = useState(false);
  const [minPinLength, setMinPinLength] = useState(4);
  
  // Managed Policy Additional Features
  const [adminPin, setAdminPin] = useState('');
  const [whitelistedWebsites, setWhitelistedWebsites] = useState('');
  const [managedPinMinLength, setManagedPinMinLength] = useState(6);

  // Determine if we're in edit mode
  const isEditMode = selectedPolicy && selectedPolicy.id;

  // Initialize form when editing a policy
  useEffect(() => {
    if (selectedPolicy) {
      setPolicyType(selectedPolicy.type || '');
      setPolicyName(selectedPolicy.name || '');
      setDescription(selectedPolicy.description || '');
      setUserPin(selectedPolicy.userPin || '');
      
      if (selectedPolicy.managedFeatures) {
        setAdminPin(selectedPolicy.managedFeatures.adminPin || '');
        setWhitelistedWebsites(selectedPolicy.managedFeatures.whitelistedWebsites ? selectedPolicy.managedFeatures.whitelistedWebsites.join(', ') : '');
        setManagedPinMinLength(selectedPolicy.managedFeatures.userPinMinLength || 6);
        setEnableResetManagement(selectedPolicy.managedFeatures.enableResetManagement || false);
        setMinPinLength(selectedPolicy.managedFeatures.minPinLength || 4);
      } else if (selectedPolicy.optionalFeatures) {
        setAdminPin(selectedPolicy.optionalFeatures.adminPin || '');
        setWhitelistedWebsites(selectedPolicy.optionalFeatures.whitelistedWebsites ? selectedPolicy.optionalFeatures.whitelistedWebsites.join(', ') : '');
        setEnableResetManagement(selectedPolicy.optionalFeatures.enableResetManagement || false);
        setMinPinLength(selectedPolicy.optionalFeatures.minPinLength || 4);
      }
    }
  }, [selectedPolicy]);

  const handleSave = () => {
    const policy = {
      name: policyName,
      type: policyType,
      description,
      userPin: userPin
    };

    // When editing, always create a new policy (Save As New Policy)
    if (isEditMode) {
      policy.id = Date.now(); // Generate new ID for the new policy
      policy.createdAt = new Date().toISOString();
      policy.status = 'Active';
    }

    if (policyType === 'managed') {
      policy.managedFeatures = {
        adminPin,
        whitelistedWebsites: whitelistedWebsites.split(',').map(site => site.trim()).filter(site => site),
        userPinMinLength: managedPinMinLength,
        enableResetManagement,
        minPinLength
      };
    }

    if (policyType === 'generic') {
      policy.optionalFeatures = {
        adminPin: adminPin || null,
        whitelistedWebsites: whitelistedWebsites ? whitelistedWebsites.split(',').map(site => site.trim()).filter(site => site) : [],
        enableResetManagement,
        minPinLength
      };
    }

    console.log(isEditMode ? 'Saving as new policy:' : 'Creating new policy:', policy);
    
    if (onSave) {
      onSave(policy, isEditMode);
    } else {
      alert(isEditMode ? 'Policy saved as new policy successfully!' : 'Policy created successfully!');
      onBack();
    }
  };

  const getPolicyTypeDescription = (type) => {
    switch (type) {
      case 'generic':
        return 'Recommended for Thales and Yubikey devices for standard FIDO support. Provides flexible configuration options for mixed device environments.';
      case 'managed':
        return 'Recommended for Thales devices with additional enterprise features that go beyond the standard FIDO features. Requires 16-character Admin PIN for enhanced security controls.';
      default:
        return 'Select a policy type to see its description and available features.';
    }
  };

  const isFormValid = () => {
    // Policy type is mandatory
    if (!policyType) return false;
    
    // Policy name is required
    if (!policyName.trim()) return false;
    
    // User PIN validation (4-6 characters)
    if (!userPin || userPin.length < 4 || userPin.length > 6) return false;
    
    // Minimum PIN length validation (4-63 characters)
    if (!minPinLength || minPinLength < 4 || minPinLength > 63) return false;
    
    // Admin PIN validation for managed policy
    if (policyType === 'managed' && (!adminPin || adminPin.length !== 16)) return false;
    
    // Admin PIN validation for generic policy (optional but if provided must be 16 chars)
    if (policyType === 'generic' && adminPin && adminPin.length > 0 && adminPin.length !== 16) return false;
    
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-6 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Policies
          </button>
        </div>
        <div>
          <h1 style={typography.pageTitle}>
            {isEditMode ? 'Edit Authenticator Policy' : 'Create Authenticator Policy'}
          </h1>
          <p style={typography.pageDescription}>
            {isEditMode 
              ? 'Modify policy settings and save as a new policy' 
              : 'Define security requirements and controls for FIDO devices'
            }
          </p>
        </div>
      </div>

      {/* Policy Type Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 id="policy-type-heading" style={typography.h2}>Policy Type Selection</h2>
        <p className="text-gray-600 mb-6">Choose the appropriate policy type based on your device type and security requirements</p>
        
        {/* Device Guidance */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 style={typography.h4}>Device Recommendations</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Generic Policy:</strong> Recommended for Thales and Yubikey devices for standard FIDO support</p>
                <p><strong>Managed Policy:</strong> Recommended for Thales devices with additional enterprise features that go beyond the standard FIDO features</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" role="radiogroup" aria-labelledby="policy-type-heading">
          <button
            type="button"
            onClick={() => setPolicyType('generic')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setPolicyType('generic');
              }
            }}
            aria-pressed={policyType === 'generic'}
            role="radio"
            aria-checked={policyType === 'generic'}
            className={`p-4 border-2 rounded-md cursor-pointer transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              policyType === 'generic'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <Settings className="w-6 h-6 text-gray-600 mr-2" />
              <h3 style={typography.h4}>Generic Policy</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Standard FIDO support</p>
            <div className="text-xs text-gray-500">
              <p>✓ Thales and Yubikey devices</p>
              <p>✓ Standard FIDO features</p>
              <p>✓ Flexible configuration</p>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setPolicyType('managed')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setPolicyType('managed');
              }
            }}
            aria-pressed={policyType === 'managed'}
            role="radio"
            aria-checked={policyType === 'managed'}
            className={`p-4 border-2 rounded-md cursor-pointer transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              policyType === 'managed'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <Shield className="w-6 h-6 text-gray-600 mr-2" />
              <h3 style={typography.h4}>Managed Policy</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Enhanced enterprise features</p>
            <div className="text-xs text-gray-500">
              <p>✓ Thales devices</p>
              <p>✓ Beyond standard FIDO</p>
              <p>✓ Admin PIN required</p>
            </div>
          </button>
        </div>
        
        {policyType && (
          <div className="p-4 bg-gray-50 rounded-md" role="status" aria-live="polite">
            <p className="text-sm text-gray-700">{getPolicyTypeDescription(policyType)}</p>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 style={typography.h2}>Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="policy-name" style={inputStyles.label}>
              Policy Name *
            </label>
            <input
              id="policy-name"
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Enter policy name"
              maxLength="64"
              disabled={!policyType}
              aria-describedby="policy-name-help"
              style={{
                ...inputStyles.default,
                ...((!policyType) ? inputStyles.disabled : {}),
                width: '100%'
              }}
            />
            <p id="policy-name-help" className="text-xs text-gray-500 mt-1">
              Maximum 64 characters ({policyName.length}/64)
            </p>
          </div>
          
          <div>
            <label htmlFor="policy-description" style={inputStyles.label}>
              Description
            </label>
            <input
              id="policy-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the policy"
              maxLength="256"
              disabled={!policyType}
              aria-describedby="policy-description-help"
              style={{
                ...inputStyles.default,
                ...((!policyType) ? inputStyles.disabled : {}),
                width: '100%'
              }}
            />
            <p id="policy-description-help" className="text-xs text-gray-500 mt-1">
              Maximum 256 characters ({description.length}/256)
            </p>
          </div>
          
          <div>
            <label htmlFor="user-pin" style={inputStyles.label}>
              User PIN (4-6 characters) *
            </label>
            <input
              id="user-pin"
              type="password"
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              placeholder="Enter user PIN"
              minLength="4"
              maxLength="6"
              disabled={!policyType}
              aria-describedby="user-pin-help"
              style={{
                ...inputStyles.default,
                ...((!policyType) ? inputStyles.disabled : {}),
                width: '100%'
              }}
            />
            <p id="user-pin-help" className="text-xs text-gray-500 mt-1">
              PIN must be between 4-6 characters
            </p>
          </div>
        </div>
      </div>



      {/* Enhanced Management Features */}
      {policyType === 'managed' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 style={typography.h2}>Enhanced Management Features</h2>
          <p className="text-gray-600 mb-6">Required for Managed Policy - enables enterprise controls</p>
          
          <div className="space-y-6">
            {/* Admin PIN - Required for Managed */}
            <div>
              <label htmlFor="admin-pin-managed" style={inputStyles.label}>
                Admin PIN (16 characters) *
              </label>
              <input
                id="admin-pin-managed"
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter 16-character admin PIN"
                maxLength="16"
                aria-describedby="admin-pin-managed-help admin-pin-managed-error"
                style={{
                  ...inputStyles.default,
                  width: '100%'
                }}
              />
              <p id="admin-pin-managed-help" className="text-xs text-gray-500 mt-1">
                Admin PIN enables advanced device management features
              </p>
              {adminPin && adminPin.length !== 16 && (
                <p id="admin-pin-managed-error" className="text-xs text-red-500 mt-1" role="alert">
                  Admin PIN must be exactly 16 characters
                </p>
              )}
            </div>

            {/* Whitelisted Websites */}
            <div>
              <label htmlFor="whitelisted-websites-managed" style={inputStyles.label}>
                Whitelisted Websites
              </label>
              <textarea
                id="whitelisted-websites-managed"
                value={whitelistedWebsites}
                onChange={(e) => setWhitelistedWebsites(e.target.value)}
                placeholder="e.g., company.com, app.company.com, secure.company.com"
                rows="3"
                aria-describedby="whitelisted-websites-managed-help"
                style={{
                  ...inputStyles.default,
                  width: '100%',
                  minHeight: '80px'
                }}
              />
              <p id="whitelisted-websites-managed-help" className="text-xs text-gray-500 mt-1">
                Comma-separated list of allowed websites for FIDO authentication
              </p>
            </div>

            {/* Admin Features */}
            <div>
              <h3 style={typography.h3}>Administrative Controls</h3>
              <div className="space-y-4">
                {/* Minimum PIN Length */}
                <div>
                  <label htmlFor="min-pin-length-managed" style={inputStyles.label}>
                    Minimum PIN length (4-63 characters) *
                  </label>
                  <input
                    id="min-pin-length-managed"
                    type="number"
                    min="4"
                    max="63"
                    value={minPinLength}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 4 && value <= 63) {
                        setMinPinLength(value);
                      }
                    }}
                    style={{
                      ...inputStyles.default,
                      width: '100%'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PIN length must be between 4-63 characters
                  </p>
                  {minPinLength && (minPinLength < 4 || minPinLength > 63) && (
                    <p className="text-xs text-red-500 mt-1">
                      PIN length must be between 4-63 characters
                    </p>
                  )}
                </div>

                {/* Manage Reset */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow device reset management</label>
                    <p className="text-xs text-gray-500">Enable admins to disable/enable device reset functionality</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableResetManagement}
                      onChange={(e) => setEnableResetManagement(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional Enterprise Features for Generic Policy */}
      {policyType === 'generic' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Optional Enterprise Features</h2>
          <p className="text-gray-600 mb-6">Configure additional features as needed for your environment</p>
          
          <div className="space-y-6">
            {/* Admin PIN - Optional for Generic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin PIN (16 characters) - Optional
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter 16-character admin PIN (optional)"
                maxLength="16"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Admin PIN enables advanced device management features
              </p>
              {adminPin && adminPin.length > 0 && adminPin.length !== 16 && (
                <p className="text-xs text-red-500 mt-1">
                  Admin PIN must be exactly 16 characters if provided
                </p>
              )}
            </div>

            {/* Whitelisted Websites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Whitelisted Websites - Optional
              </label>
              <textarea
                value={whitelistedWebsites}
                onChange={(e) => setWhitelistedWebsites(e.target.value)}
                placeholder="e.g., company.com, app.company.com, secure.company.com"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Comma-separated list of allowed websites for FIDO authentication
              </p>
            </div>

            {/* Administrative Controls - Optional for Generic */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Administrative Controls - Optional</h3>
              <div className="space-y-4">
                {/* Minimum PIN Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum PIN length (4-63 characters) - Optional
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="63"
                    value={minPinLength}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 4 && value <= 63) {
                        setMinPinLength(value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: PIN length must be between 4-63 characters
                  </p>
                  {minPinLength && (minPinLength < 4 || minPinLength > 63) && (
                    <p className="text-xs text-red-500 mt-1">
                      PIN length must be between 4-63 characters
                    </p>
                  )}
                </div>

                {/* Manage Reset */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow device reset management</label>
                    <p className="text-xs text-gray-500">Optional: Enable admins to disable/enable device reset functionality</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableResetManagement}
                      onChange={(e) => setEnableResetManagement(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Preview */}
      {policyType && policyName && userPin && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">Policy Preview</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {policyName}</p>
                <p><strong>Type:</strong> {policyType.charAt(0).toUpperCase() + policyType.slice(1)}</p>
                <p><strong>User PIN:</strong> {userPin.length} characters configured</p>
                <p><strong>Minimum PIN Length:</strong> {minPinLength} characters</p>
                {(policyType === 'managed' || policyType === 'generic') && adminPin && (
                  <p><strong>Admin PIN Configured:</strong> Yes</p>
                )}
                {enableResetManagement && (
                  <p><strong>Device Reset Management:</strong> Enabled</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          style={buttonStyles.secondary}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isFormValid()}
          style={isFormValid() ? buttonStyles.primary : buttonStyles.disabled}
        >
          <Save className="w-4 h-4" />
          {isEditMode ? 'Save As New Policy' : 'Save Policy'}
        </button>
      </div>
    </div>
  );
};

export default PolicyCreation;

