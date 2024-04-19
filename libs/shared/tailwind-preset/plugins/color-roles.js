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
      backgroundColor: 'rgb(var(--msk-mat-surface-dim-rgb)) !important',
    },
    '.bg-surface': {
      backgroundColor: 'rgb(var(--msk-mat-surface-rgb)) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'rgb(var(--msk-mat-surface-bright-rgb)) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'rgb(var(--msk-mat-surface-container-lowest-rgb)) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'rgb(var(--msk-mat-surface-container-low-rgb)) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'rgb(var(--msk-mat-surface-container-rgb)) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'rgb(var(--msk-mat-surface-container-high-rgb)) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'rgb(var(--msk-mat-surface-container-highest-rgb)) !important',
    },
    '.text-on-surface': {
      color: 'rgb(var(--msk-mat-on-surface-rgb)) !important',
    },
    '.text-on-surface-variant': {
      color: 'rgb(var(--msk-mat-on-surface-variant-rgb)) !important',
    },
    '.bg-inverse-surface': {
      backgroundColor: 'rgb(var(--msk-mat-inverse-surface-rgb)) !important',
    },
    '.text-inverse-on-surface': {
      color: 'rgb(var(--msk-mat-inverse-on-surface-rgb)) !important',
    },
  });

  addComponents({
    '.bg-primary': {
      backgroundColor: 'rgb(var(--msk-mat-primary-rgb)) !important',
    },
    '.text-primary': {
      color: 'rgb(var(--msk-mat-primary-rgb)) !important',
    },
    '.text-on-primary': {
      color: 'rgb(var(--msk-mat-on-primary-rgb)) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'rgb(var(--msk-mat-primary-container-rgb)) !important',
    },
    '.text-on-primary-container': {
      color: 'rgb(var(--msk-mat-on-primary-container-rgb)) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'rgb(var(--msk-mat-primary-fixed-rgb)) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-mat-primary-fixed-dim-rgb)) !important',
    },
    '.text-on-primary-fixed': {
      color: 'rgb(var(--msk-mat-on-primary-fixed-rgb)) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'rgb(var(--msk-mat-on-primary-fixed-variant-rgb)) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'rgb(var(--msk-mat-secondary-rgb)) !important',
    },
    '.text-secondary': {
      color: 'rgb(var(--msk-mat-secondary-rgb)) !important',
    },
    '.text-on-secondary': {
      color: 'rgb(var(--msk-mat-on-secondary-rgb)) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'rgb(var(--msk-mat-secondary-container-rgb)) !important',
    },
    '.text-on-secondary-container': {
      color: 'rgb(var(--msk-mat-on-secondary-container-rgb)) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'rgb(var(--msk-mat-secondary-fixed-rgb)) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-mat-secondary-fixed-dim-rgb)) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'rgb(var(--msk-mat-on-secondary-fixed-rgb)) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'rgb(var(--msk-mat-on-secondary-fixed-variant-rgb)) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'rgb(var(--msk-mat-tertiary-rgb)) !important',
    },
    '.text-tertiary': {
      color: 'rgb(var(--msk-mat-tertiary-rgb)) !important',
    },
    '.text-on-tertiary': {
      color: 'rgb(var(--msk-mat-on-tertiary-rgb)) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'rgb(var(--msk-mat-tertiary-container-rgb)) !important',
    },
    '.text-on-tertiary-container': {
      color: 'rgb(var(--msk-mat-on-tertiary-container-rgb)) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'rgb(var(--msk-mat-tertiary-fixed-rgb)) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-mat-tertiary-fixed-dim-rgb)) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'rgb(var(--msk-mat-on-tertiary-fixed-rgb)) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'rgb(var(--msk-mat-on-tertiary-fixed-variant-rgb)) !important',
    },

    '.bg-error': {
      backgroundColor: 'rgb(var(--msk-mat-error-rgb)) !important',
    },
    '.text-error': {
      color: 'rgb(var(--msk-mat-error-rgb)) !important',
    },
    '.text-on-error': {
      color: 'rgb(var(--msk-mat-on-error-rgb)) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'rgb(var(--msk-mat-error-container-rgb)) !important',
    },
    '.text-on-error-container': {
      color: 'rgb(var(--msk-mat-on-error-container-rgb)) !important',
    },
  });
});
