import React, { useState } from 'react'
import { Shield } from 'lucide-react'
import { colors, typography, spacing, buttonStyles, inputStyles } from '../styles/globalStyles.js'
import { AccessibleFormField, useFormValidation, useFocusManagement } from '../utils/accessibility.jsx'

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { errors, validateField, clearError } = useFormValidation()
  const { focusRef } = useFocusManagement()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    const isUsernameValid = validateField('username', credentials.username, { required: true, email: true })
    const isPasswordValid = validateField('password', credentials.password, { required: true })

    if (!isUsernameValid || !isPasswordValid) {
      setIsLoading(false)
      return
    }

    // Simulate authentication delay
    setTimeout(() => {
      // Simple authentication - only admin@company.com with admin123
      if (credentials.username === 'admin@company.com' && credentials.password === 'admin123') {
        onLogin({
          id: 1,
          email: 'admin@company.com',
          name: 'System Administrator',
          role: 'admin'
        })
      } else {
        validateField('username', '', { required: false })
        validateField('password', '', { required: false })
        // Use proper error handling instead of alert
        const errorDiv = document.createElement('div')
        errorDiv.setAttribute('role', 'alert')
        errorDiv.textContent = 'Invalid credentials. Please use admin@company.com / admin123'
        errorDiv.style.color = '#dc2626'
        errorDiv.style.fontSize = '14px'
        errorDiv.style.marginTop = '8px'
        errorDiv.style.textAlign = 'center'
        
        const form = document.querySelector('#login-form')
        const existingError = form.querySelector('[role="alert"]')
        if (existingError) {
          existingError.remove()
        }
        form.appendChild(errorDiv)
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: colors.primary}}>
            <Shield className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 style={typography.pageTitle}>F1 MVP</h1>
          <p style={typography.pageDescription}>Enterprise Security Key Management</p>
        </header>

        {/* Login Form */}
        <main>
          <div className="f1-card">
            <h2 style={typography.h3} className="mb-6 text-center">Sign In</h2>
            
            <form id="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AccessibleFormField
                id="username"
                name="username"
                label="Username"
                type="email"
                value={credentials.username}
                onChange={handleInputChange}
                error={errors.username?.[0]}
                required={true}
                autoComplete="username"
                placeholder="Enter your username"
              />

              <AccessibleFormField
                id="password"
                name="password"
                label="Password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                error={errors.password?.[0]}
                required={true}
                autoComplete="current-password"
                placeholder="Enter your password"
              />

              <button
                type="submit"
                disabled={isLoading}
                ref={focusRef}
                aria-describedby="login-help"
                style={{
                  ...buttonStyles.primary,
                  width: '100%',
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                className="accessible-button primary"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner" aria-hidden="true"></span>
                    <span className="sr-only">Signing in...</span>
                    Signing in...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            <div id="login-help" className="mt-6 text-center">
              <p style={typography.body2Regular}>Demo credentials:</p>
              <p style={{...typography.body2Regular, fontFamily: 'monospace', color: colors.textSecondary}}>
                admin@company.com / admin123
              </p>
            </div>
          </div>

          <footer className="text-center mt-6">
            <p style={typography.body2Regular}>Secure authentication powered by F1 Enterprise Security</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default LoginPage

