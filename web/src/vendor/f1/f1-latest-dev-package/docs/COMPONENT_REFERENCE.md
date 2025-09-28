# F1 FIDO Key Manager - Component Reference

## 📋 Component Overview

This document provides comprehensive documentation of all React components in the F1 FIDO Key Manager application. Each component is documented with props, state, methods, and usage examples for AI tool development.

## 🏗️ Application Structure

```
src/
├── App.jsx                    # Main application component
├── components/
│   ├── Dashboard.jsx          # Dashboard overview
│   ├── FidoKeyManagement.jsx  # FIDO key management
│   ├── PolicyManagement.jsx   # Policy management
│   ├── Inventory.jsx          # Device inventory
│   ├── AuditLogs.jsx          # Audit logging
│   ├── IdpSettings.jsx        # IDP configuration
│   ├── Navigation.jsx         # Navigation sidebar
│   ├── LoginPage.jsx          # Authentication
│   ├── SimpleToast.jsx        # Toast notifications
│   ├── PaginationComponent.jsx # Pagination
│   ├── ErrorMessage.jsx       # Error display
│   └── ui/                    # UI components
└── styles/                    # Styling system
```

## 🎯 Core Components

### App.jsx
Main application component that handles routing and global state.

```javascript
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FidoKeyManagement from './components/FidoKeyManagement';
import PolicyManagement from './components/PolicyManagement';
import Inventory from './components/Inventory';
import AuditLogs from './components/AuditLogs';
import IdpSettings from './components/IdpSettings';
import LoginPage from './components/LoginPage';

const App = () => {
  // State management
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Authentication methods
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('login');
  };

  // View rendering
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'fido-keys':
        return <FidoKeyManagement />;
      case 'policies':
        return <PolicyManagement />;
      case 'inventory':
        return <Inventory />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'idp-settings':
        return <IdpSettings />;
      default:
        return <Dashboard />;
    }
  };

  // Render authentication or main app
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;
```

**Props**: None (root component)
**State**:
- `currentView`: Current active view/page
- `isAuthenticated`: Authentication status
- `user`: Current user data

**Methods**:
- `handleLogin(userData)`: Authenticate user
- `handleLogout()`: Sign out user
- `renderCurrentView()`: Render active component

### FidoKeyManagement.jsx
Main component for FIDO key operations including discovery, configuration, and assignment.

