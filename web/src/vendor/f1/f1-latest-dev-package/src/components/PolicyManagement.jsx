import React, { useState } from 'react'
import { Shield, Plus, Edit, Trash2, Users, Key, Settings } from 'lucide-react'
import PolicyCreation from './PolicyCreation'
import DeletePolicyConfirmation from './DeletePolicyConfirmation'
import PaginationComponent from './PaginationComponent'
import { colors, typography, spacing, buttonStyles, inputStyles } from '../styles/globalStyles.js'

const PolicyManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Enterprise Security Policy',
      description: 'High-security policy for enterprise users',
      type: 'Managed Policy',
      fidoVersion: 'FIDO2.1',
      deviceCount: 45,
      userCount: 120,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Standard User Policy',
      description: 'Standard security policy for regular users',
      type: 'Generic Policy',
      fidoVersion: 'FIDO2.0',
      deviceCount: 23,
      userCount: 67,
      status: 'Active'
    }
  ]);

  const handleCreatePolicy = () => {
    setShowCreateForm(true)
    setSelectedPolicy(null)
  }

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy)
    setShowCreateForm(true)
  }

  const handleBackToList = () => {
    setShowCreateForm(false)
    setSelectedPolicy(null)
  }

  const handleSavePolicy = (policyData, isEditMode = false) => {
    if (isEditMode) {
      // Save As New Policy - always create a new policy when editing
      const newPolicy = {
        ...policyData,
        id: policyData.id || Date.now(),
        deviceCount: 0,
        userCount: 0,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      }
      setPolicies([...policies, newPolicy])
    } else if (selectedPolicy && !isEditMode) {
      // Update existing policy (this case shouldn't happen with current flow)
      setPolicies(policies.map(p => 
        p.id === selectedPolicy.id 
          ? { ...policyData, id: selectedPolicy.id, createdDate: selectedPolicy.createdDate }
          : p
      ))
    } else {
      // Create new policy
      const newPolicy = {
        ...policyData,
        id: Date.now(),
        deviceCount: 0,
        userCount: 0,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      }
      setPolicies([...policies, newPolicy])
    }
    setShowCreateForm(false)
    setSelectedPolicy(null)
  }

  const handleDeletePolicy = (policy) => {
    setPolicyToDelete(policy)
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = (policy) => {
    setPolicies(policies.filter(p => p.id !== policy.id))
    setShowDeleteConfirmation(false)
    setPolicyToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setPolicyToDelete(null)
  }

  // Mock function to get assigned devices for a policy
  // In a real application, this would fetch from an API
  const getAssignedDevices = (policyId) => {
    // Mock data - some policies have assigned devices
    const mockAssignments = {
      1: [
        { id: 'device1', name: 'YubiKey 5 NFC', type: 'YubiKey' },
        { id: 'device2', name: 'Thales SafeNet', type: 'Thales' }
      ],
      2: [], // No assigned devices
      3: [
        { id: 'device3', name: 'YubiKey 5C', type: 'YubiKey' }
      ]
    }
    return mockAssignments[policyId] || []
  }

  // Pagination logic
  const totalPages = Math.ceil(policies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = policies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // If showing create form, render PolicyCreation component
  if (showCreateForm) {
    return <PolicyCreation onBack={handleBackToList} selectedPolicy={selectedPolicy} onSave={handleSavePolicy} />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Managed':
        return 'bg-blue-100 text-blue-800'
      case 'Unmanaged':
        return 'bg-purple-100 text-purple-800'
      case 'Generic':
        return 'bg-orange-100 text-orange-900' // Changed from text-orange-800 to text-orange-900 for better contrast
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={typography.pageTitle}>Policy Management</h1>
          <p style={typography.pageDescription}>Manage FIDO authentication policies</p>
        </div>
        <button
          onClick={handleCreatePolicy}
          style={buttonStyles.primary}
        >
          <Plus className="w-4 h-4" />
          <span>Create Policy</span>
        </button>
      </div>

      {/* Policies Table */}
      <div className="f1-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Policy Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Devices</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Users</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPolicies.map((policy) => (
                <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{policy.name}</p>
                      <p className="text-sm text-gray-500">{policy.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(policy.type)}`}>
                      {policy.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{policy.deviceCount}</td>
                  <td className="py-3 px-4 text-gray-900">{policy.userCount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Policy"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <PaginationComponent
          currentPage={currentPage}
          totalItems={policies.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {policies.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 style={typography.h3}>No policies created yet</h3>
            <p style={typography.body2Regular} className="mb-4">Create your first FIDO authentication policy to get started</p>
            <button
              onClick={handleCreatePolicy}
              style={buttonStyles.primary}
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Policy</span>
            </button>
          </div>
        )}
      </div>

      {/* Policy Creation Guidance */}
      <div className="f1-card">
        <h3 style={typography.h2}>Policy Type Guidance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 style={typography.h4}>Generic Policy</h4>
            <p style={typography.body2Regular} className="mb-3 text-gray-700">Recommended for Thales and Yubikey devices for standard FIDO support</p>
            <ul style={typography.body2Regular} className="text-gray-600 space-y-1">
              <li>• Thales and Yubikey devices</li>
              <li>• Standard FIDO features</li>
              <li>• Flexible configuration</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 style={typography.h4}>Managed Policy</h4>
            <p style={typography.body2Regular} className="mb-3 text-gray-700">Recommended for Thales devices with additional enterprise features that go beyond the standard FIDO features</p>
            <ul style={typography.body2Regular} className="text-gray-600 space-y-1">
              <li>• Thales devices</li>
              <li>• Beyond standard FIDO</li>
              <li>• Admin PIN required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && policyToDelete && (
        <DeletePolicyConfirmation
          policy={policyToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          assignedDevices={getAssignedDevices(policyToDelete.id)}
        />
      )}
    </div>
  )
}

export default PolicyManagement

