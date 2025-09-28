import React from 'react'
import { 
  LayoutDashboard, 
  Shield, 
  Key, 
  Package, 
  Settings, 
  FileText, 
  LogOut,
  User
} from 'lucide-react'
import { colors, typography, spacing, buttonStyles } from '../styles/globalStyles.js'
import { navigationStyles } from '../styles/navigationStyles.js'
import '../styles/accessibility.css'

const Navigation = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'policy-management', label: 'Policy Management' },
    { id: 'fido-keys', label: 'FIDO Keys' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'idp-settings', label: 'IDP Settings' },
    { id: 'audit-logs', label: 'Audit Logs' }
  ]

  return (
    <nav className="w-64 f1-sidebar h-full flex flex-col" role="navigation" aria-label="Main navigation">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: colors.primary}}>
            <Shield className="w-6 h-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{...typography.h3, color: colors.primary}}>F1 MVP</h1>
            <p style={typography.body2Regular}>Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Made scrollable for zoom accessibility */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`accessible-nav-item ${isActive ? 'nav-active' : ''}`}
              >
                <span className="nav-text">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* User Info and Logout - Fixed at bottom but accessible */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{...typography.body2Medium, color: colors.textPrimary}} className="truncate">
              {currentUser?.name}
            </p>
            <p style={{...typography.body2Regular, color: colors.textSecondary}} className="truncate">
              {currentUser?.role === 'admin' ? 'System Administrator' : currentUser?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          style={buttonStyles.tertiary}
          className="w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  )
}

export default Navigation

