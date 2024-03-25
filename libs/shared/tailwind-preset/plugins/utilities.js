const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }) => {
  /*
   * Add base components. These are very important for everything to look
   * correct. We are adding these to the 'components' layer because they must
   * be defined before pretty much everything else.
   */
  addComponents({
    '.mat-icon': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--msk-icon-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-default': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--msk-text-default-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-secondary': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--msk-text-secondary-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-disabled': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--msk-text-disabled-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-hint': {
      '--tw-text-opacity': '1 !important',
      color: 'rgba(var(--msk-text-hint-rgb), var(--tw-text-opacity)) !important',
    },
    '.bg-default': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--msk-bg-default-rgb), var(--tw-bg-opacity)) !important',
    },
    '.bg-dialog': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--msk-bg-dialog-rgb), var(--tw-bg-opacity)) !important',
    },
    '.bg-card': {
      '--tw-bg-opacity': '1 !important',
      backgroundColor: 'rgba(var(--msk-bg-card-rgb), var(--tw-bg-opacity)) !important',
    },
    '.bg-hover': {
      backgroundColor: 'var(--msk-bg-hover) !important',
    },
    '.divider': {
      color: 'var(--msk-divider) !important',
    },
  });
});
