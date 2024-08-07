const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents, addUtilities, theme }) => {
  /*
   * Add base utilities. These are very important for everything to look
   * correct. We are adding these to the 'utilities' layer because they must
   * be defined before pretty much everything else.
   */
  addUtilities({
    '.bg-default': {
      backgroundColor: 'var(--sys-surface-container) !important',
    },
    '.text-default': {
      color: 'var(--sys-on-surface) !important',
    },

    '.bg-surface': {
      backgroundColor: 'var(--sys-surface) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'var(--sys-surface-bright) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'var(--sys-surface-container) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'var(--sys-surface-container-lowest) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'var(--sys-surface-container-low) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'var(--sys-surface-container-high) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'var(--sys-surface-container-highest) !important',
    },
    '.bg-surface-dim': {
      backgroundColor: 'var(--sys-surface-dim) !important',
    },
    '.bg-surface-tint': {
      backgroundColor: 'var(--sys-surface-tint) !important',
    },
    '.bg-surface-variant': {
      backgroundColor: 'var(--sys-surface-variant) !important',
    },

    '.text-on-surface': {
      color: 'var(--sys-on-surface) !important',
    },
    '.text-on-surface-variant': {
      color: 'var(--sys-on-surface-variant) !important',
    },

    '.bg-inverse-surface': {
      backgroundColor: 'var(--sys-inverse-surface) !important',
    },
    '.text-inverse-on-surface': {
      color: 'var(--sys-inverse-on-surface) !important',
    },

    '.bg-primary': {
      backgroundColor: 'var(--sys-primary) !important',
    },
    '.text-primary': {
      color: 'var(--sys-primary) !important',
    },
    '.text-on-primary': {
      color: 'var(--sys-on-primary) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'var(--sys-primary-container) !important',
    },
    '.text-on-primary-container': {
      color: 'var(--sys-on-primary-container) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'var(--sys-primary-fixed) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'var(--sys-primary-fixed-dim) !important',
    },
    '.text-on-primary-fixed': {
      color: 'var(--sys-on-primary-fixed) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'var(--sys-on-primary-fixed-variant) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'var(--sys-secondary) !important',
    },
    '.text-secondary': {
      color: 'var(--sys-secondary) !important',
    },
    '.text-on-secondary': {
      color: 'var(--sys-on-secondary) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'var(--sys-secondary-container) !important',
    },
    '.text-on-secondary-container': {
      color: 'var(--sys-on-secondary-container) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'var(--sys-secondary-fixed) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'var(--sys-secondary-fixed-dim) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'var(--sys-on-secondary-fixed) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'var(--sys-on-secondary-fixed-variant) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'var(--sys-tertiary) !important',
    },
    '.text-tertiary': {
      color: 'var(--sys-tertiary) !important',
    },
    '.text-on-tertiary': {
      color: 'var(--sys-on-tertiary) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'var(--sys-tertiary-container) !important',
    },
    '.text-on-tertiary-container': {
      color: 'var(--sys-on-tertiary-container) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'var(--sys-tertiary-fixed) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'var(--sys-tertiary-fixed-dim) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'var(--sys-on-tertiary-fixed) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'var(--sys-on-tertiary-fixed-variant) !important',
    },

    '.bg-error': {
      backgroundColor: 'var(--sys-error) !important',
    },
    '.text-error': {
      color: 'var(--sys-error) !important',
    },
    '.text-on-error': {
      color: 'var(--sys-on-error) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'var(--sys-error-container) !important',
    },
    '.text-on-error-container': {
      color: 'var(--sys-on-error-container) !important',
    },
  });

  addComponents({
    '.msk-mat-card-elevated': {
      position: 'relative',
      boxShadow: 'var(--sys-elevation-level-1)',
      borderRadius: 'var(--sys-corner-medium)',
      backgroundColor: 'var(--sys-surface-container-low)',
    },

    '.msk-mat-card-filled': {
      position: 'relative',
      boxShadow: 'var(--sys-elevation-level-0)',
      borderRadius: 'var(--sys-corner-medium)',
      backgroundColor: 'var(--sys-surface-container-highest)',
    },

    '.msk-mat-card-outlined': {
      position: 'relative',
      boxShadow: 'var(--sys-elevation-level-0)',
      borderRadius: 'var(--sys-corner-medium)',
      backgroundColor: 'var(--sys-surface)',
      border: '1px solid var(--sys-outline-variant)',
    },
  });

  addComponents({
    '.msk-list-item': {
      display: 'flex',
      padding: '8px 16px',
    },
    '.msk-list-item-icon': {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginInlineEnd: '16px',
      color: 'var(--sys-on-surface-variant)',
    },
    '.msk-list-item-content': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '.msk-list-item-content span:nth-child(1)': {
      fontWeight: '500',
    },
    '.msk-list-item-content span:nth-child(2)': {
      color: 'var(--sys-secondary)',
    },
    '.msk-list-item-content span:nth-child(3)': {
      color: 'var(--sys-secondary)',
    },
  });
});
