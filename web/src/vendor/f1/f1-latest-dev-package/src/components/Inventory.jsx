import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Download, MoreVertical, X } from 'lucide-react';
import PaginationComponent from './PaginationComponent';
import { colors, typography, spacing, buttonStyles, inputStyles } from '../styles/globalStyles.js';

const Inventory = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [deviceToRevoke, setDeviceToRevoke] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const inventoryData = [
    {
      id: 3,
      serialNumber: 'TH-5110-003',
      deviceMode: 'FIDO2 + PIV',
      policy: 'Enterprise Security Policy',
      userName: 'admin@company.com',
      updatedOn: '2024-09-02 10:30',
      status: 'Enrolled',
      deviceName: 'Thales SafeNet eToken 5110',
      version: '1.2.1',
      aaguid: 'a4e9fc6d-4cbe-4758-b8ba-37598bb76bf8'
    },
    {
      id: 5,
      serialNumber: 'TH-5300-005',
      deviceMode: 'FIDO2 + PIV + OTP',
      policy: 'Executive Policy',
      userName: 'ceo@company.com',
      updatedOn: '2024-09-02 09:45',
      status: 'Configured',
      deviceName: 'Thales SafeNet eToken 5300',
      version: '1.3.2',
      aaguid: 'a4e9fc6d-4cbe-4758-b8ba-37598bb76bf8'
    },
    {
      id: 1,
      serialNumber: 'YK-5C-NFC-001',
      deviceMode: 'FIDO2',
      policy: 'Corporate Security Standard',
      userName: 'john.doe@company.com',
      updatedOn: '2024-09-01 14:30',
      status: 'Configured',
      deviceName: 'YubiKey 5C NFC',
      version: '5.4.3',
      aaguid: '2fc0579f-8113-47ea-b116-bb5a8db9202a'
    },
    {
      id: 2,
      serialNumber: 'YK-5-NFC-002',
      deviceMode: 'FIDO2 + PIV',
      policy: 'Executive Policy',
      userName: 'jane.smith@company.com',
      updatedOn: '2024-09-01 12:15',
      status: 'Enrolled',
      deviceName: 'YubiKey 5 NFC',
      version: '5.4.3',
      aaguid: '2fc0579f-8113-47ea-b116-bb5a8db9202a'
    },
    {
      id: 6,
      serialNumber: 'FT-EPASS-006',
      deviceMode: 'FIDO2',
      policy: 'Standard Policy',
      userName: 'developer@company.com',
      updatedOn: '2024-08-29 11:20',
      status: 'Enrolled',
      deviceName: 'Feitian ePass FIDO',
      version: '2.1.0',
      aaguid: '77010bd7-212a-4fc9-b236-d2ca5e9d4084'
    },
    {
      id: 4,
      serialNumber: 'SK-BIO-004',
      deviceMode: 'FIDO2',
      policy: 'Biometric Policy',
      userName: 'sarah.jones@company.com',
      updatedOn: '2024-09-01 09:20',
      status: 'Enrolled',
      deviceName: 'SoloKey Bio',
      version: '4.1.5',
      aaguid: '8876631b-d4a0-427f-5773-0ec71c9e0279'
    },
    {
      id: 5,
      serialNumber: 'TK-BIO-005',
      deviceMode: 'FIDO2',
      policy: 'Corporate Security Standard',
      userName: 'alex.brown@company.com',
      updatedOn: '2024-08-28 11:30',
      status: 'Revoked',
      deviceName: 'TrustKey Bio',
      version: '2.1.0',
      aaguid: 'dd4ec289-e01d-41c9-bb89-70fa845d4bf2'
    }
  ];

  const handleRevokeDevice = (device) => {
    setDeviceToRevoke(device);
    setShowRevokeModal(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (deviceId) => {
    setOpenDropdown(openDropdown === deviceId ? null : deviceId);
  };

  const confirmRevoke = () => {
    // Here you would typically make an API call to revoke the device
    console.log('Revoking device:', deviceToRevoke);
    setShowRevokeModal(false);
    setDeviceToRevoke(null);
    // You could update the device status in the state here
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Device Inventory</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of all registered FIDO devices</p>
        </div>
        <button 
          style={buttonStyles.primary}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user or device name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...inputStyles.default,
              width: '100%',
              paddingLeft: '40px'
            }}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="f1-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Device</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Device Mode</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Policy</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 cursor-pointer" onClick={() => toggleRowExpansion(item.id)}>
                      <div className="flex items-center">
                        {expandedRows.has(item.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">{item.deviceName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {item.deviceMode}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {item.policy}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {item.userName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openDropdown === item.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRevokeDevice(item);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 bg-gray-50">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Device Name
                            </label>
                            <p className="text-sm text-gray-900">{item.deviceName}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Version
                            </label>
                            <p className="text-sm text-gray-900">{item.version}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              AAGUID
                            </label>
                            <p className="text-sm text-gray-900 font-mono">{item.aaguid}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <PaginationComponent
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Revoke Device Modal */}
      {showRevokeModal && deviceToRevoke && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revoke Device</h3>
              <button
                onClick={() => setShowRevokeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to revoke this device? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Device:</span>
                    <span className="text-sm text-gray-900">{deviceToRevoke.deviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Serial:</span>
                    <span className="text-sm text-gray-900">{deviceToRevoke.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">User:</span>
                    <span className="text-sm text-gray-900">{deviceToRevoke.userName}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevoke}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Revoke Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

