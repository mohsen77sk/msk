const path = require('path');

const config = {
  darkMode: 'selector',
  important: true,
  theme: {
    fontFamily: {
      sans: ['IRANSansX', 'sans-serif'],
    },
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      md: '0.8125rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.25rem',
      '6xl': '2.5rem',
      '7xl': '3rem',
      '8xl': '4rem',
      '9xl': '6rem',
      '10xl': '8rem',
    },
    screens: {
      sm: '600px',
      md: '840px',
      lg: '1200px',
      xl: '1600px',
    },
    borderRadius: {
      'none': '0',
      'extra-small': 'var(--sys-corner-extra-small)',
      'small': 'var(--sys-corner-small)',
      'medium': 'var(--sys-corner-medium)',
      'large': 'var(--sys-corner-large)',
      'extra-large': 'var(--sys-corner-extra-large)',
      'full': 'var(--sys-corner-full)',
    },
    boxShadow: {
      'level-0': 'var(--mat-app-elevation-shadow-level-0)',
      'level-1': 'var(--mat-app-elevation-shadow-level-1)',
      'level-2': 'var(--mat-app-elevation-shadow-level-2)',
      'level-3': 'var(--mat-app-elevation-shadow-level-3)',
      'level-4': 'var(--mat-app-elevation-shadow-level-4)',
      'level-5': 'var(--mat-app-elevation-shadow-level-5)',
      'level-6': 'var(--mat-app-elevation-shadow-level-6)',
      'level-7': 'var(--mat-app-elevation-shadow-level-7)',
      'level-8': 'var(--mat-app-elevation-shadow-level-8)',
      'level-9': 'var(--mat-app-elevation-shadow-level-9)',
      'level-10': 'var(--mat-app-elevation-shadow-level-10)',
      'level-11': 'var(--mat-app-elevation-shadow-level-11)',
      'level-12': 'var(--mat-app-elevation-shadow-level-12)',
      'level-13': 'var(--mat-app-elevation-shadow-level-13)',
      'level-14': 'var(--mat-app-elevation-shadow-level-14)',
      'level-15': 'var(--mat-app-elevation-shadow-level-15)',
      'level-16': 'var(--mat-app-elevation-shadow-level-16)',
      'level-17': 'var(--mat-app-elevation-shadow-level-17)',
      'level-18': 'var(--mat-app-elevation-shadow-level-18)',
      'level-19': 'var(--mat-app-elevation-shadow-level-19)',
      'level-20': 'var(--mat-app-elevation-shadow-level-20)',
      'level-21': 'var(--mat-app-elevation-shadow-level-21)',
      'level-22': 'var(--mat-app-elevation-shadow-level-22)',
      'level-23': 'var(--mat-app-elevation-shadow-level-23)',
      'level-24': 'var(--mat-app-elevation-shadow-level-24)',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      flex: {
        0: '0 0 auto',
      },
      opacity: {
        12: '0.12',
        38: '0.38',
        87: '0.87',
      },
      rotate: {
        '-270': '270deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        270: '270deg',
      },
      scale: {
        '-1': '-1',
      },
      zIndex: {
        '-1': -1,
        49: 49,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        99: 99,
        999: 999,
        9999: 9999,
        99999: 99999,
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        50: '12.5rem',
        90: '22.5rem',

        // Bigger values
        100: '25rem',
        120: '30rem',
        128: '32rem',
        140: '35rem',
        160: '40rem',
        180: '45rem',
        192: '48rem',
        200: '50rem',
        240: '60rem',
        256: '64rem',
        280: '70rem',
        320: '80rem',
        360: '90rem',
        400: '100rem',
        480: '120rem',

        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      maxHeight: (theme) => ({
        none: 'none',
      }),
      minWidth: (theme) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      maxWidth: (theme) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        drawer: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },

      // @tailwindcss/typography
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--sys-on-surface)',
            '--tw-prose-headings': 'var(--sys-on-surface)',
            '--tw-prose-links': 'var(--sys-primary)',
            '--tw-prose-bold': 'var(--sys-on-surface)',
            '--tw-prose-code': 'var(--sys-primary)',
            '--tw-prose-th-borders': 'var(--sys-outline-variant)',
            '--tw-prose-td-borders': 'var(--sys-outline-variant)',
            'font-size': 'var(--sys-body-medium-size)',
            'line-height': 'var(--sys-body-medium-line-height)'
          },
        },
      }),
    },
  },
  plugins: [
    // Tailwind plugins
    require(path.resolve(__dirname, './plugins/material')),
    require(path.resolve(__dirname, './plugins/icon-size')),
    // Other third party and/or custom plugins
    require('@tailwindcss/typography'),
  ],
};

module.exports = config;
