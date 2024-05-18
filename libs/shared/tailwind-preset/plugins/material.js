const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }) => {
  /*
   * Add base components. These are very important for everything to look
   * correct. We are adding these to the 'components' layer because they must
   * be defined before pretty much everything else.
   */
  addComponents({
    '.bg-default': {
      backgroundColor: 'rgb(var(--msk-surface-container)) !important',
    },
    '.text-default': {
      color: 'rgb(var(--msk-on-surface)) !important',
    },
    '.bg-surface-dim': {
      backgroundColor: 'rgb(var(--msk-surface-dim)) !important',
    },
    '.bg-surface': {
      backgroundColor: 'rgb(var(--msk-surface)) !important',
    },
    '.bg-surface-bright': {
      backgroundColor: 'rgb(var(--msk-surface-bright)) !important',
    },
    '.bg-surface-container-lowest': {
      backgroundColor: 'rgb(var(--msk-surface-container-lowest)) !important',
    },
    '.bg-surface-container-low': {
      backgroundColor: 'rgb(var(--msk-surface-container-low)) !important',
    },
    '.bg-surface-container': {
      backgroundColor: 'rgb(var(--msk-surface-container)) !important',
    },
    '.bg-surface-container-high': {
      backgroundColor: 'rgb(var(--msk-surface-container-high)) !important',
    },
    '.bg-surface-container-highest': {
      backgroundColor: 'rgb(var(--msk-surface-container-highest)) !important',
    },
    '.text-on-surface': {
      color: 'rgb(var(--msk-on-surface)) !important',
    },
    '.text-on-surface-variant': {
      color: 'rgb(var(--msk-on-surface-variant)) !important',
    },
    '.bg-inverse-surface': {
      backgroundColor: 'rgb(var(--msk-inverse-surface)) !important',
    },
    '.text-inverse-on-surface': {
      color: 'rgb(var(--msk-inverse-on-surface)) !important',
    },
  });

  addComponents({
    '.bg-primary': {
      backgroundColor: 'rgb(var(--msk-primary)) !important',
    },
    '.text-primary': {
      color: 'rgb(var(--msk-primary)) !important',
    },
    '.text-on-primary': {
      color: 'rgb(var(--msk-on-primary)) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'rgb(var(--msk-primary-container)) !important',
    },
    '.text-on-primary-container': {
      color: 'rgb(var(--msk-on-primary-container)) !important',
    },
    '.bg-primary-fixed': {
      backgroundColor: 'rgb(var(--msk-primary-fixed)) !important',
    },
    '.bg-primary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-primary-fixed-dim)) !important',
    },
    '.text-on-primary-fixed': {
      color: 'rgb(var(--msk-on-primary-fixed)) !important',
    },
    '.text-on-primary-fixed-variant': {
      color: 'rgb(var(--msk-on-primary-fixed-variant)) !important',
    },

    '.bg-secondary': {
      backgroundColor: 'rgb(var(--msk-secondary)) !important',
    },
    '.text-secondary': {
      color: 'rgb(var(--msk-secondary)) !important',
    },
    '.text-on-secondary': {
      color: 'rgb(var(--msk-on-secondary)) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'rgb(var(--msk-secondary-container)) !important',
    },
    '.text-on-secondary-container': {
      color: 'rgb(var(--msk-on-secondary-container)) !important',
    },
    '.bg-secondary-fixed': {
      backgroundColor: 'rgb(var(--msk-secondary-fixed)) !important',
    },
    '.bg-secondary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-secondary-fixed-dim)) !important',
    },
    '.text-on-secondary-fixed': {
      color: 'rgb(var(--msk-on-secondary-fixed)) !important',
    },
    '.text-on-secondary-fixed-variant': {
      color: 'rgb(var(--msk-on-secondary-fixed-variant)) !important',
    },

    '.bg-tertiary': {
      backgroundColor: 'rgb(var(--msk-tertiary)) !important',
    },
    '.text-tertiary': {
      color: 'rgb(var(--msk-tertiary)) !important',
    },
    '.text-on-tertiary': {
      color: 'rgb(var(--msk-on-tertiary)) !important',
    },
    '.bg-tertiary-container': {
      backgroundColor: 'rgb(var(--msk-tertiary-container)) !important',
    },
    '.text-on-tertiary-container': {
      color: 'rgb(var(--msk-on-tertiary-container)) !important',
    },
    '.bg-tertiary-fixed': {
      backgroundColor: 'rgb(var(--msk-tertiary-fixed)) !important',
    },
    '.bg-tertiary-fixed-dim': {
      backgroundColor: 'rgb(var(--msk-tertiary-fixed-dim)) !important',
    },
    '.text-on-tertiary-fixed': {
      color: 'rgb(var(--msk-on-tertiary-fixed)) !important',
    },
    '.text-on-tertiary-fixed-variant': {
      color: 'rgb(var(--msk-on-tertiary-fixed-variant)) !important',
    },

    '.bg-error': {
      backgroundColor: 'rgb(var(--msk-error)) !important',
    },
    '.text-error': {
      color: 'rgb(var(--msk-error)) !important',
    },
    '.text-on-error': {
      color: 'rgb(var(--msk-on-error)) !important',
    },
    '.bg-error-container': {
      backgroundColor: 'rgb(var(--msk-error-container)) !important',
    },
    '.text-on-error-container': {
      color: 'rgb(var(--msk-on-error-container)) !important',
    },
  });

  addComponents({
    '.rounded-extra-small': {
      'border-radius': 'var(--msk-corner-extra-small) !important',
    },
    '.rounded-small': {
      'border-radius': 'var(--msk-corner-small) !important',
    },
    '.rounded-medium': {
      'border-radius': 'var(--msk-corner-medium) !important',
    },
    '.rounded-large': {
      'border-radius': 'var(--msk-corner-large) !important',
    },
    '.rounded-extra-large': {
      'border-radius': 'var(--msk-corner-extra-large) !important',
    },
  });

  addComponents({
    '.shadow-level-0': {
      'box-shadow': 'var(--msk-elevation-level-0) !important',
    },
    '.shadow-level-1': {
      'box-shadow': 'var(--msk-elevation-level-1) !important',
    },
    '.shadow-level-2': {
      'box-shadow': 'var(--msk-elevation-level-2) !important',
    },
    '.shadow-level-3': {
      'box-shadow': 'var(--msk-elevation-level-3) !important',
    },
    '.shadow-level-4': {
      'box-shadow': 'var(--msk-elevation-level-4) !important',
    },
    '.shadow-level-5': {
      'box-shadow': 'var(--msk-elevation-level-5) !important',
    },
  });
});
