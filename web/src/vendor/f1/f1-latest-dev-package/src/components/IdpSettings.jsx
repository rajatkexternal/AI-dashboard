import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, AlertTriangle, X, Save, Building, Cloud, Shield, Key } from 'lucide-react';
import PaginationComponent from './PaginationComponent';
import { colors, typography, spacing, buttonStyles, inputStyles } from '../styles/globalStyles.js';

const IdpSettings = () => {
  const [idps, setIdps] = useState([
    {
      id: 1,
      name: 'Corporate Entra ID',
      type: 'entra_id',
      status: 'Configured',
      config: {
        name: 'Corporate Entra ID',
        tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        clientId: '12345678-90ab-cdef-1234-567890abcdef',
        clientSecret: '***hidden***',
        graphApi: 'https://graph.microsoft.com'
      }
    },
    {
      id: 2,
      name: 'STA Production',
      type: 'sta',
      status: 'Configured',
      config: {
        name: 'STA Production',
        endpoint: 'https://sta.company.com/api',
        apiKey: '***hidden***',
        domain: 'company.com'
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIdpType, setSelectedIdpType] = useState('');
  const [editingIdp, setEditingIdp] = useState(null);
  const [formData, setFormData] = useState({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idpToDelete, setIdpToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const idpTypes = [
    { id: 'entra_id', name: 'Microsoft Entra ID', icon: Building, color: 'blue' },
    { id: 'sta', name: 'STA Identity Provider', icon: Shield, color: 'purple' }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Configured': 'bg-green-100 text-green-800',
      'Connected': 'bg-green-100 text-green-800',
      'Error': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const handleAddIdp = (type) => {
    setSelectedIdpType(type);
    setEditingIdp(null);
    setFormData({});
    setShowAddModal(true);
  };

  const handleEditIdp = (idp) => {
    setSelectedIdpType(idp.type);
    setEditingIdp(idp);
    setFormData(idp.config);
    setShowAddModal(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult('');
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate for demo
    if (success) {
      setTestResult('Connection successful!');
      // If editing an existing IDP, update its status to Configured
      if (editingIdp) {
        setIdps(prev => prev.map(idp => 
          idp.id === editingIdp.id 
            ? { ...idp, status: 'Configured' }
            : idp
        ));
      }
    } else {
      setTestResult('Connection failed. Please check your configuration.');
    }
    setTestingConnection(false);
  };

  const handleDeleteIdp = (idp) => {
    setIdpToDelete(idp);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIdps(prev => prev.filter(idp => idp.id !== idpToDelete.id));
    setShowDeleteModal(false);
    setIdpToDelete(null);
  };

  const handleSave = () => {
    // Validate required fields
    const requiredFields = selectedIdpType === 'entra_id' 
      ? ['name', 'tenantId', 'clientId', 'clientSecret']
      : ['name', 'tenantId', 'apiKey', 'restApiEndpoint', 'mappingAttribute'];
    
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (editingIdp) {
      // Update existing IDP
      setIdps(prev => prev.map(idp => 
        idp.id === editingIdp.id 
          ? { ...idp, config: formData, name: formData.name || idp.name }
          : idp
      ));
    } else {
      // Add new IDP - only set to Configured if test connection was successful
      const newIdp = {
        id: Date.now(),
        name: formData.name || `New ${selectedIdpType.toUpperCase()} Provider`,
        type: selectedIdpType,
        status: testResult === 'Connection successful!' ? 'Configured' : 'Error',
        lastSync: 'Never',
        users: 0,
        config: formData
      };
      setIdps(prev => [...prev, newIdp]);
    }
    
    setShowAddModal(false);
    setFormData({});
    setTestResult('');
  };

  const renderConfigForm = () => {
    if (selectedIdpType === 'entra_id') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter configuration name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Directory/Tenant ID *</label>
            <input
              type="text"
              required
              value={formData.tenantId || ''}
              onChange={(e) => handleInputChange('tenantId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application/Client ID *</label>
            <input
              type="text"
              required
              value={formData.clientId || ''}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12345678-90ab-cdef-1234-567890abcdef"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret *</label>
            <input
              type="password"
              required
              value={formData.clientSecret || ''}
              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter client secret"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graph API Endpoint</label>
            <input
              type="url"
              value={formData.graphApi || 'https://graph.microsoft.com'}
              onChange={(e) => handleInputChange('graphApi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://graph.microsoft.com"
            />
          </div>
        </div>
      );
    }

    if (selectedIdpType === 'sta') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter configuration name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant ID *</label>
            <input
              type="text"
              required
              value={formData.tenantId || ''}
              onChange={(e) => handleInputChange('tenantId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter STA tenant identifier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key *</label>
            <input
              type="password"
              required
              value={formData.apiKey || ''}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter API key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">REST API Endpoint *</label>
            <input
              type="url"
              required
              value={formData.restApiEndpoint || ''}
              onChange={(e) => handleInputChange('restApiEndpoint', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://api.sta-provider.com/v1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mapping Attribute *</label>
            <select
              required
              value={formData.mappingAttribute || ''}
              onChange={(e) => handleInputChange('mappingAttribute', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select mapping attribute</option>
              <option value="upn">UPN (User Principal Name)</option>
              <option value="email">Email</option>
              <option value="samAccountName">samAccountName</option>
            </select>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        Configuration form for {selectedIdpType} will be implemented here.
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={typography.pageTitle}>Identity Provider Settings</h1>
          <p style={typography.pageDescription}>Configure and manage identity provider integrations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={buttonStyles.primary}
        >
          <Plus className="w-4 h-4" />
          <span>Add Identity Provider</span>
        </button>
      </div>

      {/* Identity Providers List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 style={typography.h2}>Configured Identity Providers</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {idps.map((idp) => {
                return (
                  <tr key={idp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{idp.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {idp.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(idp.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditIdp(idp)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteIdp(idp)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <PaginationComponent
          currentPage={currentPage}
          totalItems={idps.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Add/Edit IDP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingIdp ? 'Edit Identity Provider' : 'Add Identity Provider'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {!selectedIdpType ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Identity Provider Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {idpTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedIdpType(type.id)}
                          className="p-4 border-2 border-gray-200 rounded-md text-left hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-md mr-3">
                              <Icon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{type.name}</h4>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setSelectedIdpType('')}
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      ← Back
                    </button>
                    <h3 className="text-lg font-medium text-gray-900">
                      Configure {idpTypes.find(t => t.id === selectedIdpType)?.name}
                    </h3>
                  </div>

                  {renderConfigForm()}

                  {/* Test Connection */}
                  {testResult && (
                    <div className={`mt-4 p-3 rounded-md ${
                      testResult.includes('successful') 
                        ? 'bg-gray-50 border border-gray-200 text-gray-700'
                        : 'bg-gray-50 border border-gray-200 text-gray-700'
                    }`}>
                      {testResult}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      style={buttonStyles.secondary}
                      className="disabled:opacity-50"
                    >
                      {testingConnection ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {testingConnection ? 'Testing...' : 'Test Connection'}
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowAddModal(false)}
                        style={buttonStyles.secondary}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        style={buttonStyles.primary}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete IDP Modal */}
      {showDeleteModal && idpToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Identity Provider</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this identity provider? This action cannot be undone and will affect all users associated with this provider.
              </p>
              
              <div className="bg-gray-50 rounded-md p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Provider:</span>
                    <span className="text-sm text-gray-900">{idpToDelete.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="text-sm text-gray-900 capitalize">{idpToDelete.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Users:</span>
                    <span className="text-sm text-gray-900">{idpToDelete.users}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                style={buttonStyles.secondary}
                className="flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  ...buttonStyles.primary,
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626'
                }}
                className="flex-1"
              >
                Delete Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdpSettings;

