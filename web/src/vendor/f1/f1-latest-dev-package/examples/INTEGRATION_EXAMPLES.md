# F1 FIDO Key Manager - Integration Examples

## 📋 Overview

This document provides practical integration examples for the F1 FIDO Key Manager application. These examples are designed for AI tool development and demonstrate common integration patterns, API usage, and component implementations.

## 🔌 API Integration Examples

### Authentication Integration

#### Login Implementation
```javascript
// Authentication service
class AuthService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      this.token = data.accessToken;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      this.token = data.accessToken;
      return data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.token = null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Usage in React component
const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authService = new AuthService('https://api.f1fido.com');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(credentials);
      onLogin(userData);
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### Device Management Integration

#### Device Discovery and Management
```javascript
// Device service
class DeviceService {
  constructor(authService) {
    this.authService = authService;
    this.baseURL = 'https://api.f1fido.com';
  }

  async discoverDevices() {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/devices/discover`, {
        method: 'POST',
        headers: this.authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Device discovery failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Discovery error:', error);
      throw error;
    }
  }

  async getDevices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    
    try {
      const response = await fetch(`${this.baseURL}/api/v1/devices?${queryString}`, {
        headers: this.authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch devices error:', error);
      throw error;
    }
  }

  async configureDevice(deviceId, configuration) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/devices/${deviceId}/configure`, {
        method: 'POST',
        headers: this.authService.getAuthHeaders(),
        body: JSON.stringify(configuration)
      });

      if (!response.ok) {
        throw new Error('Device configuration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Configuration error:', error);
      throw error;
    }
  }

  async assignDevice(deviceId, assignment) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/devices/${deviceId}/assign`, {
        method: 'POST',
        headers: this.authService.getAuthHeaders(),
        body: JSON.stringify(assignment)
      });

      if (!response.ok) {
        throw new Error('Device assignment failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Assignment error:', error);
      throw error;
    }
  }
}

// Usage in React component
const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useSimpleToast();

  const authService = new AuthService('https://api.f1fido.com');
  const deviceService = new DeviceService(authService);

  const handleDiscoverDevices = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await deviceService.discoverDevices();
      setDevices(prev => [...prev, ...result.devices]);
      showSuccess(`Discovered ${result.devices.length} new devices`);
    } catch (error) {
      setError('Failed to discover devices');
      showError('Device discovery failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureDevice = async (device, policyId) => {
    try {
      const configuration = {
        policyId,
        configuration: {
          pinRequired: true,
          biometricEnabled: true,
          timeout: 300
        }
      };

      await deviceService.configureDevice(device.id, configuration);
      
      // Update local state
      setDevices(prev => prev.map(d => 
        d.id === device.id 
          ? { ...d, status: 'Configured', configuredPolicy: { id: policyId } }
          : d
      ));

      showSuccess('Device configured successfully');
    } catch (error) {
      showError('Failed to configure device');
    }
  };

  const handleAssignDevice = async (device, userId, idpProvider) => {
    try {
      const assignment = {
        userId,
        idpProvider
      };

      await deviceService.assignDevice(device.id, assignment);
      
      // Update local state
      setDevices(prev => prev.map(d => 
        d.id === device.id 
          ? { ...d, status: 'Assigned', assignedUser: userId }
          : d
      ));

      showSuccess('Device assigned successfully');
    } catch (error) {
      showError('Failed to assign device');
    }
  };

  return (
    <div>
      <button onClick={handleDiscoverDevices} disabled={loading}>
        {loading ? 'Discovering...' : 'Discover Devices'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      <div className="device-list">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onConfigure={handleConfigureDevice}
            onAssign={handleAssignDevice}
          />
        ))}
      </div>
    </div>
  );
};
```

### Policy Management Integration

