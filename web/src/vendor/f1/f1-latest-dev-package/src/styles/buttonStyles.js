// Button style utilities for F1 FIDO Key Manager
export const buttonStyles = {
  // Primary Button - #041295 background, white text
  primary: {
    backgroundColor: '#041295',
    color: 'white',
    border: 'none',
    borderRadius: '2px',
    height: '40px',
    padding: '8px 12px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.2s ease'
  },
  
  // Secondary Button - transparent background, blue border and text
  secondary: {
    backgroundColor: 'transparent',
    color: '#041295',
    border: '1px solid #041295',
    borderRadius: '2px',
    height: '40px',
    padding: '8px 12px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease'
  },
  
  // Tertiary Button - transparent background, dark gray text, no border
  tertiary: {
    backgroundColor: 'transparent',
    color: '#383A4B',
    border: 'none',
    borderRadius: '2px',
    height: '40px',
    padding: '8px 12px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease'
  },
  
  // Disabled Button - gray background, gray text, disabled cursor
  disabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    border: '1px solid #d1d5db',
    borderRadius: '2px',
    height: '40px',
    padding: '8px 12px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'not-allowed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: '0.6'
  }
};

// Helper function to apply hover states
export const getButtonStyleWithHover = (type, isHovered = false, isDisabled = false) => {
  const baseStyle = buttonStyles[type];
  
  if (isDisabled) {
    return buttonStyles.disabled;
  }
  
  if (isHovered) {
    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          opacity: '0.9'
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#f8f9fa'
        };
      case 'tertiary':
        return {
          ...baseStyle,
          backgroundColor: '#f8f9fa'
        };
      default:
        return baseStyle;
    }
  }
  
  return baseStyle;
};

