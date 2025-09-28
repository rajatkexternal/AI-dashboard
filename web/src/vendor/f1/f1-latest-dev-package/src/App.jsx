import React, { useState, useEffect } from 'react'
import './App.css'
import './styles/accessibility.css'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'
import PolicyManagement from './components/PolicyManagement'
import FidoKeyManagement from './components/FidoKeyManagement'
import Inventory from './components/Inventory'
import IdpSettings from './components/IdpSettings'
import AuditLogs from './components/AuditLogs'
import { SkipLink, useAriaLiveRegion } from './utils/accessibility.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { announce, LiveRegion } = useAriaLiveRegion()

  // Dynamic page titles
  const pageTitles = {
    'dashboard': 'Dashboard - F1 FIDO Key Manager',
    'policy-management': 'Policy Management - F1 FIDO Key Manager',
    'fido-keys': 'FIDO Keys - F1 FIDO Key Manager',
    'inventory': 'Inventory - F1 FIDO Key Manager',
    'idp-settings': 'IDP Settings - F1 FIDO Key Manager',
    'audit-logs': 'Audit Logs - F1 FIDO Key Manager'
  }

  // Update page title when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      document.title = pageTitles[activeTab] || 'F1 FIDO Key Manager'
    } else {
      document.title = 'Login - F1 FIDO Key Manager'
    }
  }, [activeTab, isAuthenticated])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setCurrentUser(userData)
    setActiveTab('dashboard')
    announce('Successfully logged in to F1 Admin Console')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveTab('dashboard')
    announce('Successfully logged out')
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    const tabNames = {
      'dashboard': 'Dashboard',
      'policy-management': 'Policy Management',
      'fido-keys': 'FIDO Keys',
      'inventory': 'Inventory',
      'idp-settings': 'IDP Settings',
      'audit-logs': 'Audit Logs'
    }
    announce(`Navigated to ${tabNames[newTab]}`)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={handleTabChange} />
      case 'policy-management':
        return <PolicyManagement />
      case 'fido-keys':
        return <FidoKeyManagement />
      case 'inventory':
        return <Inventory />
      case 'idp-settings':
        return <IdpSettings />
      case 'audit-logs':
        return <AuditLogs />
      default:
        return <Dashboard setActiveTab={handleTabChange} />
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <SkipLink targetId="login-form" />
        <LoginPage onLogin={handleLogin} />
        <LiveRegion />
      </>
    )
  }

  return (
    <>
      <SkipLink targetId="main-content" />
      <div className="flex h-screen bg-gray-50">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main id="main-content" className="flex-1 overflow-auto" role="main">
          {renderContent()}
        </main>
      </div>
      <LiveRegion />
    </>
  )
}

export default App
