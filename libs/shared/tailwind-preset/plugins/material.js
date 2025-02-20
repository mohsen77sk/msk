const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents, addUtilities, theme }) => {
  /*
   * Add base utilities. These are very important for everything to look
   * correct. We are adding these to the 'utilities' layer because they must
   * be defined before pretty much everything else.
   */
  addUtilities({
    '.bg-default': {
      backgroundColor: 'var(--mat-sys-surface-container) !important',
    },
    '.text-default': {
      color: 'var(--mat-sys-on-surface) !important',
    },

    '.bg-surface': {
      backgroundColor: 'var(--mat-sys-surface) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'var(--mat-sys-surface-bright) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'var(--mat-sys-surface-container) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'var(--mat-sys-surface-container-lowest) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'var(--mat-sys-surface-container-low) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'var(--mat-sys-surface-container-high) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'var(--mat-sys-surface-container-highest) !important',
    },
    '.bg-surface-dim': {
      backgroundColor: 'var(--mat-sys-surface-dim) !important',
    },
    '.bg-surface-tint': {
      backgroundColor: 'var(--mat-sys-surface-tint) !important',
    },
    '.bg-surface-variant': {
      backgroundColor: 'var(--mat-sys-surface-variant) !important',
    },

    '.text-on-surface': {
      color: 'var(--mat-sys-on-surface) !important',
    },
    '.text-on-surface-variant': {
      color: 'var(--mat-sys-on-surface-variant) !important',
    },

    '.bg-inverse-surface': {
      backgroundColor: 'var(--mat-sys-inverse-surface) !important',
    },
    '.text-inverse-on-surface': {
      color: 'var(--mat-sys-inverse-on-surface) !important',
    },

    '.bg-primary': {
      backgroundColor: 'var(--mat-sys-primary) !important',
    },
    '.text-primary': {
      color: 'var(--mat-sys-primary) !important',
    },
    '.text-on-primary': {
      color: 'var(--mat-sys-on-primary) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'var(--mat-sys-primary-container) !important',
    },
    '.text-on-primary-container': {
      color: 'var(--mat-sys-on-primary-container) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'var(--mat-sys-primary-fixed) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'var(--mat-sys-primary-fixed-dim) !important',
    },
    '.text-on-primary-fixed': {
      color: 'var(--mat-sys-on-primary-fixed) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'var(--mat-sys-on-primary-fixed-variant) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'var(--mat-sys-secondary) !important',
    },
    '.text-secondary': {
      color: 'var(--mat-sys-secondary) !important',
    },
    '.text-on-secondary': {
      color: 'var(--mat-sys-on-secondary) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'var(--mat-sys-secondary-container) !important',
    },
    '.text-on-secondary-container': {
      color: 'var(--mat-sys-on-secondary-container) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'var(--mat-sys-secondary-fixed) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'var(--mat-sys-secondary-fixed-dim) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'var(--mat-sys-on-secondary-fixed) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'var(--mat-sys-on-secondary-fixed-variant) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'var(--mat-sys-tertiary) !important',
    },
    '.text-tertiary': {
      color: 'var(--mat-sys-tertiary) !important',
    },
    '.text-on-tertiary': {
      color: 'var(--mat-sys-on-tertiary) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'var(--mat-sys-tertiary-container) !important',
    },
    '.text-on-tertiary-container': {
      color: 'var(--mat-sys-on-tertiary-container) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'var(--mat-sys-tertiary-fixed) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'var(--mat-sys-tertiary-fixed-dim) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'var(--mat-sys-on-tertiary-fixed) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'var(--mat-sys-on-tertiary-fixed-variant) !important',
    },

    '.bg-error': {
      backgroundColor: 'var(--mat-sys-error) !important',
    },
    '.text-error': {
      color: 'var(--mat-sys-error) !important',
    },
    '.text-on-error': {
      color: 'var(--mat-sys-on-error) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'var(--mat-sys-error-container) !important',
    },
    '.text-on-error-container': {
      color: 'var(--mat-sys-on-error-container) !important',
    },
  });

  addUtilities({
    '.text-display-large': {
      font: 'var(--mat-sys-display-large) !important',
    },
    '.text-display-medium': {
      font: 'var(--mat-sys-display-medium) !important',
    },
    '.text-display-small': {
      font: 'var(--mat-sys-display-small) !important',
    },
    '.text-headline-large': {
      font: 'var(--mat-sys-headline-large) !important',
    },
    '.text-headline-medium': {
      font: 'var(--mat-sys-headline-medium) !important',
    },
    '.text-headline-small': {
      font: 'var(--mat-sys-headline-small) !important',
    },
    '.text-title-large': {
      font: 'var(--mat-sys-title-large) !important',
    },
    '.text-title-medium': {
      font: 'var(--mat-sys-title-medium) !important',
    },
    '.text-title-small': {
      font: 'var(--mat-sys-title-small) !important',
    },
    '.text-body-large': {
      font: 'var(--mat-sys-body-large) !important',
    },
    '.text-body-medium': {
      font: 'var(--mat-sys-body-medium) !important',
    },
    '.text-body-small': {
      font: 'var(--mat-sys-body-small) !important',
    },
    '.text-label-large': {
      font: 'var(--mat-sys-label-large) !important',
    },
    '.text-label-medium': {
      font: 'var(--mat-sys-label-medium) !important',
    },
    '.text-label-small': {
      font: 'var(--mat-sys-label-small) !important',
    },
  });

  addComponents({
    '.msk-mat-card-elevated': {
      position: 'relative',
      boxShadow: 'var(--mat-sys-level1)',
      borderRadius: 'var(--mat-sys-corner-medium)',
      backgroundColor: 'var(--mat-sys-surface-container-low)',
    },

    '.msk-mat-card-filled': {
      position: 'relative',
      boxShadow: 'var(--mat-sys-level0)',
      borderRadius: 'var(--mat-sys-corner-medium)',
      backgroundColor: 'var(--mat-sys-surface-container-highest)',
    },

    '.msk-mat-card-outlined': {
      position: 'relative',
      boxShadow: 'var(--mat-sys-level0)',
      borderRadius: 'var(--mat-sys-corner-medium)',
      backgroundColor: 'var(--mat-sys-surface)',
      border: '1px solid var(--mat-sys-outline-variant)',
    },
  });

  addComponents({
    '.msk-list-item': {
      display: 'flex',
      padding: '8px 16px',
      gap: '16px',
    },
    '.msk-list-item-icon': {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--mat-sys-on-surface-variant)',
    },
    '.msk-list-item-content': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: '1 1 0%',
    },
    '.msk-list-item-content span:nth-child(1)': {
      fontWeight: '500',
      lineHeight: '1.5rem',
      color: 'var(--mat-sys-on-surface)',
    },
    '.msk-list-item-content span:nth-child(2)': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      color: 'var(--mat-sys-on-surface-variant)',
    },
    '.msk-list-item-content span:nth-child(3)': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      color: 'var(--mat-sys-on-surface-variant)',
    },
  });
});
