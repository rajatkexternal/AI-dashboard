import React from 'react';
import { TrendingUp, Users, Key, AlertTriangle, Plus, FileText, Shield, Download } from 'lucide-react';
import { colors, typography, spacing, buttonStyles } from '../styles/globalStyles.js';

const Dashboard = ({ onNavigate, setActiveTab }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={typography.pageTitle}>F1 Admin Dashboard</h1>
          <p style={typography.pageDescription}>Welcome to the F1 FIDO Key Manager</p>
        </div>
      </div>

      {/* Local Service Download */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h2 style={typography.h2}>System Requirements</h2>
            <h3 style={typography.h3}>F1 Local Service Required</h3>
            <p className="text-blue-700 mb-4">
              Download and install the F1 Local Service to communicate with FIDO devices. 
              The service runs on <strong>port 9333</strong> and enables device management capabilities.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  // Simulate download
                  const link = document.createElement('a')
                  link.href = '#'
                  link.download = 'F1-Local-Service-Setup.exe'
                  link.click()
                }}
                style={buttonStyles.primary}
              >
                <Download className="w-4 h-4" />
                <span>Download for Windows</span>
              </button>
              <div className="flex items-center space-x-2 text-blue-600">
                <span className="text-sm">Port: <strong>9333</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <h2 style={typography.h2}>System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total FIDO keys</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">128</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Configured</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">85</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revoked</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">14</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 style={typography.h2}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Create Policy */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 style={typography.h3}>Create Policy</h3>
            <button 
              onClick={() => setActiveTab && setActiveTab('policy-management')}
              style={buttonStyles.primary}
            >
              <FileText className="w-4 h-4" />
              Create Policy
            </button>
          </div>

          {/* IDP Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 style={typography.h3}>IDP Settings</h3>
            <button 
              onClick={() => setActiveTab && setActiveTab('idp-settings')}
              style={buttonStyles.primary}
            >
              <Shield className="w-4 h-4" />
              Configure IDPs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard

