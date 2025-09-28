import { colors, typography } from './globalStyles.js';

export const navigationStyles = {
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#374151', // Dark gray for good contrast
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'left',
    minHeight: '44px'
  },
  
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: colors.primary, // #041295 - primary blue background
    color: 'white', // White text for high contrast on blue background
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'left',
    minHeight: '44px'
  },
  
  navItemHover: {
    backgroundColor: '#f3f4f6', // Light gray hover
    color: '#374151' // Ensure text stays dark on hover
  }
};

