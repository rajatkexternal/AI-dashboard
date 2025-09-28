import React, { useState } from 'react';
import { Key, Plus, Search, Filter, Link, WifiOff, CheckCircle, AlertCircle, Usb, Shield, Settings, UserPlus, X, Hand, ChevronDown, ChevronRight } from 'lucide-react';
import PaginationComponent from './PaginationComponent';
import ErrorMessage from './ErrorMessage';
import { useSimpleToast } from './SimpleToast';
import { buttonStyles } from '../styles/buttonStyles.js';
import { colors, typography, spacing, layout, inputStyles } from '../styles/globalStyles.js';

const FidoKeyManagement = () => {
  const { showSuccess, showError, ToastContainer } = useSimpleToast();
  const [isServiceConnected, setIsServiceConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showBulkConfigureModal, setShowBulkConfigureModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [expandedDevices, setExpandedDevices] = useState(new Set());
  
  // Multi-device selection state
  const [selectedDevices, setSelectedDevices] = useState(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Reset modal states
  const [assignUserStep, setAssignUserStep] = useState(1);
  const [selectedIDP, setSelectedIDP] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [bulkSelectedPolicy, setBulkSelectedPolicy] = useState('');
  const [bulkConfigureStep, setBulkConfigureStep] = useState(1);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [showTouchPrompt, setShowTouchPrompt] = useState(false);
  
  // User search functionality
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Reset functionality states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: PIN entry, 2: confirmation, 3: disconnect/reconnect, 4: complete
  const [resetPin, setResetPin] = useState('');
  const [resetError, setResetError] = useState('');
  const [deviceToReset, setDeviceToReset] = useState(null);
  
  // Error handling and loading states
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [configureError, setConfigureError] = useState('');
  const [assignError, setAssignError] = useState('');
  const [operationSuccess, setOperationSuccess] = useState('');

  const handleConnectService = async () => {
    setConnectionError('');
    setIsConnecting(true);
    
    try {
      // Auto-proceed without browser prompt
      setIsServiceConnected(true);
      
      // Show success toast
      showSuccess('Successfully connected to local FIDO service');
      
      // Simulate connected devices with only Thales and Yubico devices
      setConnectedDevices([
        {
          id: 3,
          name: 'Thales SafeNet eToken 5110',
          manufacturer: 'Thales',
          model: 'eToken-5110-003',
          serialNumber: 'TH-5110-003',
          status: 'Connected',
          version: '1.2.1',
          aaguid: '2fc0579f-8113-47ea-b116-bb5a8db9202a',
          fidoVersion: '2.1',
          capabilities: ['FIDO2', 'PIV'],
          lastSeen: '1 minute ago',
          hasAdminPin: true,
          configuredPolicy: null,
          assignedUser: null,
          assignedIdp: null
        },
          {
            id: 5,
            name: 'Thales SafeNet eToken 5300',
            manufacturer: 'Thales',
            model: 'eToken-5300-005',
            serialNumber: 'TH-5300-005',
            status: 'Connected',
            version: '1.3.2',
            aaguid: '2fc0579f-8113-47ea-b116-bb5a8db9202a',
            fidoVersion: '2.1',
            capabilities: ['FIDO2', 'PIV', 'OTP'],
            lastSeen: '30 seconds ago',
            hasAdminPin: false,
            configuredPolicy: null,
            assignedUser: null,
            assignedIdp: null
          },
          {
            id: 1,
            name: 'YubiKey 5C NFC',
            manufacturer: 'Yubico',
            model: 'YK5C-NFC-001',
            serialNumber: 'YK-5C-NFC-001',
            status: 'Connected',
            version: '5.4.3',
            aaguid: 'cb69481e-8ff7-4039-93ec-0a2729a154a8',
            fidoVersion: '2.0',
          capabilities: ['FIDO2', 'PIV', 'OTP'],
          lastSeen: '2 minutes ago',
          hasAdminPin: false,
          configuredPolicy: null,
          assignedUser: null,
          assignedIdp: null
        },
        {
          id: 2,
          name: 'YubiKey 5 NFC',
          manufacturer: 'Yubico',
          model: 'YK5-NFC-002',
          serialNumber: 'YK-5-NFC-002',
          status: 'Connected',
          version: '5.4.3',
          aaguid: 'cb69481e-8ff7-4039-93ec-0a2729a154a8',
          fidoVersion: '2.0',
          capabilities: ['FIDO2', 'PIV', 'OTP'],
          lastSeen: '5 minutes ago',
          hasAdminPin: true,
          configuredPolicy: null,
          assignedUser: null,
          assignedIdp: null
        }
      ]);
    } catch (error) {
      // Handle any connection errors
      setConnectionError('Unable to connect to the FIDO Key Management Service. Make sure that it\'s installed and running on your computer.');
      showError('Failed to connect to local FIDO service');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConfigure = (device) => {
    setSelectedDevice(device);
    setShowConfigureModal(true);
  };

  const handleAssignUser = (device) => {
    setSelectedDevice(device);
    setShowAssignUserModal(true);
    setAssignUserStep(1);
  };

  const handleAssignUserNext = () => {
    if (assignUserStep === 1 && selectedIDP) {
      setAssignUserStep(2);
    } else if (assignUserStep === 2 && selectedUser) {
      // If device already has a configured policy, skip policy selection step
      if (selectedDevice && selectedDevice.configuredPolicy) {
        setShowTouchPrompt(true);
      } else {
        setAssignUserStep(3);
      }
    } else if (assignUserStep === 3 && selectedPolicy) {
      // Skip PIN entry step and go directly to touch prompt
      setShowTouchPrompt(true);
    }
  };

  // User search functionality
  const handleUserSearch = (query) => {
    setUserSearchQuery(query);
    
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      const mockUsers = selectedIDP === 'entra-id' ? [
        { id: 'user1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
        { id: 'user2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR' },
        { id: 'user3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Finance' },
        { id: 'user4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Marketing' },
        { id: 'user5', name: 'David Brown', email: 'david.brown@company.com', department: 'Sales' }
      ] : [
        { id: 'sta1', name: 'Alice Cooper', email: 'alice.cooper@sta.local', department: 'Security' },
        { id: 'sta2', name: 'Bob Miller', email: 'bob.miller@sta.local', department: 'Operations' },
        { id: 'sta3', name: 'Carol Davis', email: 'carol.davis@sta.local', department: 'Admin' }
      ];

      // Show all users if query is empty or less than 2 characters, otherwise filter
      const filtered = query.length === 0 ? mockUsers : mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  // Function to show demo users when search field is focused
  const handleSearchFocus = () => {
    if (userSearchQuery.length === 0) {
      handleUserSearch('');
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user.id);
    setUserSearchQuery(user.name + ' (' + user.email + ')');
    setSearchResults([]);
  };

  const handlePinEntered = () => {
    setShowPinPrompt(false);
    setShowTouchPrompt(true);
  };

  const handleTouchCompleted = () => {
    // Get the selected user details
    const mockUsers = selectedIDP === 'entra-id' ? [
      { id: 'user1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
      { id: 'user2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR' },
      { id: 'user3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Finance' },
      { id: 'user4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Marketing' },
      { id: 'user5', name: 'David Brown', email: 'david.brown@company.com', department: 'Sales' }
    ] : [
      { id: 'sta1', name: 'Alice Cooper', email: 'alice.cooper@sta.local', department: 'Security' },
      { id: 'sta2', name: 'Bob Miller', email: 'bob.miller@sta.local', department: 'Operations' },
      { id: 'sta3', name: 'Carol Davis', email: 'carol.davis@sta.local', department: 'Admin' }
    ];

    const selectedUserData = mockUsers.find(user => user.id === selectedUser);
    const idpName = selectedIDP === 'entra-id' ? 'Entra ID' : 'STA';

    // Update the device with assignment information
    setConnectedDevices(prev => prev.map(device => 
      device.id === selectedDevice.id 
        ? { 
            ...device, 
            status: 'Assigned',
            assignedUser: selectedUserData ? selectedUserData.email : 'Unknown User',
            assignedIdp: idpName
          }
        : device
    ));

    setShowTouchPrompt(false);
    setShowAssignUserModal(false);
    setAssignUserStep(1);
    setSelectedIDP('');
    setSelectedUser('');
    setSelectedPolicy('');
    setUserSearchQuery('');
    setSearchResults([]);
    showSuccess('Device successfully assigned to user!');
  };

  // Device click handler - shows device modal with actions
  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  // Reset functionality handlers
  const handleResetDevice = (device) => {
    setDeviceToReset(device);
    setShowDeviceModal(false);
    setShowResetModal(true);
    setResetStep(1);
    setResetPin('');
    setResetError('');
  };

  const handleResetPinSubmit = () => {
    if (!resetPin || resetPin.length < 4) {
      setResetError('PIN must be at least 4 characters');
      return;
    }
    
    // Simulate PIN validation
    setResetError('');
    setResetStep(2);
  };

  const handleResetConfirm = () => {
    setResetStep(3);
  };

  const handleDeviceReconnected = () => {
    setResetStep(4);
    // Simulate reset completion after 2 seconds
    setTimeout(() => {
      // Reset device status back to Connected and clear assignment
      if (deviceToReset) {
        setConnectedDevices(prev => prev.map(device => 
          device.id === deviceToReset.id 
            ? { 
                ...device, 
                status: 'Connected',
                assignedUser: null,
                assignedIdp: null,
                configuredPolicy: null
              }
            : device
        ));
      }
      
      setShowResetModal(false);
      setResetStep(1);
      setDeviceToReset(null);
      setResetPin('');
      setResetError('');
    }, 2000);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
    setResetStep(1);
    setDeviceToReset(null);
    setResetPin('');
    setResetError('');
  };

  // Multi-device selection handlers
  const handleDeviceSelection = (deviceId, isChecked) => {
    const newSelectedDevices = new Set(selectedDevices);
    
    if (isChecked && selectedDevices.size < 20) {
      newSelectedDevices.add(deviceId);
    } else if (!isChecked) {
      newSelectedDevices.delete(deviceId);
    }
    
    setSelectedDevices(newSelectedDevices);
    setIsMultiSelectMode(newSelectedDevices.size > 1);
  };

  const handleSelectAllDevices = (isChecked) => {
    if (isChecked) {
      const deviceIds = connectedDevices.slice(0, 20).map(device => device.id);
      setSelectedDevices(new Set(deviceIds));
      setIsMultiSelectMode(deviceIds.length > 1);
    } else {
      setSelectedDevices(new Set());
      setIsMultiSelectMode(false);
    }
  };

  const handleMultiDeviceConfigure = () => {
    if (selectedDevices.size > 0) {
      setShowBulkConfigureModal(true);
    }
  };

  const clearSelection = () => {
    setSelectedDevices(new Set());
    setIsMultiSelectMode(false);
  };

  const toggleDeviceExpansion = (deviceId) => {
    const newExpanded = new Set(expandedDevices);
    if (newExpanded.has(deviceId)) {
      newExpanded.delete(deviceId);
    } else {
      newExpanded.add(deviceId);
    }
    setExpandedDevices(newExpanded);
  };

  const getManufacturerIcon = (manufacturer) => {
    switch (manufacturer.toLowerCase()) {
      case 'yubico':
        return <Key className="w-8 h-8 text-green-600" />;
      case 'thales':
        return <Shield className="w-8 h-8 text-blue-600" />;
      default:
        return <Key className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isServiceConnected) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 style={typography.pageTitle}>FIDO Key Management</h1>
            <p style={typography.pageDescription}>Manage and configure FIDO security keys</p>
          </div>
        </div>

        {/* Service Connection Required */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 style={typography.h2}>Local Windows Service Required</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              To manage FIDO devices, you need to connect to the local Windows service that discovers and manages connected security keys.
            </p>
            
            <button
              onClick={handleConnectService}
              style={buttonStyles.primary}
            >
              <Link className="w-5 h-5" />
              Connect to Local Service
            </button>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-blue-900">Service Requirements</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Ensure the F1 Windows Service is installed and running on your local machine to detect connected FIDO devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={typography.pageTitle}>FIDO Key Management</h1>
          <p style={typography.pageDescription}>Manage and configure FIDO security keys</p>
        </div>
      </div>

      {/* Service Connection Status */}
      {!isServiceConnected && !isConnecting && !connectionError && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Local Service Status</span>
              </div>
            </div>
            <button
              onClick={handleConnectService}
              style={buttonStyles.primary}
            >
              <Link className="w-4 h-4" />
              Connect to Local Service
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isConnecting && (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 mb-2">If prompted, click on "Open FIDO Key Management Service"</p>
            <p className="text-gray-600">and wait while the get the list of devices.</p>
          </div>
        </div>
      )}

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{connectionError}</span>
            </div>
            <button
              onClick={() => setConnectionError('')}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Service Connected Status */}
      {isServiceConnected && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Local Service Status</span>
              </div>
            </div>
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Service Connected
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {isServiceConnected && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by device name, serial number, or manufacturer..."
                style={{
                  ...inputStyles.default,
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Connected Devices */}
      {isServiceConnected && (
        <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 style={typography.h2}>Connected FIDO Devices</h2>
              <p style={typography.body2Regular}>
                {connectedDevices.length} devices detected
                {selectedDevices.size > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {selectedDevices.size} selected
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedDevices.size > 1 ? (
                <>
                  <button
                    onClick={handleMultiDeviceConfigure}
                    style={buttonStyles.primary}
                  >
                    <Settings className="w-4 h-4" />
                    Configure Selected ({selectedDevices.size})
                  </button>
                  <button
                    onClick={clearSelection}
                    style={buttonStyles.secondary}
                  >
                    Clear Selection
                  </button>
                </>
              ) : connectedDevices.length > 0 && selectedDevices.size <= 1 && (
                <button
                  onClick={() => setShowBulkConfigureModal(true)}
                  style={buttonStyles.primary}
                >
                  <Settings className="w-4 h-4" />
                  Bulk Configure ({Math.min(connectedDevices.length, 50)})
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {connectedDevices.map((device) => (
            <div key={device.id} className="bg-gray-50 rounded-lg border border-gray-200">
              {/* Device Tile Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Device Selection Checkbox */}
                    <input
                      type="checkbox"
                      id={`device-${device.id}`}
                      checked={selectedDevices.has(device.id)}
                      onChange={(e) => handleDeviceSelection(device.id, e.target.checked)}
                      disabled={!selectedDevices.has(device.id) && selectedDevices.size >= 20}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    
                    <button
                      onClick={() => toggleDeviceExpansion(device.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedDevices.has(device.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 style={typography.h4}>{device.name}</h3>
                      <p style={typography.body2Regular}>{device.manufacturer} • {device.model}</p>
                      {device.manufacturer !== 'Yubico' && (
                        <p style={typography.body2Regular}>Serial: {device.serialNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - conditional based on multi-select mode */}
                  <div className="flex items-center space-x-2">
                    {isMultiSelectMode ? (
                      // Multi-select mode: grey out all individual action buttons
                      <>
                        <button
                          disabled
                          style={{
                            ...buttonStyles.secondary,
                            opacity: 0.5,
                            cursor: 'not-allowed'
                          }}
                        >
                          <Settings className="w-4 h-4" />
                          Configure
                        </button>
                        
                        <button
                          disabled
                          style={{
                            ...buttonStyles.secondary,
                            opacity: 0.5,
                            cursor: 'not-allowed'
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </button>
                        
                        {device.manufacturer === 'Thales' && (
                          <button
                            disabled
                            style={{
                              ...buttonStyles.secondary,
                              opacity: 0.5,
                              cursor: 'not-allowed'
                            }}
                          >
                            <AlertCircle className="w-4 h-4" />
                            Reset
                          </button>
                        )}
                      </>
                    ) : (
                      // Normal mode: all buttons enabled
                      <>
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            handleConfigure(device);
                          }}
                          style={buttonStyles.primary}
                        >
                          <Settings className="w-4 h-4" />
                          Configure
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            handleAssignUser(device);
                          }}
                          disabled={device.status === 'Assigned'}
                          style={{
                            ...buttonStyles.primary,
                            ...(device.status === 'Assigned' && {
                              opacity: 0.5,
                              cursor: 'not-allowed'
                            })
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </button>
                        
                        {device.manufacturer === 'Thales' && (
                          <button
                            onClick={() => {
                              setSelectedDevice(device);
                              handleResetDevice(device);
                            }}
                            style={buttonStyles.primary}
                          >
                            <AlertCircle className="w-4 h-4" />
                            Reset
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedDevices.has(device.id) && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">AAGUID</p>
                      <p className="text-sm text-gray-900 font-mono">{device.aaguid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">FIDO Version</p>
                      <p className="text-sm text-gray-900">{device.fidoVersion}</p>
                    </div>
                    {device.configuredPolicy && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Configured Policy</p>
                        <p className="text-sm text-gray-900">{device.configuredPolicy}</p>
                      </div>
                    )}
                    {device.assignedUser && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Assigned User</p>
                        <p className="text-sm text-gray-900">{device.assignedUser}</p>
                      </div>
                    )}
                    {device.assignedIdp && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Identity Provider</p>
                        <p className="text-sm text-gray-900">{device.assignedIdp}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Component */}
        <PaginationComponent
          currentPage={currentPage}
          totalItems={connectedDevices.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
      )}

      {/* Device Action Modal */}
      {showDeviceModal && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Device Actions</h3>
              <button 
                onClick={() => setShowDeviceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                {getManufacturerIcon(selectedDevice.manufacturer)}
                <div>
                  <h4 className="font-medium text-gray-900">{selectedDevice.name}</h4>
                  {selectedDevice.manufacturer !== 'Yubico' && (
                    <p className="text-sm text-gray-600">{selectedDevice.serialNumber}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowDeviceModal(false);
                  handleConfigure(selectedDevice);
                }}
                className="w-full flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                Configure Device
              </button>
              
              <button 
                onClick={() => {
                  setShowDeviceModal(false);
                  handleAssignUser(selectedDevice);
                }}
                className="w-full flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Assign to User
              </button>
              
              {selectedDevice.manufacturer === 'Thales' && (
                <button 
                  onClick={() => handleResetDevice(selectedDevice)}
                  className="w-full flex items-center px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <AlertCircle className="w-5 h-5 mr-3" />
                  Reset to Factory Settings
                </button>
              )}
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => setShowDeviceModal(false)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Device Modal */}
      {showConfigureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 style={typography.h3}>Configure Device</h3>
              <button 
                onClick={() => setShowConfigureModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label style={inputStyles.label}>Select Policy</label>
                <select 
                  value={selectedPolicy}
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                  style={{
                    ...inputStyles.default,
                    width: '100%'
                  }}
                >
                  <option value="">Choose a policy...</option>
                  <option value="enterprise-managed">Enterprise Managed Policy</option>
                  <option value="standard-unmanaged">Standard Unmanaged Policy</option>
                  <option value="high-security">High Security Policy</option>
                  <option value="biometric-policy">Biometric Policy</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowConfigureModal(false)}
                  style={buttonStyles.secondary}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (selectedPolicy) {
                      // Get policy name for display
                      const policyNames = {
                        'enterprise-managed': 'Enterprise Managed Policy',
                        'standard-unmanaged': 'Standard Unmanaged Policy',
                        'high-security': 'High Security Policy',
                        'biometric-policy': 'Biometric Policy'
                      };
                      
                      // Update device with policy information
                      setConnectedDevices(prev => prev.map(device => 
                        device.id === selectedDevice.id 
                          ? { 
                              ...device, 
                              status: 'Configured',
                              configuredPolicy: policyNames[selectedPolicy]
                            }
                          : device
                      ));
                      
                      setShowConfigureModal(false);
                      setSelectedPolicy('');
                      showSuccess('Policy applied to device successfully!');
                    }
                  }}
                  disabled={!selectedPolicy}
                  style={{
                    ...buttonStyles.primary,
                    opacity: selectedPolicy ? 1 : 0.5,
                    cursor: selectedPolicy ? 'pointer' : 'not-allowed'
                  }}
                >
                  Apply Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {showAssignUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 style={typography.h3}>Assign Device to User</h3>
              <button 
                onClick={() => {
                  setShowAssignUserModal(false);
                  setAssignUserStep(1);
                  setSelectedIDP('');
                  setSelectedUser('');
                  setSelectedPolicy('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {assignUserStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label style={inputStyles.label}>Select Identity Provider</label>
                  <select 
                    value={selectedIDP}
                    onChange={(e) => setSelectedIDP(e.target.value)}
                    style={{
                      ...inputStyles.default,
                      width: '100%'
                    }}
                  >
                    <option value="">Choose an IDP...</option>
                    <option value="entra-id">Entra ID</option>
                    <option value="sta">STA</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      setShowAssignUserModal(false);
                      setAssignUserStep(1);
                      setSelectedIDP('');
                      setUserSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={buttonStyles.secondary}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAssignUserNext}
                    disabled={!selectedIDP}
                    style={{
                      ...buttonStyles.primary,
                      opacity: selectedIDP ? 1 : 0.5,
                      cursor: selectedIDP ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {assignUserStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label style={inputStyles.label}>Search for User</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      onFocus={handleSearchFocus}
                      placeholder="Type to search users..."
                      style={{
                        ...inputStyles.default,
                        width: '100%',
                        paddingRight: '40px'
                      }}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.department}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {isSearching && (
                    <div className="mt-2 text-sm text-gray-500">Searching...</div>
                  )}
                  
                  {userSearchQuery.length > 0 && searchResults.length === 0 && !isSearching && (
                    <div className="mt-2 text-sm text-gray-500">No users found. Try searching for "John", "Jane", or "Alice"</div>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setAssignUserStep(1)}
                    style={buttonStyles.secondary}
                    className="flex-1"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleAssignUserNext}
                    disabled={!selectedUser}
                    style={{
                      ...buttonStyles.primary,
                      opacity: selectedUser ? 1 : 0.5,
                      cursor: selectedUser ? 'pointer' : 'not-allowed'
                    }}
                    className="flex-1"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {assignUserStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label style={inputStyles.label}>Select Policy</label>
                  <select 
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                    style={{
                      ...inputStyles.default,
                      width: '100%'
                    }}
                  >
                    <option value="">Choose a policy...</option>
                    <option value="enterprise">Enterprise Security Policy</option>
                    <option value="standard">Standard FIDO Policy</option>
                    <option value="managed">Managed Device Policy</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setAssignUserStep(2)}
                    style={buttonStyles.secondary}
                    className="flex-1"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleAssignUserNext}
                    disabled={!selectedPolicy}
                    style={{
                      ...buttonStyles.primary,
                      opacity: selectedPolicy ? 1 : 0.5,
                      cursor: selectedPolicy ? 'pointer' : 'not-allowed'
                    }}
                    className="flex-1"
                  >
                    Continue to Device Touch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PIN Prompt Modal */}
      {showPinPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Device PIN</h3>
              <p className="text-gray-600 mb-6">
                Please enter your FIDO device PIN to continue with the assignment.
              </p>
              
              <input 
                type="password" 
                placeholder="Enter PIN"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-center"
                maxLength="8"
              />
              
              <button 
                onClick={handlePinEntered}
                style={buttonStyles.primary}
                className="w-full"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Touch Prompt Modal */}
      {showTouchPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* FIDO Alliance standard touch icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-600 rounded-md flex items-center justify-center">
                  <Hand className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Verification Required</h3>
              <p className="text-gray-600 mb-6">
                Please touch the sensor on your FIDO security key when it lights up or vibrates to verify your presence and complete the device assignment.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-gray-800">
                      Your security key will indicate when it's ready for touch through visual (LED) or tactile (vibration) feedback.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowTouchPrompt(false)}
                  style={buttonStyles.secondary}
                  className="flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTouchCompleted}
                  style={buttonStyles.primary}
                  className="flex-1"
                >
                  Complete Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Reset Modal */}
      {showResetModal && deviceToReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Reset Device to Factory Settings</h3>
              <button 
                onClick={handleResetCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {resetStep === 1 && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This will permanently erase all data on the device and reset it to factory settings.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-700 mb-4">
                    Device: <strong>{deviceToReset.name}</strong> ({deviceToReset.serialNumber})
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter User PIN or Admin PIN to continue
                  </label>
                  <input
                    type="password"
                    value={resetPin}
                    onChange={(e) => setResetPin(e.target.value)}
                    placeholder="Enter PIN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {resetError && (
                    <p className="text-sm text-red-600 mt-1">{resetError}</p>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={handleResetCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetPinSubmit}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Final Confirmation</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Are you absolutely sure you want to reset this device? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-700">
                    Device: <strong>{deviceToReset.name}</strong> ({deviceToReset.serialNumber})
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={handleResetCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Yes, Reset Device
                  </button>
                </div>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <Usb className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Device Disconnection Required</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Please disconnect the device from your computer, wait 3 seconds, then reconnect it to complete the reset process.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <div className="animate-pulse">
                    <Usb className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Waiting for device reconnection...</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={handleResetCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeviceReconnected}
                    className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
                    style={{backgroundColor: '#041295'}}
                  >
                    Device Reconnected
                  </button>
                </div>
              </div>
            )}

            {resetStep === 4 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Reset Complete</h4>
                      <p className="text-sm text-green-700 mt-1">
                        The device has been successfully reset to factory settings.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Device reset completed successfully!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Configure Modal */}
      {showBulkConfigureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Bulk Configure FIDO Devices</h3>
              <button 
                onClick={() => {
                  setShowBulkConfigureModal(false);
                  setBulkConfigureStep(1);
                  setBulkSelectedPolicy('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {bulkConfigureStep === 1 && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-blue-800 font-medium">
                        {Math.min(connectedDevices.length, 50)} devices will be configured
                      </span>
                    </div>
                    {connectedDevices.length > 50 && (
                      <span className="text-sm text-orange-600">
                        Maximum 50 devices per batch
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Select Policy to Apply</h4>
                  <p className="text-gray-600 mb-4">
                    Choose a policy that will be applied to all connected FIDO devices simultaneously.
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { id: 'enterprise-managed', name: 'Enterprise Managed Policy', description: 'Full enterprise controls with Admin PIN' },
                    { id: 'standard-unmanaged', name: 'Standard Unmanaged Policy', description: 'Basic FIDO2.1 compliance for general use' },
                    { id: 'mixed-environment', name: 'Mixed Environment Policy', description: 'Flexible policy for diverse device types' },
                    { id: 'high-security', name: 'High Security Policy', description: 'Enhanced security with strict controls' }
                  ].map((policy) => (
                    <div
                      key={policy.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        bulkSelectedPolicy === policy.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBulkSelectedPolicy(policy.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={bulkSelectedPolicy === policy.id}
                          onChange={() => setBulkSelectedPolicy(policy.id)}
                          className="mr-3"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{policy.name}</h5>
                          <p className="text-sm text-gray-600">{policy.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setShowBulkConfigureModal(false);
                      setBulkConfigureStep(1);
                      setBulkSelectedPolicy('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setBulkConfigureStep(2)}
                    disabled={!bulkSelectedPolicy}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      bulkSelectedPolicy
                        ? 'text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={bulkSelectedPolicy ? {backgroundColor: '#041295'} : {}}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {bulkConfigureStep === 2 && (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Bulk Configuration</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-yellow-800">Important Notice</h5>
                        <p className="text-sm text-yellow-700 mt-1">
                          This action will configure {Math.min(connectedDevices.length, 50)} FIDO devices simultaneously. 
                          Each device will require user interaction (PIN entry and touch) during the process.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Configuration Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected Policy:</span>
                        <span className="font-medium text-gray-900">
                          {[
                            { id: 'enterprise-managed', name: 'Enterprise Managed Policy' },
                            { id: 'standard-unmanaged', name: 'Standard Unmanaged Policy' },
                            { id: 'mixed-environment', name: 'Mixed Environment Policy' },
                            { id: 'high-security', name: 'High Security Policy' }
                          ].find(p => p.id === bulkSelectedPolicy)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Devices to Configure:</span>
                        <span className="font-medium text-gray-900">{Math.min(connectedDevices.length, 50)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium text-gray-900">{Math.ceil(Math.min(connectedDevices.length, 50) * 0.5)} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => setBulkConfigureStep(1)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setBulkConfigureStep(3)}
                    className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{backgroundColor: '#041295'}}
                  >
                    Start Bulk Configuration
                  </button>
                </div>
              </div>
            )}

            {bulkConfigureStep === 3 && (
              <div>
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Bulk Configuration Complete!</h4>
                  <p className="text-gray-600 mb-4">
                    Successfully configured {Math.min(connectedDevices.length, 50)} FIDO devices with the selected policy.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-green-800">
                      <div className="flex justify-between mb-2">
                        <span>Devices Configured:</span>
                        <span className="font-medium">{Math.min(connectedDevices.length, 50)}/{Math.min(connectedDevices.length, 50)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Success Rate:</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Time:</span>
                        <span className="font-medium">{Math.ceil(Math.min(connectedDevices.length, 50) * 0.4)} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowBulkConfigureModal(false);
                    setBulkConfigureStep(1);
                    setBulkSelectedPolicy('');
                  }}
                  className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                  style={{backgroundColor: '#041295'}}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default FidoKeyManagement;