#### Policy Service Implementation
```javascript
class PolicyService {
  constructor(authService) {
    this.authService = authService;
    this.baseURL = 'https://api.f1fido.com';
  }

  async getPolicies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    
    try {
      const response = await fetch(`${this.baseURL}/api/v1/policies?${queryString}`, {
        headers: this.authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch policies');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch policies error:', error);
      throw error;
    }
  }

  async createPolicy(policyData) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/policies`, {
        method: 'POST',
        headers: this.authService.getAuthHeaders(),
        body: JSON.stringify(policyData)
      });

      if (!response.ok) {
        throw new Error('Failed to create policy');
      }

      return await response.json();
    } catch (error) {
      console.error('Create policy error:', error);
      throw error;
    }
  }

  async applyPolicy(policyId, deviceIds) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/policies/${policyId}/apply`, {
        method: 'POST',
        headers: this.authService.getAuthHeaders(),
        body: JSON.stringify({ deviceIds })
      });

      if (!response.ok) {
        throw new Error('Failed to apply policy');
      }

      return await response.json();
    } catch (error) {
      console.error('Apply policy error:', error);
      throw error;
    }
  }

  async getPolicyTemplates() {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/policies/templates`, {
        headers: this.authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch policy templates');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch templates error:', error);
      throw error;
    }
  }
}

