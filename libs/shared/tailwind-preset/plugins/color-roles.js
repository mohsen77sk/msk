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
      backgroundColor: 'var(--msk-mat-surface-dim) !important',
    },
    '.bg-surface': {
      backgroundColor: 'var(--msk-mat-surface) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'var(--msk-mat-surface-bright) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'var(--msk-mat-surface-container-lowest) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'var(--msk-mat-surface-container-low) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'var(--msk-mat-surface-container) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'var(--msk-mat-surface-container-high) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'var(--msk-mat-surface-container-highest) !important',
    },
    '.text-on-surface': {
      color: 'var(--msk-mat-on-surface) !important',
    },
    '.text-on-surface-variant': {
      color: 'var(--msk-mat-on-surface-variant) !important',
    },
    '.bg-inverse-surface': {
      backgroundColor: 'var(--msk-mat-inverse-surface) !important',
    },
    '.text-inverse-on-surface': {
      color: 'var(--msk-mat-inverse-on-surface) !important',
    },
  });

  addComponents({
    '.bg-primary': {
      backgroundColor: 'var(--msk-mat-primary) !important',
    },
    '.text-primary': {
      color: 'var(--msk-mat-primary) !important',
    },
    '.text-on-primary': {
      color: 'var(--msk-mat-on-primary) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'var(--msk-mat-primary-container) !important',
    },
    '.text-on-primary-container': {
      color: 'var(--msk-mat-on-primary-container) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'var(--msk-mat-primary-fixed) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'var(--msk-mat-primary-fixed-dim) !important',
    },
    '.text-on-primary-fixed': {
      color: 'var(--msk-mat-on-primary-fixed) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'var(--msk-mat-on-primary-fixed-variant) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'var(--msk-mat-secondary) !important',
    },
    '.text-secondary': {
      color: 'var(--msk-mat-secondary) !important',
    },
    '.text-on-secondary': {
      color: 'var(--msk-mat-on-secondary) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'var(--msk-mat-secondary-container) !important',
    },
    '.text-on-secondary-container': {
      color: 'var(--msk-mat-on-secondary-container) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'var(--msk-mat-secondary-fixed) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'var(--msk-mat-secondary-fixed-dim) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'var(--msk-mat-on-secondary-fixed) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'var(--msk-mat-on-secondary-fixed-variant) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'var(--msk-mat-tertiary) !important',
    },
    '.text-tertiary': {
      color: 'var(--msk-mat-tertiary) !important',
    },
    '.text-on-tertiary': {
      color: 'var(--msk-mat-on-tertiary) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'var(--msk-mat-tertiary-container) !important',
    },
    '.text-on-tertiary-container': {
      color: 'var(--msk-mat-on-tertiary-container) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'var(--msk-mat-tertiary-fixed) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'var(--msk-mat-tertiary-fixed-dim) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'var(--msk-mat-on-tertiary-fixed) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'var(--msk-mat-on-tertiary-fixed-variant) !important',
    },

    '.bg-error': {
      backgroundColor: 'var(--msk-mat-error) !important',
    },
    '.text-error': {
      color: 'var(--msk-mat-error) !important',
    },
    '.text-on-error': {
      color: 'var(--msk-mat-on-error) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'var(--msk-mat-error-container) !important',
    },
    '.text-on-error-container': {
      color: 'var(--msk-mat-on-error-container) !important',
    },
  });
});
