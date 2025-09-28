// Accessibility utilities for WCAG 2.2 AA compliance
import { useEffect, useRef, useState } from 'react';

// Focus management utilities
export const useFocusManagement = () => {
  const focusRef = useRef(null);
  
  const setFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };
  
  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  };
  
  return { focusRef, setFocus, trapFocus };
};

// Keyboard navigation hook
export const useKeyboardNavigation = (onEscape, onEnter) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Generate unique IDs for form elements
export const useUniqueId = (prefix = 'id') => {
  const [id] = useState(() => `${prefix}-${Math.random().toString(36).substr(2, 9)}`);
  return id;
};

// Reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// Skip link component
export const SkipLink = ({ targetId = 'main-content' }) => (
  <a
    href={`#${targetId}`}
    className="skip-link"
    style={{
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: '#041295',
      color: 'white',
      padding: '8px',
      textDecoration: 'none',
      borderRadius: '4px',
      zIndex: 1000,
      fontSize: '14px',
      fontWeight: '500'
    }}
    onFocus={(e) => {
      e.target.style.top = '6px';
    }}
    onBlur={(e) => {
      e.target.style.top = '-40px';
    }}
  >
    Skip to main content
  </a>
);

// ARIA live region hook
export const useAriaLiveRegion = () => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('polite');
  
  const announce = (text, level = 'polite') => {
    setMessage('');
    setTimeout(() => {
      setMessage(text);
      setPriority(level);
    }, 100);
  };
  
  const LiveRegion = () => (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
  
  return { announce, LiveRegion };
};

// Focus visible styles
export const focusStyles = {
  outline: '2px solid #041295',
  outlineOffset: '2px',
  borderRadius: '2px'
};

// High contrast mode detection
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = () => setIsHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isHighContrast;
};

// Touch target utilities
export const touchTargetStyles = {
  minHeight: '44px',
  minWidth: '44px',
  padding: '12px',
  margin: '4px'
};

// Form validation utilities
export const useFormValidation = () => {
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value, rules) => {
    const fieldErrors = [];
    
    if (rules.required && !value) {
      fieldErrors.push(`${name} is required`);
    }
    
    if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      fieldErrors.push('Please enter a valid email address');
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`${name} must be at least ${rules.minLength} characters`);
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
    
    return fieldErrors.length === 0;
  };
  
  const clearError = (name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };
  
  return { errors, validateField, clearError };
};

// Accessible button component
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  ariaLabel, 
  ariaPressed, 
  ariaExpanded,
  ariaControls,
  className = '',
  style = {},
  type = 'button',
  ...props 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && onClick) {
        onClick(e);
      }
    }
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={className}
      style={{
        ...style,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...touchTargetStyles
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Accessible form field component
export const AccessibleFormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helpText,
  required = false,
  autoComplete,
  placeholder,
  name,
  ...props
}) => {
  const fieldId = useUniqueId(id || 'field');
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className="form-field" style={{ marginBottom: '24px' }}>
      <label 
        htmlFor={fieldId}
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '400',
          color: '#131319',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {label}
        {required && <span aria-label="required" style={{ color: '#dc2626' }}> *</span>}
      </label>
      
      <input
        id={fieldId}
        name={name || id}
        type={type}
        value={value || ''}
        onChange={handleChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim()}
        style={{
          width: '100%',
          height: '40px',
          padding: '8px 12px',
          border: `1px solid ${error ? '#dc2626' : '#5D607E'}`,
          borderRadius: '2px',
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: 'white'
        }}
        {...props}
      />
      
      {error && (
        <div 
          id={errorId}
          role="alert"
          style={{
            color: '#dc2626',
            fontSize: '12px',
            marginTop: '4px'
          }}
        >
          {error}
        </div>
      )}
      
      {helpText && (
        <div 
          id={helpId}
          style={{
            color: '#5D607E',
            fontSize: '12px',
            marginTop: '4px'
          }}
        >
          {helpText}
        </div>
      )}
    </div>
  );
};

