const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }) => {
  /*
   * Add base components. These are very important for everything to look
   * correct. We are adding these to the 'components' layer because they must
   * be defined before pretty much everything else.
   */
  addComponents({
    '.bg-default': {
      backgroundColor: 'var(--mat-app-background-color) !important',
    },
    '.text-default': {
      color: 'var(--mat-app-text-color) !important',
    },
    '.bg-surface-dim': {
      backgroundColor: 'var(--msk-surface-dim) !important',
    },
    '.bg-surface': {
      backgroundColor: 'var(--msk-surface) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'var(--msk-surface-bright) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'var(--msk-surface-container-lowest) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'var(--msk-surface-container-low) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'var(--msk-surface-container) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'var(--msk-surface-container-high) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'var(--msk-surface-container-highest) !important',
    },
    '.text-on-surface': {
      color: 'var(--msk-on-surface) !important',
    },
    '.text-on-surface-variant': {
      color: 'var(--msk-on-surface-variant) !important',
    },
    '.bg-inverse-surface': {
      backgroundColor: 'var(--msk-inverse-surface) !important',
    },
    '.text-inverse-on-surface': {
      color: 'var(--msk-inverse-on-surface) !important',
    },
  });

  addComponents({
    '.bg-primary': {
      backgroundColor: 'var(--msk-primary) !important',
    },
    '.text-primary': {
      color: 'var(--msk-primary) !important',
    },
    '.text-on-primary': {
      color: 'var(--msk-on-primary) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'var(--msk-primary-container) !important',
    },
    '.text-on-primary-container': {
      color: 'var(--msk-on-primary-container) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'var(--msk-primary-fixed) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'var(--msk-primary-fixed-dim) !important',
    },
    '.text-on-primary-fixed': {
      color: 'var(--msk-on-primary-fixed) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'var(--msk-on-primary-fixed-variant) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'var(--msk-secondary) !important',
    },
    '.text-secondary': {
      color: 'var(--msk-secondary) !important',
    },
    '.text-on-secondary': {
      color: 'var(--msk-on-secondary) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'var(--msk-secondary-container) !important',
    },
    '.text-on-secondary-container': {
      color: 'var(--msk-on-secondary-container) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'var(--msk-secondary-fixed) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'var(--msk-secondary-fixed-dim) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'var(--msk-on-secondary-fixed) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'var(--msk-on-secondary-fixed-variant) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'var(--msk-tertiary) !important',
    },
    '.text-tertiary': {
      color: 'var(--msk-tertiary) !important',
    },
    '.text-on-tertiary': {
      color: 'var(--msk-on-tertiary) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'var(--msk-tertiary-container) !important',
    },
    '.text-on-tertiary-container': {
      color: 'var(--msk-on-tertiary-container) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'var(--msk-tertiary-fixed) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'var(--msk-tertiary-fixed-dim) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'var(--msk-on-tertiary-fixed) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'var(--msk-on-tertiary-fixed-variant) !important',
    },

    '.bg-error': {
      backgroundColor: 'var(--msk-error) !important',
    },
    '.text-error': {
      color: 'var(--msk-error) !important',
    },
    '.text-on-error': {
      color: 'var(--msk-on-error) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'var(--msk-error-container) !important',
    },
    '.text-on-error-container': {
      color: 'var(--msk-on-error-container) !important',
    },
  });
});