```javascript
import React, { useState } from 'react';
import { useSimpleToast } from './SimpleToast';

const FidoKeyManagement = () => {
  // Toast notifications
  const { showSuccess, showError, ToastContainer } = useSimpleToast();

  // Service connection state
  const [isServiceConnected, setIsServiceConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Modal states
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Selected items
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState(new Set());
  const [selectedIDP, setSelectedIDP] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('');

  // Assignment flow state
  const [assignUserStep, setAssignUserStep] = useState(1);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset flow state
  const [resetStep, setResetStep] = useState(1);
  const [resetPin, setResetPin] = useState('');
  const [resetError, setResetError] = useState('');
  const [deviceToReset, setDeviceToReset] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Prompt states
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [showTouchPrompt, setShowTouchPrompt] = useState(false);

  // Multi-select state
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [expandedDevices, setExpandedDevices] = useState(new Set());

  // Service connection handler
  const handleConnectService = async () => {
    setConnectionError('');
    setIsConnecting(true);
    
    try {
      // Auto-proceed without browser prompt
      setIsServiceConnected(true);
      showSuccess('Successfully connected to local FIDO service');
      
      // Simulate connected devices
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
        // ... more devices
      ]);
    } catch (error) {
      setConnectionError('Unable to connect to the FIDO Key Management Service.');
      showError('Failed to connect to local FIDO service');
    } finally {
      setIsConnecting(false);
    }
  };

  // Device assignment handler
  const handleAssignUser = (device) => {
    setSelectedDevice(device);
    setShowAssignUserModal(true);
    setAssignUserStep(1);
  };

  // Assignment flow navigation with smart policy skipping
  const handleAssignUserNext = () => {
    if (assignUserStep === 1 && selectedIDP) {
      setAssignUserStep(2);
    } else if (assignUserStep === 2 && selectedUser) {
      // Smart policy flow: skip if device already has policy
      if (selectedDevice && selectedDevice.configuredPolicy) {
        setShowTouchPrompt(true);
      } else {
        setAssignUserStep(3);
      }
    } else if (assignUserStep === 3 && selectedPolicy) {
      setShowTouchPrompt(true);
    }
  };

  // User search functionality
  const handleUserSearch = (query) => {
    setUserSearchQuery(query);
    setIsSearching(true);
    
    setTimeout(() => {
      const mockUsers = selectedIDP === 'entra-id' ? [
        { id: 'user1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
        { id: 'user2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR' },
        // ... more users
      ] : [
        { id: 'sta1', name: 'Alice Cooper', email: 'alice.cooper@sta.local', department: 'Security' },
        // ... more STA users
      ];

      const filtered = query.length === 0 ? mockUsers : mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  // Touch completion handler
  const handleTouchCompleted = () => {
    const mockUsers = selectedIDP === 'entra-id' ? [
      { id: 'user1', name: 'John Doe', email: 'john.doe@company.com', department: 'IT' },
      // ... users array
    ] : [
      { id: 'sta1', name: 'Alice Cooper', email: 'alice.cooper@sta.local', department: 'Security' },
      // ... STA users
    ];

    const selectedUserData = mockUsers.find(user => user.id === selectedUser);
    const idpName = selectedIDP === 'entra-id' ? 'Entra ID' : 'STA';

    // Update device with assignment
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

    // Reset modal state
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

  // Device reset handler
  const handleResetDevice = (device) => {
    setDeviceToReset(device);
    setShowDeviceModal(false);
    setShowResetModal(true);
    setResetStep(1);
    setResetPin('');
    setResetError('');
  };

  // Reset completion handler
  const handleDeviceReconnected = () => {
    setResetStep(4);
    setTimeout(() => {
      // Reset device status and clear assignment
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

  // Device selection handlers
  const handleDeviceSelection = (deviceId, isSelected) => {
    const newSelection = new Set(selectedDevices);
    if (isSelected && newSelection.size < 20) {
      newSelection.add(deviceId);
    } else {
      newSelection.delete(deviceId);
    }
    setSelectedDevices(newSelection);
  };

  const clearSelection = () => {
    setSelectedDevices(new Set());
    setIsMultiSelectMode(false);
  };

  // Device expansion toggle
  const toggleDeviceExpansion = (deviceId) => {
    const newExpanded = new Set(expandedDevices);
    if (newExpanded.has(deviceId)) {
      newExpanded.delete(deviceId);
    } else {
      newExpanded.add(deviceId);
    }
    setExpandedDevices(newExpanded);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate paginated devices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDevices = connectedDevices.slice(startIndex, endIndex);

  // Render methods would continue here...
  // [Component JSX rendering logic]

  return (
    <div className="p-6 space-y-6">
      {/* Component JSX */}
      <ToastContainer />
    </div>
  );
};

export default FidoKeyManagement;
```

**Props**: None
**State**:
- Service connection: `isServiceConnected`, `connectedDevices`, `isConnecting`
- Modal states: `showDeviceModal`, `showConfigureModal`, `showAssignUserModal`
- Selection: `selectedDevice`, `selectedDevices`, `selectedIDP`, `selectedUser`
- Assignment flow: `assignUserStep`, `userSearchQuery`, `searchResults`
- Reset flow: `resetStep`, `resetPin`, `deviceToReset`
- Pagination: `currentPage`, `itemsPerPage`

**Key Methods**:
- `handleConnectService()`: Connect to FIDO service
- `handleAssignUser(device)`: Start device assignment
- `handleAssignUserNext()`: Navigate assignment flow with smart policy skipping
- `handleUserSearch(query)`: Search for users
- `handleTouchCompleted()`: Complete device assignment
- `handleResetDevice(device)`: Start device reset
- `handleDeviceReconnected()`: Complete device reset

### SimpleToast.jsx
Toast notification system for user feedback.

```javascript
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

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
        return baseStyles;
    }
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
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
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
```

