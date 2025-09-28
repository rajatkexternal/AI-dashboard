import React, { useState } from 'react'
import { Search, Filter, Download, ChevronDown, ChevronRight, User } from 'lucide-react'
import PaginationComponent from './PaginationComponent'
import { colors, typography, inputStyles, buttonStyles } from '../styles/globalStyles'

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('All Actions')
  const [userFilter, setUserFilter] = useState('All Users')
  const [expandedRows, setExpandedRows] = useState(new Set()) // No rows expanded by default
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Sample audit log data with new structure matching the screenshot
  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-03-15\n14:30:25',
      user: 'admin@company.com',
      action: 'FIDO_KEY_REGISTERED',
      resource: 'YubiKey 5 NFC (YK-003-789)',
      policyApplied: 'Enterprise Managed Policy',
      details: 'New FIDO key registered for user john...',
      severity: 'INFO',
      severityColor: 'blue',
      expandedDetails: {
        description: 'FIDO key registration completed successfully',
        agent: 'a47e2f4e-3cf4-479c-b51c-6470f4f3-5727',
        fullDetails: 'User admin@company.com successfully registered a new YubiKey 5 NFC device with serial number YK-003-789. The device was validated and added to the Enterprise Managed Policy group.',
        jsonData: {
          "event_id": "evt_7d82457-aac9-4826-9986-a8392b2153f3",
          "timestamp": "2024-03-15T14:30:25.000Z",
          "action": "FIDO_KEY_REGISTERED",
          "user_id": "admin@company.com",
          "device_info": {
            "type": "YubiKey 5 NFC",
            "serial": "YK-003-789",
            "manufacturer": "Yubico"
          },
          "policy_applied": "Enterprise Managed Policy",
          "result": "success"
        }
      }
    },
    {
      id: 2,
      timestamp: '2024-03-15\n14:25:12',
      user: 'jane.smith@company.com',
      action: 'AUTHENTICATION_SUCCESS',
      resource: 'F1 Admin Console',
      policyApplied: 'Standard Unmanaged Policy',
      details: 'User successfully authenticated using ...',
      severity: 'INFO',
      severityColor: 'blue',
      expandedDetails: {
        description: 'Successful authentication to F1 Admin Console',
        agent: 'web-console-auth',
        fullDetails: 'User jane.smith@company.com successfully authenticated to the F1 Admin Console using FIDO2 authentication method.',
        jsonData: {
          "event_id": "evt_8e93568-bbd0-5937-a097-b9403c3264g4",
          "timestamp": "2024-03-15T14:25:12.000Z",
          "action": "AUTHENTICATION_SUCCESS",
          "user_id": "jane.smith@company.com",
          "resource": "F1 Admin Console",
          "auth_method": "FIDO2",
          "policy_applied": "Standard Unmanaged Policy",
          "result": "success"
        }
      }
    },
    {
      id: 3,
      timestamp: '2024-03-15\n14:20:45',
      user: 'admin@company.com',
      action: 'POLICY_CREATED',
      resource: 'High Security Policy',
      policyApplied: 'N/A',
      details: 'New authentication policy created with...',
      severity: 'INFO',
      severityColor: 'blue',
      expandedDetails: {
        description: 'New authentication policy created',
        agent: 'policy-management-service',
        fullDetails: 'Administrator created a new High Security Policy with enhanced authentication requirements and device restrictions.',
        jsonData: {
          "event_id": "evt_9f04679-cce1-6048-b108-ca514d4375h5",
          "timestamp": "2024-03-15T14:20:45.000Z",
          "action": "POLICY_CREATED",
          "user_id": "admin@company.com",
          "policy_name": "High Security Policy",
          "policy_type": "authentication",
          "result": "success"
        }
      }
    },
    {
      id: 4,
      timestamp: '2024-03-15\n14:15:33',
      user: 'system',
      action: 'BULK_CONFIGURATION',
      resource: 'Enterprise Managed Policy',
      policyApplied: 'Enterprise Managed Policy',
      details: 'Bulk configuration applied to 15 conne...',
      severity: 'INFO',
      severityColor: 'blue',
      expandedDetails: {
        description: 'Bulk configuration update applied',
        agent: 'system-automation',
        fullDetails: 'System automatically applied bulk configuration changes to 15 connected devices under the Enterprise Managed Policy.',
        jsonData: {
          "event_id": "evt_af15780-ddf2-7159-c219-db625e5486i6",
          "timestamp": "2024-03-15T14:15:33.000Z",
          "action": "BULK_CONFIGURATION",
          "user_id": "system",
          "affected_devices": 15,
          "policy_applied": "Enterprise Managed Policy",
          "result": "success"
        }
      }
    },
    {
      id: 5,
      timestamp: '2024-03-15\n14:10:18',
      user: 'bob.wilson@company.com',
      action: 'AUTHENTICATION_FAILED',
      resource: 'YubiKey 5C (YK-002-567)',
      policyApplied: 'High Security Policy',
      details: 'Authentication failed - PIN verification ...',
      severity: 'WARNING',
      severityColor: 'yellow',
      expandedDetails: {
        description: 'Authentication attempt failed due to PIN verification failure',
        agent: 'auth-service',
        fullDetails: 'User bob.wilson@company.com failed to authenticate using YubiKey 5C device. PIN verification failed after 3 attempts.',
        jsonData: {
          "event_id": "evt_bg26891-eeg3-8260-d320-ec736f6597j7",
          "timestamp": "2024-03-15T14:10:18.000Z",
          "action": "AUTHENTICATION_FAILED",
          "user_id": "bob.wilson@company.com",
          "device_info": {
            "type": "YubiKey 5C",
            "serial": "YK-002-567"
          },
          "failure_reason": "PIN verification failed",
          "attempts": 3,
          "policy_applied": "High Security Policy",
          "result": "failure"
        }
      }
    }
  ]



  const toggleRowExpansion = (rowId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId)
    } else {
      newExpanded.add(rowId)
    }
    setExpandedRows(newExpanded)
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === 'All Actions' || log.action === actionFilter
    const matchesUser = userFilter === 'All Users' || log.user === userFilter
    
    return matchesSearch && matchesAction && matchesUser
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={typography.pageTitle}>Audit Logs</h1>
          <p style={typography.pageDescription}>Monitor system activities, policy compliance, and device management</p>
        </div>
        <button style={buttonStyles.primary}>
          <Download className="w-4 h-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4 mb-8 mt-8">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        {/* Action Filter */}
        <div className="relative">
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>All Actions</option>
            <option>FIDO_KEY_REGISTERED</option>
            <option>AUTHENTICATION_SUCCESS</option>
            <option>AUTHENTICATION_FAILED</option>
            <option>POLICY_CREATED</option>
            <option>BULK_CONFIGURATION</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* User Filter */}
        <div className="relative">
          <select 
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>All Users</option>
            <option>admin@company.com</option>
            <option>jane.smith@company.com</option>
            <option>bob.wilson@company.com</option>
            <option>system</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs, policies, devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-3 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Applied</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <React.Fragment key={log.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <button
                      onClick={() => toggleRowExpansion(log.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows.has(log.id) ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-mono whitespace-pre-line">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {log.policyApplied === 'N/A' ? (
                      <span className="text-gray-500">N/A</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.policyApplied}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
                {expandedRows.has(log.id) && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Agent</h4>
                          <p className="text-sm text-gray-600 font-mono">{log.expandedDetails.agent}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{log.expandedDetails.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-xs overflow-x-auto">
                            <pre>{JSON.stringify(log.expandedDetails.jsonData, null, 2)}</pre>
                          </div>
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
        totalItems={filteredLogs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  )
}

export default AuditLogs