// Policy creation component
const PolicyCreation = ({ onPolicyCreated }) => {
  const [policyData, setPolicyData] = useState({
    name: '',
    description: '',
    type: 'authentication',
    configuration: {
      authentication: {
        pinRequired: true,
        pinComplexity: 'medium',
        biometricEnabled: false,
        timeout: 1800,
        maxRetries: 5,
        lockoutDuration: 15
      }
    }
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useSimpleToast();

  const authService = new AuthService('https://api.f1fido.com');
  const policyService = new PolicyService(authService);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const result = await policyService.getPolicyTemplates();
      setTemplates(result.templates);
    } catch (error) {
      showError('Failed to load policy templates');
    }
  };

  const handleTemplateSelect = (template) => {
    setPolicyData({
      ...policyData,
      name: template.name,
      description: template.description,
      configuration: template.configuration
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPolicy = await policyService.createPolicy(policyData);
      showSuccess('Policy created successfully');
      onPolicyCreated(newPolicy);
    } catch (error) {
      showError('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Policy Name</label>
        <input
          type="text"
          value={policyData.name}
          onChange={(e) => setPolicyData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={policyData.description}
          onChange={(e) => setPolicyData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <label>Template</label>
        <select onChange={(e) => {
          const template = templates.find(t => t.id === e.target.value);
          if (template) handleTemplateSelect(template);
        }}>
          <option value="">Select a template</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Authentication Settings</h3>
        
        <label>
          <input
            type="checkbox"
            checked={policyData.configuration.authentication.pinRequired}
            onChange={(e) => setPolicyData(prev => ({
              ...prev,
              configuration: {
                ...prev.configuration,
                authentication: {
                  ...prev.configuration.authentication,
                  pinRequired: e.target.checked
                }
              }
            }))}
          />
          PIN Required
        </label>

        <label>
          PIN Complexity
          <select
            value={policyData.configuration.authentication.pinComplexity}
            onChange={(e) => setPolicyData(prev => ({
              ...prev,
              configuration: {
                ...prev.configuration,
                authentication: {
                  ...prev.configuration.authentication,
                  pinComplexity: e.target.value
                }
              }
            }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={policyData.configuration.authentication.biometricEnabled}
            onChange={(e) => setPolicyData(prev => ({
              ...prev,
              configuration: {
                ...prev.configuration,
                authentication: {
                  ...prev.configuration.authentication,
                  biometricEnabled: e.target.checked
                }
              }
            }))}
          />
          Biometric Authentication
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Policy'}
      </button>
    </form>
  );
};
```

## 🔄 WebSocket Integration

### Real-time Updates Implementation
```javascript
class WebSocketService {
  constructor(authService) {
    this.authService = authService;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  connect() {
    const token = this.authService.token;
    if (!token) {
      throw new Error('Authentication required for WebSocket connection');
    }

    this.ws = new WebSocket(`wss://api.f1fido.com/ws?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleMessage(message) {
    const { type, data } = message;
    const listeners = this.listeners.get(type) || [];
    
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }

  subscribe(eventType, listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Usage in React component
const DeviceMonitor = () => {
  const [devices, setDevices] = useState([]);
  const { showInfo } = useSimpleToast();

  const authService = new AuthService('https://api.f1fido.com');
  const wsService = new WebSocketService(authService);

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect();

    // Subscribe to device status updates
    const unsubscribeDeviceStatus = wsService.subscribe('device.status', (data) => {
      setDevices(prev => prev.map(device => 
        device.id === data.deviceId 
          ? { ...device, status: data.status, assignedUser: data.assignedUser }
          : device
      ));
      
      showInfo(`Device ${data.deviceId} status updated to ${data.status}`);
    });

    // Subscribe to policy updates
    const unsubscribePolicyUpdate = wsService.subscribe('policy.updated', (data) => {
      showInfo(`Policy ${data.name} has been updated`);
    });

    // Subscribe to audit events
    const unsubscribeAuditEvent = wsService.subscribe('audit.event', (data) => {
      if (data.severity === 'error' || data.severity === 'critical') {
        showError(`Security event: ${data.eventType}`);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeDeviceStatus();
      unsubscribePolicyUpdate();
      unsubscribeAuditEvent();
      wsService.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Device Monitor</h2>
      <div className="device-grid">
        {devices.map(device => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p>Status: {device.status}</p>
            <p>Assigned: {device.assignedUser || 'Unassigned'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎨 Component Integration Examples

### Custom Hook for Device Management
```javascript
// Custom hook for device management
const useDeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useSimpleToast();

  const authService = new AuthService('https://api.f1fido.com');
  const deviceService = new DeviceService(authService);

  const loadDevices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deviceService.getDevices(params);
      setDevices(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      showError('Failed to load devices');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deviceService, showError]);

  const discoverDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await deviceService.discoverDevices();
      setDevices(prev => [...prev, ...result.devices]);
      showSuccess(`Discovered ${result.devices.length} new devices`);
      return result;
    } catch (err) {
      setError(err.message);
      showError('Device discovery failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deviceService, showSuccess, showError]);

  const configureDevice = useCallback(async (deviceId, configuration) => {
    try {
      const result = await deviceService.configureDevice(deviceId, configuration);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'Configured', configuredPolicy: result.configuredPolicy }
          : device
      ));

      showSuccess('Device configured successfully');
      return result;
    } catch (err) {
      showError('Failed to configure device');
      throw err;
    }
  }, [deviceService, showSuccess, showError]);

  const assignDevice = useCallback(async (deviceId, assignment) => {
    try {
      const result = await deviceService.assignDevice(deviceId, assignment);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'Assigned', assignedUser: assignment.userId }
          : device
      ));

      showSuccess('Device assigned successfully');
      return result;
    } catch (err) {
      showError('Failed to assign device');
      throw err;
    }
  }, [deviceService, showSuccess, showError]);

  const resetDevice = useCallback(async (deviceId) => {
    try {
      await deviceService.resetDevice(deviceId);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: 'Connected', 
              assignedUser: null, 
              configuredPolicy: null 
            }
          : device
      ));

      showSuccess('Device reset successfully');
    } catch (err) {
      showError('Failed to reset device');
      throw err;
    }
  }, [deviceService, showSuccess, showError]);

  return {
    devices,
    loading,
    error,
    loadDevices,
    discoverDevices,
    configureDevice,
    assignDevice,
    resetDevice
  };
};

// Usage in component
const DeviceManagementPage = () => {
  const {
    devices,
    loading,
    error,
    loadDevices,
    discoverDevices,
    configureDevice,
    assignDevice,
    resetDevice
  } = useDeviceManagement();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    loadDevices({ page: currentPage, pageSize: itemsPerPage });
  }, [currentPage, itemsPerPage, loadDevices]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading && devices.length === 0) {
    return <div>Loading devices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Device Management</h1>
        <button onClick={discoverDevices} disabled={loading}>
          {loading ? 'Discovering...' : 'Discover Devices'}
        </button>
      </div>

      <div className="device-grid">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onConfigure={configureDevice}
            onAssign={assignDevice}
            onReset={resetDevice}
          />
        ))}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(devices.length / itemsPerPage)}
        totalItems={devices.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};
