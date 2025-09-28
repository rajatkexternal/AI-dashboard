// F1 FIDO Key Manager - Comprehensive Style Guide Implementation
import { buttonStyles } from './buttonStyles.js';

export const colors = {
  // Primary Colors
  primaryBlue: '#041295',
  lightBlue: '#00BBDD',
  blue50: '#E6E7F4',
  
  // Status Colors
  errorRed: '#E01E00',
  successGreen: '#00BBDD', // Using light blue as success
  warningOrange: '#FFA500',
  
  // Neutral Colors
  white: '#FFFFFF',
  gray25: '#F7F7F9',
  gray500: '#5D607E',
  gray700: '#383A4B',
  gray750: '#333344',
  gray900: '#131319'
};

export const typography = {
  // Headings
  h1: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '42px',
    fontWeight: '500',
    lineHeight: '50px',
    color: colors.primaryBlue
  },
  h2: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '36px',
    color: colors.primaryBlue
  },
  h3: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '28px',
    color: colors.primaryBlue
  },
  h4: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    color: colors.primaryBlue
  },
  
  // Body Text
  body1Regular: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    color: colors.gray900
  },
  body1Medium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px',
    color: colors.gray900
  },
  body1Bold: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    color: colors.gray900
  },
  body2Regular: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: colors.gray500
  },
  body2Medium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    color: colors.gray700
  },
  
  // Page Title (special case)
  pageTitle: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '42px',
    fontWeight: '500',
    lineHeight: '50px',
    color: colors.gray900 // Changed from gray750 to gray900 for better contrast
  },
  
  // Page Description
  pageDescription: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    color: colors.gray900
  }
};

export const spacing = {
  base: '4px',
  small: '8px',
  medium: '12px',
  large: '16px',
  xLarge: '24px',
  xxLarge: '32px',
  xxxLarge: '40px'
};

export const layout = {
  header: {
    height: '64px',
    background: colors.white,
    boxShadow: '0px 2px 4px 0px rgba(1,5,50,0.04), 0px 4px 5px 0px rgba(1,5,50,0.04), 0px 1px 10px 0px rgba(1,5,50,0.08)',
    padding: '0 12px'
  },
  
  navigation: {
    width: '240px',
    background: colors.white,
    boxShadow: '0px 2px 2px 0px rgba(1,5,50,0.02), 0px 3px 4px 0px rgba(1,5,50,0.02), 0px 1px 5px 0px rgba(1,5,50,0.04)'
  },
  
  contentHeader: {
    background: colors.gray25,
    height: '138px',
    padding: spacing.xxLarge
  },
  
  mainContent: {
    background: colors.white,
    height: '822px',
    padding: spacing.xxLarge
  }
};

export const inputStyles = {
  default: {
    background: colors.white,
    border: `1px solid ${colors.gray500}`,
    borderRadius: '2px',
    height: '40px',
    padding: '12px 8px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: colors.gray900,
    '::placeholder': {
      color: colors.gray500
    }
  },
  
  error: {
    border: `1px solid ${colors.errorRed}`,
    color: colors.errorRed
  },
  
  success: {
    border: `1px solid ${colors.successGreen}`,
    color: colors.successGreen
  },
  
  warning: {
    border: `1px solid ${colors.warningOrange}`,
    color: colors.warningOrange
  },
  
  disabled: {
    background: colors.gray25,
    border: `1px solid ${colors.blue50}`,
    color: colors.gray500
  },
  
  label: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: colors.gray900,
    marginBottom: '4px'
  },
  
  caption: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: colors.gray500,
    marginTop: '2px'
  }
};

export const navigationStyles = {
  item: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    color: colors.gray900,
    padding: '18px 12px 18px 16px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  activeItem: {
    fontWeight: '700',
    backgroundColor: colors.blue50,
    borderLeft: `3px solid ${colors.primaryBlue}`
  },
  
  childItem: {
    paddingLeft: '48px' // 32px indentation + 16px base
  },
  
  icon: {
    width: '24px',
    height: '24px',
    marginRight: spacing.large
  }
};

export const formStyles = {
  spacing: {
    sectionTitle: '4px', // between title and description
    titleToField: '16px', // between title and form field
    betweenSections: '40px',
    betweenFields: '24px',
    betweenSubsections: '24px',
    fieldToButton: '24px',
    sideByFields: '16px',
    checkboxLabel: '4px',
    checkboxGroup: '12px',
    dependentField: '8px',
    nestedField: '8px',
    nestedIndentation: '32px',
    dividerSpacing: '24px',
    validationSpacing: '40px',
    validationMinBottom: '32px'
  }
};

// Helper function to apply styles
export const applyStyles = (element, styles) => {
  if (element && styles) {
    Object.assign(element.style, styles);
  }
};

// Re-export buttonStyles for convenience
export { buttonStyles };