**Props**:
- `message` (string): Toast message text
- `type` (string): Toast type ('success', 'error', 'warning', 'info')
- `onClose` (function): Callback when toast closes
- `duration` (number): Auto-close duration in milliseconds

**Hook Returns**:
- `showSuccess(message)`: Show success toast
- `showError(message)`: Show error toast
- `showWarning(message)`: Show warning toast
- `showInfo(message)`: Show info toast
- `ToastContainer`: Component to render toasts

### PaginationComponent.jsx
Reusable pagination component for data tables.

```javascript
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationComponent = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100]
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
        
        {showItemsPerPage && (
          <div className="ml-6 flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded border ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
```

**Props**:
- `currentPage` (number): Current active page
- `totalPages` (number): Total number of pages
- `totalItems` (number): Total number of items
- `itemsPerPage` (number): Items displayed per page
- `onPageChange` (function): Page change handler
- `onItemsPerPageChange` (function): Items per page change handler
- `showItemsPerPage` (boolean): Show items per page selector
- `itemsPerPageOptions` (array): Available items per page options

## 🎨 Styling System

### globalStyles.js
Centralized styling system with design tokens.

```javascript
// Color system
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#041295',  // F1 Brand Blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669'
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  },
  header: {
    bg: '#131319',
    text: '#ffffff',
    border: '#374151'
  }
};

// Typography system
export const typography = {
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: '1.2'
  },
  pageDescription: {
    fontSize: '0.875rem',
    color: colors.gray[500],
    marginTop: '0.25rem'
  },
  h1: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colors.gray[900]
  },
  h2: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: colors.gray[900]
  },
  body1Regular: {
    fontSize: '1rem',
    fontWeight: '400',
    color: colors.gray[700]
  },
  body2Regular: {
    fontSize: '0.875rem',
    fontWeight: '400',
    color: colors.gray[600]
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: '400',
    color: colors.gray[500]
  }
};

// Spacing system
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem'
};

// Layout system
export const layout = {
  containerMaxWidth: '1200px',
  sidebarWidth: '16rem',
  headerHeight: '4rem'
};

// Input styles
export const inputStyles = {
  default: {
    width: '100%',
    padding: '0.625rem 0.75rem',
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    color: colors.gray[900],
    outline: 'none',
    transition: 'all 0.2s ease-in-out'
  },
  focus: {
    borderColor: colors.primary[500],
    boxShadow: `0 0 0 3px ${colors.primary[500]}20`
  },
  error: {
    borderColor: colors.error[500],
    boxShadow: `0 0 0 3px ${colors.error[500]}20`
  }
};
```

### buttonStyles.js
Button styling system with variants.

```javascript
import { colors } from './globalStyles.js';

export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary[500],
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease-in-out',
    outline: 'none'
  },
  secondary: {
    backgroundColor: 'white',
    color: colors.gray[700],
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: '0.375rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease-in-out',
    outline: 'none'
  },
  danger: {
    backgroundColor: colors.error[500],
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease-in-out',
    outline: 'none'
  }
};
```

## 🔧 Usage Patterns

### Component Integration
```javascript
// Example: Using FidoKeyManagement with toast notifications
import FidoKeyManagement from './components/FidoKeyManagement';

const App = () => {
  return (
    <div className="app">
      <FidoKeyManagement />
    </div>
  );
};
```

### State Management Pattern
```javascript
// Example: Managing device state
const [devices, setDevices] = useState([]);
const [selectedDevice, setSelectedDevice] = useState(null);

// Update device status
const updateDeviceStatus = (deviceId, newStatus) => {
  setDevices(prev => prev.map(device => 
    device.id === deviceId 
      ? { ...device, status: newStatus }
      : device
  ));
};
```

### Event Handling Pattern
```javascript
// Example: Handling user interactions
const handleDeviceAction = async (device, action) => {
  try {
    setLoading(true);
    const result = await performDeviceAction(device.id, action);
    showSuccess(`${action} completed successfully`);
    updateDeviceState(device.id, result);
  } catch (error) {
    showError(`Failed to ${action}: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

---

This component reference provides comprehensive documentation for all React components in the F1 FIDO Key Manager application, formatted for AI tool development and integration.