```

### Error Boundary Implementation
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceManagementPage />} />
          <Route path="/policies" element={<PolicyManagement />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};
```

## 🧪 Testing Integration Examples

### Component Testing with React Testing Library
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import DeviceCard from '../components/DeviceCard';

// Mock the toast hook
jest.mock('../components/SimpleToast', () => ({
  useSimpleToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    ToastContainer: () => null
  })
}));

describe('DeviceCard', () => {
  const mockDevice = {
    id: 'device-123',
    name: 'YubiKey 5C NFC',
    manufacturer: 'Yubico',
    status: 'Connected',
    assignedUser: null
  };

  const mockHandlers = {
    onConfigure: jest.fn(),
    onAssign: jest.fn(),
    onReset: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders device information correctly', () => {
    render(<DeviceCard device={mockDevice} {...mockHandlers} />);
    
    expect(screen.getByText('YubiKey 5C NFC')).toBeInTheDocument();
    expect(screen.getByText('Yubico')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  test('shows assign button for unassigned devices', () => {
    render(<DeviceCard device={mockDevice} {...mockHandlers} />);
    
    const assignButton = screen.getByRole('button', { name: /assign/i });
    expect(assignButton).toBeInTheDocument();
    expect(assignButton).not.toBeDisabled();
  });

  test('disables assign button for assigned devices', () => {
    const assignedDevice = { ...mockDevice, status: 'Assigned', assignedUser: 'john.doe@company.com' };
    render(<DeviceCard device={assignedDevice} {...mockHandlers} />);
    
    const assignButton = screen.getByRole('button', { name: /assign/i });
    expect(assignButton).toBeDisabled();
  });

  test('calls onAssign when assign button is clicked', async () => {
    render(<DeviceCard device={mockDevice} {...mockHandlers} />);
    
    const assignButton = screen.getByRole('button', { name: /assign/i });
    fireEvent.click(assignButton);
    
    await waitFor(() => {
      expect(mockHandlers.onAssign).toHaveBeenCalledWith(mockDevice);
    });
  });

  test('calls onConfigure when configure button is clicked', async () => {
    render(<DeviceCard device={mockDevice} {...mockHandlers} />);
    
    const configureButton = screen.getByRole('button', { name: /configure/i });
    fireEvent.click(configureButton);
    
    await waitFor(() => {
      expect(mockHandlers.onConfigure).toHaveBeenCalledWith(mockDevice);
    });
  });
});
```

### API Integration Testing
```javascript
import { jest } from '@jest/globals';
import DeviceService from '../services/DeviceService';

// Mock fetch
global.fetch = jest.fn();

describe('DeviceService', () => {
  let deviceService;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = {
      getAuthHeaders: jest.fn().mockReturnValue({
        'Authorization': 'Bearer mock-token',
        'Content-Type': 'application/json'
      })
    };
    
    deviceService = new DeviceService(mockAuthService);
    fetch.mockClear();
  });

  test('getDevices makes correct API call', async () => {
    const mockResponse = {
      data: [{ id: 'device-123', name: 'Test Device' }],
      pagination: { page: 1, totalPages: 1 }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await deviceService.getDevices({ page: 1, pageSize: 20 });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.f1fido.com/api/v1/devices?page=1&pageSize=20',
      {
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      }
    );

    expect(result).toEqual(mockResponse);
  });

  test('configureDevice handles errors correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    await expect(
      deviceService.configureDevice('device-123', { policyId: 'policy-456' })
    ).rejects.toThrow('Device configuration failed');
  });
});
```

---

These integration examples provide comprehensive patterns for implementing the F1 FIDO Key Manager functionality, suitable for AI tool development and system integration.

