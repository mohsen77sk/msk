/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--mat-sys-on-surface)',
            '--tw-prose-body': 'var(--mat-sys-on-surface)',
            '--tw-prose-headings': 'var(--mat-sys-on-surface)',
            '--tw-prose-links': 'var(--mat-sys-primary)',
            '--tw-prose-bold': 'var(--mat-sys-on-surface)',
            '--tw-prose-code': 'var(--mat-sys-primary)',
            '--tw-prose-th-borders': 'var(--mat-sys-outline-variant)',
            '--tw-prose-td-borders': 'var(--mat-sys-outline-variant)',
            'font-size': 'var(--mat-sys-body-medium-size)',
            'line-height': 'var(--mat-sys-body-medium-line-height)',
          },
        },
      },
    },
  },
};
